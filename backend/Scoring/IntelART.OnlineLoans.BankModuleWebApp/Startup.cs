using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using IntelART.WebApiRequestProxy;

namespace IntelART.Ameria.BankModuleWebApp
{
    public class Startup
    {
        public IConfigurationRoot Configuration { get; }

        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton(Configuration);
            services.AddMvc();

            services.AddAuthentication(options =>
            {
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
            })
            .AddCookie()
            .AddOpenIdConnect(options =>
            {
                options.Authority = Configuration["auth:oidc:authority"];
                options.ClientId = Configuration["auth:oidc:clientid"];
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                loggerFactory.AddDebug();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseAuthentication();

            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

            string authority = Configuration.GetSection("Authentication")["Authority"];

            app.UseAuthentication();

            IConfigurationSection requestProxyPolicies = Configuration.GetSection("RequestProxy").GetSection("Policies");
            IConfigurationSection requestProxyPolicy = requestProxyPolicies.GetSection("0");

            PathString bankApiPathPrefix = new PathString(requestProxyPolicy["LocalPath"]);
            string bankApiForwardUrlBase = requestProxyPolicy["RemoteUrlBase"];

            app.UseWebApiRequestProxy()
                .AddRule(
                    new SimleWebApiRequestProxyRule(
                        bankApiPathPrefix,
                        bankApiForwardUrlBase,
                        async (r, c) =>
                        {
                            string accessToken = await r.HttpContext.GetTokenAsync("access_token");
                            c.SetBearerToken(accessToken);
                        })
                );

            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
