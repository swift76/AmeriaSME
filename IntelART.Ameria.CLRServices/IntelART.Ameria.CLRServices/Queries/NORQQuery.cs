using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Transactions;
using System.Xml;

namespace IntelART.Ameria.CLRServices
{
    public class NORQQuery
    {
        public void GetResponse(DataHelper dataAccess, ServiceConfig config, NORQEntity entity)
        {
            XmlDocument document;
            dataAccess.SaveNORQTryCount(entity.ID);

            string responseText = dataAccess.GetCachedNORQResponse(entity.SocialCardNumber);

            if (string.IsNullOrEmpty(responseText))
            {
                Dictionary<string, string> parameters = new Dictionary<string, string>();
                parameters.Add("partner_password", config.UserPassword);
                parameters.Add("partner_username", config.UserName);
                parameters.Add("soccard", entity.SocialCardNumber);
                document = ServiceHelper.GetServiceResult(config.URL, "http://tempuri.org/IsrvNorq/f_GetUserDataXML", dataAccess.GetServiceTimeout(4), "f_GetUserDataXML", parameters, "Request", "http://schemas.datacontract.org/2004/07/Norq.DataContract");
                XmlNode node = document.SelectSingleNode("/*[local-name()='Envelope']/*[local-name()='Body']/*[local-name()='f_GetUserDataXMLResponse']/*[local-name()='f_GetUserDataXMLResult']");
                if (node != null)
                {
                    responseText = ServiceHelper.DecodeResponseXML(node.InnerXml);
                }
            }

            document = new XmlDocument();
            document.LoadXml(responseText);
            string firstName = FormatName(ServiceHelper.GetNodeValue(document, "/PersonDataResponse/privatedata/Firstname"));
            string lastName = FormatName(ServiceHelper.GetNodeValue(document, "/PersonDataResponse/privatedata/Lastname"));

            DateTime dateCurrent = dataAccess.GetServerDate();

            DateTime birthDate = ServiceHelper.GetNORQDateValue(ServiceHelper.GetNodeValue(document, "/PersonDataResponse/privatedata/Birthdate"), dateCurrent);
            if (firstName == string.Empty || lastName == string.Empty)
            {
                dataAccess.AutomaticallyRefuseApplication(entity.ID, "Սխալ փաստաթղթի տվյալներ");
            }
            else
            {
                string middleName = ServiceHelper.GetNodeValue(document, "/PersonDataResponse/privatedata/Middlename").ToUpper();
                bool gender = (ServiceHelper.GetNodeValue(document, "/PersonDataResponse/privatedata/Gender") == "2");

                string district = ServiceHelper.GetNodeValue(document, "/PersonDataResponse/privatedata/Region").ToUpper();
                string community = ServiceHelper.GetNodeValue(document, "/PersonDataResponse/privatedata/Community").ToUpper();
                string street = ServiceHelper.GetNodeValue(document, "/PersonDataResponse/privatedata/Street").ToUpper();
                string building = ServiceHelper.GetNodeValue(document, "/PersonDataResponse/privatedata/Building").ToUpper();
                string apartment = ServiceHelper.GetNodeValue(document, "/PersonDataResponse/privatedata/Apartment").ToUpper();
                string address = string.Format("{0}, {1}, {2}", street, building, apartment);

                string passportNumber = ServiceHelper.GetNodeValue(document, "/PersonDataResponse/privatedata/Passport");
                DateTime passportDate = ServiceHelper.GetNORQDateValue(ServiceHelper.GetNodeValue(document, "/PersonDataResponse/privatedata/PassportDate"), dateCurrent);
                DateTime passportExpiryDate = ServiceHelper.GetNORQDateValue(ServiceHelper.GetNodeValue(document, "/PersonDataResponse/privatedata/PassportVdate"), dateCurrent);
                string passportBy = ServiceHelper.GetNodeValue(document, "/PersonDataResponse/privatedata/PassportWhere");

                string idCardNumber = ServiceHelper.GetNodeValue(document, "/PersonDataResponse/privatedata/IdCard");
                DateTime idCardIssueDate = ServiceHelper.GetNORQDateValue(ServiceHelper.GetNodeValue(document, "/PersonDataResponse/privatedata/IdCardDate"), dateCurrent);
                DateTime idCardExpiryDate = ServiceHelper.GetNORQDateValue(ServiceHelper.GetNodeValue(document, "/PersonDataResponse/privatedata/IdCardVdate"), dateCurrent);
                string idCardIssuedBy = ServiceHelper.GetNodeValue(document, "/PersonDataResponse/privatedata/IdCardWhere");

                string biometricPassportNumber = ServiceHelper.GetNodeValue(document, "/PersonDataResponse/privatedata/Biometric");
                DateTime biometricPassportIssueDate = ServiceHelper.GetNORQDateValue(ServiceHelper.GetNodeValue(document, "/PersonDataResponse/privatedata/BiometricDate"), dateCurrent);
                DateTime biometricPassportExpiryDate = ServiceHelper.GetNORQDateValue(ServiceHelper.GetNodeValue(document, "/PersonDataResponse/privatedata/BiometricVdate"), dateCurrent);
                string biometricPassportIssuedBy = ServiceHelper.GetNodeValue(document, "/PersonDataResponse/privatedata/BiometricWhere");

                string socialCardNumber = ServiceHelper.GetNodeValue(document, "/PersonDataResponse/privatedata/Soccard");

                XmlNodeList listWork = document.SelectNodes("/PersonDataResponse/workdata/WorkData");
                decimal fee = 0;
                List<WorkData> Employment = new List<WorkData>();
                foreach (XmlNode node in listWork)
                {
                    WorkData work = new WorkData()
                    {
                        OrganizationName = node.SelectSingleNode("OrganizationName").InnerXml,
                        RegistryCode = node.SelectSingleNode("RegistryCode").InnerXml,
                        TaxCode = Regex.Replace(node.SelectSingleNode("TaxCode").InnerXml, @"\s+", ""),
                        OrganizationAddress = node.SelectSingleNode("OrganizationAddress").InnerXml,
                        Position = node.SelectSingleNode("Position").InnerXml,
                        AgreementStartDate = ServiceHelper.GetNORQDateValue(node.SelectSingleNode("AgreementStartDate").InnerXml, DateTime.MinValue),
                        AgreementEndDate = ServiceHelper.GetNORQDateValue(node.SelectSingleNode("AgreementEndDate").InnerXml, DateTime.MaxValue),
                        Salary = decimal.Parse(node.SelectSingleNode("Salary").InnerXml),
                        SocialPayment = decimal.Parse(node.SelectSingleNode("SocialPayment").InnerXml)
                    };
                    Employment.Add(work);
                    if (work.AgreementEndDate >= dateCurrent)
                        fee += work.Salary;
                }
                
                using (TransactionScope transScope = new TransactionScope())
                {
                    if (dataAccess.LockApplicationByID(entity.ID, 4))
                        dataAccess.SaveNORQQueryResult(entity.ID, firstName, lastName, middleName, birthDate, gender, 
                            district, community, street, building, apartment, address,
                            passportNumber, passportDate, passportExpiryDate, passportBy,
                            biometricPassportNumber, biometricPassportIssueDate, biometricPassportExpiryDate, biometricPassportIssuedBy,
                            idCardNumber, idCardIssueDate, idCardExpiryDate, idCardIssuedBy,
                            socialCardNumber, fee, responseText, Employment);
                    transScope.Complete();
                }
            }
        }

        public void GetLegalResponse(DataHelper dataAccess, ServiceConfig config, NORQLegalEntity entity)
        {
            dataAccess.SaveNORQLegalTryCount(entity.ID);

            NORQLegalQueryResult result = dataAccess.GetCachedNORQLegalResponse(entity.TaxCode, entity.ID);

            if (result == null || !result.ApplicationID.HasValue)
            {
                Dictionary<string, string> parameters = new Dictionary<string, string>();
                parameters.Add("TIN", entity.TaxCode);
                parameters.Add("partner_password", config.UserPassword);
                parameters.Add("partner_username", config.UserName);
                XmlDocument document = ServiceHelper.GetServiceResult(config.URL, "http://tempuri.org/IsrvNorq/f_GetLegalData", dataAccess.GetServiceTimeout(1), "f_GetLegalData", parameters, "Request", "http://schemas.datacontract.org/2004/07/Norq.DataContract");
                XmlNode node = document.SelectSingleNode("/*[local-name()='Envelope']/*[local-name()='Body']/*[local-name()='f_GetLegalDataResponse']");

                result = new NORQLegalQueryResult();
                result.Name = string.Empty;
                result.Type = string.Empty;
                result.Address = string.Empty;
                result.LegalAddress = string.Empty;
                result.RegistrationCode = string.Empty;
                result.RegistrationDate = DateTime.Now;
                result.TaxCode = string.Empty;
                result.EmployeeCount = 1;

                result = new NORQLegalQueryResult();
                if (node != null)
                {
                    string responseText = ServiceHelper.DecodeResponseXML(node.InnerXml);
                    document = new XmlDocument();
                    document.LoadXml(responseText);
                    XmlNodeList founders = document.SelectNodes("/*[local-name()='f_GetLegalDataResult']/*[local-name()='legaldata']/*[local-name()='LegalData']");
                    if (founders.Count > 0)
                    {
                        result.Name = ServiceHelper.GetNodeValue(founders[0], "*[local-name()='CompName']");
                        result.Type = ServiceHelper.GetNodeValue(founders[0], "*[local-name()='CompType']");
                        result.Address = ServiceHelper.GetNodeValue(founders[0], "*[local-name()='Address']");
                        result.LegalAddress = ServiceHelper.GetNodeValue(founders[0], "*[local-name()='LegalAddress']");
                        result.RegistrationCode = ServiceHelper.GetNodeValue(founders[0], "*[local-name()='RegCode']");
                        result.RegistrationDate = ServiceHelper.GetNORQDateValue(ServiceHelper.GetNodeValue(founders[0], "*[local-name()='RegDate']"), result.RegistrationDate);
                        result.TaxCode = ServiceHelper.GetNodeValue(founders[0], "*[local-name()='HVHH']");
                        string employeeCount = ServiceHelper.GetNodeValue(founders[0], "*[local-name()='WorkerCount']");
                        int count;
                        if (int.TryParse(employeeCount, out count))
                            result.EmployeeCount = count;
                        for (int i = 0; i < founders.Count; i++)
                            result.Founders.Add(new NORQLegalQueryResultFounder()
                            {
                                Name = ServiceHelper.GetNodeValue(founders[i], "*[local-name()='Creator']"),
                                DocumentNumber = ServiceHelper.GetNodeValue(founders[i], "*[local-name()='Passport']")
                            });
                    }
                }
            }
           
            using (TransactionScope transScope = new TransactionScope())
            {
                if (dataAccess.LockApplicationByID(entity.ID, 1))
                    dataAccess.SaveNORQLegalQueryResult(entity.ID, result);
                transScope.Complete();
            }
        }

        private string FormatName(string source)
        {
            string result = source.Trim().ToUpper();
            result = result.Replace("և", "ԵՎ");
            result = result.Replace("ԵՒ", "ԵՎ");
            return result;
        }
    }
}
