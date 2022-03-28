using System;
using System.Collections.Generic;

namespace IntelART.Ameria.CLRServices
{
    public class ERegisterQueryResult
    {
        public Guid? ApplicationID { get; set; }

        public string COUNTRY { get; set; }
        public string DISTRICT { get; set; }
        public string COMMUNITY { get; set; }
        public string STREET { get; set; }
        public string BUILDING { get; set; }
        public string APARTMENT { get; set; }
        public string ADDRESS { get; set; }
        public string POSTAL_CODE { get; set; }
        public string CERTIFICATE_CODE { get; set; }
        public string REGISTRATION_CODE { get; set; }
        public DateTime REGISTRATION_DATE { get; set; }
        public string TYPE { get; set; }
        public bool IS_ACTIVE { get; set; }
        public string INDUSTRY_CODE { get; set; }
        public string NAME_AM { get; set; }
        public string NAME_EN { get; set; }
        public string NAME_RU { get; set; }
        public byte QUERY_SOURCE { get; set; }

        public List<ERegisterQueryResultExecutive> Executives { get; set; }
        public List<ERegisterQueryResultOwner> Owners { get; set; }

        public ERegisterQueryResult()
        {
            Executives = new List<ERegisterQueryResultExecutive>();
            Owners = new List<ERegisterQueryResultOwner>();
        }
    }
}
