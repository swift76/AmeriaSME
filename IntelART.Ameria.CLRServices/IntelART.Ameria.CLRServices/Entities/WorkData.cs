using System;

namespace IntelART.Ameria.CLRServices
{
    public class WorkData
    {
        public string OrganizationName { get; set; }
        public string RegistryCode { get; set; }
        public string TaxCode { get; set; }
        public string OrganizationAddress { get; set; }
        public string Position { get; set; }
        public DateTime AgreementStartDate { get; set; }
        public DateTime AgreementEndDate { get; set; }
        public decimal Salary { get; set; }
        public decimal SocialPayment { get; set; }
    }
}
