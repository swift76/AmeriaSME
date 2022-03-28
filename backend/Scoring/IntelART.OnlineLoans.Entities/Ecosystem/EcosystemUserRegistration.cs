using System;
using System.Collections.Generic;
using System.Text;

namespace IntelART.OnlineLoans.Entities.Ecosystem
{
    public class EcosystemUserRegistration
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
        public bool IsApproved { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}