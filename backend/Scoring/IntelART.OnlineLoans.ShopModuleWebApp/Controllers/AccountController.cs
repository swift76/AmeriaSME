using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using IdentityModel.Client;
using Microsoft.AspNetCore.Authorization;
using IntelART.Ameria.ShopModuleWebApp.Models;
using System.Net.Http;
using Newtonsoft.Json;
using IntelART.Utilities;

namespace IntelART.Ameria.ShopModuleWebApp.Controllers
{
    public class AccountController : Controller
    {
        private string identityServerUrl;

        private string CurrentUsername
        {
            get
            {
                return HttpContext.User.Identity.Name;
            }
        }

        public AccountController(IConfigurationRoot configuration)
        {
            this.identityServerUrl = configuration.GetSection("Authentication")["Authority"];
        }

        [HttpGet]
        public async Task<IActionResult> Login([FromQuery]string returnUrl)
        {
            LoginModel model = new LoginModel();
            model.ReturnUrl = returnUrl;
            return View(model);
        }

        [HttpPost]
        ////[ValidateAntiForgeryToken]
        public async Task<IActionResult> Login([FromForm]LoginModel model)
        {
            IActionResult result;

            var disco = await DiscoveryClient.GetAsync(this.identityServerUrl);
            if (disco.IsError)
            {
                throw new Exception(disco.Error);
            }

            var client = new TokenClient(
                disco.TokenEndpoint,
                "shopApplication2",
                "secret");

            string ipAddress = await GetIPAddress();

            TokenResponse tokenResponse = await client.RequestResourceOwnerPasswordAsync(model.Username, model.Password, "openid profile loanApplicationApi offline_access");

            if (!tokenResponse.IsError
                && tokenResponse.AccessToken != null)
            {
                JwtSecurityToken token = new JwtSecurityToken(tokenResponse.AccessToken);
                AuthenticationProperties props = new AuthenticationProperties();
                props.Items[".Token.access_token"] = tokenResponse.AccessToken;
                await HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(new ClaimsIdentity(token.Claims, CookieAuthenticationDefaults.AuthenticationScheme)),
                    props);

                LogIP(ipAddress, "LOAN SPECIALIST LOGIN");

                return Ok(tokenResponse.Json);
            }
            else
            {
                return BadRequest(tokenResponse.Json);
            }
        }

        [HttpGet]
        public async Task<IActionResult> Logout()
        {
            string ipAddress = await GetIPAddress();
            LogIP(ipAddress, "LOAN SPECIALIST LOGOUT");
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("", "");
        }

        [Authorize]
        [HttpGet()]
        public async Task<IActionResult> ChangePassword()
        {
            if (HttpContext.User != null
                && HttpContext.User.Identity != null
                && HttpContext.User.Identity.IsAuthenticated)
            {
                string returnUrl = HttpContext.Request.Headers["referer"];
                ChangePasswordModel model = new ChangePasswordModel();
                model.Username = HttpContext.User.Identity.Name;
                if (!string.IsNullOrWhiteSpace(returnUrl))
                {
                    model.ReturnUrl = returnUrl;
                }
                return View(model);
            }
            else
            {
                return Unauthorized();
            }
        }

        [Authorize]
        [HttpPost()]
        public async Task<IActionResult> ChangePassword(ChangePasswordModel model)
        {
            // IActionResult result;

            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(string.Format("{0}://{1}", this.Request.Scheme, this.Request.Host));

            FormUrlEncodedContent form = new FormUrlEncodedContent(new[] {
                new KeyValuePair<string, string>("Username", model.Username),
                new KeyValuePair<string, string>("OldPassword", model.OldPassword),
                new KeyValuePair<string, string>("NewPassword", model.NewPassword),
                new KeyValuePair<string, string>("ConfirmNewPassword", model.ConfirmNewPassword),
                new KeyValuePair<string, string>("ReturnUrl", model.ReturnUrl),
            });
            AuthenticateResult info = await this.HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            string accessToken;
            if (info != null
                && info.Properties != null
                && info.Properties.Items != null
                && info.Properties.Items.TryGetValue(".Token.access_token", out accessToken))
            {
                client.SetBearerToken(accessToken);
            }
            string sss = JsonConvert.SerializeObject(new { oldPassword = model.OldPassword, newPassword = model.NewPassword, newPasswordConfirmation = model.ConfirmNewPassword }, Formatting.None);
            HttpResponseMessage response = await client.PostAsync("/api/loan/Account/Password/", new StringContent(sss, System.Text.Encoding.UTF8));

            if (response.IsSuccessStatusCode)
            {
                // TODO: Tigran: Should logout here. Also, the redirect URL should be the logout
                // endpoint of the clinet application, so that the user will be logged out on the
                // client application scope as well.
                // result = Redirect(model.ReturnUrl);
                return Ok(true);
            }
            else
            {
                bool isUnknownError = true;
                if (response.Content != null)
                {
                    string content = await response.Content.ReadAsStringAsync();
                    ErrorInfo exception = JsonConvert.DeserializeObject<ErrorInfo>(content);
                    if (exception != null)
                    {
                        isUnknownError = false;
                        // ModelState.AddModelError("", exception.Message);
                        return BadRequest(exception);
                    }
                }
                if (isUnknownError)
                {
                    // ModelState.AddModelError("", "Համակարգային սխալ գաղտնաբառի փոփոխման ժամանակ");
                    return BadRequest("Համակարգային սխալ գաղտնաբառի փոփոխման ժամանակ");
                }
                // result = View(model);
                return BadRequest();
            }
        }

        private async Task<string> GetIPAddress()
        {
            string ipAddress;
            if (HttpContext.Request.Headers.ContainsKey("X-SME-IP"))
                ipAddress = HttpContext.Request.Headers["X-SME-IP"];
            else
                ipAddress = HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
            return ipAddress;
        }

        private async void LogIP(string ipAddress, string operation)
        {
            HttpClient httpClient = new HttpClient();
            httpClient.BaseAddress = new Uri(string.Format("{0}://{1}", this.Request.Scheme, this.Request.Host));
            AuthenticateResult info = await this.HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            string accessToken;
            if (info != null
                && info.Properties != null
                && info.Properties.Items != null
                && info.Properties.Items.TryGetValue(".Token.access_token", out accessToken))
            {
                httpClient.SetBearerToken(accessToken);
            }
            string logIP = JsonConvert.SerializeObject(new { IP = ipAddress, Operation = operation }, Formatting.None);
            HttpResponseMessage response = await httpClient.PostAsync("/api/loan/Account/IP/", new StringContent(logIP, System.Text.Encoding.UTF8));
        }
    }
}
