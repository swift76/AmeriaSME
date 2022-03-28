namespace IntelART.OnlineLoans.Entities
{
    /// <summary>
    /// The main application for the loan
    /// It contain all the info from the applicatin metadata, thus inheriting it
    /// </summary>
    public class MainApplication : Application
    {
        public byte REPAYMENT_DAY             { get; set; }
        public decimal FINAL_AMOUNT           { get; set; }
        public decimal INTEREST               { get; set; }
        public string CURRENCY_CODE           { get; set; }
        public string LOAN_TERM               { get; set; }
        public bool IS_REFINANCING            { get; set; }
        public string LOAN_TEMPLATE_CODE      { get; set; }
        public string OVERDRAFT_TEMPLATE_CODE { get; set; }
    }
}
