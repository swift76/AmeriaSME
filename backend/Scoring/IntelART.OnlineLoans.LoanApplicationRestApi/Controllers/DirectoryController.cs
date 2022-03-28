using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using IntelART.OnlineLoans.Entities;
using IntelART.OnlineLoans.Repositories;
using System.Linq;

namespace IntelART.OnlineLoans.LoanApplicationRestApi.Controllers
{
    /// <summary>
    /// Controller class to implement the API methods required for retrieving
    /// different lookup sets
    /// </summary>
    [Authorize]
    [Route("/Directory")]
    public class DirectoryController : RepositoryControllerBase<DirectoryRepository>
    {
        public DirectoryController(IConfigurationRoot Configuration)
            : base(Configuration, (connectionString)=>new DirectoryRepository(connectionString))
        {
        }

        /// <summary>
        /// Gets the list of countries
        /// </summary>
        [HttpGet("Countries")]
        public async Task<IEnumerable<DirectoryEntity>> GetCountries()
        {
            IEnumerable<DirectoryEntity> countries = await Repository.GetCountries(this.languageCode);
            return countries;
        }

        /// <summary>
        /// Gets the list of countries
        /// </summary>
        [HttpGet("AddressCountries")]
        public async Task<IEnumerable<DirectoryEntity>> GetAddressCountries()
        {
            IEnumerable<DirectoryEntity> countries = await Repository.GetAddressCountries(this.languageCode);
            return countries;
        }

        /// <summary>
        /// Gets the list of states
        /// </summary>
        [HttpGet("States")]
        public async Task<IEnumerable<DirectoryEntity>> GetStates()
        {
            IEnumerable<DirectoryEntity> states = await Repository.GetStates(this.languageCode);
            return states;
        }

        /// <summary>
        /// Gets the list of cities for a given state
        /// </summary>
        /// <param name="stateCode">The code of the state</param>
        /// <returns></returns>
        [HttpGet("States/{stateCode}/Cities")]
        public async Task<IEnumerable<DirectoryEntity>> GetCitiesForState(string stateCode)
        {
            IEnumerable<DirectoryEntity> cities = await Repository.GetCities(this.languageCode, stateCode);
            return cities;
        }

        /// <summary>
        /// Gets the list of possible loan types /non loan specialist/
        /// </summary>
        [HttpGet("LoanTypes")]
        public async Task<IEnumerable<LoanType>> GetLoanTypes()
        {
            IEnumerable<LoanType> loanTypes = await Repository.GetLoanTypes(this.languageCode);
            return loanTypes;
        }

        /// <summary>
        /// Gets the list of possible loan types /to be created by loan specialists only/
        /// </summary>
        [HttpGet("LSLoanTypes")]
        public async Task<IEnumerable<LoanType>> GetLSLoanTypes()
        {
            IEnumerable<LoanType> loanTypes = await Repository.GetLSLoanTypes(this.languageCode);
            return loanTypes;
        }

        /// <summary>
        /// Gets the list of possible currency types
        /// </summary>
        [HttpGet("Currencies/{loanType}")]
        public async Task<IEnumerable<DirectoryEntity>> GetCurrencies(string loanType)
        {
            IEnumerable<DirectoryEntity> currencies = Enumerable.Empty<DirectoryEntity>();
            if (loanType != "null")
            {
                currencies = await Repository.GetLoanCurrencies(loanType, this.languageCode);
            }
            return currencies;
        }

        /// <summary>
        /// Implements GET /LoanTerms?isOverdraft={isOverdraft}&termFrom={termFrom}&termTo={termTo}
        /// Gets the list of loan terms
        /// </summary>
        [HttpGet("LoanTerms/{isOverdraft}/{termFrom}/{termTo}")]
        public IEnumerable<DirectoryEntity> GetLoanTerms(bool isOverdraft, int termFrom, int termTo)
        {
            IEnumerable<DirectoryEntity> loanTerms = Repository.GetLoanTerms(this.languageCode, isOverdraft, termFrom, termTo);
            return loanTerms;
        }

        /// <summary>
        /// Gets the list of possible options to receive branches of the bank
        /// </summary>
        [HttpGet("BankBranches")]
        public async Task<IEnumerable<DirectoryEntity>> GetBankBranches()
        {
            IEnumerable<DirectoryEntity> bankBranches = await Repository.GetBankBranches(this.languageCode);
            return bankBranches;
        }

        /// <summary>
        /// Gets the list of possible types of credit cards
        /// </summary>
        [HttpGet("CreditCardTypes/{loanType}/{currency}")]
        public async Task<IEnumerable<DirectoryEntity>> GetCreditCardTypes(string loanType, string currency)
        {
            IEnumerable<DirectoryEntity> creditCardTypes = await Repository.GetCreditCardTypes(this.languageCode, loanType, currency);
            return creditCardTypes;
        }

        /// <summary>
        /// Gets the list of possible appraisal companies
        /// </summary>
        [HttpGet("AppraisalCompanies")]
        public async Task<IEnumerable<DirectoryEntity>> GetAppraisalCompanies()
        {
            IEnumerable<DirectoryEntity> appraisalCompanies = await Repository.GetAppraisalCompanies(this.languageCode);
            return appraisalCompanies;
        }

        /// <summary>
        /// Gets the list of possible purposes of loan
        /// </summary>
        [HttpGet("LoanPurposes")]
        public async Task<IEnumerable<DirectoryEntity>> GetLoanPurposes()
        {
            IEnumerable<DirectoryEntity> loanPurposes = await Repository.GetLoanPurposes(this.languageCode);
            return loanPurposes;
        }

        /// <summary>
        /// Gets the list of possible loan repayment forms
        /// </summary>
        [HttpGet("LoanRepaymentForms")]
        public async Task<IEnumerable<DirectoryEntity>> GetLoanRepaymentForms()
        {
            IEnumerable<DirectoryEntity> loanRepaymentForms = await Repository.GetLoanRepaymentForms(this.languageCode);
            return loanRepaymentForms;
        }

        /// <summary>
        /// Gets the list of possible pledge types
        /// </summary>
        [HttpGet("PledgeTypes")]
        public async Task<IEnumerable<DirectoryEntity>> GetPledgeTypes()
        {
            IEnumerable<DirectoryEntity> pledgeTypes = await Repository.GetPledgeTypes(this.languageCode);
            return pledgeTypes;
        }

        /// <summary>
        /// Gets the list of possible activities
        /// </summary>
        [HttpGet("Activities")]
        public async Task<IEnumerable<DirectoryEntity>> GetActivities()
        {
            IEnumerable<DirectoryEntity> industries = await Repository.GetActivities(this.languageCode);
            return industries;
        }

        /// <summary>
        /// Gets the list of factual industries
        /// </summary>
        [HttpGet("FactualIndustries")]
        public async Task<IEnumerable<DirectoryEntity>> GetFactualIndustries()
        {
            IEnumerable<DirectoryEntity> industries = await Repository.GetFactualIndustries(this.languageCode);
            return industries;
        }

        /// <summary>
        /// Gets the list of reasons for cancellation
        /// </summary>
        [HttpGet("CancellationReasons")]
        public async Task<IEnumerable<DirectoryEntity>> GetCancellationReasons()
        {
            IEnumerable<DirectoryEntity> reasons = await Repository.GetCancellationReasons(this.languageCode);
            return reasons;
        }

        #region Loan Specialist directories

        /// <summary>
        /// Gets the list of business states of the company
        /// </summary>
        [HttpGet("BusinessStateTypes")]
        public async Task<IEnumerable<DirectoryEntity>> GetBusinessStateTypes(Guid id)
        {
            IEnumerable<DirectoryEntity> businessStates = await Repository.GetBusinessStateTypes(this.languageCode);
            return businessStates;
        }

        /// <summary>
        /// Gets the list of possible insurance companies
        /// </summary>
        [HttpGet("InsuranceCompanies")]
        public async Task<IEnumerable<DirectoryEntity>> GetInsuranceCompanies()
        {
            IEnumerable<DirectoryEntity> insuranceCompanies = await Repository.GetInsuranceCompanies(this.languageCode);
            return insuranceCompanies;
        }

        #endregion
    }
}
