using Microsoft.AspNetCore.Mvc;

namespace IntelART.OnlineLoans.LoanApplicationRestApi.Controllers
{
    public abstract class ControllerBase : Controller
    {
        private static string DefaultLanguageCode = "am";
        protected string GetLanguageCode()
        {
            string result;
            if (HttpContext != null && HttpContext.Request.Query.ContainsKey("lang"))
            {
                result = HttpContext.Request.Query["lang"].ToString().ToLower();
            }
            else
            {
                result = DefaultLanguageCode;
            }
            return result;
        }

        protected int CurrentUserID
        {
            get
            {
                return int.Parse(HttpContext.User.FindFirst("sub").Value);
            }
        }

        protected bool IsLoanSpecialist
        {
            get
            {
                return HttpContext.User.IsInRole("LoanSpecialist");
            }
        }
    }
}
