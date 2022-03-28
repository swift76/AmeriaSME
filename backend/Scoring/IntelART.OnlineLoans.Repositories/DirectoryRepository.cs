using System;
using Dapper;
using System.Collections.Generic;
using IntelART.OnlineLoans.Entities;
using System.Threading.Tasks;

namespace IntelART.OnlineLoans.Repositories
{
    public class DirectoryRepository : BaseRepository
    {
        public DirectoryRepository(string connectionString) : base(connectionString)
        {
        }

        /// <summary>
        /// Returns list of countries
        /// </summary>
        public async Task<IEnumerable<DirectoryEntity>> GetCountries(string languageCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("LANGUAGE_CODE", languageCode);
            return await GetListAsync<DirectoryEntity>(parameters, "dbo.sp_GetCountries");
        }

        /// <summary>
        /// Returns list of loan terms
        /// </summary>
        public IEnumerable<DirectoryEntity> GetLoanTerms(string language, bool isOverdraft, int termFrom, int termTo)
        {
            List<DirectoryEntity> loanTerms = new List<DirectoryEntity>();
            int termInterval = 6;
            for (int i = termFrom; i <= termTo; i += termInterval)
            {
                loanTerms.Add(new DirectoryEntity { CODE = i.ToString(), NAME = string.Format("{0} ամիս", i.ToString()) });
            }

            return loanTerms;
        }

        /// <summary>
        /// Returns list of states
        /// </summary>
        public async Task<IEnumerable<DirectoryEntity>> GetStates(string languageCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("LANGUAGE_CODE", languageCode);
            return await GetListAsync<DirectoryEntity>(parameters, "dbo.sp_GetStates");
        }

        /// <summary>
        /// Returns list of states
        /// </summary>
        public async Task<IEnumerable<DirectoryEntity>> GetCities(string languageCode, string stateCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("LANGUAGE_CODE", languageCode);
            parameters.Add("STATE_CODE", stateCode);
            return await GetListAsync<DirectoryEntity>(parameters, "dbo.sp_GetCities");
        }

        /// <summary>
        /// Returns list of loan types /non loan specialist/
        /// </summary>
        public async Task<IEnumerable<LoanType>> GetLoanTypes(string languageCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("LANGUAGE_CODE", languageCode);
            IEnumerable<LoanType> loanTypes = await GetListAsync<LoanType>(parameters, "dbo.sp_GetLoanTypes");
            return loanTypes;
        }

        /// <summary>
        /// Returns list of loan types /to be created by loan specialists only/
        /// </summary>
        public async Task<IEnumerable<LoanType>> GetLSLoanTypes(string languageCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("LANGUAGE_CODE", languageCode);
            IEnumerable<LoanType> loanTypes = await GetListAsync<LoanType>(parameters, "dbo.sp_GetLSLoanTypes");
            return loanTypes;
        }

        /// <summary>
        /// Returns list of loan currencies
        /// </summary>
        public async Task<IEnumerable<DirectoryEntity>> GetLoanCurrencies(string loanType, string languageCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("LOAN_TYPE_CODE", loanType);
            parameters.Add("LANGUAGE_CODE", languageCode);
            return await GetListAsync<DirectoryEntity>(parameters, "dbo.sp_GetLoanCurrencies");
        }

        /// <summary>
        /// Returns list of branches of the bank
        /// </summary>
        public async Task<IEnumerable<DirectoryEntity>> GetBankBranches(string languageCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("LANGUAGE_CODE", languageCode);
            return await GetListAsync<DirectoryEntity>(parameters, "dbo.sp_GetBankBranches");
        }

        /// <summary>
        /// Returns list of countries
        /// </summary>
        public async Task<IEnumerable<DirectoryEntity>> GetAddressCountries(string languageCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("LANGUAGE_CODE", languageCode);
            return await GetListAsync<DirectoryEntity>(parameters, "dbo.sp_GetAddressCountries");
        }

        /// <summary>
        /// Returns list of credit card types
        /// </summary>
        public async Task<IEnumerable<DirectoryEntity>> GetCreditCardTypes(string languageCode, string loanType, string currency)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("LANGUAGE_CODE", languageCode);
            parameters.Add("CURRENCY_CODE", currency);
            return await GetListAsync<DirectoryEntity>(parameters, "dbo.sp_GetCreditCardTypes");
        }

        /// <summary>
        /// Returns list of appraisal companies
        /// </summary>
        public async Task<IEnumerable<DirectoryEntity>> GetAppraisalCompanies(string languageCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("LANGUAGE_CODE", languageCode);
            return await GetListAsync<DirectoryEntity>(parameters, "dbo.sp_GetAppraisalCompanies");
        }

        /// <summary>
        /// Returns list of purposes of loan
        /// </summary>
        public async Task<IEnumerable<DirectoryEntity>> GetLoanPurposes(string languageCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("LANGUAGE_CODE", languageCode);
            return await GetListAsync<DirectoryEntity>(parameters, "dbo.sp_GetLoanPurposes");
        }

        /// <summary>
        /// Returns list of loan repayment forms
        /// </summary>
        public async Task<IEnumerable<DirectoryEntity>> GetLoanRepaymentForms(string languageCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("LANGUAGE_CODE", languageCode);
            return await GetListAsync<DirectoryEntity>(parameters, "dbo.sp_GetLoanRepaymentForms");
        }

        /// <summary>
        /// Returns list of pledge types
        /// </summary>
        public async Task<IEnumerable<DirectoryEntity>> GetPledgeTypes(string languageCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("LANGUAGE_CODE", languageCode);
            return await GetListAsync<DirectoryEntity>(parameters, "dbo.sp_GetPledgeTypes");
        }

        /// <summary>
        /// Returns list of activities
        /// </summary>
        public async Task<IEnumerable<DirectoryEntity>> GetActivities(string languageCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("LANGUAGE_CODE", languageCode);
            return await GetListAsync<DirectoryEntity>(parameters, "dbo.sp_GetActivities");
        }

        /// <summary>
        /// Returns list of factual industries
        /// </summary>
        public async Task<IEnumerable<DirectoryEntity>> GetFactualIndustries(string languageCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("LANGUAGE_CODE", languageCode);
            return await GetListAsync<DirectoryEntity>(parameters, "dbo.sp_GetFactualIndustries");
        }

        /// <summary>
        /// Returns list of reasons for cancellation
        /// </summary>
        public async Task<IEnumerable<DirectoryEntity>> GetCancellationReasons(string languageCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("LANGUAGE_CODE", languageCode);
            return await GetListAsync<DirectoryEntity>(parameters, "dbo.sp_GetCancellationReasons");
        }

        #region Loan Specialist directories

        /// <summary>
        /// Returns list of business states
        /// </summary>
        public async Task<IEnumerable<DirectoryEntity>> GetBusinessStateTypes(string languageCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("LANGUAGE_CODE", languageCode);
            return await GetListAsync<DirectoryEntity>(parameters, "dbo.sp_GetBusinessStateTypes");
        }

        /// <summary>
        /// Returns list of insurance companies
        /// </summary>
        public async Task<IEnumerable<DirectoryEntity>> GetInsuranceCompanies(string languageCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("LANGUAGE_CODE", languageCode);
            return await GetListAsync<DirectoryEntity>(parameters, "dbo.sp_GetInsuranceCompanies");
        }

        #endregion
    }
}
