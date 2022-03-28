namespace IntelART.OnlineLoans.Entities
{
    public class ApplicationCompanyData
    {
        public string CODE { get; set; }
        public decimal AMOUNT { get; set; }
        public string COMMENT { get; set; }
    }

    public class ApplicationCompanyDataWithName : ApplicationCompanyData
    {
        public string NAME { get; set; }
    }
}
