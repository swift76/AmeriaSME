using System.ComponentModel.DataAnnotations;

namespace IntelART.OnlineLoans.CustomerModuleWebApp.Controllers.Authentication
{
    public class RegisterModel
    {
        [Required(ErrorMessage = "Իրավաբանական անձի / ԱՁ-ի անվանումը պարտադիր է:")]
        public string CompanyName { get; set; }

        [Required(ErrorMessage = "ՀՎՀՀ / հարկ վճարողի հաշվառման համարը պարտադիր է:")]
        [RegularExpression("^(\\d){8}$", ErrorMessage = "Նման ՀՎՀՀ / հարկ վճարողի հաշվառման համար գոյություն չունի։")]
        public string TaxIdNumber { get; set; }

        [Required(ErrorMessage = "Բջջային հեռախոսահամարը պարտադիր է:")]
        [RegularExpression("^[ ]*(\\d\\s*){8}$", ErrorMessage = "Նման բջջային հեռախոսահամար գոյություն չունի։")]
        public string MobilePhone { get; set; }

        [Required(ErrorMessage = "Էլեկտրոնային հասցեն պարտադիր է:")]
        [RegularExpression("^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,7})+$", ErrorMessage = "Նման էլեկտրոնային հասցե գոյություն չունի։")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Գաղտնաբառը պարտադիր է:")]
        [RegularExpression("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\da-zA-Z]).{8,}$", ErrorMessage = "Գաղտնաբառը պետք է լինի լատինատառ, պարունակի առնվազն ութ նիշ, մեկ մեծատառ, մեկ փոքրատառ և մեկ թվանշան:")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Գաղտնաբառի կրկնությունը պարտադիր է:")]
        [Compare("Password", ErrorMessage = "Մուտքագրված գաղտնաբառերի անհամապատասխանություն։")]
        public string ConfirmPassword { get; set; }

        [Required]
        [Range(typeof(bool), "true", "true", ErrorMessage = "Պայմաններին և կանոններին Ձեր համաձայնությունը պարտադիր է:")]
        public bool AcceptedTermsAndConditions { get; set; }

        public bool IsActive { get; set; }
    }
}
