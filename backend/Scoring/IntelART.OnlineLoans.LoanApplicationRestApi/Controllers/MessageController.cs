﻿using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using IntelART.OnlineLoans.Entities;
using IntelART.OnlineLoans.Repositories;
using System.Collections.Generic;

namespace IntelART.OnlineLoans.LoanApplicationRestApi.Controllers
{
    /// <summary>
    /// Controller class to implement the API methods required for getting 
    /// and updating messages for customer applications
    /// </summary>
    [Authorize]
    [Route("/Message/{id}")]
    public class MessageController : RepositoryControllerBase<ApplicationRepository>
    {
        public MessageController(IConfigurationRoot configuration)
            : base(configuration, (connectionString) => new ApplicationRepository(connectionString))
        {
        }

        /// <summary>
        /// Implements GET /Message/{id}
        /// For the given application id returns the messages sent from bank
        /// </summary>
        [HttpGet]
        public async Task<IEnumerable<Message>> Get(Guid id)
        {
            IEnumerable<Message> messages = await this.Repository.GetMessages(id);
            return messages;
        }

        /// <summary>
        /// Implements POST /Message/{id}
        /// Adds one message sent from the client
        /// </summary>
        [HttpPost]
        public void Post(Guid id)
        {
            this.Repository.SendMessage(id);
        }
    }
}