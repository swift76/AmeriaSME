using System;

namespace IntelART.Ameria.CLRServices
{
    public class ERegisterQueryResultOwner
    {
        public string COUNTRY { get; set; }
        public string DISTRICT { get; set; }
        public string COMMUNITY { get; set; }
        public string STREET { get; set; }
        public string BUILDING { get; set; }
        public string APARTMENT { get; set; }
        public string ADDRESS { get; set; }
        public string POSTAL_CODE { get; set; }
        public string PASSPORT_NUMBER { get; set; }
        public DateTime? PASSPORT_DATE { get; set; }
        public DateTime? PASSPORT_EXPIRY_DATE { get; set; }
        public string PASSPORT_BY { get; set; }
        public string SOCIAL_CARD_NUMBER { get; set; }
        public DateTime? BIRTH_DATE { get; set; }
        public bool? GENDER { get; set; }
        public string CITIZENSHIP_CODE { get; set; }
        public string FIRST_NAME { get; set; }
        public string LAST_NAME { get; set; }
        public string PATRONYMIC_NAME { get; set; }
        public string FULL_NAME { get; set; }
        public bool IS_FOUNDER { get; set; }
        public bool IS_LEGAL { get; set; }
        public DateTime? JOIN_DATE { get; set; }
        public DateTime? LEAVE_DATE { get; set; }
    }
}
