using System;
using Microsoft.AspNetCore.Mvc;
using IntelART.Utilities;
using IntelART.OnlineLoans.Repositories;
using Microsoft.Extensions.Configuration;
using IntelART.OnlineLoans.Entities;
using IntelART.Communication;
using System.Threading.Tasks;

namespace IntelART.OnlineLoans.CustomerRestApi.Controllers
{
    /// <summary>
    /// A controller class that exposes functionality for customer account management.
    /// </summary>
    [Route("Account/{username}/PasswordManagerProcess")]
    public class AccountPasswordController : Controller
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

        public AccountPasswordController(IConfigurationRoot Configuration, ISmsSender smsSender)
        {
            this.smsSender = smsSender;
            string connectionString = Configuration.GetSection("ConnectionStrings")["ScoringDB"];
            this.repository = new UserRepository(connectionString);
        }

        /// <summary>
        /// Creates new password reset process
        /// </summary>
        [HttpPut("{processId}")]
        public async Task Put(string username, Guid processId)
        {
            if (processId != null)
            {
                if (this.repository.CheckUserExistenceByParameter("MOBILE_PHONE", username))
                {
                    string smsCode = repository.GetAuthorizationCode();
                    this.repository.StartUserPasswordReset(username, processId, Crypto.HashString(smsCode));
                    await smsSender.SendAsync(string.Format("374{0}", username), smsCode);
                }
                else
                {
                    throw new ApplicationException("E-5112", "Տվյալ հեռախոսահամարով գրանցված օգտագործող գոյություն չունի");
                }
            }
        }

        /// <summary>
        /// Updates the password within the context of the given password update process.
        /// /Account/{username}/PasswordManagerProcess/{processId}
        /// </summary>
        [HttpPost("{processId}")]
        public void Post(string username, Guid processId, [FromBody]CustomerUserPasswordResetData data)
        {
            if (data == null)
            {
                throw new ApplicationException("E-5111", "Գաղտնաբառի վերականգնման թերի հարցում");
            }

            this.repository.ResetUserPassword(username, Crypto.HashString(data.SmsCode), processId, Crypto.HashString(data.NewPassword));
        }
    }
}
