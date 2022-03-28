using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using IntelART.OnlineLoans.Entities;
using IntelART.OnlineLoans.Repositories;
using System.Threading.Tasks;

namespace IntelART.OnlineLoans.LoanApplicationRestApi.Controllers
{
    /// <summary>
    /// Controller class to implement the API methods required for viewing, creating, and 
    /// managing loan applications
    /// </summary>
    [Authorize]
    [Route("/Applications/{id}/Manual")]
    public class LoanManualApplicationController : RepositoryControllerBase<ApplicationRepository>
    {
        public LoanManualApplicationController(IConfigurationRoot configuration)
            : base(configuration, (connectionString) => new ApplicationRepository(connectionString))
        {
        }

        /// <summary>
        /// Implements GET /Applications/{id}/Manual
        /// Returns manual application with the given id
        /// </summary>
        [HttpGet]
        public async Task<ManualApplication> Get(Guid id)
        {
            ManualApplication application = await Repository.GetManualApplication(id);
            return application;
        }

        /// <summary>
        /// Implements POST /Applications/{id}/Manual
        /// Creates main application with the given id
        /// </summary>
        [HttpPost]
        public async Task Post(Guid id, [FromBody]ManualApplication application)
        {
            await Repository.CreateManualApplication(id, application);
        }
    }
}
