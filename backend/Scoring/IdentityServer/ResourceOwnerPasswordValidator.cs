using System.Threading.Tasks;
using IdentityServer4.Models;
using IdentityServer4.Validation;
using IntelART.IdentityManagement;
using Microsoft.AspNetCore.Http;

namespace IntelART.IdentityServer
{
    public class ResourceOwnerPasswordValidator : IResourceOwnerPasswordValidator
    {
        private IUserStore userStore;
        private readonly IHttpContextAccessor httpContextAccessor;
        public ResourceOwnerPasswordValidator(IUserStore userStore, IHttpContextAccessor httpContextAccessor)
        {
            this.userStore = userStore;
            this.httpContextAccessor = httpContextAccessor;
        }

        public async Task ValidateAsync(ResourceOwnerPasswordValidationContext context)
        {
            byte roleId;
            if (context.Request.Client.ClientId == "shopApplication2")
                roleId = 2;
            else if (context.Request.Client.ClientId == "ecosystemOnBoarding")
                roleId = 4;
            else
                roleId = 3;
            if (!this.userStore.ValidatePassword(context.UserName, context.Password, roleId))
            {
                if (this.userStore.ValidateUserExistence(context.UserName))
                {
                    context.Result = new GrantValidationResult(TokenRequestErrors.UnauthorizedClient, "Սխալ օգտատեր կամ գաղտնաբառ։");
                }
                else
                {
                    context.Result = new GrantValidationResult(TokenRequestErrors.UnauthorizedClient, "Նման տվյալներով օգտատեր առկա չէ։ Խնդրում ենք փորձել նորից կամ գրանցել օգտատեր։");
                }
            }
            else
            {
                UserInfo user = this.userStore.GetUserByUsername(context.UserName);
                context.Result = new GrantValidationResult(user.Id.ToString(), "custom");
            }
        }
    }
}
