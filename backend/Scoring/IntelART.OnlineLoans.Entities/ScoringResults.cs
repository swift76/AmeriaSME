namespace IntelART.OnlineLoans.Entities
{
    public class ScoringResults
    {
        public decimal APPROVED_AMOUNT_1  { get; set; }
        public decimal APPROVED_AMOUNT_2  { get; set; }
        public decimal REFINANCING_AMOUNT { get; set; }
        public decimal INTEREST           { get; set; }
        public byte TERM_FROM             { get; set; }
        public byte TERM_TO               { get; set; }
        public string TEMPLATE_CODE       { get; set; }
        public string TEMPLATE_NAME       { get; set; }
    }
}
