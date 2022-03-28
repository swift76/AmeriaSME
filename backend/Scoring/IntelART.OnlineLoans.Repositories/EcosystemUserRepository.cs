using System;
using System.Collections.Generic;
using System.Data;
using Dapper;
using IntelART.Utilities;
using IntelART.OnlineLoans.Entities.Ecosystem;

namespace IntelART.OnlineLoans.Repositories
{
    public class EcosystemUserRepository : BaseRepository
    {
        public EcosystemUserRepository(string connectionString)
            : base(connectionString)
        { }

        public Guid RegisterEcosystemUser(EcosystemUserRegistration user)
        {
            Dictionary<string, string> changes = new Dictionary<string, string>();
            DynamicParameters parameters = new DynamicParameters();
            
            PrepareParameters(changes, parameters, "email", user.Email, true);
            PrepareParameters(changes, parameters, "hash", Crypto.HashString(user.Password), true);
            PrepareParameters(changes, parameters, "firstNameEng", user.FirstName, true);
            PrepareParameters(changes, parameters, "lastNameEng", user.LastName, true);
            parameters.Add("emailConfirmationToken", dbType: DbType.Guid, direction: ParameterDirection.Output);
            Execute(parameters, "dbo.sp_CreateEcosystemUser");

            Guid result = parameters.Get<Guid>("emailConfirmationToken");

            return result;
        }

        public void ConfirmEcosystemUser(Guid token)
        {
            Dictionary<string, string> changes = new Dictionary<string, string>();
            DynamicParameters parameters = new DynamicParameters();

            PrepareParameters(changes, parameters, "emailConfirmationToken", token, true);
            Execute(parameters, "dbo.sp_EcosystemUserConfirmation");
        }

        public EcosystemUser GetEcosystemUser(int applicationUserId)
        {
            EcosystemUser result = null;

            Dictionary<string, string> changes = new Dictionary<string, string>();
            DynamicParameters parameters = new DynamicParameters();

            PrepareParameters(changes, parameters, "applicationUserId", applicationUserId, true);

            result = GetSingle<EcosystemUser>(parameters, "dbo.sp_GetEcosystemUser");

            return result;
        }
    }
}