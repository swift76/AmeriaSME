using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using IntelART.OnlineLoans.Entities;
using IntelART.OnlineLoans.Repositories;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace IntelART.OnlineLoans.LoanApplicationRestApi.Controllers
{
    /// <summary>
    /// Controller class to implement the API methods required for viewing, creating, and
    /// managing loan applications
    /// </summary>
    [Authorize]
    [Route("/Applications/{id}/PreapprovedResult")]
    public class LoanPreapprovedApplicationController : RepositoryControllerBase<ApplicationRepository>
    {
        public LoanPreapprovedApplicationController(IConfigurationRoot configuration)
            : base(configuration, (connectionString) => new ApplicationRepository(connectionString))
        {
        }

        /// <summary>
        /// Implements GET /Applications/{id}/PreapprovedResult
        /// Returns pre-approved results for the given application id
        /// </summary>
        [HttpGet]
        public async Task<IEnumerable<ApplicationPreapprovedResult>> Get(Guid id)
        {
            IEnumerable<ApplicationPreapprovedResult> results = await Repository.GetApplicationPreapprovedResult(id);
            return results;
        }

        /// <summary>
        /// Implements POST /Applications/{id}/PreapprovedResult
        /// Saves id of pre-approved result for the given application id
        /// </summary>
        [HttpPost]
        public async Task Post(Guid id, [FromBody]PreapprovedSelection result)
        {
            await Repository.UpdateApplicationPreapprovedResult(id, result.Id, result.IsRealEstate);
        }
    }
}
