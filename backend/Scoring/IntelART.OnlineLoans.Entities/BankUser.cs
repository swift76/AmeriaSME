namespace IntelART.OnlineLoans.Entities
{
    public class BankUser : ApplicationUser
    {
        public string FIRST_NAME_AM   { get; set; }
        public string LAST_NAME_AM    { get; set; }
        public bool? IS_ADMINISTRATOR { get; set; }
    }
}
