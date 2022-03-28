using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using IntelART.OnlineLoans.Entities;
using IntelART.OnlineLoans.Repositories;

namespace IntelART.OnlineLoans.LoanApplicationRestApi.Controllers
{
    /// <summary>
    /// Controller class to implement the API methods required for getting the
    /// loan options available as a result of the successful scoring
    /// </summary>
    [Authorize]
    [Route("/Applications/{id}")]
    public class LoanApplicationScoringResultsController : RepositoryControllerBase<ApplicationRepository>
    {
        public LoanApplicationScoringResultsController(IConfigurationRoot configuration)
            : base(configuration, (connectionString) => new ApplicationRepository(connectionString))
        {
        }

        /// <summary>
        /// Implements GET /Applications/{id}/ScoringResults
        /// Returns scoring results for the main application with the given id
        /// </summary>
        [HttpGet("ScoringResults")]
        public async Task<IEnumerable<ScoringResults>> Get(Guid id)
        {
            IEnumerable<ScoringResults> results = await Repository.GetApplicationScoringResult(id);
            return results;
        }
    }
}
