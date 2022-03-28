using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using IntelART.OnlineLoans.Entities;
using IntelART.OnlineLoans.Repositories;
using System.Threading.Tasks;

namespace IntelART.OnlineLoans.LoanApplicationRestApi.Controllers
{
    /// <summary>
    /// Controller class to implement the API methods required for viewing of user data
    /// </summary>
    [Authorize]
    [Route("/BankUsers")]
    public class BankUserController : RepositoryControllerBase<UserRepository>
    {
        public BankUserController(IConfigurationRoot configuration)
            : base(configuration, (connectionString) => new UserRepository(connectionString))
        {
        }

        /// <summary>
        /// Implements GET /BankUsers
        /// Returns bank user data for the logged user
        /// </summary>
        [HttpGet()]
        public async Task<BankUser> Get()
        {
            BankUser user = await Repository.GetBankUser(this.CurrentUserID);
            return user;
        }
    }
}
