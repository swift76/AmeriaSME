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
    /// Controller class to implement the API methods required for retrieving
    /// different lookup sets
    /// </summary>
    [Authorize]
    [Route("/ApplicationGroupData")]
    public class LoanApplicationGroupDataController : RepositoryControllerBase<GroupDataRepository>
    {
        public LoanApplicationGroupDataController(IConfigurationRoot Configuration)
            : base(Configuration, (connectionString)=>new GroupDataRepository(connectionString))
        {
        }

        /// <summary>
        /// Gets the list of company profits
        /// </summary>
        [HttpGet("CompanyProfits/{id}")]
        public async Task<IEnumerable<ApplicationCompanyDataWithName>> GetCompanyProfits(Guid id)
        {
            IEnumerable<ApplicationCompanyDataWithName> profits = await Repository.GetCompanyProfits(id, this.languageCode);
            return profits;
        }

        /// <summary>
        /// Gets the list of company overheads
        /// </summary>
        [HttpGet("CompanyOverheads/{id}")]
        public async Task<List<ApplicationCompanyOverheadGrouped>> GetCompanyOverheads(Guid id)
        {
            List<ApplicationCompanyOverheadGrouped> overheads = await Repository.GetCompanyOverheads(id, this.languageCode);
            return overheads;
        }

        /// <summary>
        /// Gets the list of company costs
        /// </summary>
        [HttpGet("CompanyCosts/{id}")]
        public async Task<IEnumerable<ApplicationCompanyDataWithName>> GetCompanyCosts(Guid id)
        {
            IEnumerable<ApplicationCompanyDataWithName> costs = await Repository.GetCompanyCosts(id, this.languageCode);
            return costs;
        }

        /// <summary>
        /// Gets the list of operational expenses of the company
        /// </summary>
        [HttpGet("CompanyOperationalExpenses/{id}")]
        public async Task<IEnumerable<ApplicationCompanyDataWithName>> GetCompanyOperationalExpenses(Guid id)
        {
            IEnumerable<ApplicationCompanyDataWithName> operationalExpenses = await Repository.GetCompanyOperationalExpenses(id, this.languageCode);
            return operationalExpenses;
        }

        /// <summary>
        /// Gets the list of non-operational expenses of the company
        /// </summary>
        [HttpGet("CompanyNonOperationalExpenses/{id}")]
        public async Task<IEnumerable<ApplicationCompanyDataWithName>> GetCompanyNonOperationalExpenses(Guid id)
        {
            IEnumerable<ApplicationCompanyDataWithName> nonOperationalExpenses = await Repository.GetCompanyNonOperationalExpenses(id, this.languageCode);
            return nonOperationalExpenses;
        }

        /// <summary>
        /// Gets the list of balances of the company
        /// </summary>
        [HttpGet("CompanyBalances/{id}")]
        public async Task<IEnumerable<ApplicationCompanyDataWithName>> GetCompanyBalances(Guid id)
        {
            IEnumerable<ApplicationCompanyDataWithName> balances = await Repository.GetCompanyBalances(id, this.languageCode);
            return balances;
        }

        /// <summary>
        /// Gets the list of other statistics of the company
        /// </summary>
        [HttpGet("CompanyOtherStatistics/{id}")]
        public async Task<IEnumerable<ApplicationCompanyDataWithName>> GetCompanyOtherStatistics(Guid id)
        {
            IEnumerable<ApplicationCompanyDataWithName> otherStatistics = await Repository.GetCompanyOtherStatistics(id, this.languageCode);
            return otherStatistics;
        }

        /// <summary>
        /// Gets the list of good month earnings of the company
        /// </summary>
        [HttpGet("GoodMonthEarnings/{id}")]
        public async Task<IEnumerable<ApplicationCompanyDataWithName>> GetGoodMonthEarnings(Guid id)
        {
            IEnumerable<ApplicationCompanyDataWithName> earnings = await Repository.GetGoodMonthEarnings(id, this.languageCode);
            return earnings;
        }

        /// <summary>
        /// Gets the list of bad month earnings of the company
        /// </summary>
        [HttpGet("BadMonthEarnings/{id}")]
        public async Task<IEnumerable<ApplicationCompanyDataWithName>> GetBadMonthEarnings(Guid id)
        {
            IEnumerable<ApplicationCompanyDataWithName> earnings = await Repository.GetBadMonthEarnings(id, this.languageCode);
            return earnings;
        }

        /// <summary>
        /// Gets the list of application Guarantors
        /// </summary>
        [HttpGet("ApplicationGuarantors/{id}")]
        public async Task<IEnumerable<ApplicationRelatedPerson>> GetApplicationGuarantors(Guid id)
        {
            IEnumerable<ApplicationRelatedPerson> guarantors = await Repository.GetApplicationGuarantors(id);
            return guarantors;
        }

        /// <summary>
        /// Gets the list of application Pledgers
        /// </summary>
        [HttpGet("ApplicationPledgers/{id}")]
        public async Task<IEnumerable<ApplicationRelatedPerson>> GetApplicationPledgers(Guid id)
        {
            IEnumerable<ApplicationRelatedPerson> pledgers = await Repository.GetApplicationPledgers(id);
            return pledgers;
        }

        [HttpGet("IndustryTypes")]
        public async Task<IEnumerable<DirectoryEntity>> GetIndustryTypes()
        {
            IEnumerable<DirectoryEntity> types = await Repository.GetIndustryTypes(this.languageCode);
            return types;
        }

        [HttpGet("IndustryProducts")]
        public async Task<IEnumerable<DirectoryEntity>> GetIndustryProducts()
        {
            IEnumerable<DirectoryEntity> products = await Repository.GetIndustryProducts(this.languageCode);
            return products;
        }
    }
}
