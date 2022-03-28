using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using IntelART.OnlineLoans.Repositories;
using IntelART.OnlineLoans.Entities;
using IntelART.Communication;

namespace IntelART.OnlineLoans.CustomerRestApi.Controllers
{
    /// <summary>
    /// A controller class that exposes functionality for customer account management.
    /// </summary>
    [Route("[controller]")]
    public class AccountController : Controller
    {
        private ISmsSender smsSender;
        private UserRepository repository;
        
        private string CurrentUsername
        {
            get
            {
                return HttpContext.User.Identity.Name;
            }
        }

        public AccountController(IConfigurationRoot Configuration, ISmsSender smsSender)
        {
            this.smsSender = smsSender;
            string connectionString = Configuration.GetSection("ConnectionStrings")["ScoringDB"];
            this.repository = new UserRepository(connectionString);
        }

        /// <summary>
        /// Creates new customer user
        /// </summary>
        [HttpPost]
        public async Task Post([FromBody]UserRegistration customerUser)
        {
            if (customerUser != null && !customerUser.ID.HasValue) // create customer user
            {
                string smsCode = repository.GetAuthorizationCode();
                customerUser.VERIFICATION_CODE = smsCode;
                this.repository.StartRegistration(customerUser);
                string phone = string.Format("374{0}", customerUser.MOBILE_PHONE.Trim());
                await smsSender.SendAsync(phone, smsCode);
            }
        }

        /// <summary>
        /// Resends SMS code to a newly created customer user
        /// /Account/{processId}
        /// </summary>
        [HttpPost("{processId}")]
        public async Task Post(Guid processId)
        {
            UserRegistration registrationProcess = this.repository.GetRegistration(processId);
            if (registrationProcess == null)
            {
                throw new ApplicationException("E-5002", "Անհայտ գրանցում");
            }

            int tryCount = int.Parse(repository.GetSetting("AUTHORIZATION_CODE_TRY_COUNT"));
            if (registrationProcess.SMS_COUNT >= tryCount)
            {
                throw new ApplicationException("E-5008", "SMS ուղարկելու քանակը սպառվեց");
            }

            string smsCode = repository.GetAuthorizationCode();
            repository.UpdateRegistration(processId, smsCode);
            string phone = string.Format("374{0}", registrationProcess.MOBILE_PHONE.Trim());
            await smsSender.SendAsync(phone, smsCode);
        }

        /// <summary>
        /// Set the SMS verification code for the given registration process ID.
        /// /Account/{processId}/Verification/{verificationCode}
        /// </summary>
        [HttpPut("{processId}/Verification/{verificationCode}")]
        public void Put(Guid processId, string verificationCode)
        {
            UserRegistration registrationProcess = this.repository.GetRegistration(processId);
            if (registrationProcess == null)
            {
                throw new ApplicationException("E-5002", "Անհայտ գրանցում։");
            }

            int tryCount = int.Parse(repository.GetSetting("AUTHORIZATION_CODE_TRY_COUNT"));
            if (registrationProcess.VERIFICATION_CODE != verificationCode)
            {
                if (registrationProcess.TRY_COUNT < tryCount)
                {
                    repository.SetTryUserRegistration(processId);
                    throw new ApplicationException("E-5003", "Մուտքագրված կոդը սխալ է");
                }
                else
                {
                    throw new ApplicationException("E-5006", "Հնարավոր փորձերի քանակը սպառվեց");
                }
            }

            User customerUser = new User();
            customerUser.COMPANY_NAME  = registrationProcess.COMPANY_NAME;
            customerUser.TAX_ID_NUMBER = registrationProcess.TAX_ID_NUMBER;
            customerUser.MOBILE_PHONE  = registrationProcess.MOBILE_PHONE;
            customerUser.EMAIL         = registrationProcess.EMAIL;
            customerUser.HASH          = registrationProcess.HASH;

            if (customerUser != null && !customerUser.ID.HasValue) // create customer user
            {
                this.repository.CreateUser(customerUser);
            }
        }

        [HttpGet("{restrictedPasswords}")]
        public async Task<IEnumerable<string>> GetRestrictedPasswords()
        {
            IEnumerable<string> restrictedPasswords = await repository.GetRestrictedPasswords();
            return restrictedPasswords;
        }
    }
}
