using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using IntelART.OnlineLoans.Repositories;
using System.Collections.Generic;
using IntelART.OnlineLoans.Entities;
using System.Threading.Tasks;

namespace IntelART.OnlineLoans.LoanApplicationRestApi.Controllers
{
    /// <summary>
    /// Controller class to implement the API methods required for getting settings
    /// </summary>
    [Authorize]
    [Route("/Settings")]
    public class LoanSettingsController : RepositoryControllerBase<ApplicationParameterRepository>
    {
        public LoanSettingsController(IConfigurationRoot configuration)
            : base(configuration, (connectionString) => new ApplicationParameterRepository(connectionString))
        {
        }

        /// <summary>
        /// Implements GET /Settings/FileMaxSize
        /// Returns maximal size of files allowed to be uploaded.
        /// </summary>
        [HttpGet("FileMaxSize")]
        public int GetFileMaxSize()
        {
            int fileMaxSize = Repository.GetFileMaxSize();
            return fileMaxSize;
        }

        /// <summary>
        /// Implements GET /Settings/ScanMaxCount
        /// Returns the list of abbreviations and maximum counts of the scanned documents
        /// </summary>
        [HttpGet("ScanMaxCount")]
        public IEnumerable<Setting> GetScanMaxCount()
        {
            IEnumerable<Setting> scanMaxCounts = Repository.GetScanMaxCount();
            return scanMaxCounts;
        }

        /// <summary>
        /// Implements GET /Settings/LoanSettings
        /// Returns general loan settings.
        /// </summary>
        [HttpGet("LoanSettings")]
        public async Task<LoanSettings> GetLoanSettings()
        {
            LoanSettings settings = await Repository.GetLoanSettings();
            return settings;
        }

        /// <summary>
        /// Implements GET /Settings/ApplicationUnsecuredLimits
        /// Returns unsecured limits for Loan Specialist application.
        /// </summary>
        [HttpGet("ApplicationUnsecuredLimits")]
        public async Task<IEnumerable<ApplicationUnsecuredLimit>> GetApplicationUnsecuredLimits()
        {
            IEnumerable<ApplicationUnsecuredLimit> limits = await Repository.GetApplicationUnsecuredLimits();
            return limits;
        }

        /// <summary>
        /// Implements GET /Settings/LoanSpecialistLoanTerms
        /// Returns loan terms for loan specialist applications.
        /// </summary>
        [HttpGet("LoanSpecialistLoanTerms")]
        public async Task<IEnumerable<string>> GetLoanSpecialistLoanTerms()
        {
            IEnumerable<string> terms = await Repository.GetLoanSpecialistLoanTerms();
            return terms;
        }
    }
}
