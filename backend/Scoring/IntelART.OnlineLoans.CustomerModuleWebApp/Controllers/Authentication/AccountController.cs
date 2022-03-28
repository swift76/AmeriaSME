using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using IdentityModel.Client;
using Newtonsoft.Json;
using IntelART.OnlineLoans.Entities;
using IntelART.OnlineLoans.Repositories;
using IntelART.Utilities;

namespace IntelART.OnlineLoans.CustomerModuleWebApp.Controllers.Authentication
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
            IActionResult result;
            if (HttpContext.User != null
                && HttpContext.User.Identity != null
                && HttpContext.User.Identity.IsAuthenticated)
            {
                if (string.IsNullOrEmpty(returnUrl))
                {
                    result = RedirectToAction("", "");
                }
                else
                {
                    result = Redirect(returnUrl);
                }
            }
            else
            {
                AuthenticationViewModel model = new AuthenticationViewModel();
                model.LoginModel.ReturnUrl = returnUrl;
                result = View(model);
            }

            return result;
        }

        [HttpGet]
        public async Task<IActionResult> RequestPasswordReset()
        {
            RequestPasswordResetModel model = new RequestPasswordResetModel();
            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> RequestPasswordReset([FromForm]RequestPasswordResetModel model)
        {
            IActionResult result = null;
            bool hasError = !ModelState.IsValid;
            try
            {
                if (!hasError)
                {
                    PasswordResetModel newModel = new PasswordResetModel();
                    newModel.RegistrationProcessId = Guid.NewGuid();
                    newModel.Phone = model.Phone;

                    HttpClient client = new HttpClient();
                    client.BaseAddress = new Uri(string.Format("{0}://{1}", this.Request.Scheme, this.Request.Host));
                    HttpResponseMessage response = await client.PutAsync(string.Format("/api/customer/Account/{0}/PasswordManagerProcess/{1}", model.Phone, newModel.RegistrationProcessId), null);
                    if (!response.IsSuccessStatusCode)
                    {
                        hasError = true;
                        bool isUnknownError = true;
                        if (response.Content != null)
                        {
                            string content = await response.Content.ReadAsStringAsync();
                            ErrorInfo exception = JsonConvert.DeserializeObject<ErrorInfo>(content);
                            if (exception != null)
                            {
                                isUnknownError = false;
                                ModelState.AddModelError("", exception.Message);
                            }
                        }
                        if (isUnknownError)
                        {
                            ModelState.AddModelError("", "Համակարգային սխալ գաղտնաբառի փոփոխման ժամանակ");
                        }
                    }

                    result = View("PasswordReset", newModel);
                }
            }
            catch (Exception e)
            {
                hasError = true;
                ModelState.AddModelError("", e.Message);
            }
            if(hasError)
            {
                result = View(model);
            }
            
            return result;
        }

        [HttpPost]
        public async Task<IActionResult> PasswordReset([FromForm]PasswordResetModel model)
        {
            IActionResult result = null;
            bool hasError = !ModelState.IsValid;
            try
            {
                if (!hasError)
                {
                    CustomerUserPasswordResetData data = new CustomerUserPasswordResetData();
                    data.SmsCode = model.VerificationCode;
                    data.NewPassword = model.Password;
                    HttpClient client = new HttpClient();
                    client.BaseAddress = new Uri(string.Format("{0}://{1}", this.Request.Scheme, this.Request.Host));

                    // password validation
                    if (!(await CheckRestrictedPasswords(client, model.Password)))
                    {
                        hasError = true;
                        ModelState.AddModelError("", "Անթույլատրելի գաղտնաբառ");
                    }
                    else
                    {
                        HttpResponseMessage response = await client.PostAsync(string.Format("/api/customer/Account/{0}/PasswordManagerProcess/{1}", model.Phone, model.RegistrationProcessId), new StringContent(JsonConvert.SerializeObject(data, Formatting.None), System.Text.Encoding.UTF8));
                        if (!response.IsSuccessStatusCode)
                        {
                            hasError = true;
                            bool isUnknownError = true;
                            if (response.Content != null)
                            {
                                string content = await response.Content.ReadAsStringAsync();
                                ErrorInfo exception = JsonConvert.DeserializeObject<ErrorInfo>(content);
                                if (exception != null)
                                {
                                    isUnknownError = false;
                                    ModelState.AddModelError("", exception.Message);
                                }
                            }
                            if (isUnknownError)
                            {
                                ModelState.AddModelError("", "Համակարգային սխալ գաղտնաբառի փոփոխման ժամանակ");
                            }
                        }
                    }

                    result = Redirect("Login");
                }
            }
            catch (Exception e)
            {
                hasError = true;
                ModelState.AddModelError("", e.Message);
            }
            if (hasError)
            {
                result = View(model);
            }

            return result;
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
                "customerApplication",
                "secret");

            string username = null;
            string password = null;

            username = model.Username;
            password = model.Password;

            TokenResponse tokenResponse = await client.RequestResourceOwnerPasswordAsync(username, password, "openid profile customerApi loanApplicationApi offline_access");

            if (!tokenResponse.IsError
                && tokenResponse.AccessToken != null)
            {
                JwtSecurityToken token = new JwtSecurityToken(tokenResponse.AccessToken);
                AuthenticationProperties props = new AuthenticationProperties();
                props.Items[".Token.access_token"] = tokenResponse.AccessToken;
                await HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme)),
                    props);

                if (string.IsNullOrEmpty(model.ReturnUrl))
                {
                    result = RedirectToAction("", "");
                }
                else
                {
                    result = Redirect(model.ReturnUrl);
                }
            }
            else
            {
                AuthenticationViewModel viewModel = new AuthenticationViewModel();
                viewModel.LoginModel.Username = model.Username;
                viewModel.LoginModel.ReturnUrl = model.ReturnUrl;
                if (!string.IsNullOrEmpty(tokenResponse.ErrorDescription))
                {
                    ModelState.AddModelError("", tokenResponse.ErrorDescription);
                }
                result = View(viewModel);
            }
            return result;
        }

        [HttpPost]
        ////[ValidateAntiForgeryToken]
        public async Task<IActionResult> Register([FromForm]RegisterModel model)
        {
            AuthenticationViewModel viewModel = new AuthenticationViewModel();
            Guid processId = Guid.NewGuid();
            string phone = null;
            bool hasError = !ModelState.IsValid;
            try
            {
                if (!hasError)
                {
                    phone = model.MobilePhone.Replace(" ", "");

                    if (!model.AcceptedTermsAndConditions)
                    {
                        throw new ApplicationException("ERR-0034", "Պայմաններին և կանոններին Ձեր համաձայնությունը պարտադիր է։");
                    }
                    else
                    {
                        // password validation
                        ValidationManager.ValidateCustomerPasswordCreation(model.TaxIdNumber,
                                                                           model.Password,
                                                                           model.ConfirmPassword);

                        HttpClient client = new HttpClient();
                        client.BaseAddress = new Uri(string.Format("{0}://{1}", this.Request.Scheme, this.Request.Host));
                        if (!(await CheckRestrictedPasswords(client, model.Password)))
                        {
                            hasError = true;
                            ModelState.AddModelError("", "Անթույլատրելի գաղտնաբառ");
                        }
                        else
                        {
                            UserRegistration user = new UserRegistration();
                            user.MOBILE_PHONE = phone;
                            user.EMAIL = model.Email;
                            user.HASH = Crypto.HashString(model.Password);
                            user.COMPANY_NAME = model.CompanyName;
                            user.TAX_ID_NUMBER = model.TaxIdNumber;
                            user.PROCESS_ID = processId;
                            HttpResponseMessage response = await client.PostAsync("/api/customer/Account", new StringContent(JsonConvert.SerializeObject(user, Formatting.None), System.Text.Encoding.UTF8));
                            if (!response.IsSuccessStatusCode)
                            {
                                hasError = true;
                                bool isUnknownError = true;
                                if (response.Content != null)
                                {
                                    string content = await response.Content.ReadAsStringAsync();
                                    ErrorInfo exception = JsonConvert.DeserializeObject<ErrorInfo>(content);
                                    if (exception != null)
                                    {
                                        isUnknownError = false;
                                        ModelState.AddModelError("", exception.Message);
                                    }
                                }
                                if (isUnknownError)
                                {
                                    ModelState.AddModelError("", "Համակարգային սխալ գրանցման ժամանակ");
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception e)
            {
                hasError = true;
                ModelState.AddModelError("", e.Message);
            }

            if (hasError)
            {
                viewModel.RegisterModel.CompanyName = model.CompanyName;
                viewModel.RegisterModel.TaxIdNumber = model.TaxIdNumber;
                viewModel.RegisterModel.MobilePhone = model.MobilePhone;
                viewModel.RegisterModel.Email = model.Email;
                viewModel.RegisterModel.AcceptedTermsAndConditions = model.AcceptedTermsAndConditions;
                viewModel.RegisterModel.IsActive = true;
                viewModel.LoginModel.IsActive = false;
            }
            else
            {
                ModelState.Clear();
                viewModel.VerificationModel.MobilePhone = "+374 " + phone;
                viewModel.VerificationModel.RegistrationProcessId = processId;
                viewModel.VerificationModel.IsActive = true;
                viewModel.LoginModel.IsActive = false;
            }

            return View("Login", viewModel);
        }

        [HttpPost]
        public async Task<IActionResult> VerifyPhone([FromForm]VerificationModel model)
        {
            AuthenticationViewModel viewModel = new AuthenticationViewModel();
            bool hasError = !ModelState.IsValid;
            try
            {
                if (!hasError)
                {
                    HttpClient client = new HttpClient();
                    client.BaseAddress = new Uri(string.Format("{0}://{1}", this.Request.Scheme, this.Request.Host));
                    HttpResponseMessage response = await client.PutAsync(string.Format("/api/customer/Account/{0}/Verification/{1}", model.RegistrationProcessId, model.VerificationCode), null);
                    if (!response.IsSuccessStatusCode)
                    {
                        hasError = true;
                        bool isUnknownError = true;
                        if (response.Content != null)
                        {
                            string content = await response.Content.ReadAsStringAsync();
                            ErrorInfo exception = JsonConvert.DeserializeObject<ErrorInfo>(content);
                            if (exception != null)
                            {
                                isUnknownError = false;
                                ModelState.AddModelError("", exception.Message);
                            }
                        }
                        if (isUnknownError)
                        {
                            ModelState.AddModelError("", "Համակարգային սխալ գրանցման ժամանակ");
                        }
                    }
                }
            }
            catch (Exception e)
            {
                hasError = true;
                ModelState.AddModelError("", e.Message);
            }

            if (hasError)
            {
                viewModel.VerificationModel.MobilePhone = model.MobilePhone;
                viewModel.VerificationModel.RegistrationProcessId = model.RegistrationProcessId;
                viewModel.VerificationModel.VerificationCode = model.VerificationCode;
                viewModel.VerificationModel.IsActive = true;
                viewModel.RegisterModel.IsActive = false;
                viewModel.LoginModel.IsActive = false;
            }
            else
            {
                ModelState.Clear();
            }

            return View("Login", viewModel);
        }

        [HttpPost]
        public async Task<IActionResult> ResendVerificationCode([FromQuery]Guid processID)
        {
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(string.Format("{0}://{1}", this.Request.Scheme, this.Request.Host));
            HttpResponseMessage response = await client.PostAsync(string.Format("/api/customer/Account/{0}/", processID), null);

            if (!response.IsSuccessStatusCode)
            {
                if (response.Content != null)
                {
                    string content = await response.Content.ReadAsStringAsync();
                    ErrorInfo exception = JsonConvert.DeserializeObject<ErrorInfo>(content);
                    throw new Exception(exception.Message);
                }
                throw new Exception();
            }

            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("", "");
        }

        private async Task<bool> CheckRestrictedPasswords(HttpClient client, string password)
        {
            HttpResponseMessage responsePasswords = await client.GetAsync("/api/customer/Account/restrictedPasswords");
            string responsePasswordsContent = await responsePasswords.Content.ReadAsStringAsync();
            List<string> restrictedPasswords = JsonConvert.DeserializeObject<List<string>>(responsePasswordsContent);
            if (restrictedPasswords != null)
            {
                foreach (string restrictedPassword in restrictedPasswords)
                {
                    if (password.ToLower().Contains(restrictedPassword))
                    {
                        return false;
                    }
                }
            }
            return true;
        }
    }
}
