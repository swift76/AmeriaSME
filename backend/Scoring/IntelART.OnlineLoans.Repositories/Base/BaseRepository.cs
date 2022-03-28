using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using IntelART.OnlineLoans.Entities;
using System.Reflection;

namespace IntelART.OnlineLoans.Repositories
{
    public class BaseRepository
    {
        public string ConnectionString;

        public BaseRepository(string connectionString)
        {
            this.ConnectionString = connectionString;
        }

        public IEnumerable<T> GetList<T>(DynamicParameters parameters, string procedureName, int timeoutInterval = 180, CommandType cmdType = CommandType.StoredProcedure)
        {
            using (IDbConnection connection = new SqlConnection(ConnectionString))
            {
                if (connection.State != ConnectionState.Open)
                    connection.Open();
                return connection.Query<T>(procedureName, parameters, commandType: cmdType, commandTimeout: timeoutInterval);
            }
        }

        public T GetScalarValue<T>(DynamicParameters parameters, string procedureName, int timeoutInterval = 180, CommandType cmdType = CommandType.Text)
        {
            using (IDbConnection connection = new SqlConnection(ConnectionString))
            {
                if (connection.State != ConnectionState.Open)
                    connection.Open();
                return connection.ExecuteScalar<T>(procedureName, parameters, commandType: cmdType, commandTimeout: timeoutInterval);
            }
        }

        public async Task<IEnumerable<T>> GetListAsync<T>(DynamicParameters parameters, string procedureName, int timeoutInterval = 180, CommandType cmdType = CommandType.StoredProcedure)
        {
            using (IDbConnection connection = new SqlConnection(ConnectionString))
            {
                if (connection.State != ConnectionState.Open)
                    connection.Open();
                return await connection.QueryAsync<T>(procedureName, parameters, commandType: cmdType, commandTimeout: timeoutInterval);
            }
        }

        public T GetSingle<T>(DynamicParameters parameters, string procedureName, int timeoutInterval = 180, CommandType cmdType = CommandType.StoredProcedure)
        {
            return GetList<T>(parameters, procedureName, timeoutInterval, cmdType).FirstOrDefault();
        }

        public async Task<T> GetSingleAsync<T>(DynamicParameters parameters, string procedureName, int timeoutInterval = 180, CommandType cmdType = CommandType.StoredProcedure)
        {
            using (IDbConnection connection = new SqlConnection(ConnectionString))
            {
                if (connection.State != ConnectionState.Open)
                    connection.Open();
                return await connection.QueryFirstOrDefaultAsync<T>(procedureName, parameters, commandType: cmdType, commandTimeout: timeoutInterval);
            }
        }

        public void Execute(DynamicParameters parameters, string procedureName, int timeoutInterval = 180, CommandType cmdType = CommandType.StoredProcedure)
        {
            using (IDbConnection connection = new SqlConnection(ConnectionString))
            {
                if (connection.State != ConnectionState.Open)
                    connection.Open();
                connection.Execute(procedureName, parameters, commandType: cmdType, commandTimeout: timeoutInterval);
            }
        }

        public void AddTableValuedParameter<T>(DynamicParameters parameters, string parameterName, IEnumerable<T> rows)
        {
            DataTable dataTable = new DataTable();
            PropertyInfo[] properties = typeof(T).GetProperties();
            for (int i = 0; i < properties.Length; i++)
            {
                dataTable.Columns.Add(new DataColumn(properties[i].Name, properties[i].PropertyType));
            }
            object[] values = new object[properties.Length];
            foreach (T row in rows)
            {
                for (int i = 0; i < properties.Length; i++)
                {
                    values[i] = properties[i].GetValue(row);
                }
                dataTable.Rows.Add(values);
            }

            parameters.Add(parameterName, dataTable, DbType.Object);
        }

        public async Task ExecuteAsync(DynamicParameters parameters, string procedureName, int timeoutInterval = 180, CommandType cmdType = CommandType.StoredProcedure)
        {
            using (IDbConnection connection = new SqlConnection(ConnectionString))
            {
                if (connection.State != ConnectionState.Open)
                    connection.Open();
                await connection.ExecuteAsync(procedureName, parameters, commandType: cmdType, commandTimeout: timeoutInterval);
            }
        }

        public DateTime GetServerDate()
        {
            return GetSingle<DateTime>(new DynamicParameters(), "SELECT GETDATE()", cmdType: CommandType.Text);
        }

        public IEnumerable<Setting> GetSettings()
        {
            return GetList<Setting>(new DynamicParameters(), "dbo.sp_GetSettings");
        }

        public string GetSetting(string code)
        {
            string result = null;
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("CODE", code);
            Setting setting = GetSingle<Setting>(parameters, "dbo.sp_GetSettings");
            if (setting != null)
                result = setting.VALUE;
            return result;
        }
        public static string GenerateOperationDetailsString(Dictionary<string, string> changes)
        {
            StringBuilder builder = new StringBuilder();
            foreach (string key in changes.Keys)
                builder.AppendLine(string.Format("{0}:{1}", key, changes[key]));
            return builder.ToString();
        }

        public DateTime GenerateUserPasswordExpiryDate()
        {
            DateTime current = GetServerDate();
            int expiry_days = int.Parse(GetSetting("USER_PASSWORD_EXPIRY"));
            return current.AddDays(expiry_days);
        }

        public static string FormatDate(DateTime date)
        {
            return date.ToString("dd/MM/yyyy");
        }

        public static bool IsNumericType(Type T)
        {
            switch (T.ToString())
            {
                case "System.Byte":
                case "System.SByte":
                case "System.UInt16":
                case "System.UInt32":
                case "System.UInt64":
                case "System.Int16":
                case "System.Int32":
                case "System.Int64":
                case "System.Decimal":
                case "System.Double":
                case "System.Single":
                    return true;
                default:
                    return false;
            }
        }

        public static void PrepareParameters<T>(Dictionary<string, string> changes,
            DynamicParameters parameters, string entityName, T entityValue, bool check = false)
        {
            string entityValueString = null;
            if (entityValue != null)
            {
                if (typeof(T) == typeof(DateTime)) // special approach for DateTime type
                {
                    DateTime entityValueDate = (DateTime)(object)entityValue;
                    if (entityValueDate != default(DateTime))
                    {
                        entityValueString = FormatDate(entityValueDate);
                    }
                }
                else if (!IsNumericType(typeof(T)) || !entityValue.Equals(Convert.ChangeType(0, typeof(T)))) // to exclude 0 for Numeric types
                {
                    entityValueString = entityValue.ToString().Trim();
                }
            }

            if (!string.IsNullOrEmpty(entityValueString))
            {
                parameters.Add(entityName, entityValue);
                changes.Add(entityName, entityValueString);
            }
            else if (check) // the field is mandatory and cannot be null or empty
            {
                throw new ApplicationException("ERR-0017", string.Format("{0} must have a value", entityName));
            }
        }

        /// <summary>
        /// Maps the values of "APPLICATION_STATUS" table
        /// with the strings of Application state diagram.
        /// </summary>
        protected string MapApplicationStatus(int statusID)
        {
            switch (statusID)
            {
                case 0:
                    return "NEW";
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                    return "PENDING_PRE_APPROVAL";
                case 8:
                case 11:
                    return "PRE_APPROVAL_SUCCESS";
                case 10:
                    return "PRE_APPROVAL_REVIEW_ADDITIONAL_DATA";
                case 13:
                    return "PRE_APPROVAL_REVIEW_CORPORATE";
                case 9:
                case 12:
                case 36:
                    return "PRE_APPROVAL_FAIL";
                case 14:
                    return "PENDING_APPROVAL";
                case 15:
                    return "APPROVAL_REVIEW";
                case 16:
                    return "APPROVAL_SUCCESS";
                case 17:
                    return "APPROVAL_FAIL";
                case 18:
                    return "AGREED";
                case 19:
                case 37:
                    return "CANCELLED";
                case 20:
                    return "PRE_APPROVAL_SUBMITTED";
                case 21:
                    return "ADDITIONAL_ATTACHMENTS_NEEDED";
                case 24:
                    return "COMPLETED";
                case 25:
                    return "PRINT_READY";
                case 30:
                    return "LOAN_SPECIALIST_ELIGIBLE";
                case 31:
                    return "LOAN_SPECIALIST_PENDING_PREAPPROVAL";
                case 32:
                case 42:
                    return "BANK_REVIEW";
                case 35:
                    return "LOAN_SPECIALIST_PREAPPOVED";
                case 45:
                    return "BANK_REVIEW_SUPERVISOR";
                case 55:
                    return "EXPIRED";
                default:
                    if (statusID >= 150 && statusID <= 199)
                        return "PRE_APPROVAL_SUBMITTED";
                    throw new ApplicationException("ERR-0025", "Incorrect application status ID");
            }
        }

        public async void ExecuteAsyncNoWait(DynamicParameters parameters, string procedureName, int timeoutInterval = 180, CommandType cmdType = CommandType.StoredProcedure)
        {
            using (IDbConnection connection = new SqlConnection(ConnectionString))
            {
                if (connection.State != ConnectionState.Open)
                    connection.Open();
                await connection.ExecuteAsync(procedureName, parameters, commandType: cmdType, commandTimeout: timeoutInterval);
            }
        }

        public void LogClientIpAddress(string ipAddress, int userId, string operationType)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("IP_ADDRESS",     ipAddress);
            parameters.Add("USER_ID",        userId);
            parameters.Add("OPERATION_TYPE", operationType);
            Execute(parameters, "dbo.sp_LogClientIpAddress");
        }

        public string GetAuthorizationCode()
        {
            return (Guid.NewGuid()).ToString().Replace("-", string.Empty).ToUpper().Substring(0, 6);
        }
    }
}
