using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using IntelART.OnlineLoans.Repositories;

namespace IntelART.OnlineLoans.LoanApplicationRestApi.Controllers
{
    /// <summary>
    /// Controller class to implement the API methods required for getting
    /// information about the company
    /// </summary>
    [Authorize]
    [Route("/Company/{id}")]
    public class CompanyController : RepositoryControllerBase<CompanyRepository>
    {
        public CompanyController(IConfigurationRoot configuration)
            : base(configuration, (connectionString) => new CompanyRepository(connectionString))
        {
        }

        /// <summary>
        /// Implements GET /Company/{id}/IsCompanyLLC
        /// Returns true, if the company is LLC, and false, if it is IE
        /// </summary>
        [HttpGet("IsCompanyLLC")]
        public bool IsCompanyLLC(Guid id)
        {
            bool isCompanyLLC = Repository.IsCompanyLLC(id);
            return isCompanyLLC;
        }

        /// <summary>
        /// Implements GET /Company/{id}/HasCompanyMultipleOwners
        /// Returns true, if the company is LLC and has multiple owners,
        /// otherwise returns false
        /// </summary>
        [HttpGet("HasCompanyMultipleOwners")]
        public bool HasCompanyMultipleOwners(Guid id)
        {
            bool hasCompanyMultipleOwners = Repository.HasCompanyMultipleOwners(id);
            return hasCompanyMultipleOwners;
        }
    }
}
