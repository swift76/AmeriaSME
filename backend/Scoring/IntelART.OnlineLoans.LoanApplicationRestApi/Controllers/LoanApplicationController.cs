using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using IntelART.OnlineLoans.Entities;
using IntelART.OnlineLoans.Repositories;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace IntelART.OnlineLoans.LoanApplicationRestApi.Controllers
{
    /// <summary>
    /// Controller class to implement the API methods required for viewing, creating, and
    /// managing loan applications
    /// </summary>
    [Authorize]
    [Route("/Applications")]
    public class LoanApplicationController : RepositoryControllerBase<ApplicationRepository>
    {
        private readonly string remoteIpAddress;

        public LoanApplicationController(IConfigurationRoot configuration, IHttpContextAccessor httpContextAccessor)
            : base(configuration, (connectionString) => new ApplicationRepository(connectionString))
        {
            if (httpContextAccessor.HttpContext.Request.Headers.ContainsKey("X-SME-IP"))
                this.remoteIpAddress = httpContextAccessor.HttpContext.Request.Headers["X-SME-IP"];
            else
                this.remoteIpAddress = httpContextAccessor.HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
        }

        /// <summary>
        /// Implements GET /Applications?taxIdNumber={taxIdNumber}
        /// Returns all applications accessible to the current user
        /// </summary>
        [HttpGet]
        public async Task<IEnumerable<Application>> Get([FromQuery]string taxIdNumber)
        {
            IEnumerable<Application> applications;
            if (this.IsLoanSpecialist) // loan specialist
            {
                applications = await Repository.GetLoanSpecialistApplications(this.CurrentUserID, taxIdNumber);
            }
            else // customer user
            {
                applications = await Repository.GetApplications(this.CurrentUserID);
            }

            return applications;
        }

        /// <summary>
        /// Implements GET /Applications/{id}
        /// Returns initial application with the given id
        /// </summary>
        [HttpGet("{id}")]
        public async Task<InitialApplication> Get(Guid id)
        {
            InitialApplication application;
            if (this.IsLoanSpecialist) // loan specialist
            {
                application = await Repository.GetInitialApplicationLoanSpecialist(id, this.CurrentUserID);
            }
            else // customer user
            {
                application = await Repository.GetInitialApplication(id);
            }

            return application;
        }

        /// <summary>
        /// Implements POST /Applications
        /// Creates a new initial application
        /// </summary>
        [HttpPost]
        public async Task<Guid> Post([FromBody]InitialApplication application)
        {
            if (application.IS_SUBMIT && !application.AGREED_WITH_TERMS)
            {
                throw new ApplicationException("ERR-0036", "Պայմաններին և կանոններին Ձեր համաձայնությունը պարտադիր է։");
            }

            if (application.IS_SUBMIT && !this.IsLoanSpecialist)
            {
                ApplicationCountSetting setting = await Repository.GetApplicationCountSetting(this.CurrentUserID, application.ID, application.LOAN_TYPE_ID);
                if (setting.APPLICATION_COUNT > setting.REPEAT_COUNT)
                {
                    throw new ApplicationException("ERR-0200", "Application count overflow");
                }
            }

            Guid applicationId = await Repository.CreateInitialApplication(application, this.CurrentUserID, this.IsLoanSpecialist);
            if (this.IsLoanSpecialist)
            {
                this.Repository.LogClientIpAddress(remoteIpAddress, this.CurrentUserID, "CREATE INITIAL APPLICATION");
            }
            return applicationId;
        }

        /// <summary>
        /// Implements DELETE /Applications/{id}
        /// Deletes an application with the given id
        /// </summary>
        [HttpDelete("{id}")]
        public async Task Delete(Guid id)
        {
            await Repository.DeleteApplication(id);
        }

        /// <summary>
        /// Implements GET /Applications/ApplicationInformation/{id}
        /// Returns information of the application with the given id
        /// </summary>
        [HttpGet("ApplicationInformation/{id}")]
        public async Task<ApplicationInformation> ApplicationInformation(Guid id)
        {
            ApplicationInformation application = await Repository.GetApplicationInformation(id);
            return application;
        }

        /// <summary>
        /// Implements GET /Applications/CustomerLatestApplicationData/{taxIdNumber}
        /// Returns latest application data for the given tax ID
        /// </summary>
        [HttpGet("CustomerLatestApplicationData/{taxIdNumber}")]
        public async Task<InitialApplication> GetCustomerLatestApplicationData(string taxIdNumber)
        {
            InitialApplication application = await Repository.GetCustomerLatestApplicationData(taxIdNumber);
            if (application == null)
                application = new InitialApplication();
            return application;
        }
    }
}
