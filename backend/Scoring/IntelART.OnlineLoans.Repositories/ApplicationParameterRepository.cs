using System.Threading.Tasks;
using Dapper;
using IntelART.OnlineLoans.Entities;
using System.Collections.Generic;

namespace IntelART.OnlineLoans.Repositories
{
    public class ApplicationParameterRepository : BaseRepository
    {
        public ApplicationParameterRepository(string connectionString) : base(connectionString)
        {
        }

        public async Task<LoanLimits> GetLoanLimits(string loanTypeCode, string currency)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("LOAN_TYPE_CODE", loanTypeCode);
            parameters.Add("CURRENCY", currency);
            return await GetSingleAsync<LoanLimits>(parameters, "dbo.sp_GetLoanLimits");
        }

        public async Task<LoanParameters> GetLoanParameters(string loanTypeCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("LOAN_TYPE_CODE", loanTypeCode);
            return await GetSingleAsync<LoanParameters>(parameters, "dbo.sp_GetLoanParameters");
        }

        public async Task<IEnumerable<ApplicationUnsecuredLimit>> GetApplicationUnsecuredLimits()
        {
            return await GetListAsync<ApplicationUnsecuredLimit>(new DynamicParameters(), "dbo.sp_GetApplicationUnsecuredLimits");
        }

        public int GetFileMaxSize()
        {
            int fileMaxSize = int.Parse(GetSetting("FILE_MAX_SIZE"));
            return fileMaxSize;
        }

        public IEnumerable<Setting> GetScanMaxCount()
        {
            return GetList<Setting>(new DynamicParameters(), "dbo.sp_GetScanMaxCount");
        }

        public async Task<LoanSettings> GetLoanSettings()
        {
            return await GetSingleAsync<LoanSettings>(new DynamicParameters(), "dbo.sp_GetLoanSettings");
        }

        public async Task<IEnumerable<string>> GetLoanSpecialistLoanTerms()
        {
            return await GetListAsync<string>(new DynamicParameters(), "dbo.sp_GetLoanSpecialistLoanTerms");
        }
    }
}
