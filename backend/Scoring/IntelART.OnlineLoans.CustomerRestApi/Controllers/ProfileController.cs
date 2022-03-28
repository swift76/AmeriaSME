using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using IntelART.Utilities;
using IntelART.OnlineLoans.Repositories;
using Microsoft.Extensions.Configuration;
using IntelART.OnlineLoans.Entities;

namespace IntelART.OnlineLoans.CustomerRestApi.Controllers
{
    /// <summary>
    /// A controller class that exposes Customers entities.
    /// </summary>
    [Route("[controller]")]
    [Authorize]
    public class ProfileController : Controller
    {
        private string ConnectionString;
        private UserRepository repository;
        
        private string CurrentUsername
        {
            get
            {
                return HttpContext.User.Identity.Name;
            }
        }

        private int CurrentUserID
        {
            get
            {
                return int.Parse(HttpContext.User.FindFirst("sub").Value);
            }
        }

        public ProfileController(IConfigurationRoot Configuration)
        {
            this.ConnectionString = Configuration.GetSection("ConnectionStrings")["ScoringDB"];
            this.repository = new UserRepository(this.ConnectionString);
        }

        /// <summary>
        /// Get the current user ID and lookup the
        /// CustiomerUser object with that ID
        /// </summary>
        [HttpGet]
        public User Get()
        {
            User customerUser = this.repository.GetUser(this.CurrentUserID);
            return customerUser;
        }

        /// <summary>
        /// Changes Customer user password
        /// </summary>
        [HttpPut("login")]
        public void ChangeUserPassword(string login,
                                      [FromBody]string oldPassword,
                                      [FromBody]string newPassword,
                                      [FromBody]string newPasswordRepeat)
        {
            // this is not used at the moment
            ValidationManager.ValidatePasswordChange(login, oldPassword, newPassword, newPasswordRepeat);

            if (repository.AuthenticateUser(login, Crypto.HashString(oldPassword)) == null)
                throw new Exception("Հին գաղտնաբառը սխալ է");

            repository.ChangeUserPassword(login, Crypto.HashString(newPassword));
        }
    }
}
