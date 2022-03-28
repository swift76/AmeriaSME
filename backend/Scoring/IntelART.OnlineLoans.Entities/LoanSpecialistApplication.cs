namespace IntelART.OnlineLoans.Entities
{
    public class LoanSpecialistApplication : Application
    {
        public string LOAN_SPECIALIST_NAME { get; set; }
        public string COMPANY_NAME         { get; set; }
        public int TERM_DAYS               { get; set; } // TODO: find better name for the property
        public bool IS_AVAILABLE           { get; set; }
        public string MANUAL_REASON        { get; set; }
    }
}
