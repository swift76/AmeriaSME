namespace IntelART.OnlineLoans.Entities
{
    /// <summary>
    /// The manual application for the loan
    /// It contain all the info from the applicatin metadata, thus inheriting it
    /// </summary>
    public class ManualApplication : Application
    {
        public string LOAN_TERM                { get; set; }
        public decimal INTEREST                { get; set; }
        public string LOAN_REPAYMENT_FORM_CODE { get; set; }
        public string LOAN_PURPOSE_CODE        { get; set; }
        public byte? GRACE_PERIOD              { get; set; }
        public byte? REPAYMENT_DAY             { get; set; }
        public decimal? INVENTORY_BALANCE      { get; set; }
        public decimal? DEBTORS_BALANCE        { get; set; }
        public decimal? CREDITORS_BALANCE      { get; set; }
        public decimal? MONTHLY_EARNING        { get; set; }
        public decimal? MONTHLY_COST           { get; set; }
        public decimal? MONTHLY_NET_INCOME     { get; set; }
        public string PLEDGE_TYPE_CODE         { get; set; }
        public string APPRAISAL_COMPANY_CODE   { get; set; }
        public string BANK_BRANCH_CODE         { get; set; }
    }
}
