using System.Data;
using System.Data.SqlClient;
using IntelART.Utilities;
using IntelART.IdentityManagement;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;

namespace IntelART.OnlineLoans.SqlMembershipProvider
{
    public class SqlMembershipProvider : IMembershipProvider
    {
        private readonly string schemaName;
        private readonly string getUserByUsernameSpName;
        private readonly string getUserByIdSpName;
        private readonly string authenticateApplicationUserSpName;
        private readonly string validateUserExistenceSpName;
        private readonly string changeApplicationUserPasswordSpName;
        private readonly string logClientIpAddressSpName;

        private string connectionString;

        public SqlMembershipProvider(string connectionString)
        {
            this.schemaName = "dbo";
            this.getUserByUsernameSpName = string.Format("{0}.{1}", this.schemaName, "sp_GetApplicationUser");
            this.getUserByIdSpName = string.Format("{0}.{1}", this.schemaName, "sp_GetApplicationUserByID");
            this.authenticateApplicationUserSpName = string.Format("{0}.{1}", this.schemaName, "sp_AuthenticateApplicationUser");
            this.validateUserExistenceSpName = string.Format("{0}.{1}", this.schemaName, "sp_CheckUserExistenceByLogin");
            this.changeApplicationUserPasswordSpName = string.Format("{0}.{1}", this.schemaName, "sp_ChangeApplicationUserPasswordByID");
            this.logClientIpAddressSpName = string.Format("{0}.{1}", this.schemaName, "sp_LogClientIpAddress");
            this.connectionString = connectionString;
        }

        public void LogClientIpAddress(string ipAddress, int userId, string operation)
        {
            using (SqlConnection connection = this.GetConnection())
            {
                using (SqlCommand command = new SqlCommand(this.logClientIpAddressSpName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("IP_ADDRESS", ipAddress.Trim()));
                    command.Parameters.Add(new SqlParameter("USER_ID", userId));
                    command.Parameters.Add(new SqlParameter("OPERATION_TYPE", operation));
                    command.ExecuteNonQuery();
                }
            }
        }

        public UserInfo GetUserByUsername(string username)
        {
            UserInfo userInfo = null;
            using (SqlConnection connection = this.GetConnection())
            {
                using (SqlCommand command = new SqlCommand(this.getUserByUsernameSpName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("LOGIN", username.Trim()));
                    using (SqlDataReader reader = command.ExecuteReader(CommandBehavior.SingleRow))
                    {
                        userInfo = this.ReadSingleUser(reader);
                    }
                }
            }
            return userInfo;
        }

        public bool ValidatePassword(string username, string password, byte? roleId = null)
        {
            bool result = false;

            using (SqlConnection connection = this.GetConnection())
            {
                using (SqlCommand command = new SqlCommand(this.authenticateApplicationUserSpName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("LOGIN", username.Trim()));
                    command.Parameters.Add(new SqlParameter("HASH", Crypto.HashString(password)));
                    command.Parameters.Add(new SqlParameter("USER_ROLE_ID", roleId));
                    using (SqlDataReader reader = command.ExecuteReader(CommandBehavior.SingleRow))
                    {
                        result = reader.Read();
                    }
                }
            }

            return result;
            ////return repository.AuthenticateApplicationUser(username, Crypto.HashString(password));
        }

        public bool ValidateUserExistence(string username)
        {
            bool result = false;

            using (SqlConnection connection = this.GetConnection())
            {
                using (SqlCommand command = new SqlCommand(this.validateUserExistenceSpName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("LOGIN", username.Trim()));
                    using (SqlDataReader reader = command.ExecuteReader(CommandBehavior.SingleRow))
                    {
                        result = reader.Read();
                    }
                }
            }

            return result;
        }

        public async Task ChangeUserPassword(string id, string oldPassword, string newPassword)
        {
            // this is not used at the moment
            using (SqlConnection connection = this.GetConnection())
            {
                using (SqlCommand command = new SqlCommand(this.changeApplicationUserPasswordSpName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("ID", id));
                    command.Parameters.Add(new SqlParameter("HASH", Crypto.HashString(newPassword)));
                    command.Parameters.Add(new SqlParameter("PASSWORD_EXPIRY_DATE", DateTime.Now.Date.AddDays(90)));
                    await command.ExecuteNonQueryAsync();
                }
            }
        }

        public UserInfo GetUserById(string userId)
        {
            UserInfo userInfo = null;

            int id;
            if (int.TryParse(userId, out id))
            {
                using (SqlConnection connection = this.GetConnection())
                {
                    using (SqlCommand command = new SqlCommand(this.getUserByIdSpName, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add(new SqlParameter("ID", id));
                        using (SqlDataReader reader = command.ExecuteReader(CommandBehavior.SingleRow))
                        {
                            userInfo = this.ReadSingleUser(reader);
                        }
                    }
                }
            }
            return userInfo;
        }

        private UserInfo ReadSingleUser(SqlDataReader reader)
        {
            UserInfo result = null;
            if (reader.Read())
            {
                result = this.ReadUser(reader);
            }
            return result;
        }

        private UserInfo ReadUser(SqlDataReader reader)
        {
            UserInfo result = null;
            result = new UserInfo();
            result.Id = reader.GetInt32(reader.GetOrdinal("ID"));
            result.Username = reader.GetString(reader.GetOrdinal("LOGIN"));
            //result.Email = reader.GetString(reader.GetOrdinal("EMAIL"));
            //result.FullName = reader.GetString(reader.GetOrdinal("COMPANY_NAME"));
            // TODO: correct
            // result.FullName = reader.GetString(reader.GetOrdinal("FIRST_NAME")) + reader.GetString(reader.GetOrdinal("LAST_NAME"));
            return result;
        }

        private SqlConnection GetConnection()
        {
            SqlConnection connection = new SqlConnection(this.connectionString);
            if (connection.State != ConnectionState.Open)
            {
                connection.Open();
            }

            return connection;
        }

        private async Task<SqlConnection> GetConnectionAsync()
        {
            SqlConnection connection = new SqlConnection(this.connectionString);
            if (connection.State != ConnectionState.Open)
            {
                await connection.OpenAsync();
            }

            return connection;
        }

        public async Task<IEnumerable<string>> GetUserRolesById(string userId)
        {
            List<string> roles = new List<string>();
            int id;
            if (int.TryParse(userId, out id))
            {
                using (SqlConnection connection = await this.GetConnectionAsync())
                {
                    using (SqlCommand command = new SqlCommand("select dbo.f_GetApplicationUserRoleName(@id)", connection))
                    {
                        command.CommandType = CommandType.Text;
                        command.Parameters.Add(new SqlParameter("@id", id));
                        using (SqlDataReader reader = await command.ExecuteReaderAsync(CommandBehavior.SingleRow))
                        {
                            if (reader.Read())
                            {
                                string roleName = reader.GetString(0);
                                if (roleName != null)
                                {
                                    roles.Add(roleName);
                                }
                            }
                        }
                    }
                }
            }
            return roles;
        }
    }
}
