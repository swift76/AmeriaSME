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
    /// and updating refinancing loan table for customer applications
    /// </summary>
    [Authorize]
    [Route("/RefinancingLoan/{id}")]
    public class RefinancingLoanController : RepositoryControllerBase<ApplicationRepository>
    {
        public RefinancingLoanController(IConfigurationRoot configuration)
            : base(configuration, (connectionString) => new ApplicationRepository(connectionString))
        {
        }

        /// <summary>
        /// Implements GET /RefinancingLoan/{id}
        /// For the given application id returns the loans eligible for refinancing
        /// </summary>
        [HttpGet]
        public async Task<IEnumerable<RefinancingLoan>> Get(Guid id)
        {
            IEnumerable<RefinancingLoan> refinancingLoans = await Repository.GetRefinancingLoans(id);
            return refinancingLoans;
        }

        /// <summary>
        /// Implements POST /RefinancingLoan/{id}
        /// Updates refinancing loans
        /// </summary>
        [HttpPost]
        public void Post(Guid id, [FromBody]IEnumerable<RefinancingLoan> refinancingLoans)
        {
            if (refinancingLoans == null)
            {
                throw new ApplicationException("ERR-5888", "Վերաֆինանսավորման ենթակա վարկեր չկան");
            }

            Repository.UpdateRefinancingLoans(id, refinancingLoans);
        }
    }
}