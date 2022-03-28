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
    [Route("/Applications/{id}/LoanSpecialist")]
    public class LoanSpecialistApplicationController : RepositoryControllerBase<ApplicationRepository>
    {
        public LoanSpecialistApplicationController(IConfigurationRoot configuration)
            : base(configuration, (connectionString) => new ApplicationRepository(connectionString))
        {
        }

        /// <summary>
        /// Implements GET /Applications/{id}/LoanSpecialist
        /// Returns load specialist application (long page) with the given id
        /// </summary>
        [HttpGet]
        public async Task<LoanSpecialistMainApplication> Get(Guid id)
        {
            LoanSpecialistMainApplication application = await Repository.GetApplicationLoanSpecialist(id);
            return application;
        }

        /// <summary>
        /// Implements POST /Applications/{id}/LoanSpecialist
        /// Creates a loan specialist application (long page)
        /// </summary>
        [HttpPost]
        public async Task Post(Guid id, [FromBody]LoanSpecialistMainApplication application)
        {
            await Repository.SaveLoanSpecialistApplication(id, application, this.CurrentUserID);
        }
    }
}
