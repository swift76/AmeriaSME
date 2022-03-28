using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using IntelART.OnlineLoans.Entities;
using IntelART.OnlineLoans.Repositories;
using System.Threading.Tasks;
using System.Text.RegularExpressions;

namespace IntelART.OnlineLoans.LoanApplicationRestApi.Controllers
{
    /// <summary>
    /// Controller class to implement the API methods required for viewing, creating, and
    /// managing loan applications
    /// </summary>
    [Authorize]
    [Route("/Applications/{id}/Agreed")]
    public class LoanAgreedApplicationController : RepositoryControllerBase<ApplicationRepository>
    {
        public LoanAgreedApplicationController(IConfigurationRoot configuration)
            : base(configuration, (connectionString) => new ApplicationRepository(connectionString))
        {
        }

        /// <summary>
        /// Implements GET /Applications/{id}/Agreed
        /// Returns agreed application with the given id
        /// </summary>
        [HttpGet]
        public async Task<AgreedApplication> Get(Guid id)
        {
            AgreedApplication application = await Repository.GetAgreedApplication(id);
            return application;
        }

        /// <summary>
        /// Implements POST /Applications/{id}/Agreed
        /// Creates main application with the given id
        /// </summary>
        [HttpPost]
        public async Task Post(Guid id, [FromBody]AgreedApplication application)
        {
            if (application.IS_SUBMIT)
            {
                if (!application.AGREED_WITH_TERMS)
                {
                    throw new ApplicationException("ERR-0036", "Պայմաններին և կանոններին Ձեր համաձայնությունը պարտադիր է։");
                }
                if (Repository.IsCompanyLLC(id) && PrepareString(application.GUARANTEE_SIGNATURE_TEXT) != PrepareString(await Repository.GetGuaranteeSignature(id)))
                {
                    throw new ApplicationException("ERR-0037", "Երաշխավորության համաձայնության տեքստի անհամապատասխանություն։");
                }
            }

            await Repository.CreateAgreedApplication(id, application);
        }

        private string PrepareString(string source)
        {
    	    if (source == null)
            {
                return null;
            }
            return Regex.Replace(source, @"[^Ա-Ֆա-և0-9]", "").Trim().ToUpper();
        }
    }
}
