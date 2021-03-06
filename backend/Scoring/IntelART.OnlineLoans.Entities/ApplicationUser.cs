using System;

namespace IntelART.OnlineLoans.Entities
{
    public class ApplicationUser
    {
        public int? ID               { get; set; }
        public string LOGIN          { get; set; }
        public string PASSWORD       { get; set; }
        public string HASH           { get; set; }
        public string MOBILE_PHONE   { get; set; }
        public string EMAIL          { get; set; }
        public DateTime? CREATE_DATE { get; set; }
        public DateTime? CLOSE_DATE  { get; set; }
        public byte? USER_STATE_ID   { get; set; }
        public DateTime? PASSWORD_EXPIRY_DATE  { get; set; }
        public byte USER_ROLE_ID     { get; set; }
    }
}
