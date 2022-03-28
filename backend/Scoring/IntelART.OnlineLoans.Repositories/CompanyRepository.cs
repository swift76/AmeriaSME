using Dapper;
using System;

namespace IntelART.OnlineLoans.Repositories
{
    public class CompanyRepository : BaseRepository
    {
        public CompanyRepository(string connectionString) : base(connectionString)
        {
        }
        
        public bool IsCompanyLLC(Guid applicationId)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", applicationId);
            return GetScalarValue<bool>(parameters,
                "select dbo.f_IsCompanyLLC(@APPLICATION_ID)");
        }

        public bool HasCompanyMultipleOwners(Guid applicationId)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", applicationId);
            return GetScalarValue<bool>(parameters,
                "select dbo.f_HasCompanyMultipleOwners(@APPLICATION_ID)");
        }
    }
}
