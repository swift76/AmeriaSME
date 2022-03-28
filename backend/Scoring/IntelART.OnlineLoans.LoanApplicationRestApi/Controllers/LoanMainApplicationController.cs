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
    [Route("/Applications/{id}/Main")]
    public class LoanMainApplicationController : RepositoryControllerBase<ApplicationRepository>
    {
        public LoanMainApplicationController(IConfigurationRoot configuration)
            : base(configuration, (connectionString) => new ApplicationRepository(connectionString))
        {
        }

        /// <summary>
        /// Implements GET /Applications/{id}/Main
        /// Returns main application with the given id
        /// </summary>
        [HttpGet]
        public async Task<MainApplication> Get(Guid id)
        {
            MainApplication application = await Repository.GetMainApplication(id, this.CurrentUserID);
            return application;
        }

        /// <summary>
        /// Implements POST /Applications/{id}/Main
        /// Creates main application with the given id
        /// </summary>
        [HttpPost]
        public async Task Post(Guid id, [FromBody]MainApplication application)
        {
            // before submitting the main application, a server side check
            // to be sure that the user has submitted valid amount
            IEnumerable<ScoringResults> results = await Repository.GetApplicationScoringResult(id);
            bool isAmountCorrect = false;
            decimal selectedAmount = 0;
            byte selectedLoanTerm = byte.Parse(application.LOAN_TERM);

            foreach (ScoringResults result in results)
            {
                if (application.INTEREST == result.INTEREST
                    && (selectedLoanTerm == 0 || // Անժամկետ
                       (selectedLoanTerm >= result.TERM_FROM && selectedLoanTerm <= result.TERM_TO)))
                {
                    // the final amount should be equal to APPROVED_AMOUNT_2, if it is refinancing,
                    // and to APPROVED_AMOUNT_1, otherwise
                    if (application.IS_REFINANCING)
                    {
                        isAmountCorrect = (application.FINAL_AMOUNT == result.APPROVED_AMOUNT_2);
                        selectedAmount = result.APPROVED_AMOUNT_2;
                    }
                    else
                    {
                        isAmountCorrect = (application.FINAL_AMOUNT == result.APPROVED_AMOUNT_1);
                        selectedAmount = result.APPROVED_AMOUNT_1;
                    }
                    break;
                }
            }

            if (!isAmountCorrect)
            {
                throw new ApplicationException("ERR-5055",
                    string.Format("Վարկի վերջնական գումարը ({0}) չի կարող տարբեր լինել Ձեր ընտրած գումարից ({1})", application.FINAL_AMOUNT.ToString("N0"), selectedAmount.ToString("N0")));
            }
            else
            {
                await Repository.CreateMainApplication(id, application, this.CurrentUserID);
            }
        }
    }
}
