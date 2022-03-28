using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using IntelART.OnlineLoans.Repositories;

namespace IntelART.OnlineLoans.LoanApplicationRestApi.Controllers
{
    /// <summary>
    /// Controller class to implement the API methods required for getting 
    /// the URL of individual online loan page
    /// </summary>
    [Authorize]
    [Route("[controller]")]
    public class IndividualLoanPageController : RepositoryControllerBase<BaseRepository>
    {
        public IndividualLoanPageController(IConfigurationRoot configuration)
            : base(configuration, (connectionString) => new BaseRepository(connectionString))
        {
        }

        /// <summary>
        /// Implements GET /IndividualLoanPage
        /// Returns the loan repayment schedule based on the loan amount, the interest rate,
        /// and the loan duration in months
        /// </summary>
        [HttpGet]
        public string Get()
        {
            string individualLoanPageUrl = Repository.GetSetting("INDIVIDUAL_ONLINE_LOAN_PAGE");
            return individualLoanPageUrl;
        }
    }
}
