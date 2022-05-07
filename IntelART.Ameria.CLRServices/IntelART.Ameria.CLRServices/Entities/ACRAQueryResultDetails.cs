using System;

namespace IntelART.Ameria.CLRServices
{
    public class ACRAQueryResultDetails
    {
        public string STATUS { get; set; }
        public DateTime FROM_DATE { get; set; }
        public DateTime TO_DATE { get; set; }
        public string TYPE { get; set; }
        public string CUR { get; set; }
        public decimal CONTRACT_AMOUNT { get; set; }
        public decimal DEBT { get; set; }
        public DateTime? PAST_DUE_DATE { get; set; }
        public string RISK { get; set; }
        public DateTime? CLASSIFICATION_DATE { get; set; }
        public decimal INTEREST_RATE { get; set; }
        public string PLEDGE { get; set; }
        public string PLEDGE_AMOUNT { get; set; }
        public decimal OUTSTANDING_AMOUNT { get; set; }
        public decimal OUTSTANDING_PERCENT { get; set; }
        public string BANK_NAME { get; set; }
        public bool IS_GUARANTEE { get; set; }
        public int DUE_DAYS_1 { get; set; }
        public int DUE_DAYS_2 { get; set; }
        public int DUE_DAYS_3 { get; set; }
        public int DUE_DAYS_4 { get; set; }
        public bool IS_CREDIT_LINE { get; set; }
        public bool IS_IGNORED_LOAN { get; set; }
        public int DUE_DAYS_M1 { get; set; }
        public int DUE_DAYS_M2 { get; set; }
        public int DUE_DAYS_M3 { get; set; }
        public string SCOPE { get; set; }
        public int DUE_DAYS_MAX_Y1 { get; set; }
        public int DUE_DAYS_MAX_Y2 { get; set; }
        public string LOAN_ID { get; set; }
        public DateTime? CREDITING_DATE { get; set; }
        public string CREDIT_USE_PLACE { get; set; }
        public string PLEDGE_NOTES { get; set; }
        public string PLEDGE_CURRENCY { get; set; }
        public DateTime? LAST_PAYMENT_DATE { get; set; }
        public decimal OVERDUE_MAIN_AMOUNT { get; set; }
        public decimal OVERDUE_INTEREST_AMOUNT { get; set; }
        public int PROLONGATION_COUNT { get; set; }
        public string WORST_CLASS_Y1 { get; set; }
        public string WORST_CLASS_Y2 { get; set; }
        public string WORST_CLASS_Y3_Y5 { get; set; }
        public int SUM_OVERDUE_DAYS_Y1_Y2 { get; set; }
        public int MAX_OVERDUE_DAYS_Y1_Y2 { get; set; }
        public int SUM_OVERDUE_DAYS_Y1_Y5 { get; set; }
        public int MAX_OVERDUE_DAYS_Y1_Y5 { get; set; }
        public int OVERDUE_DAYS { get; set; }
        public DateTime? INCOMING_DATE { get; set; }
        public int DELAYED_PAYMENT_COUNT { get; set; }
        public decimal PROVISION_AMOUNT { get; set; }
    }
}
