using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using IntelART.OnlineLoans.Entities;

namespace IntelART.OnlineLoans.Repositories
{
    public class UserRepository : BaseRepository
    {
        public UserRepository(string connectionString) : base(connectionString)
        {
        }

        public void StartRegistration(UserRegistration registration)
        {
            this.CheckUserExistence(registration.MOBILE_PHONE, registration.EMAIL, registration.SOCIAL_CARD_NUMBER, registration.TAX_ID_NUMBER);

            Dictionary<string, string> changes = new Dictionary<string, string>();
            DynamicParameters parameters = new DynamicParameters();

            PrepareParameters(changes, parameters, "COMPANY_NAME",      registration.COMPANY_NAME,      true);
            PrepareParameters(changes, parameters, "TAX_ID_NUMBER",     registration.TAX_ID_NUMBER,     true);
            PrepareParameters(changes, parameters, "MOBILE_PHONE",      registration.MOBILE_PHONE,      true);
            PrepareParameters(changes, parameters, "EMAIL",             registration.EMAIL,             true);
            PrepareParameters(changes, parameters, "PROCESS_ID",        registration.PROCESS_ID,        true);
            PrepareParameters(changes, parameters, "VERIFICATION_CODE", registration.VERIFICATION_CODE, true);

            parameters.Add("HASH", registration.HASH);
            Execute(parameters, "dbo.sp_StartUserRegistration");

        }

        public UserRegistration GetRegistration(Guid registrationId)
        {
            Dictionary<string, string> changes = new Dictionary<string, string>();
            DynamicParameters parameters = new DynamicParameters();
            PrepareParameters(changes, parameters, "PROCESS_ID",        registrationId,   true);
            UserRegistration result = GetSingle<UserRegistration>(parameters, "dbo.sp_GetUserRegistration");
            return result;
        }

        public void UpdateRegistration(Guid registrationId, string verificationCode)
        {
            Dictionary<string, string> changes = new Dictionary<string, string>();
            DynamicParameters parameters = new DynamicParameters();
            PrepareParameters(changes, parameters, "PROCESS_ID",        registrationId,   true);
            PrepareParameters(changes, parameters, "VERIFICATION_CODE", verificationCode, true);
            Execute(parameters, "dbo.sp_UpdateUserRegistration");
        }

        /// <summary>
        /// Creates a user during registration
        /// </summary>
        public void CreateUser(User user)
        {
            this.CheckUserExistence(user.MOBILE_PHONE, user.EMAIL, user.SOCIAL_CARD_NUMBER, user.TAX_ID_NUMBER);

            Dictionary<string, string> changes = new Dictionary<string, string>();
            DynamicParameters parameters = new DynamicParameters();

            PrepareParameters(changes, parameters, "COMPANY_NAME",  user.COMPANY_NAME,  true);
            PrepareParameters(changes, parameters, "TAX_ID_NUMBER", user.TAX_ID_NUMBER, true);
            PrepareParameters(changes, parameters, "MOBILE_PHONE",  user.MOBILE_PHONE,  true);
            PrepareParameters(changes, parameters, "EMAIL",         user.EMAIL,         true);
            
            parameters.Add("HASH", user.HASH);
            parameters.Add("OPERATION_DETAILS", GenerateOperationDetailsString(changes));
            parameters.Add("USER_ID", dbType: DbType.Int32, direction: ParameterDirection.Output);
            Execute(parameters, "dbo.sp_CreateUser");
        }

        public bool CheckUserExistenceByParameter(string parameterName, string parameterValue, int? userID = null)
        {
            string procedureName = string.Empty;
            switch (parameterName)
            {
                case "MOBILE_PHONE":
                    procedureName = "sp_CheckUserExistenceByMobilePhone";
                    break;
                case "EMAIL":
                    procedureName = "sp_CheckUserExistenceByEmail";
                    break;
                case "TAX_ID_NUMBER":
                    procedureName = "sp_CheckUserExistenceByTaxID";
                    break;
            }

            DynamicParameters parameters = new DynamicParameters();
            parameters.Add(parameterName, parameterValue);
            List<int?> user = GetList<int?>(parameters, string.Format("dbo.{0}", procedureName)).ToList();
            if (userID.HasValue &&
                (user.Count > 1 || (user.Count == 1 && !user.Contains(userID)))) // modify user
            {
                return true;
            }
            else if (!userID.HasValue && user.Count > 0) // register user
            {
                return true;
            }
            return false;
        }

        private void CheckUserExistence(string mobilePhone, string email, string socialCard, string taxIdNumber, int? userID = null)
        {
            if (this.CheckUserExistenceByParameter("MOBILE_PHONE", mobilePhone, userID))
            {
                throw new ApplicationException("ERR-0040", "Նման բջջային հեռախոսահամարով առկա է օգտատեր։");
            }
            else if (this.CheckUserExistenceByParameter("EMAIL", email, userID))
            {
                throw new ApplicationException("ERR-0041", "Նման էլեկտրոնային հասցեով առկա է օգտատեր։");
            }
            else if (this.CheckUserExistenceByParameter("TAX_ID_NUMBER", taxIdNumber, userID))
            {
                throw new ApplicationException("ERR-0043", "Նման ՀՎՀՀ / հարկ վճարողի հաշվառման համարով առկա է օգտատեր։");
            }
        }

        public User GetUser(int id)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("ID", id);
            User user = GetSingle<User>(parameters, "dbo.sp_GetUserByID");
            return user;
        }

        public User AuthenticateUser(string login, string hash)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("LOGIN", login);
            parameters.Add("HASH", hash);
            User user = GetSingle<User>(parameters, "dbo.sp_AuthenticateApplicationUser");
            return user;
        }

        public void ChangeUserPassword(string login, string hash)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("LOGIN", login);
            parameters.Add("HASH", hash);
            parameters.Add("PASSWORD_EXPIRY_DATE", GenerateUserPasswordExpiryDate());
            Execute(parameters, "dbo.sp_ChangeApplicationUserPassword");
        }

        public void ResetUserPassword(string login, string smsCode, Guid processId, string passwordHash)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("PROCESS_ID", processId);
            parameters.Add("PHONE", login);
            parameters.Add("VERIFICATION_CODE_HASH", smsCode);
            parameters.Add("PASSWORD_HASH", passwordHash);
            Execute(parameters, "dbo.sp_UpdateUserPassword");
        }

        public void StartUserPasswordReset(string phone, Guid processId, string smsCode)
        {
            Dictionary<string, string> changes = new Dictionary<string, string>();
            DynamicParameters parameters = new DynamicParameters();

            PrepareParameters(changes, parameters, "PROCESS_ID", processId, true);
            PrepareParameters(changes, parameters, "PHONE", phone, true);
            PrepareParameters(changes, parameters, "HASH", smsCode, true);

            Execute(parameters, "dbo.sp_StartUserPasswordReset");
        }

        public async Task<BankUser> GetBankUser(int id)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("ID", id);
            BankUser user = await GetSingleAsync<BankUser>(parameters, "sp_GetBankUserByID");
            return user;
        }

        public void SetTryUserRegistration(Guid processId)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("PROCESS_ID", processId);
            Execute(parameters, "sp_SetTryUserRegistration");
        }

        public async Task<IEnumerable<string>> GetRestrictedPasswords()
        {
            return await GetListAsync<string>(new DynamicParameters(), "sp_GetRestrictedPasswords");
        }
    }
}
