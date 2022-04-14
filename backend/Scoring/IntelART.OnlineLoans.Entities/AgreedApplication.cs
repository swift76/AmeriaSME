namespace IntelART.OnlineLoans.Entities
{
    /// <summary>
    /// The agreed application for the loan
    /// It contain all the info from the applicatin metadata, thus inheriting it
    /// </summary>
    public class AgreedApplication : Application
    {
        public string EXISTING_CARD_CODE                        { get; set; }
        public bool IS_NEW_CARD                                 { get; set; }
        public string CREDIT_CARD_TYPE_CODE                     { get; set; }
        public bool IS_CARD_DELIVERY                            { get; set; }
        public string CARD_DELIVERY_ADDRESS                     { get; set; }
        public string BANK_BRANCH_CODE                          { get; set; }
        public bool AGREED_WITH_TERMS                           { get; set; }
        public bool IS_INTERNET_BANK_CHECKED                    { get; set; }
        public bool IS_ARBITRAGE_CHECKED                        { get; set; }
        public string GUARANTEE_SIGNATURE_TEXT                  { get; set; }
        public string GUARANTEE_SIGNATURE_TEXT_TO_BE_ENTERED    { get; set; }
        public string CLIENT_CODE                               { get; set; }
        public decimal? LOAN_INTEREST_2 { get; set; }
        public string LOAN_TEMPLATE_CODE { get; set; }
        public string OVERDRAFT_TEMPLATE_CODE { get; set; }
        public byte REPAYMENT_DAY { get; set; }
        public string CURRENCY_CODE { get; set; }
        public decimal FINAL_AMOUNT { get; set; }
        public string LOAN_TERM { get; set; }
        public decimal INTEREST { get; set; }
    }
}
