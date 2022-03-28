using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using IntelART.OnlineLoans.Repositories;
using IntelART.OnlineLoans.Entities;

namespace IntelART.OnlineLoans.LoanApplicationRestApi.Controllers
{
    /// <summary>
    /// Controller class to implement the API methods required
    /// to cancel the loan applications by the customers
    /// </summary>
    [Authorize]
    [Route("/Applications")]
    public class LoanApplicationTerminationController : RepositoryControllerBase<ApplicationRepository>
    {
        public LoanApplicationTerminationController(IConfigurationRoot configuration)
            : base(configuration, (connectionString) => new ApplicationRepository(connectionString))
        {
        }

        /// <summary>
        /// Implements PUT /Applications/Cancelled/{id}
        /// Cancels the application with the given id by a customer
        /// </summary>
        [HttpPut("Cancelled/{id}")]
        public async Task Put(Guid id, [FromBody]CancellationReason cancellationReason)
        {
            await Repository.CancelApplicationByCustomer(id, cancellationReason);
        }

        /// <summary>
        /// Implements PUT /Applications/Refused/{id}
        /// Refuses the application with the given id by a loan specialist
        /// </summary>
        [HttpPut("Refused/{id}")]
        public async Task Put(Guid id)
        {
            await Repository.RefuseApplicationByLoanSpecialist(id);
        }
    }
}
