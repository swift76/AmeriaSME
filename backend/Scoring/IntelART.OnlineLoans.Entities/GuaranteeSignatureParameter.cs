namespace IntelART.OnlineLoans.Entities
{
    public class GuaranteeSignatureParameter
    {
        public string NAME             { get; set; }
        public string TYPE             { get; set; }
        public string FIRST_NAME       { get; set; }
        public string LAST_NAME        { get; set; }
        public string PATRONYMIC_NAME  { get; set; }
        public decimal APPROVED_AMOUNT { get; set; }
        public string CURRENCY_NAME    { get; set; }
    }
}
