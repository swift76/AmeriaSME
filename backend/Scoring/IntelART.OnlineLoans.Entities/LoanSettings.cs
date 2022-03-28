namespace IntelART.OnlineLoans.Entities
{
    public class LoanSettings
    {
        public int REPEAT_COUNT       { get; set; }
        public byte REPEAT_DAY_COUNT  { get; set; }
        public byte EXPIRE_DAY_COUNT  { get; set; }
        public byte CONTACT_DAY_COUNT { get; set; }
        public byte LS_EXPIRE_DAY_COUNT { get; set; }
    }
}
