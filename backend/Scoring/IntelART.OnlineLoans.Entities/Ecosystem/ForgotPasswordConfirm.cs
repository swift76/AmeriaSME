using System;
using System.Collections.Generic;
using System.Text;

namespace IntelART.OnlineLoans.Entities.Ecosystem
{
    public class ForgotPasswordConfirm
    {
        public string Username { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmNewPassword { get; set; }
        public string PasswordChangeRequestToken { get; set; }
    }
}