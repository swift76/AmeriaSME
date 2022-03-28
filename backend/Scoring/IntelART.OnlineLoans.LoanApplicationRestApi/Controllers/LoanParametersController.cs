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
    /// loan Parameters available as a result of the successful scoring
    /// </summary>
    [Authorize]
    [Route("/Parameters")]
    public class LoanParametersController : RepositoryControllerBase<ApplicationParameterRepository>
    {
        public LoanParametersController(IConfigurationRoot configuration)
            : base(configuration, (connectionString) => new ApplicationParameterRepository(connectionString))
        {
        }

        /// <summary>
        /// Implements GET /Parameters?loanTypeCode={loanTypeCode}
        /// Returns lower and upper loan Parameters for the given loan type.
        /// </summary>
        [HttpGet]
        public async Task<LoanParameters> Get([FromQuery]string loanTypeCode)
        {
            LoanParameters loanParameters = await Repository.GetLoanParameters(loanTypeCode);
            return loanParameters;
        }
    }
}
