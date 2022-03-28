namespace IntelART.OnlineLoans.Entities
{
    public class ApplicationPreapprovedResult
    {
        public byte ID                         { get; set; }
        public bool IS_REFINANCING             { get; set; }
        public decimal APPROVED_AMOUNT         { get; set; }
        public decimal INTEREST                { get; set; }
        public byte LOAN_TERM                  { get; set; }
        public decimal REQUIRED_REAL_ESTATE    { get; set; }
        public decimal REQUIRED_MOVABLE_ESTATE { get; set; }
        public decimal MONTHLY_PAYMENT_AMOUNT { get; set; }
    }
}
