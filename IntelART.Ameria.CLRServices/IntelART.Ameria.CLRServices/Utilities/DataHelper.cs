using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace IntelART.Ameria.CLRServices
{
    public class DataHelper : IDisposable
    {
        public ServiceConfig GetServiceConfig(string serviceCode)
        {
            ServiceConfig result = new ServiceConfig();
            using (SqlCommand cmd = new SqlCommand(string.Format("sp_Get{0}ConfigData", serviceCode), ActiveConnection))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = CommandTimeoutInterval;
                using (SqlDataReader rdr = cmd.ExecuteReader())
                {
                    if (rdr.Read())
                    {
                        result.URL = rdr.GetString(0);
                        result.UserName = rdr.GetString(1);
                        result.UserPassword = rdr.GetString(2);
                    }
                }
            }
            return result;
        }

        public int GetServiceTimeout(byte id)
        {
            int result = 0;
            using (SqlCommand cmd = new SqlCommand("sp_GetServiceTimeout", ActiveConnection))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = CommandTimeoutInterval;
                cmd.Parameters.Add(new SqlParameter("@ID", SqlDbType.TinyInt)).Value = id;
                using (SqlDataReader rdr = cmd.ExecuteReader())
                {
                    if (rdr.Read())
                    {
                        result = rdr.GetInt32(0);
                    }
                }
            }
            return result;
        }

        public DateTime GetServerDate()
        {
            DateTime result = DateTime.Now;
            using (SqlCommand cmd = new SqlCommand("select convert(date,getdate())", ActiveConnection))
            {
                cmd.CommandType = CommandType.Text;
                cmd.CommandTimeout = CommandTimeoutInterval;
                using (SqlDataReader rdr = cmd.ExecuteReader())
                {
                    if (rdr.Read())
                        result = rdr.GetDateTime(0);
                }
            }
            return result;
        }

        public void AutomaticallyRefuseApplication(Guid id, string reason)
        {
            using (SqlCommand cmd = new SqlCommand("sp_AutomaticallyRefuseApplication", ActiveConnection))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = CommandTimeoutInterval;
                cmd.Parameters.Add(new SqlParameter("@ID", SqlDbType.UniqueIdentifier)).Value = id;
                cmd.Parameters.Add(new SqlParameter("@REFUSAL_REASON", SqlDbType.NVarChar, 100)).Value = reason;
                cmd.ExecuteScalar();
            }
        }

        public void LogError(string operation, string errorMessage, Guid? id = null)
        {
            using (SqlCommand cmd = new SqlCommand("sp_LogScoringError", ActiveConnection))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = CommandTimeoutInterval;
                if (id.HasValue)
                    cmd.Parameters.Add(new SqlParameter("@APPLICATION_ID", SqlDbType.UniqueIdentifier)).Value = id.Value;
                cmd.Parameters.Add(new SqlParameter("@OPERATION", SqlDbType.VarChar, 200)).Value = operation;
                cmd.Parameters.Add(new SqlParameter("@ERROR_MESSAGE", SqlDbType.NVarChar, -1)).Value = errorMessage;
                cmd.ExecuteScalar();
            }
        }

        public void SaveNORQQueryResult(Guid id, string firstName, string lastName, string middleName, DateTime birthDate, bool gender,
            string district, string community, string street, string building, string apartment, string address,
            string passportNumber, DateTime passportDate, DateTime passportExpiryDate, string passportBy,
            string biometricPassportNumber, DateTime biometricPassportIssueDate, DateTime biometricPassportExpiryDate, string biometricPassportIssuedBy,
            string idCardNumber, DateTime idCardIssueDate, DateTime idCardExpiryDate, string idCardIssuedBy,
            string socialCardNumber, decimal fee, string responseText, List<WorkData> Employment)
        {
            using (SqlCommand cmd = new SqlCommand("sp_SaveNORQQueryResult", ActiveConnection))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = CommandTimeoutInterval;
                cmd.Parameters.Add(new SqlParameter("@APPLICATION_ID", SqlDbType.UniqueIdentifier)).Value = id;
                cmd.Parameters.Add(new SqlParameter("@FIRST_NAME", SqlDbType.NVarChar, 20)).Value = firstName;
                cmd.Parameters.Add(new SqlParameter("@LAST_NAME", SqlDbType.NVarChar, 20)).Value = lastName;
                cmd.Parameters.Add(new SqlParameter("@PATRONYMIC_NAME", SqlDbType.NVarChar, 20)).Value = middleName;
                cmd.Parameters.Add(new SqlParameter("@BIRTH_DATE", SqlDbType.Date)).Value = birthDate;
                cmd.Parameters.Add(new SqlParameter("@GENDER", SqlDbType.Bit)).Value = gender;
                cmd.Parameters.Add(new SqlParameter("@DISTRICT", SqlDbType.NVarChar, 20)).Value = district;
                cmd.Parameters.Add(new SqlParameter("@COMMUNITY", SqlDbType.NVarChar, 40)).Value = community;
                cmd.Parameters.Add(new SqlParameter("@STREET", SqlDbType.NVarChar, 100)).Value = street;
                cmd.Parameters.Add(new SqlParameter("@BUILDING", SqlDbType.NVarChar, 40)).Value = building;
                cmd.Parameters.Add(new SqlParameter("@APARTMENT", SqlDbType.NVarChar, 40)).Value = apartment;
                cmd.Parameters.Add(new SqlParameter("@ADDRESS", SqlDbType.NVarChar, 100)).Value = address;
                cmd.Parameters.Add(new SqlParameter("@PASSPORT_NUMBER", SqlDbType.Char, 9)).Value = passportNumber;
                cmd.Parameters.Add(new SqlParameter("@PASSPORT_DATE", SqlDbType.Date)).Value = passportDate;
                cmd.Parameters.Add(new SqlParameter("@PASSPORT_EXPIRY_DATE", SqlDbType.Date)).Value = passportExpiryDate;
                cmd.Parameters.Add(new SqlParameter("@PASSPORT_BY", SqlDbType.Char, 3)).Value = passportBy;
                cmd.Parameters.Add(new SqlParameter("@BIOMETRIC_PASSPORT_NUMBER", SqlDbType.Char, 9)).Value = biometricPassportNumber;
                cmd.Parameters.Add(new SqlParameter("@BIOMETRIC_PASSPORT_ISSUE_DATE", SqlDbType.Date)).Value = biometricPassportIssueDate;
                cmd.Parameters.Add(new SqlParameter("@BIOMETRIC_PASSPORT_EXPIRY_DATE", SqlDbType.Date)).Value = biometricPassportExpiryDate;
                cmd.Parameters.Add(new SqlParameter("@BIOMETRIC_PASSPORT_ISSUED_BY", SqlDbType.Char, 3)).Value = biometricPassportIssuedBy;
                cmd.Parameters.Add(new SqlParameter("@ID_CARD_NUMBER", SqlDbType.Char, 9)).Value = idCardNumber;
                cmd.Parameters.Add(new SqlParameter("@ID_CARD_ISSUE_DATE", SqlDbType.Date)).Value = idCardIssueDate;
                cmd.Parameters.Add(new SqlParameter("@ID_CARD_EXPIRY_DATE", SqlDbType.Date)).Value = idCardExpiryDate;
                cmd.Parameters.Add(new SqlParameter("@ID_CARD_ISSUED_BY", SqlDbType.Char, 3)).Value = idCardIssuedBy;
                cmd.Parameters.Add(new SqlParameter("@SOCIAL_CARD_NUMBER", SqlDbType.Char, 10)).Value = socialCardNumber;
                cmd.Parameters.Add(new SqlParameter("@FEE", SqlDbType.Money)).Value = fee;
                cmd.Parameters.Add(new SqlParameter("@RESPONSE_XML", SqlDbType.NVarChar, -1)).Value = ServiceHelper.GetFormattedXML(responseText);

                DataTable tableWork = new DataTable("Common.NORQQueryResultWork");
                tableWork.Columns.Add("ORGANIZATION_NAME", typeof(string));
                tableWork.Columns.Add("TAX_ID_NUMBER", typeof(string));
                tableWork.Columns.Add("ADDRESS", typeof(string));
                tableWork.Columns.Add("FROM_DATE", typeof(DateTime));
                tableWork.Columns.Add("TO_DATE", typeof(DateTime));
                tableWork.Columns.Add("SALARY", typeof(decimal));
                tableWork.Columns.Add("SOCIAL_PAYMENT", typeof(decimal));
                tableWork.Columns.Add("POSITION", typeof(string));
                for (int i = 0; i < Employment.Count; i++)
                    tableWork.Rows.Add(Employment[i].OrganizationName
                        , Employment[i].TaxCode
                        , Employment[i].OrganizationAddress
                        , Employment[i].AgreementStartDate
                        , Employment[i].AgreementEndDate
                        , Employment[i].Salary
                        , Employment[i].SocialPayment
                        , Employment[i].Position);
                cmd.Parameters.AddWithValue("@WORK_DATA", tableWork).SqlDbType = SqlDbType.Structured;

                cmd.ExecuteScalar();
            }
        }

        public void SaveACRAQueryResult(Guid id
            , ACRALegalQueryResult result
            , ACRALegalQueryResult resultLegal)
        {
            using (SqlCommand cmd = InitializeACRACommand(id, result, "sp_SaveACRAQueryResult"))
            {
                cmd.Parameters.Add(new SqlParameter("@FICO_SCORE", SqlDbType.Char, 3)).Value = result.FicoScore;
                if (resultLegal.ResponseXml != null)
                {
                    cmd.Parameters.Add(new SqlParameter("@LEGAL_RESPONSE_XML", SqlDbType.NVarChar, -1)).Value = ServiceHelper.GetFormattedXML(resultLegal.ResponseXml);
                }
                InitializeTaxParameters(resultLegal.TaxData, cmd);
                cmd.ExecuteScalar();
            }
        }

        public List<NORQEntity> GetApplicationsForNORQRequest()
        {
            using (SqlCommand cmd = new SqlCommand("sp_GetApplicationsForNORQRequest", ActiveConnection))
                return GetNORQEntities(cmd);
        }

        public List<ACRAEntity> GetApplicationsForACRARequest()
        {
            using (SqlCommand cmd = new SqlCommand("sp_GetApplicationsForACRARequest", ActiveConnection))
                return GetACRAEntities(cmd);
        }

        public List<NORQEntity> GetApplicationForNORQRequestByID(Guid id)
        {
            using (SqlCommand cmd = new SqlCommand("sp_GetApplicationForNORQRequestByID", ActiveConnection))
            {
                cmd.Parameters.Add(new SqlParameter("@ID", SqlDbType.UniqueIdentifier)).Value = id;
                return GetNORQEntities(cmd);
            }
        }

        public List<ACRAEntity> GetApplicationForACRARequestByID(Guid id)
        {
            using (SqlCommand cmd = new SqlCommand("sp_GetApplicationForACRARequestByID", ActiveConnection))
            {
                cmd.Parameters.Add(new SqlParameter("@ID", SqlDbType.UniqueIdentifier)).Value = id;
                return GetACRAEntities(cmd);
            }
        }

        public List<NORQEntity> GetApplicationForNORQRequestByISN(int isn)
        {
            using (SqlCommand cmd = new SqlCommand("sp_GetApplicationForNORQRequestByISN", ActiveConnection))
            {
                cmd.Parameters.Add(new SqlParameter("@ISN", SqlDbType.Int)).Value = isn;
                return GetNORQEntities(cmd);
            }
        }

        public List<ACRAEntity> GetApplicationForACRARequestByISN(int isn)
        {
            using (SqlCommand cmd = new SqlCommand("sp_GetApplicationForACRARequestByISN", ActiveConnection))
            {
                cmd.Parameters.Add(new SqlParameter("@ISN", SqlDbType.Int)).Value = isn;
                return GetACRAEntities(cmd);
            }
        }

        private List<NORQEntity> GetNORQEntities(SqlCommand cmd)
        {
            List<NORQEntity> result = new List<NORQEntity>();
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = CommandTimeoutInterval;
            using (SqlDataReader reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                    result.Add(new NORQEntity()
                    {
                        ID = reader.GetGuid(0),
                        SocialCardNumber = reader.GetString(1)
                    });
            }
            return result;
        }

        private List<ACRAEntity> GetACRAEntities(SqlCommand cmd)
        {
            List<ACRAEntity> result = new List<ACRAEntity>();
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = CommandTimeoutInterval;
            using (SqlDataReader reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                    result.Add(new ACRAEntity()
                    {
                        ID = reader.GetGuid(0),
                        FirstName = reader.GetString(1),
                        LastName = reader.GetString(2),
                        BirthDate = reader.GetDateTime(3),
                        PassportNumber = reader.GetString(4),
                        SocialCardNumber = reader.GetString(5),
                        IDCardNumber = reader.GetString(6),
                        ImportID = reader.GetInt32(7),
                        IsIE = reader.GetBoolean(8)
                    });
            }
            return result;
        }

        public void SaveNORQTryCount(Guid id)
        {
            using (SqlCommand cmd = new SqlCommand("sp_SaveNORQTryCount", ActiveConnection))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = CommandTimeoutInterval;
                cmd.Parameters.Add(new SqlParameter("@APPLICATION_ID", SqlDbType.UniqueIdentifier)).Value = id;
                cmd.ExecuteScalar();
            }
        }

        public void SaveACRATryCount(Guid id)
        {
            using (SqlCommand cmd = new SqlCommand("sp_SaveACRATryCount", ActiveConnection))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = CommandTimeoutInterval;
                cmd.Parameters.Add(new SqlParameter("@APPLICATION_ID", SqlDbType.UniqueIdentifier)).Value = id;
                cmd.ExecuteScalar();
            }
        }

        public string GetSettingValue(string settingCode)
        {
            string result = string.Empty;
            using (SqlCommand cmd = new SqlCommand("sp_GetSettings", ActiveConnection))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = CommandTimeoutInterval;
                cmd.Parameters.Add(new SqlParameter("@CODE", SqlDbType.VarChar, 30)).Value = settingCode;
                using (SqlDataReader rdr = cmd.ExecuteReader())
                {
                    if (rdr.Read())
                    {
                        result = rdr.GetString(1);
                    }
                }
            }
            return result;
        }

        public string GetCachedNORQResponse(string socialCard)
        {
            string result = string.Empty;
            using (SqlCommand cmd = new SqlCommand("sp_GetCachedNORQResponse", ActiveConnection))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = CommandTimeoutInterval;
                cmd.Parameters.Add(new SqlParameter("@SOCIAL_CARD_NUMBER", SqlDbType.VarChar, 10)).Value = socialCard;
                using (SqlDataReader rdr = cmd.ExecuteReader())
                {
                    if (rdr.Read())
                    {
                        result = rdr.GetString(0);
                    }
                }
            }
            return result;
        }

        public string GetCachedACRAResponse(string socialCard)
        {
            string result = string.Empty;
            using (SqlCommand cmd = new SqlCommand("sp_GetCachedACRAResponse", ActiveConnection))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = CommandTimeoutInterval;
                cmd.Parameters.Add(new SqlParameter("@SOCIAL_CARD_NUMBER", SqlDbType.VarChar, 10)).Value = socialCard;
                using (SqlDataReader rdr = cmd.ExecuteReader())
                {
                    if (rdr.Read())
                    {
                        result = rdr.GetString(0);
                    }
                }
            }
            return result;
        }

        private List<NORQLegalEntity> GetNORQLegalEntities(SqlCommand cmd)
        {
            List<NORQLegalEntity> result = new List<NORQLegalEntity>();
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = CommandTimeoutInterval;
            using (SqlDataReader reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                    result.Add(new NORQLegalEntity()
                    {
                        ID = reader.GetGuid(0),
                        TaxCode = reader.GetString(1)
                    });
            }
            return result;
        }

        private List<ACRALegalEntity> GetACRALegalEntities(SqlCommand cmd)
        {
            List<ACRALegalEntity> result = new List<ACRALegalEntity>();
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = CommandTimeoutInterval;
            using (SqlDataReader reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                    result.Add(new ACRALegalEntity()
                    {
                        ID = reader.GetGuid(0),
                        TaxCode = reader.GetString(1),
                        Name = reader.GetString(2),
                        ImportID = reader.GetInt32(3)
                    });
            }
            return result;
        }

        public List<NORQLegalEntity> GetApplicationsForNORQLegalRequest()
        {
            using (SqlCommand cmd = new SqlCommand("sp_GetApplicationsForNORQLegalRequest", ActiveConnection))
                return GetNORQLegalEntities(cmd);
        }

        public List<ACRALegalEntity> GetApplicationsForACRALegalRequest()
        {
            using (SqlCommand cmd = new SqlCommand("sp_GetApplicationsForACRALegalRequest", ActiveConnection))
                return GetACRALegalEntities(cmd);
        }

        public void SaveNORQLegalTryCount(Guid id)
        {
            using (SqlCommand cmd = new SqlCommand("sp_SaveNORQLegalTryCount", ActiveConnection))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = CommandTimeoutInterval;
                cmd.Parameters.Add(new SqlParameter("@APPLICATION_ID", SqlDbType.UniqueIdentifier)).Value = id;
                cmd.ExecuteScalar();
            }
        }

        public void SaveACRALegalTryCount(Guid id)
        {
            using (SqlCommand cmd = new SqlCommand("sp_SaveACRALegalTryCount", ActiveConnection))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = CommandTimeoutInterval;
                cmd.Parameters.Add(new SqlParameter("@APPLICATION_ID", SqlDbType.UniqueIdentifier)).Value = id;
                cmd.ExecuteScalar();
            }
        }

        public bool LockApplicationByID(Guid id, short status)
        {
            bool result;
            using (SqlCommand cmd = new SqlCommand("sp_LockApplicationByID", ActiveConnection))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = CommandTimeoutInterval;
                cmd.Parameters.Add(new SqlParameter("@ID", SqlDbType.UniqueIdentifier)).Value = id;
                cmd.Parameters.Add(new SqlParameter("@APPLICATION_STATUS_ID", SqlDbType.SmallInt)).Value = status;
                using (SqlDataReader reader = cmd.ExecuteReader())
                    result = reader.Read();
            }
            return result;
        }

        public void SaveNORQLegalQueryResult(Guid id, NORQLegalQueryResult result)
        {
            using (SqlCommand cmd = new SqlCommand("sp_SaveNORQLegalQueryResult", ActiveConnection))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = CommandTimeoutInterval;
                cmd.Parameters.Add(new SqlParameter("@APPLICATION_ID", SqlDbType.UniqueIdentifier)).Value = id;
                cmd.Parameters.Add(new SqlParameter("@NAME", SqlDbType.NVarChar, 100)).Value = result.Name;
                cmd.Parameters.Add(new SqlParameter("@TYPE", SqlDbType.NVarChar, 40)).Value = result.Type;
                cmd.Parameters.Add(new SqlParameter("@ADDRESS", SqlDbType.NVarChar, 100)).Value = result.Address;
                cmd.Parameters.Add(new SqlParameter("@LEGAL_ADDRESS", SqlDbType.NVarChar, 100)).Value = result.LegalAddress;
                cmd.Parameters.Add(new SqlParameter("@TAX_CODE", SqlDbType.VarChar, 20)).Value = result.TaxCode;
                cmd.Parameters.Add(new SqlParameter("@EMPLOYEE_COUNT", SqlDbType.Int)).Value = result.EmployeeCount;
                cmd.Parameters.Add(new SqlParameter("@REGISTRATION_DATE", SqlDbType.Date)).Value = result.RegistrationDate;
                cmd.Parameters.Add(new SqlParameter("@REGISTRATION_CODE", SqlDbType.NVarChar, 20)).Value = result.RegistrationCode;

                DataTable tableFounders = new DataTable("NORQLegalQueryResultFounder");
                tableFounders.Columns.Add("NAME", typeof(string));
                tableFounders.Columns.Add("DOCUMENT_NUMBER", typeof(string));
                for (int i = 0; i < result.Founders.Count; i++)
                    tableFounders.Rows.Add(result.Founders[i].Name, result.Founders[i].DocumentNumber);
                cmd.Parameters.AddWithValue("@FOUNDERS", tableFounders).SqlDbType = SqlDbType.Structured;

                cmd.ExecuteScalar();
            }
        }

        public void SaveACRALegalQueryResult(Guid id
            , ACRALegalQueryResult result)
        {
            using (SqlCommand cmd = InitializeACRACommand(id, result, "sp_SaveACRALegalQueryResult"))
            {
                InitializeTaxParameters(result.TaxData, cmd);
                cmd.ExecuteScalar();
            }
        }

        public List<NORQLegalEntity> GetApplicationForNORQLegalRequestByID(Guid id)
        {
            using (SqlCommand cmd = new SqlCommand("sp_GetApplicationForNORQLegalRequestByID", ActiveConnection))
            {
                cmd.Parameters.Add(new SqlParameter("@ID", SqlDbType.UniqueIdentifier)).Value = id;
                return GetNORQLegalEntities(cmd);
            }
        }

        public List<ACRALegalEntity> GetApplicationForACRALegalRequestByID(Guid id)
        {
            using (SqlCommand cmd = new SqlCommand("sp_GetApplicationForACRALegalRequestByID", ActiveConnection))
            {
                cmd.Parameters.Add(new SqlParameter("@ID", SqlDbType.UniqueIdentifier)).Value = id;
                return GetACRALegalEntities(cmd);
            }
        }

        public List<NORQLegalEntity> GetApplicationForNORQLegalRequestByISN(int isn)
        {
            using (SqlCommand cmd = new SqlCommand("sp_GetApplicationForNORQLegalRequestByISN", ActiveConnection))
            {
                cmd.Parameters.Add(new SqlParameter("@ISN", SqlDbType.Int)).Value = isn;
                return GetNORQLegalEntities(cmd);
            }
        }

        public List<ACRALegalEntity> GetApplicationForACRALegalRequestByISN(int isn)
        {
            using (SqlCommand cmd = new SqlCommand("sp_GetApplicationForACRALegalRequestByISN", ActiveConnection))
            {
                cmd.Parameters.Add(new SqlParameter("@ISN", SqlDbType.Int)).Value = isn;
                return GetACRALegalEntities(cmd);
            }
        }

        public NORQLegalQueryResult GetCachedNORQLegalResponse(string taxCode, Guid id)
        {
            NORQLegalQueryResult result = null;
            using (SqlCommand cmd = new SqlCommand("sp_GetCachedNORQLegalResponse", ActiveConnection))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = CommandTimeoutInterval;
                cmd.Parameters.Add(new SqlParameter("@TAX_CODE", SqlDbType.VarChar, 20)).Value = taxCode;
                using (SqlDataReader rdr = cmd.ExecuteReader())
                {
                    if (rdr.Read())
                    {
                        result = new NORQLegalQueryResult()
                        {
                            ApplicationID = rdr.GetGuid(0),
                            Name = rdr.GetString(1),
                            Type = rdr.GetString(2),
                            Address = rdr.GetString(3),
                            LegalAddress = rdr.GetString(4),
                            TaxCode = rdr.GetString(5),
                            EmployeeCount = rdr.GetInt32(6),
                            RegistrationDate = rdr.GetDateTime(7),
                            RegistrationCode = rdr.GetString(8)
                        };
                    }
                }
            }
            if (result != null)
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetCachedNORQLegalFounderResponse", ActiveConnection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = CommandTimeoutInterval;
                    cmd.Parameters.Add(new SqlParameter("@APPLICATION_ID", SqlDbType.UniqueIdentifier)).Value = result.ApplicationID.Value;
                    using (SqlDataReader rdr = cmd.ExecuteReader())
                    {
                        while (rdr.Read())
                        {
                            result.Founders.Add(new NORQLegalQueryResultFounder()
                            {
                                Name = rdr.GetString(0),
                                DocumentNumber = rdr.GetString(1)
                            });
                        }
                    }
                }
                result.ApplicationID = id;
            }
            return result;
        }

        public string GetCachedACRALegalResponse(string taxCode)
        {
            string result = string.Empty;
            using (SqlCommand cmd = new SqlCommand("sp_GetCachedACRALegalResponse", ActiveConnection))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = CommandTimeoutInterval;
                cmd.Parameters.Add(new SqlParameter("@TAX_CODE", SqlDbType.VarChar, 20)).Value = taxCode;
                using (SqlDataReader rdr = cmd.ExecuteReader())
                {
                    if (rdr.Read())
                    {
                        result = rdr.GetString(0);
                    }
                }
            }
            return result;
        }

        public List<ERegisterEntity> GetApplicationsForERegisterRequest()
        {
            using (SqlCommand cmd = new SqlCommand("sp_GetApplicationsForERegisterRequest", ActiveConnection))
                return GetERegisterEntities(cmd);
        }

        private List<ERegisterEntity> GetERegisterEntities(SqlCommand cmd)
        {
            List<ERegisterEntity> result = new List<ERegisterEntity>();
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = CommandTimeoutInterval;
            using (SqlDataReader reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                    result.Add(new ERegisterEntity()
                    {
                        ID = reader.GetGuid(0),
                        TaxCode = reader.GetString(1),
                        RegistrationCode = reader.GetString(2)
                    });
            }
            return result;
        }

        public List<ERegisterEntity> GetApplicationForERegisterRequestByID(Guid id)
        {
            using (SqlCommand cmd = new SqlCommand("sp_GetApplicationForERegisterRequestByID", ActiveConnection))
            {
                cmd.Parameters.Add(new SqlParameter("@ID", SqlDbType.UniqueIdentifier)).Value = id;
                return GetERegisterEntities(cmd);
            }
        }

        public List<ERegisterEntity> GetApplicationForERegisterRequestByISN(int isn)
        {
            using (SqlCommand cmd = new SqlCommand("sp_GetApplicationForERegisterRequestByISN", ActiveConnection))
            {
                cmd.Parameters.Add(new SqlParameter("@ISN", SqlDbType.Int)).Value = isn;
                return GetERegisterEntities(cmd);
            }
        }

        public ERegisterQueryResult GetCachedERegisterResponse(string taxCode)
        {
            ERegisterQueryResult result = null;
            string procedureName;
            using (SqlCommand cmd = new SqlCommand("sp_GetCachedERegisterResponse", ActiveConnection))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = CommandTimeoutInterval;
                cmd.Parameters.Add(new SqlParameter("@TAX_CODE", SqlDbType.VarChar, 20)).Value = taxCode;
                using (SqlDataReader rdr = cmd.ExecuteReader())
                {
                    if (rdr.Read())
                    {
                        result = new ERegisterQueryResult()
                        {
                            ApplicationID = rdr.GetGuid(0),
                            COUNTRY = rdr.GetString(1),
                            DISTRICT = rdr.GetString(2),
                            COMMUNITY = rdr.GetString(3),
                            STREET = rdr.GetString(4),
                            BUILDING = rdr.GetString(5),
                            APARTMENT = rdr.GetString(6),
                            ADDRESS = rdr.GetString(7),
                            POSTAL_CODE = rdr.GetString(8),
                            CERTIFICATE_CODE = rdr.GetString(9),
                            REGISTRATION_CODE = rdr.GetString(10),
                            REGISTRATION_DATE = rdr.GetDateTime(11),
                            TYPE = rdr.GetString(12),
                            IS_ACTIVE = rdr.GetBoolean(13),
                            INDUSTRY_CODE = rdr.GetString(14),
                            NAME_AM = rdr.GetString(15),
                            NAME_EN = rdr.GetString(16),
                            NAME_RU = rdr.GetString(17),
                            QUERY_SOURCE = rdr.GetByte(18)
                        };
                    }
                }
            }
            if (result != null)
            {
                switch (result.QUERY_SOURCE)
                {
                    case 2:
                        procedureName = "sp_GetCachedERegisterClientExecutiveResponse";
                        break;
                    default:
                        procedureName = "sp_GetCachedERegisterExecutiveResponse";
                        break;
                }

                using (SqlCommand cmd = new SqlCommand(procedureName, ActiveConnection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = CommandTimeoutInterval;
                    cmd.Parameters.Add(new SqlParameter("@APPLICATION_ID", SqlDbType.UniqueIdentifier)).Value = result.ApplicationID.Value;
                    using (SqlDataReader rdr = cmd.ExecuteReader())
                    {
                        while (rdr.Read())
                        {
                            ERegisterQueryResultExecutive executive = new ERegisterQueryResultExecutive();
                            if (!rdr.IsDBNull(0))
                                executive.COUNTRY = rdr.GetString(0);
                            if (!rdr.IsDBNull(1))
                                executive.DISTRICT = rdr.GetString(1);
                            if (!rdr.IsDBNull(2))
                                executive.COMMUNITY = rdr.GetString(2);
                            if (!rdr.IsDBNull(3))
                                executive.STREET = rdr.GetString(3);
                            if (!rdr.IsDBNull(4))
                                executive.BUILDING = rdr.GetString(4);
                            if (!rdr.IsDBNull(5))
                                executive.APARTMENT = rdr.GetString(5);
                            if (!rdr.IsDBNull(6))
                                executive.ADDRESS = rdr.GetString(6);
                            if (!rdr.IsDBNull(7))
                                executive.POSTAL_CODE = rdr.GetString(7);
                            if (!rdr.IsDBNull(8))
                                executive.POSITION = rdr.GetString(8);
                            if (!rdr.IsDBNull(9))
                                executive.PASSPORT_NUMBER = rdr.GetString(9);
                            if (!rdr.IsDBNull(10))
                                executive.PASSPORT_DATE = rdr.GetDateTime(10);
                            if (!rdr.IsDBNull(11))
                                executive.PASSPORT_EXPIRY_DATE = rdr.GetDateTime(11);
                            if (!rdr.IsDBNull(12))
                                executive.PASSPORT_BY = rdr.GetString(12);
                            if (!rdr.IsDBNull(13))
                                executive.SOCIAL_CARD_NUMBER = rdr.GetString(13);
                            if (!rdr.IsDBNull(14))
                                executive.BIRTH_DATE = rdr.GetDateTime(14);
                            if (!rdr.IsDBNull(15))
                                executive.GENDER = rdr.GetBoolean(15);
                            if (!rdr.IsDBNull(16))
                                executive.CITIZENSHIP_CODE = rdr.GetString(16);
                            if (!rdr.IsDBNull(17))
                                executive.FIRST_NAME = rdr.GetString(17);
                            if (!rdr.IsDBNull(18))
                                executive.LAST_NAME = rdr.GetString(18);
                            if (!rdr.IsDBNull(19))
                                executive.PATRONYMIC_NAME = rdr.GetString(19);
                            if (!rdr.IsDBNull(20))
                                executive.FULL_NAME = rdr.GetString(20);
                            result.Executives.Add(executive);
                        }
                    }
                }

                switch (result.QUERY_SOURCE)
                {
                    case 2:
                        procedureName = "sp_GetCachedERegisterClientOwnerResponse";
                        break;
                    default:
                        procedureName = "sp_GetCachedERegisterOwnerResponse";
                        break;
                }

                using (SqlCommand cmd = new SqlCommand(procedureName, ActiveConnection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = CommandTimeoutInterval;
                    cmd.Parameters.Add(new SqlParameter("@APPLICATION_ID", SqlDbType.UniqueIdentifier)).Value = result.ApplicationID.Value;
                    using (SqlDataReader rdr = cmd.ExecuteReader())
                    {
                        while (rdr.Read())
                        {
                            ERegisterQueryResultOwner owner = new ERegisterQueryResultOwner();
                            if (!rdr.IsDBNull(0))
                                owner.COUNTRY = rdr.GetString(0);
                            if (!rdr.IsDBNull(1))
                                owner.DISTRICT = rdr.GetString(1);
                            if (!rdr.IsDBNull(2))
                                owner.COMMUNITY = rdr.GetString(2);
                            if (!rdr.IsDBNull(3))
                                owner.STREET = rdr.GetString(3);
                            if (!rdr.IsDBNull(4))
                                owner.BUILDING = rdr.GetString(4);
                            if (!rdr.IsDBNull(5))
                                owner.APARTMENT = rdr.GetString(5);
                            if (!rdr.IsDBNull(6))
                                owner.ADDRESS = rdr.GetString(6);
                            if (!rdr.IsDBNull(7))
                                owner.POSTAL_CODE = rdr.GetString(7);
                            if (!rdr.IsDBNull(8))
                                owner.PASSPORT_NUMBER = rdr.GetString(8);
                            if (!rdr.IsDBNull(9))
                                owner.PASSPORT_DATE = rdr.GetDateTime(9);
                            if (!rdr.IsDBNull(10))
                                owner.PASSPORT_EXPIRY_DATE = rdr.GetDateTime(10);
                            if (!rdr.IsDBNull(11))
                                owner.PASSPORT_BY = rdr.GetString(11);
                            if (!rdr.IsDBNull(12))
                                owner.SOCIAL_CARD_NUMBER = rdr.GetString(12);
                            if (!rdr.IsDBNull(13))
                                owner.BIRTH_DATE = rdr.GetDateTime(13);
                            if (!rdr.IsDBNull(14))
                                owner.GENDER = rdr.GetBoolean(14);
                            if (!rdr.IsDBNull(15))
                                owner.CITIZENSHIP_CODE = rdr.GetString(15);
                            if (!rdr.IsDBNull(16))
                                owner.FIRST_NAME = rdr.GetString(16);
                            if (!rdr.IsDBNull(17))
                                owner.LAST_NAME = rdr.GetString(17);
                            if (!rdr.IsDBNull(18))
                                owner.PATRONYMIC_NAME = rdr.GetString(18);
                            if (!rdr.IsDBNull(19))
                                owner.FULL_NAME = rdr.GetString(19);
                            if (!rdr.IsDBNull(20))
                                owner.IS_FOUNDER = rdr.GetBoolean(20);
                            if (!rdr.IsDBNull(21))
                                owner.IS_LEGAL = rdr.GetBoolean(21);
                            if (!rdr.IsDBNull(22))
                                owner.JOIN_DATE = rdr.GetDateTime(22);
                            if (!rdr.IsDBNull(23))
                                owner.LEAVE_DATE = rdr.GetDateTime(23);
                            result.Owners.Add(owner);
                        }
                    }
                }
            }
            return result;
        }

        public void SaveERegisterTryCount(Guid id)
        {
            using (SqlCommand cmd = new SqlCommand("sp_SaveERegisterTryCount", ActiveConnection))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = CommandTimeoutInterval;
                cmd.Parameters.Add(new SqlParameter("@APPLICATION_ID", SqlDbType.UniqueIdentifier)).Value = id;
                cmd.ExecuteScalar();
            }
        }

        public void SaveERegisterQueryResult(ERegisterQueryResult result)
        {
            using (SqlCommand cmd = new SqlCommand("sp_SaveERegisterQueryResult", ActiveConnection))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = CommandTimeoutInterval;
                cmd.Parameters.Add(new SqlParameter("@APPLICATION_ID", SqlDbType.UniqueIdentifier)).Value = result.ApplicationID;
                cmd.Parameters.Add(new SqlParameter("@COUNTRY", SqlDbType.Char, 2)).Value = result.COUNTRY;
                cmd.Parameters.Add(new SqlParameter("@DISTRICT", SqlDbType.NVarChar, 20)).Value = result.DISTRICT;
                cmd.Parameters.Add(new SqlParameter("@COMMUNITY", SqlDbType.NVarChar, 40)).Value = result.COMMUNITY;
                cmd.Parameters.Add(new SqlParameter("@STREET", SqlDbType.NVarChar, 100)).Value = result.STREET;
                cmd.Parameters.Add(new SqlParameter("@BUILDING", SqlDbType.NVarChar, 40)).Value = result.BUILDING;
                cmd.Parameters.Add(new SqlParameter("@APARTMENT", SqlDbType.NVarChar, 40)).Value = result.APARTMENT;
                cmd.Parameters.Add(new SqlParameter("@ADDRESS", SqlDbType.NVarChar, 100)).Value = result.ADDRESS;
                cmd.Parameters.Add(new SqlParameter("@POSTAL_CODE", SqlDbType.VarChar, 20)).Value = result.POSTAL_CODE;
                cmd.Parameters.Add(new SqlParameter("@CERTIFICATE_CODE", SqlDbType.NVarChar, 20)).Value = result.CERTIFICATE_CODE;
                cmd.Parameters.Add(new SqlParameter("@REGISTRATION_DATE", SqlDbType.Date)).Value = result.REGISTRATION_DATE;
                cmd.Parameters.Add(new SqlParameter("@REGISTRATION_CODE", SqlDbType.NVarChar, 20)).Value = result.REGISTRATION_CODE;
                cmd.Parameters.Add(new SqlParameter("@TYPE", SqlDbType.NVarChar, 40)).Value = result.TYPE;
                cmd.Parameters.Add(new SqlParameter("@IS_ACTIVE", SqlDbType.Bit)).Value = result.IS_ACTIVE;
                cmd.Parameters.Add(new SqlParameter("@INDUSTRY_CODE", SqlDbType.VarChar, 20)).Value = result.INDUSTRY_CODE;
                cmd.Parameters.Add(new SqlParameter("@NAME_AM", SqlDbType.NVarChar, 100)).Value = result.NAME_AM;
                cmd.Parameters.Add(new SqlParameter("@NAME_EN", SqlDbType.VarChar, 100)).Value = result.NAME_EN;
                cmd.Parameters.Add(new SqlParameter("@NAME_RU", SqlDbType.NVarChar, 100)).Value = result.NAME_RU;

                DataTable tableExecutives = new DataTable("ERegisterQueryResultExecutive");
                tableExecutives.Columns.Add("COUNTRY", typeof(string));
                tableExecutives.Columns.Add("DISTRICT", typeof(string));
                tableExecutives.Columns.Add("COMMUNITY", typeof(string));
                tableExecutives.Columns.Add("STREET", typeof(string));
                tableExecutives.Columns.Add("BUILDING", typeof(string));
                tableExecutives.Columns.Add("APARTMENT", typeof(string));
                tableExecutives.Columns.Add("ADDRESS", typeof(string));
                tableExecutives.Columns.Add("POSTAL_CODE", typeof(string));
                tableExecutives.Columns.Add("POSITION", typeof(string));
                tableExecutives.Columns.Add("PASSPORT_NUMBER", typeof(string));
                tableExecutives.Columns.Add("PASSPORT_DATE", typeof(DateTime));
                tableExecutives.Columns.Add("PASSPORT_EXPIRY_DATE", typeof(DateTime));
                tableExecutives.Columns.Add("PASSPORT_BY", typeof(string));
                tableExecutives.Columns.Add("SOCIAL_CARD_NUMBER", typeof(string));
                tableExecutives.Columns.Add("BIRTH_DATE", typeof(DateTime));
                tableExecutives.Columns.Add("GENDER", typeof(bool));
                tableExecutives.Columns.Add("CITIZENSHIP_CODE", typeof(string));
                tableExecutives.Columns.Add("FIRST_NAME", typeof(string));
                tableExecutives.Columns.Add("LAST_NAME", typeof(string));
                tableExecutives.Columns.Add("PATRONYMIC_NAME", typeof(string));
                tableExecutives.Columns.Add("FULL_NAME", typeof(string));
                for (int i = 0; i < result.Executives.Count; i++)
                    tableExecutives.Rows.Add(result.Executives[i].COUNTRY, result.Executives[i].DISTRICT, result.Executives[i].COMMUNITY, result.Executives[i].STREET, result.Executives[i].BUILDING, result.Executives[i].APARTMENT, result.Executives[i].ADDRESS
                        , result.Executives[i].POSTAL_CODE, result.Executives[i].POSITION, result.Executives[i].PASSPORT_NUMBER, result.Executives[i].PASSPORT_DATE, result.Executives[i].PASSPORT_EXPIRY_DATE, result.Executives[i].PASSPORT_BY
                        , result.Executives[i].SOCIAL_CARD_NUMBER, result.Executives[i].BIRTH_DATE, result.Executives[i].GENDER, result.Executives[i].CITIZENSHIP_CODE
                        , result.Executives[i].FIRST_NAME, result.Executives[i].LAST_NAME, result.Executives[i].PATRONYMIC_NAME, result.Executives[i].FULL_NAME);
                cmd.Parameters.AddWithValue("@EXECUTIVES", tableExecutives).SqlDbType = SqlDbType.Structured;

                DataTable tableOwners = new DataTable("ERegisterQueryResultOwner");
                tableOwners.Columns.Add("COUNTRY", typeof(string));
                tableOwners.Columns.Add("DISTRICT", typeof(string));
                tableOwners.Columns.Add("COMMUNITY", typeof(string));
                tableOwners.Columns.Add("STREET", typeof(string));
                tableOwners.Columns.Add("BUILDING", typeof(string));
                tableOwners.Columns.Add("APARTMENT", typeof(string));
                tableOwners.Columns.Add("ADDRESS", typeof(string));
                tableOwners.Columns.Add("POSTAL_CODE", typeof(string));
                tableOwners.Columns.Add("PASSPORT_NUMBER", typeof(string));
                tableOwners.Columns.Add("PASSPORT_DATE", typeof(DateTime));
                tableOwners.Columns.Add("PASSPORT_EXPIRY_DATE", typeof(DateTime));
                tableOwners.Columns.Add("PASSPORT_BY", typeof(string));
                tableOwners.Columns.Add("SOCIAL_CARD_NUMBER", typeof(string));
                tableOwners.Columns.Add("BIRTH_DATE", typeof(DateTime));
                tableOwners.Columns.Add("GENDER", typeof(bool));
                tableOwners.Columns.Add("CITIZENSHIP_CODE", typeof(string));
                tableOwners.Columns.Add("FIRST_NAME", typeof(string));
                tableOwners.Columns.Add("LAST_NAME", typeof(string));
                tableOwners.Columns.Add("PATRONYMIC_NAME", typeof(string));
                tableOwners.Columns.Add("FULL_NAME", typeof(string));
                tableOwners.Columns.Add("IS_FOUNDER", typeof(bool));
                tableOwners.Columns.Add("IS_LEGAL", typeof(bool));
                tableOwners.Columns.Add("JOIN_DATE", typeof(DateTime));
                tableOwners.Columns.Add("LEAVE_DATE", typeof(DateTime));
                for (int i = 0; i < result.Owners.Count; i++)
                    tableOwners.Rows.Add(result.Owners[i].COUNTRY, result.Owners[i].DISTRICT, result.Owners[i].COMMUNITY, result.Owners[i].STREET, result.Owners[i].BUILDING, result.Owners[i].APARTMENT, result.Owners[i].ADDRESS
                        , result.Owners[i].POSTAL_CODE, result.Owners[i].PASSPORT_NUMBER, result.Owners[i].PASSPORT_DATE, result.Owners[i].PASSPORT_EXPIRY_DATE, result.Owners[i].PASSPORT_BY
                        , result.Owners[i].SOCIAL_CARD_NUMBER, result.Owners[i].BIRTH_DATE, result.Owners[i].GENDER, result.Owners[i].CITIZENSHIP_CODE
                        , result.Owners[i].FIRST_NAME, result.Owners[i].LAST_NAME, result.Owners[i].PATRONYMIC_NAME, result.Owners[i].FULL_NAME
                        , result.Owners[i].IS_FOUNDER, result.Owners[i].IS_LEGAL, result.Owners[i].JOIN_DATE, result.Owners[i].LEAVE_DATE);
                cmd.Parameters.AddWithValue("@OWNERS", tableOwners).SqlDbType = SqlDbType.Structured;

                cmd.ExecuteScalar();
            }
        }

        public void SaveERegisterClientQueryResult(ERegisterQueryResult result, string taxNumber)
        {
            using (SqlCommand cmd = new SqlCommand("sp_SaveERegisterClientQueryResult", ActiveConnection))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = CommandTimeoutInterval;
                cmd.Parameters.Add(new SqlParameter("@TAX_NUMBER", SqlDbType.VarChar, 20)).Value = taxNumber;
                cmd.Parameters.Add(new SqlParameter("@COUNTRY", SqlDbType.Char, 2)).Value = result.COUNTRY;
                cmd.Parameters.Add(new SqlParameter("@DISTRICT", SqlDbType.NVarChar, 20)).Value = result.DISTRICT;
                cmd.Parameters.Add(new SqlParameter("@COMMUNITY", SqlDbType.NVarChar, 40)).Value = result.COMMUNITY;
                cmd.Parameters.Add(new SqlParameter("@STREET", SqlDbType.NVarChar, 100)).Value = result.STREET;
                cmd.Parameters.Add(new SqlParameter("@BUILDING", SqlDbType.NVarChar, 40)).Value = result.BUILDING;
                cmd.Parameters.Add(new SqlParameter("@APARTMENT", SqlDbType.NVarChar, 40)).Value = result.APARTMENT;
                cmd.Parameters.Add(new SqlParameter("@ADDRESS", SqlDbType.NVarChar, 100)).Value = result.ADDRESS;
                cmd.Parameters.Add(new SqlParameter("@POSTAL_CODE", SqlDbType.VarChar, 20)).Value = result.POSTAL_CODE;
                cmd.Parameters.Add(new SqlParameter("@CERTIFICATE_CODE", SqlDbType.NVarChar, 20)).Value = result.CERTIFICATE_CODE;
                cmd.Parameters.Add(new SqlParameter("@REGISTRATION_DATE", SqlDbType.Date)).Value = result.REGISTRATION_DATE;
                cmd.Parameters.Add(new SqlParameter("@REGISTRATION_CODE", SqlDbType.NVarChar, 20)).Value = result.REGISTRATION_CODE;
                cmd.Parameters.Add(new SqlParameter("@TYPE", SqlDbType.NVarChar, 40)).Value = result.TYPE;
                cmd.Parameters.Add(new SqlParameter("@IS_ACTIVE", SqlDbType.Bit)).Value = result.IS_ACTIVE;
                cmd.Parameters.Add(new SqlParameter("@INDUSTRY_CODE", SqlDbType.VarChar, 20)).Value = result.INDUSTRY_CODE;
                cmd.Parameters.Add(new SqlParameter("@NAME_AM", SqlDbType.NVarChar, 100)).Value = result.NAME_AM;
                cmd.Parameters.Add(new SqlParameter("@NAME_EN", SqlDbType.VarChar, 100)).Value = result.NAME_EN;
                cmd.Parameters.Add(new SqlParameter("@NAME_RU", SqlDbType.NVarChar, 100)).Value = result.NAME_RU;

                DataTable tableExecutives = new DataTable("ERegisterQueryResultExecutive");
                tableExecutives.Columns.Add("COUNTRY", typeof(string));
                tableExecutives.Columns.Add("DISTRICT", typeof(string));
                tableExecutives.Columns.Add("COMMUNITY", typeof(string));
                tableExecutives.Columns.Add("STREET", typeof(string));
                tableExecutives.Columns.Add("BUILDING", typeof(string));
                tableExecutives.Columns.Add("APARTMENT", typeof(string));
                tableExecutives.Columns.Add("ADDRESS", typeof(string));
                tableExecutives.Columns.Add("POSTAL_CODE", typeof(string));
                tableExecutives.Columns.Add("POSITION", typeof(string));
                tableExecutives.Columns.Add("PASSPORT_NUMBER", typeof(string));
                tableExecutives.Columns.Add("PASSPORT_DATE", typeof(DateTime));
                tableExecutives.Columns.Add("PASSPORT_EXPIRY_DATE", typeof(DateTime));
                tableExecutives.Columns.Add("PASSPORT_BY", typeof(string));
                tableExecutives.Columns.Add("SOCIAL_CARD_NUMBER", typeof(string));
                tableExecutives.Columns.Add("BIRTH_DATE", typeof(DateTime));
                tableExecutives.Columns.Add("GENDER", typeof(bool));
                tableExecutives.Columns.Add("CITIZENSHIP_CODE", typeof(string));
                tableExecutives.Columns.Add("FIRST_NAME", typeof(string));
                tableExecutives.Columns.Add("LAST_NAME", typeof(string));
                tableExecutives.Columns.Add("PATRONYMIC_NAME", typeof(string));
                tableExecutives.Columns.Add("FULL_NAME", typeof(string));
                for (int i = 0; i < result.Executives.Count; i++)
                    tableExecutives.Rows.Add(result.Executives[i].COUNTRY, result.Executives[i].DISTRICT, result.Executives[i].COMMUNITY, result.Executives[i].STREET, result.Executives[i].BUILDING, result.Executives[i].APARTMENT, result.Executives[i].ADDRESS
                        , result.Executives[i].POSTAL_CODE, result.Executives[i].POSITION, result.Executives[i].PASSPORT_NUMBER, result.Executives[i].PASSPORT_DATE, result.Executives[i].PASSPORT_EXPIRY_DATE, result.Executives[i].PASSPORT_BY
                        , result.Executives[i].SOCIAL_CARD_NUMBER, result.Executives[i].BIRTH_DATE, result.Executives[i].GENDER, result.Executives[i].CITIZENSHIP_CODE
                        , result.Executives[i].FIRST_NAME, result.Executives[i].LAST_NAME, result.Executives[i].PATRONYMIC_NAME, result.Executives[i].FULL_NAME);
                cmd.Parameters.AddWithValue("@EXECUTIVES", tableExecutives).SqlDbType = SqlDbType.Structured;

                DataTable tableOwners = new DataTable("ERegisterQueryResultOwner");
                tableOwners.Columns.Add("COUNTRY", typeof(string));
                tableOwners.Columns.Add("DISTRICT", typeof(string));
                tableOwners.Columns.Add("COMMUNITY", typeof(string));
                tableOwners.Columns.Add("STREET", typeof(string));
                tableOwners.Columns.Add("BUILDING", typeof(string));
                tableOwners.Columns.Add("APARTMENT", typeof(string));
                tableOwners.Columns.Add("ADDRESS", typeof(string));
                tableOwners.Columns.Add("POSTAL_CODE", typeof(string));
                tableOwners.Columns.Add("PASSPORT_NUMBER", typeof(string));
                tableOwners.Columns.Add("PASSPORT_DATE", typeof(DateTime));
                tableOwners.Columns.Add("PASSPORT_EXPIRY_DATE", typeof(DateTime));
                tableOwners.Columns.Add("PASSPORT_BY", typeof(string));
                tableOwners.Columns.Add("SOCIAL_CARD_NUMBER", typeof(string));
                tableOwners.Columns.Add("BIRTH_DATE", typeof(DateTime));
                tableOwners.Columns.Add("GENDER", typeof(bool));
                tableOwners.Columns.Add("CITIZENSHIP_CODE", typeof(string));
                tableOwners.Columns.Add("FIRST_NAME", typeof(string));
                tableOwners.Columns.Add("LAST_NAME", typeof(string));
                tableOwners.Columns.Add("PATRONYMIC_NAME", typeof(string));
                tableOwners.Columns.Add("FULL_NAME", typeof(string));
                tableOwners.Columns.Add("IS_FOUNDER", typeof(bool));
                tableOwners.Columns.Add("IS_LEGAL", typeof(bool));
                tableOwners.Columns.Add("JOIN_DATE", typeof(DateTime));
                tableOwners.Columns.Add("LEAVE_DATE", typeof(DateTime));
                for (int i = 0; i < result.Owners.Count; i++)
                    tableOwners.Rows.Add(result.Owners[i].COUNTRY, result.Owners[i].DISTRICT, result.Owners[i].COMMUNITY, result.Owners[i].STREET, result.Owners[i].BUILDING, result.Owners[i].APARTMENT, result.Owners[i].ADDRESS
                        , result.Owners[i].POSTAL_CODE, result.Owners[i].PASSPORT_NUMBER, result.Owners[i].PASSPORT_DATE, result.Owners[i].PASSPORT_EXPIRY_DATE, result.Owners[i].PASSPORT_BY
                        , result.Owners[i].SOCIAL_CARD_NUMBER, result.Owners[i].BIRTH_DATE, result.Owners[i].GENDER, result.Owners[i].CITIZENSHIP_CODE
                        , result.Owners[i].FIRST_NAME, result.Owners[i].LAST_NAME, result.Owners[i].PATRONYMIC_NAME, result.Owners[i].FULL_NAME
                        , result.Owners[i].IS_FOUNDER, result.Owners[i].IS_LEGAL, result.Owners[i].JOIN_DATE, result.Owners[i].LEAVE_DATE);
                cmd.Parameters.AddWithValue("@OWNERS", tableOwners).SqlDbType = SqlDbType.Structured;

                cmd.ExecuteScalar();
            }
        }
        
        public void SaveMLResult(Guid id, string response)
        {
            using (SqlCommand cmd = new SqlCommand("sp_SaveMLResult", ActiveConnection))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = CommandTimeoutInterval;
                cmd.Parameters.Add("@APPLICATION_ID", SqlDbType.UniqueIdentifier).Value = id;
                cmd.Parameters.Add("@SERVICE_RESULT", SqlDbType.NVarChar, -1).Value = response;
                cmd.ExecuteScalar();
            }
        }

        public List<string> GetCreditLineTypes()
        {
            List<string> result = new List<string>();
            using (SqlCommand cmd = new SqlCommand("sp_GetCreditLineTypes", ActiveConnection))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = CommandTimeoutInterval;
                using (SqlDataReader rdr = cmd.ExecuteReader())
                {
                    while (rdr.Read())
                    {
                        result.Add(rdr.GetString(0));
                    }
                }
            }
            return result;
        }

        public List<string> GetIgnoredLoanTypes()
        {
            List<string> result = new List<string>();
            using (SqlCommand cmd = new SqlCommand("sp_GetIgnoredLoanTypes", ActiveConnection))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = CommandTimeoutInterval;
                using (SqlDataReader rdr = cmd.ExecuteReader())
                {
                    while (rdr.Read())
                    {
                        result.Add(rdr.GetString(0));
                    }
                }
            }
            return result;
        }

        private SqlCommand InitializeACRACommand(Guid id, ACRALegalQueryResult result, string procedureName)
        {
            SqlCommand cmd = new SqlCommand(procedureName, ActiveConnection);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = CommandTimeoutInterval;
            cmd.Parameters.Add(new SqlParameter("@APPLICATION_ID", SqlDbType.UniqueIdentifier)).Value = id;
            cmd.Parameters.Add(new SqlParameter("@RESPONSE_XML", SqlDbType.NVarChar, -1)).Value = ServiceHelper.GetFormattedXML(result.ResponseXml);
            cmd.Parameters.Add(new SqlParameter("@PRESENCE_TYPE", SqlDbType.VarChar, 2)).Value = result.Presence;
            cmd.Parameters.Add(new SqlParameter("@CLASSIFICATION_COUNT", SqlDbType.Int)).Value = result.ClassificationCount;
            cmd.Parameters.Add(new SqlParameter("@REVIEW_DATE", SqlDbType.DateTime)).Value = (object)result.ReviewDate ?? DBNull.Value;
            cmd.Parameters.Add(new SqlParameter("@LOAN_WORST_CLASS", SqlDbType.NVarChar, 200)).Value = result.LoanWorstClass;
            cmd.Parameters.Add(new SqlParameter("@GUARANTEE_WORST_CLASS", SqlDbType.NVarChar, 200)).Value = result.GuaranteeWorstClass;

            DataTable tableDetails = new DataTable("ACRAQueryResultDetails");
            tableDetails.Columns.Add("STATUS", typeof(string));
            tableDetails.Columns.Add("FROM_DATE", typeof(DateTime));
            tableDetails.Columns.Add("TO_DATE", typeof(DateTime));
            tableDetails.Columns.Add("TYPE", typeof(string));
            tableDetails.Columns.Add("CUR", typeof(string));
            tableDetails.Columns.Add("CONTRACT_AMOUNT", typeof(decimal));
            tableDetails.Columns.Add("DEBT", typeof(decimal));
            tableDetails.Columns.Add("PAST_DUE_DATE", typeof(DateTime));
            tableDetails.Columns.Add("RISK", typeof(string));
            tableDetails.Columns.Add("CLASSIFICATION_DATE", typeof(DateTime));
            tableDetails.Columns.Add("INTEREST_RATE", typeof(decimal));
            tableDetails.Columns.Add("PLEDGE", typeof(string));
            tableDetails.Columns.Add("PLEDGE_AMOUNT", typeof(string));
            tableDetails.Columns.Add("OUTSTANDING_AMOUNT", typeof(decimal));
            tableDetails.Columns.Add("OUTSTANDING_PERCENT", typeof(decimal));
            tableDetails.Columns.Add("BANK_NAME", typeof(string));
            tableDetails.Columns.Add("IS_GUARANTEE", typeof(bool));
            tableDetails.Columns.Add("DUE_DAYS_1", typeof(int));
            tableDetails.Columns.Add("DUE_DAYS_2", typeof(int));
            tableDetails.Columns.Add("DUE_DAYS_3", typeof(int));
            tableDetails.Columns.Add("DUE_DAYS_4", typeof(int));
            tableDetails.Columns.Add("DUE_DAYS_M1", typeof(int));
            tableDetails.Columns.Add("DUE_DAYS_M2", typeof(int));
            tableDetails.Columns.Add("DUE_DAYS_M3", typeof(int));
            tableDetails.Columns.Add("IS_CREDIT_LINE", typeof(bool));
            tableDetails.Columns.Add("IS_IGNORED_LOAN", typeof(bool));
            tableDetails.Columns.Add("SCOPE", typeof(string));
            tableDetails.Columns.Add("DUE_DAYS_MAX_Y1", typeof(int));
            tableDetails.Columns.Add("DUE_DAYS_MAX_Y2", typeof(int));
            tableDetails.Columns.Add("LOAN_ID", typeof(string));
            tableDetails.Columns.Add("CREDITING_DATE", typeof(DateTime));
            tableDetails.Columns.Add("CREDIT_USE_PLACE", typeof(string));
            tableDetails.Columns.Add("PLEDGE_NOTES", typeof(string));
            tableDetails.Columns.Add("PLEDGE_CURRENCY", typeof(string));
            tableDetails.Columns.Add("LAST_PAYMENT_DATE", typeof(DateTime));
            tableDetails.Columns.Add("OVERDUE_MAIN_AMOUNT", typeof(decimal));
            tableDetails.Columns.Add("OVERDUE_INTEREST_AMOUNT", typeof(decimal));
            tableDetails.Columns.Add("PROLONGATION_COUNT", typeof(int));
            tableDetails.Columns.Add("WORST_CLASS_Y1", typeof(string));
            tableDetails.Columns.Add("WORST_CLASS_Y2", typeof(string));
            tableDetails.Columns.Add("WORST_CLASS_Y3_Y5", typeof(string));
            tableDetails.Columns.Add("SUM_OVERDUE_DAYS_Y1_Y2", typeof(int));
            tableDetails.Columns.Add("MAX_OVERDUE_DAYS_Y1_Y2", typeof(int));
            tableDetails.Columns.Add("SUM_OVERDUE_DAYS_Y1_Y5", typeof(int));
            tableDetails.Columns.Add("MAX_OVERDUE_DAYS_Y1_Y5", typeof(int));
            tableDetails.Columns.Add("OVERDUE_DAYS", typeof(int));
            tableDetails.Columns.Add("INCOMING_DATE", typeof(DateTime));
            tableDetails.Columns.Add("DELAYED_PAYMENT_COUNT", typeof(int));
            tableDetails.Columns.Add("PROVISION_AMOUNT", typeof(decimal));
            for (int i = 0; i < result.Details.Count; i++)
                if (result.Details[i].CUR.Length == 3)
                    tableDetails.Rows.Add(result.Details[i].STATUS, result.Details[i].FROM_DATE, result.Details[i].TO_DATE, result.Details[i].TYPE
                        , result.Details[i].CUR, result.Details[i].CONTRACT_AMOUNT, result.Details[i].DEBT, result.Details[i].PAST_DUE_DATE, result.Details[i].RISK, result.Details[i].CLASSIFICATION_DATE
                        , result.Details[i].INTEREST_RATE, result.Details[i].PLEDGE, result.Details[i].PLEDGE_AMOUNT, result.Details[i].OUTSTANDING_AMOUNT, result.Details[i].OUTSTANDING_PERCENT
                        , result.Details[i].BANK_NAME, result.Details[i].IS_GUARANTEE, result.Details[i].DUE_DAYS_1, result.Details[i].DUE_DAYS_2, result.Details[i].DUE_DAYS_3, result.Details[i].DUE_DAYS_4
                        , result.Details[i].DUE_DAYS_M1, result.Details[i].DUE_DAYS_M2, result.Details[i].DUE_DAYS_M3, result.Details[i].IS_CREDIT_LINE, result.Details[i].IS_IGNORED_LOAN
                        , result.Details[i].SCOPE, result.Details[i].DUE_DAYS_MAX_Y1, result.Details[i].DUE_DAYS_MAX_Y2, result.Details[i].LOAN_ID
                        , result.Details[i].CREDITING_DATE, result.Details[i].CREDIT_USE_PLACE, result.Details[i].PLEDGE_NOTES, result.Details[i].PLEDGE_CURRENCY
                        , result.Details[i].LAST_PAYMENT_DATE, result.Details[i].OVERDUE_MAIN_AMOUNT, result.Details[i].OVERDUE_INTEREST_AMOUNT, result.Details[i].PROLONGATION_COUNT
                        , result.Details[i].WORST_CLASS_Y1, result.Details[i].WORST_CLASS_Y2, result.Details[i].WORST_CLASS_Y3_Y5
                        , result.Details[i].SUM_OVERDUE_DAYS_Y1_Y2, result.Details[i].MAX_OVERDUE_DAYS_Y1_Y2, result.Details[i].SUM_OVERDUE_DAYS_Y1_Y5, result.Details[i].MAX_OVERDUE_DAYS_Y1_Y5
                        , result.Details[i].OVERDUE_DAYS, result.Details[i].INCOMING_DATE, result.Details[i].DELAYED_PAYMENT_COUNT, result.Details[i].PROVISION_AMOUNT);
            cmd.Parameters.AddWithValue("@DETAILS", tableDetails).SqlDbType = SqlDbType.Structured;

            DataTable tableQueries = new DataTable("ACRAQueryResultQueries");
            tableQueries.Columns.Add("DATE", typeof(DateTime));
            tableQueries.Columns.Add("BANK_NAME", typeof(string));
            tableQueries.Columns.Add("REASON", typeof(string));
            for (int i = 0; i < result.Queries.Count; i++)
                tableQueries.Rows.Add(result.Queries[i].DATE, result.Queries[i].BANK_NAME, result.Queries[i].REASON);
            cmd.Parameters.AddWithValue("@QUERIES", tableQueries).SqlDbType = SqlDbType.Structured;

            DataTable tableInterrelated = new DataTable("ACRAQueryResultInterrelated");
            tableInterrelated.Columns.Add("STATUS", typeof(string));
            tableInterrelated.Columns.Add("FROM_DATE", typeof(DateTime));
            tableInterrelated.Columns.Add("TO_DATE", typeof(DateTime));
            tableInterrelated.Columns.Add("CUR", typeof(string));
            tableInterrelated.Columns.Add("RISK", typeof(string));
            tableInterrelated.Columns.Add("CONTRACT_AMOUNT", typeof(decimal));
            tableInterrelated.Columns.Add("DUE_AMOUNT", typeof(decimal));
            tableInterrelated.Columns.Add("OVERDUE_AMOUNT", typeof(decimal));
            tableInterrelated.Columns.Add("OUTSTANDING_PERCENT", typeof(decimal));
            for (int i = 0; i < result.Interrelated.Count; i++)
                if (result.Interrelated[i].CUR.Length == 3)
                    tableInterrelated.Rows.Add(result.Interrelated[i].STATUS, result.Interrelated[i].FROM_DATE, result.Interrelated[i].TO_DATE
                    , result.Interrelated[i].CUR, result.Interrelated[i].RISK, result.Interrelated[i].CONTRACT_AMOUNT, result.Interrelated[i].DUE_AMOUNT, result.Interrelated[i].OVERDUE_AMOUNT, result.Interrelated[i].OUTSTANDING_PERCENT);
            cmd.Parameters.AddWithValue("@INTERRELATED", tableInterrelated).SqlDbType = SqlDbType.Structured;

            DataTable tablePayments = new DataTable("ACRAQueryResultPayments");
            tablePayments.Columns.Add("YEAR", typeof(short));
            tablePayments.Columns.Add("MONTH", typeof(byte));
            tablePayments.Columns.Add("CUR", typeof(string));
            tablePayments.Columns.Add("AMOUNT", typeof(decimal));
            for (int i = 0; i < result.Payments.Count; i++)
                tablePayments.Rows.Add(result.Payments[i].YEAR, result.Payments[i].MONTH, result.Payments[i].CUR, result.Payments[i].AMOUNT);
            cmd.Parameters.AddWithValue("@PAYMENTS", tablePayments).SqlDbType = SqlDbType.Structured;

            DataTable tableDueDates = new DataTable("ACRAQueryResultLoanDueDates");
            tableDueDates.Columns.Add("LOAN_ID", typeof(string));
            tableDueDates.Columns.Add("YEAR", typeof(short));
            tableDueDates.Columns.Add("MONTH", typeof(byte));
            tableDueDates.Columns.Add("COUNT", typeof(int));
            for (int i = 0; i < result.DueDates.Count; i++)
                tableDueDates.Rows.Add(result.DueDates[i].LOAN_ID, result.DueDates[i].YEAR, result.DueDates[i].MONTH, result.DueDates[i].COUNT);
            cmd.Parameters.AddWithValue("@DUE_DATES", tableDueDates).SqlDbType = SqlDbType.Structured;

            DataTable tableAllPayments = new DataTable("ACRAQueryResultAllPayments");
            tableAllPayments.Columns.Add("LOAN_ID", typeof(string));
            tableAllPayments.Columns.Add("YEAR", typeof(short));
            tableAllPayments.Columns.Add("MONTH", typeof(byte));
            tableAllPayments.Columns.Add("CUR", typeof(string));
            tableAllPayments.Columns.Add("AMOUNT", typeof(decimal));
            for (int i = 0; i < result.AllPayments.Count; i++)
                tableAllPayments.Rows.Add(result.AllPayments[i].LOAN_ID, result.AllPayments[i].YEAR, result.AllPayments[i].MONTH, result.AllPayments[i].CUR, result.AllPayments[i].AMOUNT);
            cmd.Parameters.AddWithValue("@ALL_PAYMENTS", tableAllPayments).SqlDbType = SqlDbType.Structured;

            return cmd;
        }

        private void InitializeTaxParameters(TaxData taxData, SqlCommand cmd)
        {
            if (taxData.Type != null)
            {
                cmd.Parameters.Add(new SqlParameter("@COMPANY_TYPE", SqlDbType.NVarChar, 100)).Value = taxData.Type;
                cmd.Parameters.Add(new SqlParameter("@COMPANY_STATUS", SqlDbType.NVarChar, 100)).Value = taxData.Status;
                cmd.Parameters.Add(new SqlParameter("@TAX_TYPE", SqlDbType.NVarChar, 100)).Value = taxData.TaxType;
                cmd.Parameters.Add(new SqlParameter("@REGISTRATION_DISTRICT", SqlDbType.NVarChar, 20)).Value = taxData.RegistrationAddress.Region;
                cmd.Parameters.Add(new SqlParameter("@REGISTRATION_COMMUNITY", SqlDbType.NVarChar, 40)).Value = taxData.RegistrationAddress.Community;
                cmd.Parameters.Add(new SqlParameter("@REGISTRATION_STREET", SqlDbType.NVarChar, 100)).Value = taxData.RegistrationAddress.Street;
                cmd.Parameters.Add(new SqlParameter("@REGISTRATION_BUILDING", SqlDbType.NVarChar, 40)).Value = taxData.RegistrationAddress.Building;
                cmd.Parameters.Add(new SqlParameter("@REGISTRATION_APARTMENT", SqlDbType.NVarChar, 40)).Value = taxData.RegistrationAddress.Apartment;
                cmd.Parameters.Add(new SqlParameter("@CURRENT_DISTRICT", SqlDbType.NVarChar, 20)).Value = taxData.CurrentAddress.Region;
                cmd.Parameters.Add(new SqlParameter("@CURRENT_COMMUNITY", SqlDbType.NVarChar, 40)).Value = taxData.CurrentAddress.Community;
                cmd.Parameters.Add(new SqlParameter("@CURRENT_STREET", SqlDbType.NVarChar, 100)).Value = taxData.CurrentAddress.Street;
                cmd.Parameters.Add(new SqlParameter("@CURRENT_BUILDING", SqlDbType.NVarChar, 40)).Value = taxData.CurrentAddress.Building;
                cmd.Parameters.Add(new SqlParameter("@CURRENT_APARTMENT", SqlDbType.NVarChar, 40)).Value = taxData.CurrentAddress.Apartment;
            }

            DataTable tableTaxActivities = new DataTable();
            tableTaxActivities.Columns.Add("TYPE", typeof(string));
            tableTaxActivities.Columns.Add("PERIOD", typeof(string));
            tableTaxActivities.Columns.Add("UPDATE_DATE", typeof(DateTime));
            tableTaxActivities.Columns.Add("AMOUNT", typeof(decimal));
            tableTaxActivities.Columns.Add("OUTSTANDING", typeof(decimal));
            tableTaxActivities.Columns.Add("FINE", typeof(decimal));
            tableTaxActivities.Columns.Add("OVERPAYMENT", typeof(decimal));
            for (int i = 0; i < taxData.Activities.Count; i++)
                tableTaxActivities.Rows.Add(taxData.Activities[i].Type, null, DateTime.MinValue, taxData.Activities[i].Proportion, 0, 0, 0);
            cmd.Parameters.AddWithValue("@TAX_ACTIVITIES", tableTaxActivities).SqlDbType = SqlDbType.Structured;

            DataTable tableTaxDebts = new DataTable();
            tableTaxDebts.Columns.Add("TYPE", typeof(string));
            tableTaxDebts.Columns.Add("PERIOD", typeof(string));
            tableTaxDebts.Columns.Add("UPDATE_DATE", typeof(DateTime));
            tableTaxDebts.Columns.Add("AMOUNT", typeof(decimal));
            tableTaxDebts.Columns.Add("OUTSTANDING", typeof(decimal));
            tableTaxDebts.Columns.Add("FINE", typeof(decimal));
            tableTaxDebts.Columns.Add("OVERPAYMENT", typeof(decimal));
            for (int i = 0; i < taxData.Debts.Count; i++)
                tableTaxDebts.Rows.Add(taxData.Debts[i].Type, taxData.Debts[i].Period, taxData.Debts[i].UpdateDate, taxData.Debts[i].Debt, taxData.Debts[i].Outstanding, taxData.Debts[i].Fine, taxData.Debts[i].Overpayment);
            cmd.Parameters.AddWithValue("@TAX_DEBTS", tableTaxDebts).SqlDbType = SqlDbType.Structured;

            DataTable tableTaxPayments = new DataTable();
            tableTaxPayments.Columns.Add("TYPE", typeof(string));
            tableTaxPayments.Columns.Add("PERIOD", typeof(string));
            tableTaxPayments.Columns.Add("UPDATE_DATE", typeof(DateTime));
            tableTaxPayments.Columns.Add("AMOUNT", typeof(decimal));
            tableTaxPayments.Columns.Add("OUTSTANDING", typeof(decimal));
            tableTaxPayments.Columns.Add("FINE", typeof(decimal));
            tableTaxPayments.Columns.Add("OVERPAYMENT", typeof(decimal));
            for (int i = 0; i < taxData.Payments.Count; i++)
                tableTaxPayments.Rows.Add(taxData.Payments[i].Type, taxData.Payments[i].Period, taxData.Payments[i].UpdateDate, taxData.Payments[i].Amount, 0, 0, 0);
            cmd.Parameters.AddWithValue("@TAX_PAYMENTS", tableTaxPayments).SqlDbType = SqlDbType.Structured;

            DataTable tableTaxPurchases = new DataTable();
            tableTaxPurchases.Columns.Add("TYPE", typeof(string));
            tableTaxPurchases.Columns.Add("PERIOD", typeof(string));
            tableTaxPurchases.Columns.Add("UPDATE_DATE", typeof(DateTime));
            tableTaxPurchases.Columns.Add("AMOUNT", typeof(decimal));
            tableTaxPurchases.Columns.Add("OUTSTANDING", typeof(decimal));
            tableTaxPurchases.Columns.Add("FINE", typeof(decimal));
            tableTaxPurchases.Columns.Add("OVERPAYMENT", typeof(decimal));
            for (int i = 0; i < taxData.Purchases.Count; i++)
                tableTaxPurchases.Rows.Add(null, taxData.Purchases[i].Period, taxData.Purchases[i].UpdateDate, taxData.Purchases[i].Amount, 0, 0, 0);
            cmd.Parameters.AddWithValue("@TAX_PURCHASES", tableTaxPurchases).SqlDbType = SqlDbType.Structured;

            DataTable tableTaxSales = new DataTable();
            tableTaxSales.Columns.Add("TYPE", typeof(string));
            tableTaxSales.Columns.Add("PERIOD", typeof(string));
            tableTaxSales.Columns.Add("UPDATE_DATE", typeof(DateTime));
            tableTaxSales.Columns.Add("AMOUNT", typeof(decimal));
            tableTaxSales.Columns.Add("OUTSTANDING", typeof(decimal));
            tableTaxSales.Columns.Add("FINE", typeof(decimal));
            tableTaxSales.Columns.Add("OVERPAYMENT", typeof(decimal));
            for (int i = 0; i < taxData.Sales.Count; i++)
                tableTaxSales.Rows.Add(taxData.Sales[i].Type, taxData.Sales[i].Period, taxData.Sales[i].UpdateDate, taxData.Sales[i].Amount, 0, 0, 0);
            cmd.Parameters.AddWithValue("@TAX_SALES", tableTaxSales).SqlDbType = SqlDbType.Structured;

            DataTable tableTaxSalaryFunds = new DataTable();
            tableTaxSalaryFunds.Columns.Add("TYPE", typeof(string));
            tableTaxSalaryFunds.Columns.Add("PERIOD", typeof(string));
            tableTaxSalaryFunds.Columns.Add("UPDATE_DATE", typeof(DateTime));
            tableTaxSalaryFunds.Columns.Add("AMOUNT", typeof(decimal));
            tableTaxSalaryFunds.Columns.Add("OUTSTANDING", typeof(decimal));
            tableTaxSalaryFunds.Columns.Add("FINE", typeof(decimal));
            tableTaxSalaryFunds.Columns.Add("OVERPAYMENT", typeof(decimal));
            for (int i = 0; i < taxData.SalaryFunds.Count; i++)
                tableTaxSalaryFunds.Rows.Add(null, taxData.SalaryFunds[i].Period, taxData.SalaryFunds[i].UpdateDate, taxData.SalaryFunds[i].Amount, 0, 0, 0);
            cmd.Parameters.AddWithValue("@TAX_SALARY_FUNDS", tableTaxSalaryFunds).SqlDbType = SqlDbType.Structured;

            DataTable tableTaxProfits = new DataTable();
            tableTaxProfits.Columns.Add("TYPE", typeof(string));
            tableTaxProfits.Columns.Add("PERIOD", typeof(string));
            tableTaxProfits.Columns.Add("UPDATE_DATE", typeof(DateTime));
            tableTaxProfits.Columns.Add("AMOUNT", typeof(decimal));
            tableTaxProfits.Columns.Add("OUTSTANDING", typeof(decimal));
            tableTaxProfits.Columns.Add("FINE", typeof(decimal));
            tableTaxProfits.Columns.Add("OVERPAYMENT", typeof(decimal));
            for (int i = 0; i < taxData.Profits.Count; i++)
                tableTaxProfits.Rows.Add(null, taxData.Profits[i].Period, taxData.Profits[i].UpdateDate, taxData.Profits[i].Amount, 0, 0, 0);
            cmd.Parameters.AddWithValue("@TAX_PROFITS", tableTaxProfits).SqlDbType = SqlDbType.Structured;

            DataTable tableTaxEmployees = new DataTable();
            tableTaxEmployees.Columns.Add("PERIOD", typeof(string));
            tableTaxEmployees.Columns.Add("UPDATE_DATE", typeof(DateTime));
            tableTaxEmployees.Columns.Add("NUMBER", typeof(int));
            for (int i = 0; i < taxData.Employees.Count; i++)
                tableTaxEmployees.Rows.Add(taxData.Employees[i].Period, taxData.Employees[i].UpdateDate, taxData.Employees[i].Number);
            cmd.Parameters.AddWithValue("@TAX_EMPLOYEES", tableTaxEmployees).SqlDbType = SqlDbType.Structured;

            DataTable tableTaxReportCorrections = new DataTable();
            tableTaxReportCorrections.Columns.Add("REPORT_NAME", typeof(string));
            tableTaxReportCorrections.Columns.Add("UPDATE_DATE", typeof(DateTime));
            tableTaxReportCorrections.Columns.Add("FIELD_NAME", typeof(string));
            tableTaxReportCorrections.Columns.Add("FIELD_VALUE", typeof(decimal));
            for (int i = 0; i < taxData.ReportCorrections.Count; i++)
                tableTaxReportCorrections.Rows.Add(taxData.ReportCorrections[i].ReportName, taxData.ReportCorrections[i].UpdateDate, taxData.ReportCorrections[i].FieldName, taxData.ReportCorrections[i].FieldValue);
            cmd.Parameters.AddWithValue("@TAX_REPORT_CORRECTIONS", tableTaxReportCorrections).SqlDbType = SqlDbType.Structured;
        }

        public string GetLoanUsageName(string loanUsageCode)
        {
            string result = string.Empty;
            using (SqlCommand cmd = new SqlCommand("sp_GetLoanUsageName", ActiveConnection))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = CommandTimeoutInterval;
                cmd.Parameters.Add("@CODE", SqlDbType.NVarChar, 2).Value = loanUsageCode;
                using (SqlDataReader rdr = cmd.ExecuteReader())
                {
                    if (rdr.Read())
                    {
                        result = rdr.GetString(0);
                    }
                }
            }
            return result;
        }

        public static int CommandTimeoutInterval { get; set; }

        public DataHelper()
        {
            this.ActiveConnection = new SqlConnection("context connection=true");
            this.ActiveConnection.Open();
        }

        ~DataHelper()
        {
            this.DisposeConnection();
        }

        public SqlConnection ActiveConnection { get; set; }

        public void Dispose()
        {
            this.DisposeConnection();
            GC.SuppressFinalize(this);
        }

        public void DisposeConnection()
        {
            if (this.ActiveConnection != null)
            {
                this.ActiveConnection.Close();
                this.ActiveConnection = null;
            }
        }
    }
}
