using System;
using System.Linq;
using Dapper;
using System.Collections.Generic;
using IntelART.OnlineLoans.Entities;
using System.Threading.Tasks;

namespace IntelART.OnlineLoans.Repositories
{
    public class GroupDataRepository : BaseRepository
    {
        public GroupDataRepository(string connectionString) : base(connectionString)
        {
        }

        /// <summary>
        /// Returns list of company profits
        /// </summary>
        public async Task<IEnumerable<ApplicationCompanyDataWithName>> GetCompanyProfits(Guid applicationID, string languageCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", applicationID);
            parameters.Add("LANGUAGE_CODE",  languageCode);
            return await GetListAsync<ApplicationCompanyDataWithName>(parameters, "dbo.sp_GetCompanyProfits");
        }

        /// <summary>
        /// Returns list of company overheads
        /// </summary>
        public async Task<List<ApplicationCompanyOverheadGrouped>> GetCompanyOverheads(Guid applicationID, string languageCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", applicationID);
            parameters.Add("LANGUAGE_CODE", languageCode);
            IEnumerable<ApplicationCompanyOverheadWithName> list = await GetListAsync<ApplicationCompanyOverheadWithName>(parameters, "dbo.sp_GetCompanyOverheads");
            List<ApplicationCompanyOverheadGrouped> result = new List<ApplicationCompanyOverheadGrouped>();
            IEnumerable<string> industries = list.Select(item => item.INDUSTRY_CODE).Distinct();
            foreach (string industry in industries)
            {
                ApplicationCompanyOverheadGrouped overhead = new ApplicationCompanyOverheadGrouped()
                {
                    CODE = industry,
                    PRODUCTS = list.Where(item => item.INDUSTRY_CODE == industry).ToList()
                };
                if (overhead.PRODUCTS.Count > 0)
                    overhead.NAME = overhead.PRODUCTS[0].NAME;
                result.Add(overhead);
            }
            return result;
        }

        /// <summary>
        /// Returns list of company costs
        /// </summary>
        public async Task<IEnumerable<ApplicationCompanyDataWithName>> GetCompanyCosts(Guid applicationID, string languageCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", applicationID);
            parameters.Add("LANGUAGE_CODE",  languageCode);
            return await GetListAsync<ApplicationCompanyDataWithName>(parameters, "dbo.sp_GetCompanyCosts");
        }

        /// <summary>
        /// Returns list of operational expenses of the company
        /// </summary>
        public async Task<IEnumerable<ApplicationCompanyDataWithName>> GetCompanyOperationalExpenses(Guid applicationID, string languageCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", applicationID);
            parameters.Add("LANGUAGE_CODE",  languageCode);
            return await GetListAsync<ApplicationCompanyDataWithName>(parameters, "dbo.sp_GetCompanyOperationalExpenses");
        }

        /// <summary>
        /// Returns list of non-operational expenses of the company
        /// </summary>
        public async Task<IEnumerable<ApplicationCompanyDataWithName>> GetCompanyNonOperationalExpenses(Guid applicationID, string languageCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", applicationID);
            parameters.Add("LANGUAGE_CODE",  languageCode);
            return await GetListAsync<ApplicationCompanyDataWithName>(parameters, "dbo.sp_GetCompanyNonOperationalExpenses");
        }

        /// <summary>
        /// Returns list of balances of the company
        /// </summary>
        public async Task<IEnumerable<ApplicationCompanyDataWithName>> GetCompanyBalances(Guid applicationID, string languageCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", applicationID);
            parameters.Add("LANGUAGE_CODE",  languageCode);
            return await GetListAsync<ApplicationCompanyDataWithName>(parameters, "dbo.sp_GetCompanyBalances");
        }

        /// <summary>
        /// Returns list of other statistics of the company
        /// </summary>
        public async Task<IEnumerable<ApplicationCompanyDataWithName>> GetCompanyOtherStatistics(Guid applicationID, string languageCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", applicationID);
            parameters.Add("LANGUAGE_CODE",  languageCode);
            return await GetListAsync<ApplicationCompanyDataWithName>(parameters, "dbo.sp_GetCompanyOtherStatistics");
        }

        /// <summary>
        /// Returns list of good month earnings of the company
        /// </summary>
        public async Task<IEnumerable<ApplicationCompanyDataWithName>> GetGoodMonthEarnings(Guid applicationID, string languageCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", applicationID);
            parameters.Add("LANGUAGE_CODE", languageCode);
            return await GetListAsync<ApplicationCompanyDataWithName>(parameters, "dbo.sp_GetGoodMonthEarnings");
        }

        /// <summary>
        /// Returns list of bad month earnings of the company
        /// </summary>
        public async Task<IEnumerable<ApplicationCompanyDataWithName>> GetBadMonthEarnings(Guid applicationID, string languageCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", applicationID);
            parameters.Add("LANGUAGE_CODE", languageCode);
            return await GetListAsync<ApplicationCompanyDataWithName>(parameters, "dbo.sp_GetBadMonthEarnings");
        }

        /// <summary>
        /// Returns list of Application Guarantors
        /// </summary>
        public async Task<IEnumerable<ApplicationRelatedPerson>> GetApplicationGuarantors(Guid applicationID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", applicationID);
            return await GetListAsync<ApplicationRelatedPerson>(parameters, "dbo.sp_GetApplicationGuarantors");
        }

        /// <summary>
        /// Returns list of Application Pledgers
        /// </summary>
        public async Task<IEnumerable<ApplicationRelatedPerson>> GetApplicationPledgers(Guid applicationID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", applicationID);
            return await GetListAsync<ApplicationRelatedPerson>(parameters, "dbo.sp_GetApplicationPledgers");
        }

        /// <summary>
        /// Returns list of industry types
        /// </summary>
        public async Task<IEnumerable<DirectoryEntity>> GetIndustryTypes(string languageCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("LANGUAGE_CODE", languageCode);
            return await GetListAsync<DirectoryEntity>(parameters, "dbo.sp_GetIndustryTypes");
        }

        /// <summary>
        /// Returns list of industry products
        /// </summary>
        public async Task<IEnumerable<DirectoryEntity>> GetIndustryProducts(string languageCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("LANGUAGE_CODE", languageCode);
            return await GetListAsync<DirectoryEntity>(parameters, "dbo.sp_GetIndustryProducts");
        }
    }
}
