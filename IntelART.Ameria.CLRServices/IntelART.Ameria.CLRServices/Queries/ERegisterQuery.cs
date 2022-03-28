using System;
using System.Collections.Generic;
using System.Transactions;
using System.Xml;

namespace IntelART.Ameria.CLRServices
{
    public class ERegisterQuery
    {
        public ERegisterQueryResult GetERegisterResult(DataHelper dataAccess, string taxCode, string registrationCode, ServiceConfig config)
        {
            ERegisterQueryResult result = dataAccess.GetCachedERegisterResponse(taxCode);

            if (result == null || !result.ApplicationID.HasValue)
            {
                int serviceTimeout = dataAccess.GetServiceTimeout(3) * 1000;

                XmlDocument document = ServiceHelper.GetERegisterResponseDocument("tax_id", taxCode, config, serviceTimeout);
                if (ServiceHelper.GetNodeValue(document, "/Envelope/Body/CompanyInfoResponse/CompanyInfoResult/operation_message").ToUpper() != "SUCCESS" && !string.IsNullOrEmpty(registrationCode))
                {
                    document = ServiceHelper.GetERegisterResponseDocument("reg_num", registrationCode, config, serviceTimeout);
                    if (ServiceHelper.GetNodeValue(document, "/Envelope/Body/CompanyInfoResponse/CompanyInfoResult/operation_message").ToUpper() != "SUCCESS")
                        return null;
                }

                DateTime dateCurrent = dataAccess.GetServerDate();

                result = new ERegisterQueryResult();
                result.COUNTRY = ServiceHelper.GetNodeValue(document, "/Envelope/Body/CompanyInfoResponse/CompanyInfoResult/company/address/country_id");
                result.DISTRICT = ServiceHelper.GetNodeValue(document, "/Envelope/Body/CompanyInfoResponse/CompanyInfoResult/company/address/province");
                result.COMMUNITY = ServiceHelper.GetNodeValue(document, "/Envelope/Body/CompanyInfoResponse/CompanyInfoResult/company/address/city_town");
                if (string.IsNullOrEmpty(result.COMMUNITY))
                    result.COMMUNITY = ServiceHelper.GetNodeValue(document, "/Envelope/Body/CompanyInfoResponse/CompanyInfoResult/company/address/community");
                result.STREET = string.Format("{0} {1}", ServiceHelper.GetNodeValue(document, "/Envelope/Body/CompanyInfoResponse/CompanyInfoResult/company/address/street1")
                    , ServiceHelper.GetNodeValue(document, "/Envelope/Body/CompanyInfoResponse/CompanyInfoResult/company/address/street2"));
                result.BUILDING = ServiceHelper.GetNodeValue(document, "/Envelope/Body/CompanyInfoResponse/CompanyInfoResult/company/address/house");
                result.APARTMENT = ServiceHelper.GetNodeValue(document, "/Envelope/Body/CompanyInfoResponse/CompanyInfoResult/company/address/apt");
                result.ADDRESS = ServiceHelper.GetNodeValue(document, "/Envelope/Body/CompanyInfoResponse/CompanyInfoResult/company/address/addr_descr");
                result.POSTAL_CODE = ServiceHelper.GetNodeValue(document, "/Envelope/Body/CompanyInfoResponse/CompanyInfoResult/company/address/postcode");
                result.CERTIFICATE_CODE = ServiceHelper.GetNodeValue(document, "/Envelope/Body/CompanyInfoResponse/CompanyInfoResult/company/cert_num");
                result.REGISTRATION_CODE = ServiceHelper.GetNodeValue(document, "/Envelope/Body/CompanyInfoResponse/CompanyInfoResult/company/reg_num");
                result.REGISTRATION_DATE = ServiceHelper.GetNORQDateValue(ServiceHelper.GetNodeValue(document, "/Envelope/Body/CompanyInfoResponse/CompanyInfoResult/company/registered"), dateCurrent);
                result.TYPE = ServiceHelper.GetNodeValue(document, "/Envelope/Body/CompanyInfoResponse/CompanyInfoResult/company/company_type");
                result.IS_ACTIVE = (ServiceHelper.GetNodeValue(document, "/Envelope/Body/CompanyInfoResponse/CompanyInfoResult/company/inactive") == "0");
                result.INDUSTRY_CODE = ServiceHelper.GetNodeValue(document, "/Envelope/Body/CompanyInfoResponse/CompanyInfoResult/company/industry_code");
                result.NAME_AM = ServiceHelper.GetNodeValue(document, "/Envelope/Body/CompanyInfoResponse/CompanyInfoResult/company/name_am");
                result.NAME_EN = ServiceHelper.GetNodeValue(document, "/Envelope/Body/CompanyInfoResponse/CompanyInfoResult/company/name_en");
                result.NAME_RU = ServiceHelper.GetNodeValue(document, "/Envelope/Body/CompanyInfoResponse/CompanyInfoResult/company/name_ru");

                XmlNodeList listExecutive = document.SelectNodes("/Envelope/Body/CompanyInfoResponse/CompanyInfoResult/company/executive");
                foreach (XmlNode node in listExecutive)
                {
                    if (!string.IsNullOrEmpty(node.InnerXml))
                    {
                        ERegisterQueryResultExecutive executive = new ERegisterQueryResultExecutive();
                        executive.COUNTRY = node.SelectSingleNode("address/country_id").InnerXml;
                        executive.DISTRICT = node.SelectSingleNode("address/province").InnerXml;
                        executive.COMMUNITY = node.SelectSingleNode("address/city_town").InnerXml;
                        if (string.IsNullOrEmpty(executive.COMMUNITY))
                            executive.COMMUNITY = node.SelectSingleNode("address/community").InnerXml;
                        executive.STREET = string.Format("{0} {1}", node.SelectSingleNode("address/street1").InnerXml, node.SelectSingleNode("address/street2").InnerXml);
                        executive.BUILDING = node.SelectSingleNode("address/house").InnerXml;
                        executive.APARTMENT = node.SelectSingleNode("address/apt").InnerXml;
                        executive.ADDRESS = node.SelectSingleNode("address/addr_descr").InnerXml;
                        executive.POSTAL_CODE = node.SelectSingleNode("address/postcode").InnerXml;
                        executive.POSITION = node.SelectSingleNode("exec_position").InnerXml;
                        executive.PASSPORT_NUMBER = node.SelectSingleNode("id_info/passport_no").InnerXml;
                        executive.PASSPORT_DATE = ServiceHelper.GetNullableNORQDateValue(node.SelectSingleNode("id_info/passport_issued").InnerXml);
                        executive.PASSPORT_BY = node.SelectSingleNode("id_info/passport_issued_by").InnerXml;
                        executive.SOCIAL_CARD_NUMBER = node.SelectSingleNode("id_info/ssn").InnerXml;
                        if (string.IsNullOrEmpty(executive.PASSPORT_NUMBER))
                            executive.PASSPORT_NUMBER = node.SelectSingleNode("identification_no").InnerXml;
                        if (string.IsNullOrEmpty(executive.SOCIAL_CARD_NUMBER))
                            executive.SOCIAL_CARD_NUMBER = node.SelectSingleNode("ssn").InnerXml;
                        executive.BIRTH_DATE = ServiceHelper.GetNullableNORQDateValue(node.SelectSingleNode("id_info/birth_date").InnerXml);
                        executive.GENDER = GetGender(node, "id_info/sex");
                        executive.CITIZENSHIP_CODE = node.SelectSingleNode("nationality_country_id").InnerXml;
                        executive.FIRST_NAME = node.SelectSingleNode("first_name").InnerXml;
                        executive.LAST_NAME = node.SelectSingleNode("last_name").InnerXml;
                        executive.PATRONYMIC_NAME = node.SelectSingleNode("middle_name").InnerXml;
                        executive.FULL_NAME = node.SelectSingleNode("full_name").InnerXml;

                        result.Executives.Add(executive);
                    }
                }

                XmlNodeList listOwner = document.SelectNodes("/Envelope/Body/CompanyInfoResponse/CompanyInfoResult/company/owners/KeyValueOfstringowner3UXv_SLBY");
                foreach (XmlNode node in listOwner)
                {
                    ERegisterQueryResultOwner owner = new ERegisterQueryResultOwner();
                    owner.COUNTRY = node.SelectSingleNode("Value/address/country_id").InnerXml;
                    owner.DISTRICT = node.SelectSingleNode("Value/address/province").InnerXml;
                    owner.COMMUNITY = node.SelectSingleNode("Value/address/city_town").InnerXml;
                    if (string.IsNullOrEmpty(owner.COMMUNITY))
                        owner.COMMUNITY = node.SelectSingleNode("Value/address/community").InnerXml;
                    owner.STREET = string.Format("{0} {1}", node.SelectSingleNode("Value/address/street1").InnerXml, node.SelectSingleNode("Value/address/street2").InnerXml);
                    owner.BUILDING = node.SelectSingleNode("Value/address/house").InnerXml;
                    owner.APARTMENT = node.SelectSingleNode("Value/address/apt").InnerXml;
                    owner.ADDRESS = node.SelectSingleNode("Value/address/addr_descr").InnerXml;
                    owner.POSTAL_CODE = node.SelectSingleNode("Value/address/postcode").InnerXml;
                    owner.PASSPORT_NUMBER = node.SelectSingleNode("Value/id_info/passport_no").InnerXml;
                    owner.PASSPORT_DATE = ServiceHelper.GetNullableNORQDateValue(node.SelectSingleNode("Value/id_info/passport_issued").InnerXml);
                    owner.PASSPORT_BY = node.SelectSingleNode("Value/id_info/passport_issued_by").InnerXml;
                    owner.SOCIAL_CARD_NUMBER = node.SelectSingleNode("Value/id_info/ssn").InnerXml;
                    if (string.IsNullOrEmpty(owner.PASSPORT_NUMBER))
                        owner.PASSPORT_NUMBER = node.SelectSingleNode("Value/identification_no").InnerXml;
                    if (string.IsNullOrEmpty(owner.SOCIAL_CARD_NUMBER))
                        owner.SOCIAL_CARD_NUMBER = node.SelectSingleNode("Value/ssn").InnerXml;
                    owner.BIRTH_DATE = ServiceHelper.GetNullableNORQDateValue(node.SelectSingleNode("Value/id_info/birth_date").InnerXml);
                    owner.GENDER = GetGender(node, "Value/id_info/sex");
                    owner.CITIZENSHIP_CODE = node.SelectSingleNode("Value/nationality_country_id").InnerXml;
                    owner.FIRST_NAME = node.SelectSingleNode("Value/first_name").InnerXml;
                    owner.LAST_NAME = node.SelectSingleNode("Value/last_name").InnerXml;
                    owner.PATRONYMIC_NAME = node.SelectSingleNode("Value/middle_name").InnerXml;
                    owner.FULL_NAME = node.SelectSingleNode("Value/full_name").InnerXml;
                    owner.IS_FOUNDER = (node.SelectSingleNode("Value/is_founder").InnerXml.ToLower() == "true");
                    owner.IS_LEGAL = (node.SelectSingleNode("Value/is_legal_entity").InnerXml.ToLower() == "true");
                    owner.JOIN_DATE = ServiceHelper.GetNullableNORQDateValue(node.SelectSingleNode("Value/joined_date").InnerXml);
                    owner.LEAVE_DATE = ServiceHelper.GetNullableNORQDateValue(node.SelectSingleNode("Value/left_date").InnerXml);
                    result.Owners.Add(owner);
                }
            }

            return result;
        }

        public void GetResponse(DataHelper dataAccess, ERegisterEntity entity, ServiceConfig config)
        {
            dataAccess.SaveERegisterTryCount(entity.ID);

            ERegisterQueryResult result = GetERegisterResult(dataAccess, entity.TaxCode, entity.RegistrationCode, config);
            if (result == null)
                return;
            result.ApplicationID = entity.ID;

            using (TransactionScope transScope = new TransactionScope())
            {
                if (dataAccess.LockApplicationByID(entity.ID, 2))
                    dataAccess.SaveERegisterQueryResult(result);
                transScope.Complete();
            }
        }

        private bool? GetGender(XmlNode node, string path)
        {
            bool? result = null;
            string xmlValue = node.SelectSingleNode(path).InnerXml;
            if (!string.IsNullOrEmpty(xmlValue))
                result = (xmlValue == "Ա");
            return result;
        }
    }
}
