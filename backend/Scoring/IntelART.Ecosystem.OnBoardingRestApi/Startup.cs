using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Serialization;

namespace IntelART.Ecosystem.OnBoardingRestApi
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

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            IConfigurationSection corsConfig = Configuration.GetSection("Cors");

            if (corsConfig != null)
            {
                IEnumerable<string> origins = corsConfig.GetSection("Origins").AsEnumerable().Where(t => t.Value != null).Select(t => t.Value);
                services.AddCors(options =>
                {
                    options.AddPolicy("default", policy =>
                    {
                        policy.WithOrigins(origins.ToArray())
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                    });
                });
            }

            services.AddMvcCore()
                .AddAuthorization()
                .AddJsonFormatters();

            services.AddMvc()
                .AddJsonOptions(options =>
                {
                    options.SerializerSettings.ContractResolver = new DefaultContractResolver();
                });

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }


            app.UseCors("default");

            //app.UseAuthentication();

            string authServiceUrl = Configuration.GetSection("AutenticationService")["Url"];
            app.UseIdentityServerAuthentication(new Microsoft.AspNetCore.Builder.IdentityServerAuthenticationOptions
            {
                Authority = authServiceUrl,
                AllowedScopes = { "ecosystemOnBoarding" },
                RequireHttpsMetadata = false,
                AutomaticChallenge = true,
                AutomaticAuthenticate = true,
                AuthenticationScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme
            });

            app.Use(async (context, next) =>
            {
                try
                {
                    await next();
                }
                catch (InvalidOperationException e)
                {
                    //System.IO.File.AppendAllText(@"C:\Users\Admin\Desktop\New folder\ex.txt", e.Message);
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsync("Unauthorized");
                }
                catch (Exception ex)
                {
                   // System.IO.File.AppendAllText(@"C:\Users\Admin\Desktop\New folder\ex.txt", ex.Message);
                    context.Response.StatusCode = 400;
                    await context.Response.WriteAsync("System error");
                }
            });

            app.UseMvc();
        }
    }
}
