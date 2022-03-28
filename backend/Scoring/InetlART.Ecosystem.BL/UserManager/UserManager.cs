using IntelART.Ameria.Communication;
using IntelART.IdentityManagement;
using IntelART.OnlineLoans.Entities.Ecosystem;
using IntelART.OnlineLoans.Repositories;
using IntelART.OnlineLoans.SqlMembershipProvider;
using System;
using System.Threading.Tasks;

namespace InetlART.Ecosystem.BL.UserManager
{
    public class UserManager
    {
        private EcosystemUserRepository _ecosystemUserRepository;
        private UserRepository _userRepository;
        private IMembershipProvider _membershipProvider;
        private AmeriaDbEmailSender _ameriaDbEmailSender;
        public UserManager(EcosystemUserRepository ecosystemUserRepository, UserRepository userRepository, SqlMembershipProvider membershipProvider, AmeriaDbEmailSender ameriaDbEmailSender)
        {
            _ecosystemUserRepository = ecosystemUserRepository;
            _userRepository = userRepository;
            _membershipProvider = membershipProvider;
            _ameriaDbEmailSender = ameriaDbEmailSender;
        }

        public ApiResponse<string> RegisterUser(EcosystemUserRegistration ecosystemUserRegistration)
        {
            ApiResponse<string> result = new ApiResponse<string>();
            result.Message = new ResponseMessage();

            if (!ecosystemUserRegistration.IsApproved)
            {
                result.Success = false;
                result.Message.arm = "Խնդրում ենք հաստատել պայմանները";
                result.Message.eng = "Please confirm the terms and conditions";

                return result;
            }

            if (!Helpers.Helpers.IsValidEmail(ecosystemUserRegistration.Email))
            {
                result.Success = false;
                result.Message.arm = "Սխալ էլ. փոստ";
                result.Message.eng = "Incorrect email";

                return result;
            }

            if (ecosystemUserRegistration.Password != ecosystemUserRegistration.ConfirmPassword)
            {
                result.Success = false;
                result.Message.arm = "Գաղտնաբառի հաստատումը չի համընկնում";
                result.Message.eng = "Password confirmation does not match";

                return result;
            }

            if (!Helpers.Helpers.CheckPasswordCriteria(ecosystemUserRegistration.Password))
            {
                result.Success = false;
                result.Message.arm = "Գաղտնաբառը պետք է լինի լատինատառ, պարունակի առնվազն ութ նիշ, մեկ մեծատառ, մեկ փոքրատառ և մեկ թվանշան";
                result.Message.eng = "Inccorect password";

                return result;
            }

            if (_userRepository.CheckUserExistenceByParameter("EMAIL", ecosystemUserRegistration.Email, null))
            {
                result.Success = false;
                result.Message.arm = "Տվյալ էլ. փոստով օգտատեր արդեն գոյություն ունի";
                result.Message.eng = "User with such email already exists";

                return result;
            }

            _ecosystemUserRepository.RegisterEcosystemUser(ecosystemUserRegistration);
            result.Success = true;
            result.Message = null;

            return result;
        }

        public ApiResponse<string> ConfirmEcosystemUser(Guid token)
        {
            ApiResponse<string> result = new ApiResponse<string>();

            _ecosystemUserRepository.ConfirmEcosystemUser(token);

            result.Success = true;

            return result;
        }

        public async Task<ApiResponse<string>> ForgotPassword(ForgotPassword request, string forgotPasswordUrl)
        {
            ApiResponse<string> result = new ApiResponse<string>();
            result.Message = new ResponseMessage();

            UserInfo user = _membershipProvider.GetUserByUsername(request.Username);

            if (user == null)
            {
                result.Success = false;
                result.Message.arm = "Օգտատերը չի գտնվել";
                result.Message.eng = "User not found";

                return result;
            }

            string token = Guid.NewGuid().ToString("N");
            _membershipProvider.ChangeUserPassword(user.Id.ToString(), "", token);

            string link = forgotPasswordUrl + "?token=" + token + "&userName=" + request.Username;

            EcosystemUser ecosystemUser = _ecosystemUserRepository.GetEcosystemUser(user.Id);

            string body = "SME գաղտնաբառի վերականգնում";
            string subject = "<div>" +
                                "<p> Եթե օգտատերը մոռացել է Համակարգ մուտք գործելու իր գաղտնաբառը, պետք է հնարավորություն նախատեսել այն փոխելու հետևյալ կերպ. Օգտատերը մուտքագրում է իր username - ը Մուտքագրված " + request.Username + "-ին(էլ.հասցեին) ուղարկվում է<a href= '" + link + "' > link </a>, որը  պետք է ակտիվ լինի 1 ժամվա ընթացքում Համապատասխան link-ով օգտատերը տեղափոխվում է նոր գաղտնաբառը սահմանելու և վերահաստատելու էջ, որից հետո պետք է redirect լինի Log-in էջ SME գաղտնաբառի վերականգնում</p> " +
                                "<p> Հարգելի " + ecosystemUser.FIRST_NAME_EN + " " + ecosystemUser.LAST_NAME_EN + ", Բանկը ստացել է «Մոռացել եմ գաղտնաբառը» հարցումը SME համար: SME համակարգում գաղտնաբառի վերականգնման համար խնդրում ենք անցնել <a href = 'https://www.ameriabank.am/' > հղումով </a> </p> " +
                                "<p> Եթե հարցում կատարողը Դուք չեք, խնդրում ենք կապ հաստատել մեզ հետ՝ +374 10 561111</p></br>" +
                                "<p>Շնորհակալություն, Ձեր Ամերիաբանկ </p></br>" +
                                "<p>Դուք կարող եք զանգահարել 24/7 Կոնտակտ կենտրոն՝ +374 10 561111, ինչպես նաև ծանոթանալ Ամերիաբանկ ՓԲԸ կողմից տրամադրվող <a href = 'https://ameriabank.am/userfiles/file/Terms_and_Conditions_LP_arm_16_05_2016.pdf'> ծառայություններին </a> և <a href = 'https://ameriabank.am/userfiles/file/Corporate_Tariffs.pdf'> սակագներին </a></p>" +
                            "</div>";

            await _ameriaDbEmailSender.SendAsync(new IntelART.Communication.EmailAddress(user.Username), subject, body);

            result.Success = true;
            result.Message = null;

            return result;
        }

        public ApiResponse<string> ForgotPasswordConfirm(ForgotPasswordConfirm request)
        {
            ApiResponse<string> result = new ApiResponse<string>();
            result.Message = new ResponseMessage();

            if (!_membershipProvider.ValidatePassword(request.Username, request.PasswordChangeRequestToken))
            {
                result.Success = false;
                result.Message.arm = "Անվավեր հարցում";
                result.Message.eng = "Invalid request";

                return result;
            }

            if (!Helpers.Helpers.CheckPasswordCriteria(request.NewPassword))
            {
                result.Success = false;
                result.Message.arm = "Գաղտնաբառը պետք է լինի լատինատառ, պարունակի առնվազն ութ նիշ, մեկ մեծատառ, մեկ փոքրատառ և մեկ թվանշան";
                result.Message.eng = "Inccorect password";

                return result;
            }

            if (request.NewPassword != request.ConfirmNewPassword)
            {
                result.Success = false;
                result.Message.arm = "Գաղտնաբառի հաստատումը չի համընկնում";
                result.Message.eng = "Password confirmation does not match";

                return result;
            }

            UserInfo user = _membershipProvider.GetUserByUsername(request.Username);
            if (user == null)
            {
                result.Success = false;
                result.Message.arm = "Անհայտ օգտվող";
                result.Message.eng = "Unknown user";

                return result;
            }

            _membershipProvider.ChangeUserPassword(user.Id.ToString(), request.PasswordChangeRequestToken, request.NewPassword);

            result.Success = true;
            result.Message = null;

            return result;
        }
    }
}