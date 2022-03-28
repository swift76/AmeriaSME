using System;
using System.Collections.Generic;

namespace IntelART.Ameria.CLRServices
{
    public class NORQLegalQueryResult
    {
        public Guid? ApplicationID { get; set; }

        public string Name { get; set; }
        public string Type { get; set; }
        public string Address { get; set; }
        public string LegalAddress { get; set; }
        public string TaxCode { get; set; }
        public int EmployeeCount { get; set; }
        public DateTime RegistrationDate { get; set; }
        public string RegistrationCode { get; set; }

        public List<NORQLegalQueryResultFounder> Founders { get; set; }

        public NORQLegalQueryResult()
        {
            Founders = new List<NORQLegalQueryResultFounder>();
        }
    }
}
