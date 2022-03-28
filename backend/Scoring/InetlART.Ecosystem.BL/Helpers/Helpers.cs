using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace InetlART.Ecosystem.BL.Helpers
{
    public static class Helpers
    {
        public static bool CheckPasswordCriteria(string password)
        {
            Regex hasNumber = new Regex(@"[0-9]+");
            Regex hasUpperChar = new Regex(@"[A-Z]+");
            Regex hasLowerChar = new Regex(@"[a-z]+");
            Regex hasMinimum8CharsAndMaximum30Chars = new Regex(@".{8,30}");

            return (hasNumber.IsMatch(password) &&
                    hasUpperChar.IsMatch(password) &&
                    hasLowerChar.IsMatch(password) &&
                    hasMinimum8CharsAndMaximum30Chars.IsMatch(password));
        }

        public static bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }
    }
}