using System;

namespace IntelART.OnlineLoans.Entities
{
    public class UserRegistration : User
    {
        public Guid PROCESS_ID          { get; set; }
        public string VERIFICATION_CODE { get; set; }
        public int TRY_COUNT { get; set; }
        public int SMS_COUNT { get; set; }
    }
}
