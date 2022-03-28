using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using InetlART.Ecosystem.BL.UserManager;
using IntelART.IdentityManagement;
using IntelART.OnlineLoans.Entities.Ecosystem;
using IntelART.OnlineLoans.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IntelART.OnlineLoans.CustomerRestApi.Controllers
{
    [Route("[controller]")]
    public class EcosystemAccountController : Controller
    {
        private UserManager _userManager;
        private EcosystemUserRepository _ecosystemUserRepository;
        private UserRepository _userRepository;
        private ILogger _logger;
        private IntelART.OnlineLoans.SqlMembershipProvider.SqlMembershipProvider _membershipProvider;
        private IntelART.Ameria.Communication.AmeriaDbEmailSender _ameriaDbEmailSender;
        private IConfigurationRoot _configuration;

        private string CurrentUsername
        {
            get
            {
                return HttpContext.User.Identity.Name;
            }
        }
        public EcosystemAccountController(IConfigurationRoot Configuration, ILoggerFactory loggerFactory)
        {
            _configuration = Configuration;
            string connectionString = Configuration.GetSection("ConnectionStrings")["ScoringDB"];
            _ecosystemUserRepository = new EcosystemUserRepository(connectionString);
            _membershipProvider = new IntelART.OnlineLoans.SqlMembershipProvider.SqlMembershipProvider(connectionString);
            _userRepository = new UserRepository(connectionString);
            _ameriaDbEmailSender = new IntelART.Ameria.Communication.AmeriaDbEmailSender(connectionString);
            _userManager = new UserManager(_ecosystemUserRepository, _userRepository, _membershipProvider, _ameriaDbEmailSender);
            _logger = loggerFactory.CreateLogger("IntelART.Ecosystem");
        }

        [HttpGet("Ping")]
        public string Ping()
        {
            return "Sucess";
        }

        [HttpPost("Register")]
        public ApiResponse<string> Register([FromBody] EcosystemUserRegistration request)
        {
            ApiResponse<string> result;

            try
            {
                result = _userManager.RegisterUser(request);
            }
            catch (Exception ex)
            {
                result = new ApiResponse<string>();
                result.Message = new ResponseMessage();
                result.Success = false;
                result.Message.eng = "System error, please try again";
                result.Message.arm = "Համակարգի սխալ, խնդրում ենք նորից փորձել";

                string message = Environment.NewLine + "Exception date: " + DateTime.Now.ToString() + Environment.NewLine + "Exception: " + ex.Message;

                Exception innertExceptio = ex.InnerException;

                while (innertExceptio != null)
                {
                    message += Environment.NewLine + "Inner exception: " + innertExceptio.Message;
                    innertExceptio = innertExceptio.InnerException;
                }

                //System.IO.File.AppendAllText(@"C:\Users\Admin\Desktop\New folder\ex.txt", message);
                _logger.LogInformation(message);
            }
            return result;
        }

        [HttpPost("Confirm")]
        public ApiResponse<string> Confirm([FromBody] EcosystemUserConfirmation request)
        {
            ApiResponse<string> result;

            try
            {
                result = _userManager.ConfirmEcosystemUser(request.Token);
            }
            catch (Exception ex)
            {
                result = new ApiResponse<string>();
                result.Message = new ResponseMessage();
                result.Success = false;
                result.Message.eng = "Invalid or expired link";
                result.Message.arm = "Uնվավեր կամ ժամկետանց հղում";

                string message = Environment.NewLine + "Exception date: " + DateTime.Now.ToString() + Environment.NewLine + "Exception: " + ex.Message;

                Exception innertExceptio = ex.InnerException;

                while (innertExceptio != null)
                {
                    message += Environment.NewLine + "Inner exception: " + innertExceptio.Message;
                    innertExceptio = innertExceptio.InnerException;
                }

                _logger.LogInformation(message);
            }
            return result;
        }

        [HttpPost("ForgotPassword")]
        public async Task<ApiResponse<string>> ForgotPassword([FromBody] ForgotPassword request)
        {
            ApiResponse<string> result;

            string forgotPasswordUrl = _configuration.GetSection("ForgotPasswordUrl").Value;

            try
            {
                result = await _userManager.ForgotPassword(request, forgotPasswordUrl);
            }
            catch (Exception ex)
            {
                result = new ApiResponse<string>();
                result.Message = new ResponseMessage();
                result.Success = false;
                result.Message.eng = "System error, please try again";
                result.Message.arm = "Համակարգի սխալ, խնդրում ենք նորից փորձել";

                string message = Environment.NewLine + "Exception date: " + DateTime.Now.ToString() + Environment.NewLine + "Exception: " + ex.Message;

                Exception innertExceptio = ex.InnerException;

                while (innertExceptio != null)
                {
                    message += Environment.NewLine + "Inner exception: " + innertExceptio.Message;
                    innertExceptio = innertExceptio.InnerException;
                }

                _logger.LogInformation(message);
            }
            return result;
        }

        [HttpPost("ForgotPasswordConfirm")]
        public ApiResponse<string> ForgotPasswordConfirm([FromBody] ForgotPasswordConfirm request)
        {
            ApiResponse<string> result;

            try
            {
                result = _userManager.ForgotPasswordConfirm(request);
            }
            catch (Exception ex)
            {
                result = new ApiResponse<string>();
                result.Message = new ResponseMessage();
                result.Success = false;
                result.Message.eng = "Invalid or expired link";
                result.Message.arm = "Uնվավեր կամ ժամկետանց հղում";

                string message = Environment.NewLine + "Exception date: " + DateTime.Now.ToString() + Environment.NewLine + "Exception: " + ex.Message;

                Exception innertExceptio = ex.InnerException;

                while (innertExceptio != null)
                {
                    message += Environment.NewLine + "Inner exception: " + innertExceptio.Message;
                    innertExceptio = innertExceptio.InnerException;
                }

                _logger.LogInformation(message);
            }
            return result;
        }
    }
}