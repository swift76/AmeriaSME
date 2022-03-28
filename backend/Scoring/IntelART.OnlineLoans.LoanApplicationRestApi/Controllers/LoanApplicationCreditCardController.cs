using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using IntelART.OnlineLoans.Entities;
using IntelART.OnlineLoans.Repositories;
using IntelART.Communication;

namespace IntelART.OnlineLoans.LoanApplicationRestApi.Controllers
{
    /// <summary>
    /// Controller class to implement the API methods required
    /// for customers' credit card authorization
    /// </summary>
    [Authorize]
    [Route("/Applications/{id}")]
    public class LoanApplicationCreditCardController : RepositoryControllerBase<ApplicationRepository>
    {
        private ISmsSender smsSender;

        public LoanApplicationCreditCardController(IConfigurationRoot configuration, ISmsSender smsSender)
            : base(configuration, (connectionString) => new ApplicationRepository(connectionString))
        {
            this.smsSender = smsSender;
        }

        /// <summary>
        /// Gets the list of active cards
        /// </summary>
        [HttpGet("ClientActiveCards")]
        public async Task<IEnumerable<ClientActiveCard>> GetClientActiveCards(Guid id)
        {
            ClientDataForCardValidation clientData = await Repository.GetClientDataForCardValidation(id);
            IEnumerable<ClientActiveCard> cards = await Repository.GetClientActiveCards(clientData.CLIENT_CODE, clientData.LOAN_TYPE_ID, clientData.CURRENCY_CODE);
            return cards;
        }
    }
}
