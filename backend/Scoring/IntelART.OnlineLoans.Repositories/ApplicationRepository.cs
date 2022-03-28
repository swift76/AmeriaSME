using System;
using System.Data;
using System.Threading.Tasks;
using Dapper;
using IntelART.OnlineLoans.Entities;
using System.Collections.Generic;

namespace IntelART.OnlineLoans.Repositories
{
    public class ApplicationRepository : BaseRepository
    {
        public ApplicationRepository(string connectionString) : base(connectionString)
        {
        }

        #region Initial Application

        /// <summary>
        /// Create initial application to get scoring results
        /// </summary>
        public async Task<Guid> CreateInitialApplication(InitialApplication application, int customerUserID, bool isLoanSpecialistUser)
        {
            Dictionary<string, string> changes = new Dictionary<string, string>();
            DynamicParameters parameters = new DynamicParameters();

            bool isMandatory = application.IS_SUBMIT;
            bool isCurrentAddressMandatory    = isMandatory && !application.IS_CURRENT_ADDRESS_SAME;
            bool isIndividualAddressMandatory = isMandatory && !application.IS_INDIVIDUAL_ADDRESS_SAME;

            if (isLoanSpecialistUser)
            {
                PrepareParameters(changes, parameters, "TAX_ID_NUMBER", application.TAX_ID_NUMBER, isMandatory);
                PrepareParameters(changes, parameters, "MOBILE_PHONE",  application.MOBILE_PHONE,  isMandatory);
            }

            string userID = isLoanSpecialistUser ? "LOAN_SPECIALIST_ID" : "USER_ID";
            PrepareParameters(changes, parameters, userID,                  customerUserID,                 isMandatory);
            PrepareParameters(changes, parameters, "LOAN_TYPE_ID",          application.LOAN_TYPE_ID,       isMandatory);
            PrepareParameters(changes, parameters, "INITIAL_AMOUNT",        application.INITIAL_AMOUNT,     isMandatory);
            PrepareParameters(changes, parameters, "CURRENCY_CODE",         application.CURRENCY_CODE,      isMandatory);
            PrepareParameters(changes, parameters, "ANNUAL_TURNOVER",       application.ANNUAL_TURNOVER,    isMandatory);
            PrepareParameters(changes, parameters, "COMPANY_NAME",          application.COMPANY_NAME,       isMandatory);
            PrepareParameters(changes, parameters, "FIRST_NAME_EN",         application.FIRST_NAME_EN,      isMandatory);
            PrepareParameters(changes, parameters, "LAST_NAME_EN",          application.LAST_NAME_EN,       isMandatory);
            PrepareParameters(changes, parameters, "SOCIAL_CARD_NUMBER",    application.SOCIAL_CARD_NUMBER, isMandatory);
            PrepareParameters(changes, parameters, "COMPANY_EMAIL",         application.COMPANY_EMAIL);
            PrepareParameters(changes, parameters, "FACEBOOK",              application.FACEBOOK);
            PrepareParameters(changes, parameters, "WEBSITE",               application.WEBSITE);
            PrepareParameters(changes, parameters, "IS_CURRENT_ADDRESS_SAME", application.IS_CURRENT_ADDRESS_SAME, isMandatory);
            PrepareParameters(changes, parameters, "CURRENT_COUNTRY_CODE",  application.CURRENT_COUNTRY_CODE, isCurrentAddressMandatory);
            PrepareParameters(changes, parameters, "CURRENT_STATE_CODE",    application.CURRENT_STATE_CODE,   isCurrentAddressMandatory);
            PrepareParameters(changes, parameters, "CURRENT_CITY_CODE",     application.CURRENT_CITY_CODE,    isCurrentAddressMandatory);
            PrepareParameters(changes, parameters, "CURRENT_STREET",        application.CURRENT_STREET,       isCurrentAddressMandatory);
            PrepareParameters(changes, parameters, "CURRENT_BUILDNUM",      application.CURRENT_BUILDNUM,     isCurrentAddressMandatory);
            PrepareParameters(changes, parameters, "CURRENT_APARTMENT",     application.CURRENT_APARTMENT);
            PrepareParameters(changes, parameters, "IS_INDIVIDUAL_ADDRESS_SAME", application.IS_INDIVIDUAL_ADDRESS_SAME, isMandatory);
            PrepareParameters(changes, parameters, "INDIVIDUAL_COUNTRY_CODE", application.INDIVIDUAL_COUNTRY_CODE, isIndividualAddressMandatory);
            PrepareParameters(changes, parameters, "INDIVIDUAL_STATE_CODE", application.INDIVIDUAL_STATE_CODE,     isIndividualAddressMandatory);
            PrepareParameters(changes, parameters, "INDIVIDUAL_CITY_CODE",  application.INDIVIDUAL_CITY_CODE,      isIndividualAddressMandatory);
            PrepareParameters(changes, parameters, "INDIVIDUAL_STREET",     application.INDIVIDUAL_STREET,         isIndividualAddressMandatory);
            PrepareParameters(changes, parameters, "INDIVIDUAL_BUILDNUM",   application.INDIVIDUAL_BUILDNUM,       isIndividualAddressMandatory);
            PrepareParameters(changes, parameters, "INDIVIDUAL_APARTMENT",  application.INDIVIDUAL_APARTMENT);
            PrepareParameters(changes, parameters, "ACTIVITY_CODE",         application.ACTIVITY_CODE);
            PrepareParameters(changes, parameters, "FACTUAL_INDUSTRY_CODE", application.FACTUAL_INDUSTRY_CODE, isMandatory);

            parameters.Add("OPERATION_DETAILS", GenerateOperationDetailsString(changes));
            parameters.Add("ID", dbType: DbType.Guid, direction: ParameterDirection.InputOutput, value: application.ID);
            parameters.Add("IS_SUBMIT", application.IS_SUBMIT);
            await ExecuteAsync(parameters, "dbo.sp_SaveInitialApplication");
            Guid id = parameters.Get<Guid>("ID");

            if (application.IS_SUBMIT)
            {
                parameters = new DynamicParameters();
                parameters.Add("ID", id);
                parameters.Add("queryTimeout", 180);
                ExecuteAsyncNoWait(parameters, "dbo.sp_ProcessScoringQueriesByID");
            }

            return id;
        }

        public async Task<InitialApplication> GetInitialApplication(Guid id)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("ID", id);
            InitialApplication application = await GetSingleAsync<InitialApplication>(parameters, "dbo.sp_GetInitialApplication");
            this.ApplyMappingSingle(application);
            return application;
        }

        #endregion

        #region Main Application

        /// <summary>
        /// Create main application after getting scoring results
        /// </summary>
        public async Task CreateMainApplication(Guid applicationID, MainApplication application, int customerUserID)
        {
            Dictionary<string, string> changes = new Dictionary<string, string>();
            DynamicParameters parameters = new DynamicParameters();

            PrepareParameters(changes, parameters, "APPLICATION_ID", applicationID,              true);
            PrepareParameters(changes, parameters, "FINAL_AMOUNT",   application.FINAL_AMOUNT,   true);
            PrepareParameters(changes, parameters, "INTEREST",       application.INTEREST,       true);
            PrepareParameters(changes, parameters, "REPAYMENT_DAY",  application.REPAYMENT_DAY,  true);
            PrepareParameters(changes, parameters, "LOAN_TERM",      application.LOAN_TERM,      true);
            PrepareParameters(changes, parameters, "IS_REFINANCING", application.IS_REFINANCING, true);

            bool isLoanOverdraft = this.IsLoanOverdraft(application.LOAN_TYPE_ID);
            if (isLoanOverdraft)
            {
                PrepareParameters(changes, parameters, "OVERDRAFT_TEMPLATE_CODE", application.OVERDRAFT_TEMPLATE_CODE, true);
            }
            else
            {
                PrepareParameters(changes, parameters, "LOAN_TEMPLATE_CODE", application.LOAN_TEMPLATE_CODE, true);
            }

            parameters.Add("OPERATION_DETAILS", GenerateOperationDetailsString(changes));
            parameters.Add("IS_SUBMIT", true);
            await ExecuteAsync(parameters, "dbo.sp_SaveMainApplication");
        }

        public async Task<MainApplication> GetMainApplication(Guid id, int customerUserID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("ID", id);
            MainApplication application = await GetSingleAsync<MainApplication>(parameters, "dbo.sp_GetMainApplication");

            this.ApplyMappingSingle(application);
            return application;
        }

        public async Task<IEnumerable<ScoringResults>> GetApplicationScoringResult(Guid id)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", id);
            return await GetListAsync<ScoringResults>(parameters, "dbo.sp_GetApplicationScoringResultByType");
        }

        public double CalculateMonthlyPaymentAmount(double interest,
                                                    double amount,
                                                    byte duration,
                                                    double serviceInterest,
                                                    double serviceAmount)
        {
            double monthlyPaymentAmount;
            if (duration == 0)
            {
                monthlyPaymentAmount = 0;
            }
            else
            {
                if (interest == 0)
                {
                    monthlyPaymentAmount = amount / duration;
                }
                else
                {
                    double monthlyInterest = interest / 1200;
                    monthlyPaymentAmount = amount * monthlyInterest / (1 - 1 / Math.Pow(1 + monthlyInterest, duration));
                }
            }

            if (serviceAmount > 0)
            {
                amount = serviceAmount;
            }
            else
            {
                amount = amount * serviceInterest / 100;
            }

            monthlyPaymentAmount += amount;
            monthlyPaymentAmount = Math.Ceiling(monthlyPaymentAmount);
            return monthlyPaymentAmount;
        }

        #endregion

        #region Refinancing Loans

        public void UpdateRefinancingLoans(Guid id, IEnumerable<RefinancingLoan> loans)
        {
            DynamicParameters parameters = new DynamicParameters();
            foreach (RefinancingLoan loan in loans)
            {
                parameters.Add("APPLICATION_ID", id);
                parameters.Add("ROW_ID",         loan.ROW_ID);
                parameters.Add("LOAN_CODE",      loan.LOAN_CODE);
                Execute(parameters, "dbo.sp_UpdateRefinancingLoans");
            }
        }

        public async Task<IEnumerable<RefinancingLoan>> GetRefinancingLoans(Guid applicationID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", applicationID);
            IEnumerable<RefinancingLoan> loans = await GetListAsync<RefinancingLoan>(parameters, "dbo.sp_GetRefinancingLoans");
            return loans;
        }

        #endregion

        #region Manual Application

        /// <summary>
        /// Create manual application if no amount has been approved after scoring
        /// </summary>
        public async Task CreateManualApplication(Guid applicationID, ManualApplication application)
        {
            Dictionary<string, string> changes = new Dictionary<string, string>();
            DynamicParameters parameters = new DynamicParameters();
            bool isMandatory = application.IS_SUBMIT;

            PrepareParameters(changes, parameters, "APPLICATION_ID",           applicationID,                        true);
            PrepareParameters(changes, parameters, "LOAN_TERM",                application.LOAN_TERM,                isMandatory);
            PrepareParameters(changes, parameters, "INTEREST",                 application.INTEREST,                 isMandatory);
            PrepareParameters(changes, parameters, "LOAN_REPAYMENT_FORM_CODE", application.LOAN_REPAYMENT_FORM_CODE, isMandatory);
            PrepareParameters(changes, parameters, "LOAN_PURPOSE_CODE",        application.LOAN_PURPOSE_CODE,        isMandatory);
            PrepareParameters(changes, parameters, "GRACE_PERIOD",             application.GRACE_PERIOD);
            PrepareParameters(changes, parameters, "REPAYMENT_DAY",            application.REPAYMENT_DAY,            isMandatory);
            PrepareParameters(changes, parameters, "INVENTORY_BALANCE",        application.INVENTORY_BALANCE,        isMandatory);
            PrepareParameters(changes, parameters, "DEBTORS_BALANCE",          application.DEBTORS_BALANCE,          isMandatory);
            PrepareParameters(changes, parameters, "CREDITORS_BALANCE",        application.CREDITORS_BALANCE,        isMandatory);
            PrepareParameters(changes, parameters, "MONTHLY_EARNING",          application.MONTHLY_EARNING,          isMandatory);
            PrepareParameters(changes, parameters, "MONTHLY_COST",             application.MONTHLY_COST,             isMandatory);
            PrepareParameters(changes, parameters, "MONTHLY_NET_INCOME",       application.MONTHLY_NET_INCOME,       isMandatory);
            PrepareParameters(changes, parameters, "BANK_BRANCH_CODE",         application.BANK_BRANCH_CODE,         isMandatory);

            if (this.IsLoanSecured(application.LOAN_TYPE_ID))
            {
                PrepareParameters(changes, parameters, "PLEDGE_TYPE_CODE",       application.PLEDGE_TYPE_CODE,       isMandatory);
                PrepareParameters(changes, parameters, "APPRAISAL_COMPANY_CODE", application.APPRAISAL_COMPANY_CODE, isMandatory);
            }

            parameters.Add("OPERATION_DETAILS", GenerateOperationDetailsString(changes));
            parameters.Add("IS_SUBMIT", application.IS_SUBMIT);
            await ExecuteAsync(parameters, "dbo.sp_SaveManualApplication");
        }

        public async Task<ManualApplication> GetManualApplication(Guid id)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("ID", id);
            ManualApplication application = await GetSingleAsync<ManualApplication>(parameters, "dbo.sp_GetManualApplication");
            this.ApplyMappingSingle(application);
            return application;
        }

        #endregion

        public async Task ApproveApplication(Guid applicationID)
        {
            await ChangeApplicationStatus(applicationID, 16);
        }

        #region Agreed Application

        /// <summary>
        /// Create agreed application after the customer has been authenticated
        /// </summary>
        public async Task CreateAgreedApplication(Guid applicationID, AgreedApplication application)
        {
            Dictionary<string, string> changes = new Dictionary<string, string>();
            DynamicParameters parameters = new DynamicParameters();
            bool isMandatory = application.IS_SUBMIT;

            PrepareParameters(changes, parameters, "APPLICATION_ID", applicationID, true);
            bool isLoanCardAccount = this.IsLoanCardAccount(application.LOAN_TYPE_ID);
            if (isLoanCardAccount)
            {
                if (application.IS_NEW_CARD)
                {
                    PrepareParameters(changes, parameters, "IS_CARD_DELIVERY",      application.IS_CARD_DELIVERY,      isMandatory);
                    PrepareParameters(changes, parameters, "CREDIT_CARD_TYPE_CODE", application.CREDIT_CARD_TYPE_CODE, isMandatory);

                    // workaround not to save "new card" as checked when actually it is not
                    if (string.IsNullOrEmpty(application.CREDIT_CARD_TYPE_CODE))
                    {
                        PrepareParameters(changes, parameters, "IS_NEW_CARD", false, isMandatory);
                    }
                    else
                    {
                        PrepareParameters(changes, parameters, "IS_NEW_CARD", true, isMandatory);
                    }

                    if (application.IS_CARD_DELIVERY)
                    {
                        PrepareParameters(changes, parameters, "CARD_DELIVERY_ADDRESS", application.CARD_DELIVERY_ADDRESS, isMandatory);
                    }
                    else
                    {
                        PrepareParameters(changes, parameters, "BANK_BRANCH_CODE", application.BANK_BRANCH_CODE, isMandatory);
                    }
                }
                else
                {
                    PrepareParameters(changes, parameters, "EXISTING_CARD_CODE", application.EXISTING_CARD_CODE, isMandatory);
                }
            }

            PrepareParameters(changes, parameters, "IS_INTERNET_BANK_CHECKED", application.IS_INTERNET_BANK_CHECKED, isMandatory);
            PrepareParameters(changes, parameters, "IS_ARBITRAGE_CHECKED",     application.IS_ARBITRAGE_CHECKED,     isMandatory);
            PrepareParameters(changes, parameters, "GUARANTEE_SIGNATURE_TEXT", application.GUARANTEE_SIGNATURE_TEXT);
            parameters.Add("OPERATION_DETAILS", GenerateOperationDetailsString(changes));
            parameters.Add("IS_SUBMIT", application.IS_SUBMIT);
            await ExecuteAsync(parameters, "dbo.sp_SaveAgreedApplication");
        }

        public async Task<AgreedApplication> GetAgreedApplication(Guid id)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("ID", id);
            AgreedApplication application = await GetSingleAsync<AgreedApplication>(parameters, "dbo.sp_GetAgreedApplication");
            application.GUARANTEE_SIGNATURE_TEXT_TO_BE_ENTERED = await GetGuaranteeSignature(id);
            this.ApplyMappingSingle(application);
            return application;
        }

        public async Task<string> GetGuaranteeSignature(Guid id)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("ID", id);
            GuaranteeSignatureParameter signParameters = await GetSingleAsync<GuaranteeSignatureParameter>(parameters, "dbo.sp_GetGuaranteeSignatureParameters");
            return string.Format(GetSetting("GUARANTEE_SIGNATURE_TEXT"),
                                 signParameters.LAST_NAME,
                                 signParameters.FIRST_NAME,
                                 signParameters.PATRONYMIC_NAME,
                                 signParameters.NAME,
                                 signParameters.TYPE,
                                 signParameters.APPROVED_AMOUNT.ToString("#,###"),
                                 signParameters.CURRENCY_NAME);
        }

        public async Task<ClientDataForCardValidation> GetClientDataForCardValidation(Guid id)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", id);
            return await GetSingleAsync<ClientDataForCardValidation>(parameters, "dbo.sp_GetClientDataForCardValidation");
        }

        /// <summary>
        /// Returns list of active client cards
        /// </summary>
        public async Task<IEnumerable<ClientActiveCard>> GetClientActiveCards(string clientCode, string loanType, string currency)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("CLIENT", clientCode);
            parameters.Add("CURRENCY", currency);
            return await GetListAsync<ClientActiveCard>(parameters, string.Format("{0}dbo.am0sp_GetLegalActiveClientCards", GetSetting("BANK_SERVER_DATABASE")));
        }

        #endregion

        #region Common Operations

        public async Task DeleteApplication(Guid id)
        {
            Dictionary<string, string> changes = new Dictionary<string, string>();
            DynamicParameters parameters = new DynamicParameters();
            PrepareParameters(changes, parameters, "ID", id, true);
            parameters.Add("OPERATION_DETAILS", GenerateOperationDetailsString(changes));
            await ExecuteAsync(parameters, "dbo.sp_DeleteApplication");
        }

        public async Task<IEnumerable<Application>> GetApplications(int id)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("USER_ID", id);
            IEnumerable<Application> applications = await GetListAsync<Application>(parameters, "dbo.sp_GetApplications");
            this.ApplyMappingList(applications);
            return applications;
        }

        public async Task CancelApplicationByCustomer(Guid applicationId, CancellationReason cancellationReason)
        {
            string reasonCode = cancellationReason.CANCELLATION_REASON_CODE;
            Dictionary<string, string> changes = new Dictionary<string, string>();
            DynamicParameters parameters = new DynamicParameters();
            PrepareParameters(changes, parameters, "APPLICATION_ID",           applicationId, true);
            PrepareParameters(changes, parameters, "CANCELLATION_REASON_CODE", reasonCode,    true);
            parameters.Add("OPERATION_DETAILS", GenerateOperationDetailsString(changes));
            await ExecuteAsync(parameters, "dbo.sp_CancelApplication");
        }

        private bool IsLoanOverdraft(string code)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("CODE", code);
            return GetSingle<bool>(parameters, "dbo.sp_GetLoanOverdraft");
        }

        private bool IsLoanSecured(string code)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("CODE", code);
            return GetSingle<bool>(parameters, "dbo.sp_GetLoanSecured");
        }

        private bool IsLoanCardAccount(string code)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("CODE", code);
            return GetSingle<bool>(parameters, "dbo.sp_GetLoanCardAccount");
        }

        #endregion

        #region Application Scan

        public void DeleteApplicationScan(Guid applicationId, string documentTypeCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", applicationId);
            parameters.Add("APPLICATION_SCAN_TYPE_CODE", documentTypeCode);
            Execute(parameters, "dbo.sp_DeleteApplicationScan");
        }

        public void SaveApplicationScan(Guid applicationId, string documentTypeCode, string fileName, byte[] content)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", applicationId);
            parameters.Add("APPLICATION_SCAN_TYPE_CODE", documentTypeCode);
            parameters.Add("FILE_NAME", fileName);
            parameters.Add("CONTENT", content);
            Execute(parameters, "dbo.sp_SaveApplicationScan");
        }

        public IEnumerable<ApplicationScan> GetApplicationScans(Guid applicationId, char? prefix = null)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", applicationId);
            parameters.Add("PREFIX", prefix);
            IEnumerable<ApplicationScan> applicationScans = GetList<ApplicationScan>(parameters, "dbo.sp_GetApplicationScan");
            return applicationScans;
        }

        public byte[] GetApplicationScanContent(Guid applicationId, string documentTypeCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", applicationId);
            parameters.Add("APPLICATION_SCAN_TYPE_CODE", documentTypeCode);
            ApplicationScanContent content = GetSingle<ApplicationScanContent>(parameters, "dbo.sp_GetApplicationScanContent");
            byte[] result = null;
            if (content != null)
            {
                result = content.CONTENT;
            }
            return result;
        }

        public int GetScanMaxCount(char prefix)
        {
            int count = 0;
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("CODE", prefix);
            Setting setting = GetSingle<Setting>(parameters, "dbo.sp_GetScanMaxCount");

            if (setting != null)
            {
                count = int.Parse(setting.VALUE);
            }

            return count;
        }

        #endregion

        #region Application Print

        public async Task<ApplicationContractDetails> GetApplicationContractDetails(Guid id)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("ID", id);
            ApplicationContractDetails application = await GetSingleAsync<ApplicationContractDetails>(parameters, "dbo.sp_GetApplicationContractDetails");

            DateTime queryLimitDate;
            DateTime currentDate = DateTime.Now;
            currentDate = new DateTime(currentDate.Year, currentDate.Month, currentDate.Day);
            LoanParameters loanParameters = this.GetLoanParameters(application.LOAN_TYPE_ID);

            string bankDB = this.GetSetting("BANK_SERVER_DATABASE");

            string subsystemCode = loanParameters.IS_OVERDRAFT ? "C3" : "C1";

            if (loanParameters.IS_REPAY_START_DAY)
            {
                application.REPAYMENT_BEGIN_DATE = new DateTime(currentDate.Year, currentDate.Month, 1).AddMonths(1);
            }
            else
            {
                int givenDay = currentDate.Day;
                if ((givenDay < loanParameters.REPAYMENT_DAY_FROM || givenDay > loanParameters.REPAYMENT_DAY_TO)
                    && givenDay <= loanParameters.REPAY_TRANSITION_DAY)
                {
                    application.REPAYMENT_BEGIN_DATE = new DateTime(currentDate.Year, currentDate.Month, application.REPAYMENT_DAY).AddMonths(2);
                }
                else if (loanParameters.IS_REPAY_NEXT_MONTH)
                {
                    application.REPAYMENT_BEGIN_DATE = new DateTime(currentDate.Year, currentDate.Month, application.REPAYMENT_DAY).AddMonths(1);
                }
                else
                {
                    application.REPAYMENT_BEGIN_DATE = currentDate;
                }
            }

            if (currentDate < application.REPAYMENT_BEGIN_DATE && this.IsHoliday(application.REPAYMENT_BEGIN_DATE, bankDB))
            {
                application.REPAYMENT_BEGIN_DATE = this.GetNextWorkDay(application.REPAYMENT_BEGIN_DATE, bankDB);
            }

            if (application.LOAN_TERM.Trim() == "0")
            {
                application.REPAYMENT_END_DATE = new DateTime(2049, 12, 31);
                queryLimitDate = application.REPAYMENT_END_DATE;
            }
            else
            {
                application.REPAYMENT_END_DATE = this.GetPassHolidayDate(subsystemCode, application.TEMPLATE_CODE, currentDate.AddMonths(int.Parse(application.LOAN_TERM)), bankDB);
                queryLimitDate = new DateTime(2065, 1, 1);
            }

            DateTime? scheduleLastDate = this.GetLastRepaymentDate(subsystemCode, application.TEMPLATE_CODE, currentDate, application.REPAYMENT_BEGIN_DATE, queryLimitDate, int.Parse(application.LOAN_TERM), application.FINAL_AMOUNT, application.INTEREST, application.REPAYMENT_DAY, bankDB);
            if (scheduleLastDate.HasValue)
            {
                application.REPAYMENT_END_DATE = scheduleLastDate.Value;
            }
            return application;
        }

        public async Task<ERegisterData> GetERegisterContractDetails(Guid id)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("ID", id);
            ERegisterData eRegisterData = await GetSingleAsync<ERegisterData>(parameters, "dbo.sp_GetERegisterContractDetails");
            return eRegisterData;
        }

        public async Task<NorqData> GetNorqContractDetails(Guid id)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("ID", id);
            NorqData norqData = await GetSingleAsync<NorqData>(parameters, "dbo.sp_GetNorqContractDetails");
            return norqData;
        }

        public bool IsCompanyLLC(Guid applicationId)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", applicationId);
            return GetScalarValue<bool>(parameters,
                "select dbo.f_IsCompanyLLC(@APPLICATION_ID)");
        }

        public byte[] GetApplicationPrint(Guid applicationId)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", applicationId);
            return GetSingle<byte[]>(parameters, string.Format("{0}dbo.am0sp_GetSMEApplicationPrint", GetSetting("BANK_SERVER_DATABASE")));
        }

        public byte GetRepayDate(string subsystemCode, string templateCode, DateTime date, string bankDB)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("SubsystemCode", subsystemCode);
            parameters.Add("TemplateCode", templateCode);
            parameters.Add("Date", date);
            parameters.Add("PeriodMonthFrom", dbType: DbType.Int32, direction: ParameterDirection.Output);
            parameters.Add("PeriodMonthTo", dbType: DbType.Int32, direction: ParameterDirection.Output);
            parameters.Add("Interest", dbType: DbType.Decimal, direction: ParameterDirection.Output);
            parameters.Add("RepayDay", dbType: DbType.Byte, direction: ParameterDirection.Output);
            Execute(parameters, string.Format("{0}dbo.am0sp_GetTemplateData", bankDB));
            return parameters.Get<byte>("RepayDay");
        }

        public LoanParameters GetLoanParameters(string loanType)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("LOAN_TYPE_CODE", loanType);
            return GetSingle<LoanParameters>(parameters, "dbo.sp_GetLoanParameters");
        }

        public decimal? GetActualInterest(string subsystemCode, string templateCode, string loanType,
            DateTime dateAgreementFrom, DateTime dateFirstRepayment, DateTime dateAgreementTo,
            byte period, decimal amount, string currency, decimal interest, byte repayDay, string bankDB)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("TERM_MONTH", period);
            parameters.Add("AGREEMENT_FROM", dateAgreementFrom);
            parameters.Add("FIRST_REPAYMENT", dateFirstRepayment);
            parameters.Add("AGREEMENT_TO", dateAgreementTo);
            parameters.Add("TEMPLATE_CODE", templateCode);
            parameters.Add("SUBSYSTEM_CODE", subsystemCode);
            parameters.Add("AMOUNT", amount);
            parameters.Add("CURRENCY", currency);
            parameters.Add("INTEREST", interest);
            parameters.Add("REPAY_DAY", repayDay);
            parameters.Add("LOAN_TYPE", loanType);
            return GetSingle<decimal?>(parameters, string.Format("{0}dbo.am0sp_GetActualInterest", bankDB));
        }

        public async Task<Client> GetClientData(string clientCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("CLICODE", clientCode);
            return await GetSingleAsync<Client>(parameters, string.Format("{0}dbo.am0sp_GetClientData", GetSetting("BANK_SERVER_DATABASE")));
        }

        public decimal? GetInterestAmount(string subsystemCode, string templateCode,
            DateTime dateAgreementFrom, DateTime dateFirstRepayment, DateTime dateAgreementTo,
            byte period, decimal amount, decimal interest, byte repayDay, string bankDB)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("TERM_MONTH", period);
            parameters.Add("AGREEMENT_FROM", dateAgreementFrom);
            parameters.Add("FIRST_REPAYMENT", dateFirstRepayment);
            parameters.Add("AGREEMENT_TO", dateAgreementTo);
            parameters.Add("TEMPLATE_CODE", templateCode);
            parameters.Add("SUBSYSTEM_CODE", subsystemCode);
            parameters.Add("AMOUNT", amount);
            parameters.Add("INTEREST", interest);
            parameters.Add("REPAY_DAY", repayDay);
            return GetSingle<decimal?>(parameters, string.Format("{0}dbo.am0sp_GetInterestAmount", bankDB));
        }

        public bool IsHoliday(DateTime date, string bankDB)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("Date", date);
            return GetSingle<bool>(parameters, string.Format("{0}dbo.am0sp_IsHoliday", bankDB));
        }

        public DateTime GetPassHolidayDate(string subsystemCode, string templateCode, DateTime date, string bankDB)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("SubsystemCode", subsystemCode);
            parameters.Add("TemplateCode", templateCode);
            parameters.Add("Date", date);
            return GetSingle<DateTime>(parameters, string.Format("{0}dbo.am0sp_GetPassHolidayDate", bankDB));
        }

        public DateTime? GetLastRepaymentDate(string subsystemCode, string templateCode,
            DateTime dateAgreementFrom, DateTime dateFirstRepayment, DateTime dateAgreementTo,
            int loanDuration, decimal amount, decimal interest, byte repayDay,
            string bankDB)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("SubsystemCode", subsystemCode);
            parameters.Add("TemplateCode", templateCode);
            parameters.Add("DateAgreementFrom", dateAgreementFrom);
            parameters.Add("DateFirstRepayment", dateFirstRepayment);
            parameters.Add("DateAgreementTo", dateAgreementTo);
            parameters.Add("LoanDuration", loanDuration);
            parameters.Add("Amount", amount);
            parameters.Add("Interest", interest);
            parameters.Add("RepayDay", repayDay);
            return GetSingle<DateTime?>(parameters, string.Format("{0}dbo.am0sp_GetLastRepaymentDate", bankDB));
        }

        public DateTime GetNextWorkDay(DateTime date, string bankDB)
        {
            DateTime result = date.AddDays(1);
            if (IsHoliday(result, bankDB))
                result = GetNextWorkDay(result, bankDB);
            return result;
        }

        public decimal GetCBRate(string currency, string bankDB)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("CURRENCY", currency);
            return GetSingle<decimal>(parameters, string.Format("{0}dbo.am0sp_GetCBRate", bankDB));
        }

        #endregion

        #region Messages

        public void UpdateMessage(Guid id, char scanType)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", id);
            parameters.Add("SCAN_TYPE",      scanType);
            Execute(parameters, "dbo.sp_SaveMessage");
        }

        public void SendMessage(Guid id)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", id);
            Execute(parameters, "dbo.sp_SendMessageToBank");
        }

        public async Task<IEnumerable<Message>> GetMessages(Guid applicationID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", applicationID);
            IEnumerable<Message> messages = await GetListAsync<Message>(parameters, "dbo.sp_GetMessages");
            return messages;
        }

        #endregion

        #region Loan Specialist

        public async Task<InitialApplication> GetInitialApplicationLoanSpecialist(Guid applicationID, int loanSpecialistID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID",     applicationID);
            parameters.Add("LOAN_SPECIALIST_ID", loanSpecialistID);
            InitialApplication application = await GetSingleAsync<InitialApplication>(parameters, "dbo.sp_GetInitialApplicationLoanSpecialist");
            this.ApplyMappingSingle(application);
            return application;
        }

        /// <summary>
        /// Save application for loan specialist
        /// </summary>
        public async Task SaveLoanSpecialistApplication(Guid applicationID, LoanSpecialistMainApplication application, int customerUserID)
        {
            Dictionary<string, string> changes = new Dictionary<string, string>();
            DynamicParameters parameters = new DynamicParameters();

            List<ApplicationCompanyOverhead> overheads = new List<ApplicationCompanyOverhead>();
            foreach (ApplicationCompanyOverheadGrouped industry in application.OVERHEADS)
            {
                foreach (ApplicationCompanyOverheadWithName product in industry.PRODUCTS)
                {
                    ApplicationCompanyOverhead overhead = new ApplicationCompanyOverhead()
                    {
                        INDUSTRY_CODE = industry.CODE,
                        INDUSTRY_PRODUCT_CODE = product.INDUSTRY_PRODUCT_CODE,
                        NET_AMOUNT = product.NET_AMOUNT,
                        SALE_AMOUNT = product.SALE_AMOUNT,
                        PRODUCT_PERCENTAGE = product.PRODUCT_PERCENTAGE
                    };
                    overheads.Add(overhead);
                }
            }

            bool isMandatory = application.IS_SUBMIT;
            PrepareParameters(changes, parameters, "LOAN_SPECIALIST_ID",  customerUserID,                  isMandatory);
            PrepareParameters(changes, parameters, "APPLICATION_ID",      applicationID,                   isMandatory);
            PrepareParameters(changes, parameters, "BUSINESS_SPACE",      application.BUSINESS_SPACE,      isMandatory);
            PrepareParameters(changes, parameters, "BUSINESS_STATE_CODE", application.BUSINESS_STATE_CODE, isMandatory);
            PrepareParameters(changes, parameters, "EMPLOYEE_COUNT",      application.EMPLOYEE_COUNT,      isMandatory);
            PrepareParameters(changes, parameters, "FAMILY_MEMBER_COUNT", application.FAMILY_MEMBER_COUNT, isMandatory);
            PrepareParameters(changes, parameters, "VEHICLE_COUNT",       application.VEHICLE_COUNT);
            PrepareParameters(changes, parameters, "IS_AREA_RENTED",      application.IS_AREA_RENTED);
            PrepareParameters(changes, parameters, "AREA_RENTED_COMMENT", application.AREA_RENTED_COMMENT);
            PrepareParameters(changes, parameters, "ACTIVITY_DESCRIPTION", application.ACTIVITY_DESCRIPTION);
            PrepareParameters(changes, parameters, "LS_LOAN_TYPE_ID",     application.LS_LOAN_TYPE_ID,     isMandatory);
            PrepareParameters(changes, parameters, "LS_LOAN_AMOUNT",      application.LS_LOAN_AMOUNT,      isMandatory);
            PrepareParameters(changes, parameters, "LS_CURRENCY_CODE",    application.LS_CURRENCY_CODE,    isMandatory);
            PrepareParameters(changes, parameters, "LS_LOAN_TERM",        application.LS_LOAN_TERM,        isMandatory);
            PrepareParameters(changes, parameters, "LS_REPAYMENT_DAY",    application.LS_REPAYMENT_DAY,    isMandatory);

            AddTableValuedParameter<ApplicationCompanyData>(parameters, "PROFITS",   application.PROFITS);
            AddTableValuedParameter<ApplicationCompanyOverhead>(parameters, "OVERHEADS", overheads);
            AddTableValuedParameter<ApplicationCompanyData>(parameters, "BALANCES",  application.BALANCES);
            AddTableValuedParameter<ApplicationCompanyData>(parameters, "OPERATIONAL_EXPENSES",    application.OPERATIONAL_EXPENSES);
            AddTableValuedParameter<ApplicationCompanyData>(parameters, "NONOPERATIONAL_EXPENSES", application.NONOPERATIONAL_EXPENSES);
            AddTableValuedParameter<ApplicationCompanyData>(parameters, "OTHER_STATISTICS",        application.OTHER_STATISTICS);
            AddTableValuedParameter<ApplicationCompanyData>(parameters, "GOOD_MONTH_EARNINGS",     application.GOOD_MONTH_EARNINGS);
            AddTableValuedParameter<ApplicationCompanyData>(parameters, "BAD_MONTH_EARNINGS",      application.BAD_MONTH_EARNINGS);
            AddTableValuedParameter<ApplicationRelatedPerson>(parameters, "GUARANTORS",            application.GUARANTORS);

            if (application.IS_REAL_ESTATE.HasValue)
            {
                PrepareParameters(changes, parameters, "IS_REAL_ESTATE",               application.IS_REAL_ESTATE,               isMandatory);
                PrepareParameters(changes, parameters, "SHOULD_MAIN_AGREEMENT_SIGNED", application.SHOULD_MAIN_AGREEMENT_SIGNED, isMandatory);
                PrepareParameters(changes, parameters, "IS_MAIN_AGREEMENT_SIGNED",     application.IS_MAIN_AGREEMENT_SIGNED,     isMandatory);
                PrepareParameters(changes, parameters, "IS_SUCCESSIVE_PLEDGING",       application.IS_SUCCESSIVE_PLEDGING,       isMandatory);
                PrepareParameters(changes, parameters, "MARKET_PRICE",                 application.MARKET_PRICE,                 isMandatory);
                PrepareParameters(changes, parameters, "LIQUID_PRICE",                 application.LIQUID_PRICE,                 isMandatory);
                PrepareParameters(changes, parameters, "IS_INSURANCE_CONDITION",       application.IS_INSURANCE_CONDITION,       isMandatory);
                PrepareParameters(changes, parameters, "IS_INSURANCE_BY_BANK",         application.IS_INSURANCE_BY_BANK,         isMandatory);
                PrepareParameters(changes, parameters, "INSURANCE_COMPANY_CODE",       application.INSURANCE_COMPANY_CODE,       isMandatory && application.IS_INSURANCE_CONDITION);
                PrepareParameters(changes, parameters, "APPRAISAL_COMPANY_CODE",       application.APPRAISAL_COMPANY_CODE,       isMandatory);
                PrepareParameters(changes, parameters, "APPRAISAL_DATE",               application.APPRAISAL_DATE,               isMandatory);
                AddTableValuedParameter<ApplicationRelatedPerson>(parameters,    "PLEDGERS",                     application.PLEDGERS);

                PrepareParameters(changes, parameters, "OWNERSHIP_CERTIFICATE_NUMBER", application.OWNERSHIP_CERTIFICATE_NUMBER, isMandatory);
                PrepareParameters(changes, parameters, "OWNERSHIP_CERTIFICATE_DATE", application.OWNERSHIP_CERTIFICATE_DATE, isMandatory);
                if (application.IS_REAL_ESTATE.Value)
                {
                    PrepareParameters(changes, parameters, "ESTATE_ADDRESS",               application.ESTATE_ADDRESS,               isMandatory);
                    PrepareParameters(changes, parameters, "ESTATE_RESIDENTIAL_AREA",      application.ESTATE_RESIDENTIAL_AREA);
                    PrepareParameters(changes, parameters, "ESTATE_LAND_AREA",             application.ESTATE_LAND_AREA);
                }
                else
                {
                    PrepareParameters(changes, parameters, "VEHICLE_MODEL", application.VEHICLE_MODEL, isMandatory);
                    PrepareParameters(changes, parameters, "VEHICLE_VIN",   application.VEHICLE_VIN,   isMandatory);
                    PrepareParameters(changes, parameters, "VEHICLE_DATE",  application.VEHICLE_DATE,  isMandatory);
                }
            }

            parameters.Add("OPERATION_DETAILS", GenerateOperationDetailsString(changes));
            parameters.Add("IS_SUBMIT", application.IS_SUBMIT);
            await ExecuteAsync(parameters, "dbo.sp_SaveApplicationLoanSpecialist");
        }

        public async Task<LoanSpecialistMainApplication> GetApplicationLoanSpecialist(Guid applicationId)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", applicationId);
            LoanSpecialistMainApplication application = await GetSingleAsync<LoanSpecialistMainApplication>(parameters, "dbo.sp_GetApplicationLoanSpecialist");
            this.ApplyMappingSingle(application);
            return application;
        }

        public async Task<IEnumerable<LoanSpecialistApplication>> GetLoanSpecialistApplications(int id, string taxIdNumber)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("LOAN_SPECIALIST_ID", id);
            parameters.Add("TAX_ID_NUMBER", taxIdNumber);
            IEnumerable<LoanSpecialistApplication> applications = await GetListAsync<LoanSpecialistApplication>(parameters, "dbo.sp_GetLoanSpecialistApplications");
            this.ApplyMappingList(applications);
            return applications;
        }

        public async Task<IEnumerable<ApplicationPreapprovedResult>> GetApplicationPreapprovedResult(Guid applicationId)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", applicationId);
            IEnumerable<ApplicationPreapprovedResult> preapprovedResults = await GetListAsync<ApplicationPreapprovedResult>(parameters, "dbo.sp_GetApplicationPreapprovedResult");
            return preapprovedResults;
        }

        public async Task UpdateApplicationPreapprovedResult(Guid applicationId, int preapprovedResultId, bool preapprovedIsRealEstate)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID",        applicationId);
            parameters.Add("PREAPPROVED_RESULT_ID", preapprovedResultId);
            parameters.Add("PREAPPROVED_IS_REAL_ESTATE", preapprovedIsRealEstate);
            await ExecuteAsync(parameters, "dbo.sp_UpdateApplicationPreapprovedResult");
        }

        public async Task RefuseApplicationByLoanSpecialist(Guid applicationId)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", applicationId);
            await ExecuteAsync(parameters, "dbo.sp_RefuseApplication");
        }

        #endregion

        #region Application Photo

        public void DeleteApplicationPhoto(int id)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("ID", id);
            Execute(parameters, "dbo.sp_DeleteApplicationPhoto");
        }

        public int SaveApplicationPhoto(Guid applicationId, string fileName, bool isPledge, byte[] content)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", applicationId);
            parameters.Add("FILE_NAME",      fileName);
            parameters.Add("IS_PLEDGE",      isPledge);
            parameters.Add("CONTENT",        content);
            parameters.Add("ID", dbType: DbType.Int32, direction: ParameterDirection.InputOutput, value: 0);
            Execute(parameters, "dbo.sp_SaveApplicationPhoto");
            int id = parameters.Get<int>("ID");
            return id;
        }

        public IEnumerable<ApplicationPhoto> GetApplicationPhotos(Guid applicationId)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", applicationId);
            IEnumerable<ApplicationPhoto> applicationScans = GetList<ApplicationPhoto>(parameters, "dbo.sp_GetApplicationPhotos");
            return applicationScans;
        }

        public byte[] GetApplicationPhotoContent(int id)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("ID", id);
            ApplicationScanContent content = GetSingle<ApplicationScanContent>(parameters, "dbo.sp_GetApplicationPhotoContent");
            byte[] result = null;
            if (content != null)
            {
                result = content.CONTENT;
            }
            return result;
        }

        #endregion

        public async Task<ApplicationInformation> GetApplicationInformation(Guid applicationID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", applicationID);
            ApplicationInformation application = await GetSingleAsync<ApplicationInformation>(parameters, "dbo.sp_GetApplicationInformation");
            this.ApplyMappingSingle(application);
            return application;
        }

        /// <summary>
        /// Apply mapping for a single Application entity
        /// </summary>
        private void ApplyMappingSingle(Application application)
        {
            if (application != null)
            {
                application.STATUS_STATE = this.MapApplicationStatus(application.STATUS_ID);
            }
        }

        /// <summary>
        /// Apply mapping for a list of Application entities
        /// </summary>
        private void ApplyMappingList(IEnumerable<Application> applications)
        {
            foreach(Application application in applications)
            {
                this.ApplyMappingSingle(application);
            }
        }

        /// <summary>
        /// Changes application status
        /// </summary>
        private async Task ChangeApplicationStatus(Guid id, byte status)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", id);
            parameters.Add("APPLICATION_STATUS_ID", status);
            await ExecuteAsync(parameters, "dbo.sp_ChangeApplicationStatus");
        }

        public async Task<string> GetApplicationStatusState(Guid id)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("ID", id);
            int statusID = await GetSingleAsync<int>(parameters, "dbo.sp_GetApplicationStatusID");
            string statusState = this.MapApplicationStatus(statusID);
            return statusState;
        }

        public async Task<ApplicationCountSetting> GetApplicationCountSetting(int userID, Guid? applicationID, string loanTypeID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("USER_ID", userID);
            parameters.Add("APPLICATION_ID", applicationID);
            parameters.Add("LOAN_TYPE_ID",   loanTypeID);
            return await GetSingleAsync<ApplicationCountSetting>(parameters, "dbo.sp_GetApplicationCountSetting");
        }

        public async Task<InitialApplication> GetCustomerLatestApplicationData(string taxIdNumber)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("TAX_ID_NUMBER", taxIdNumber);
            InitialApplication application = await GetSingleAsync<InitialApplication>(parameters, "dbo.sp_GetCustomerLatestApplicationData");
            return application;
        }

        public ADriveFile GetADriveFile(Guid applicationId)
        {
            string adriveDB = GetSetting("EVENTSTORE_SERVER_DATABASE");
            if (string.IsNullOrWhiteSpace(adriveDB))
                return null;
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("APPLICATION_ID", applicationId);
            return GetSingle<ADriveFile>(parameters, string.Format("{0}dbo.olsp_GetApplicationPrint", adriveDB));
        }
    }
}
