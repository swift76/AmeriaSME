using IntelART.OnlineLoans.Entities;
using IntelART.OnlineLoans.Repositories;
using IntelART.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IntelART.OnlineLoans.LoanApplicationRestApi.Controllers
{
    /// <summary>
    /// Controller class to implement the API methods required
    /// for customers' ID card authentication
    /// </summary>
    [Authorize]
    [Route("/Applications/{id}/IdCard")]
    public class LoanApplicationIdCardController : RepositoryControllerBase<ApplicationRepository>
    {
        private IConfigurationSection ekengConfiguration;

        public LoanApplicationIdCardController(IConfigurationRoot configuration)
          : base(configuration, (connectionString) => new ApplicationRepository(connectionString))
        {
            this.ekengConfiguration = configuration.GetSection("Ekeng");
        }

        [HttpPost]
        public async Task Post(Guid id, [FromBody]UserEkengData data)
        {
            string strUserData = OpenSSLCrypto.Decrypt(data.EncryptedData, this.ekengConfiguration["Code"], this.ekengConfiguration["IV"]);

            strUserData = System.Text.RegularExpressions.Regex.Unescape(strUserData);
            //Ekeng returns some strange characters after JSON. Here we'll remove them to allow JSON deserialization
            int firstIndex = strUserData.IndexOf("{");
            int lastIndex = strUserData.IndexOf("}");
            strUserData = strUserData.Substring(firstIndex, lastIndex - firstIndex + 1);
            Dictionary<string, string> userData = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, string>>(strUserData);

            UserRepository repo = new UserRepository(Repository.ConnectionString);
            User user = repo.GetUser(this.CurrentUserID);
            if (user != null && userData != null && userData.ContainsKey("SSN")
                && string.Equals(user.SOCIAL_CARD_NUMBER, userData["SSN"], StringComparison.CurrentCultureIgnoreCase))
            {
                await Repository.ApproveApplication(id);
            }
            else
            {
                throw new ApplicationException("ERR-5111", "ID քարտի Հանրային Ծառայությունների համարանիշը չի համնկնում օգտագործողի Հանրային Ծառայությունների համարանիշի հետ");
            }
        }
    }
}