using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using IntelART.OnlineLoans.Entities;
using IntelART.OnlineLoans.Repositories;
using IntelART.Utilities.DocumentStore;
using IntelART.Utilities.PrintableFormGenerator;
using IntelART.Utilities;

namespace IntelART.OnlineLoans.LoanApplicationRestApi.Controllers
{
    /// <summary>
    /// Controller class to implement the API methods required for viewing, creating, and
    /// managing loan applications
    /// </summary>
    [Authorize]
    [Route("/Applications/{id}/Documents")]
    public class LoanApplicationDocumentsController : RepositoryControllerBase<ApplicationRepository>
    {
        private IDocumentStore documentStore;
        private IPrintableFormGenerator printableFormGenerator;
        private IConfigurationSection printTemplateConfiguration;

        public LoanApplicationDocumentsController(IConfigurationRoot configuration, IDocumentStore documentStore, IPrintableFormGenerator printableFormGenerator)
            : base(configuration, (connectionString) => new ApplicationRepository(connectionString))
        {
            this.documentStore = documentStore;
            this.printableFormGenerator = printableFormGenerator;
            this.printTemplateConfiguration = configuration.GetSection("PrintTemplates");
        }

        private string GetDocumentUniqueName(Guid applicationId, string documentType)
        {
            return string.Format("{0}_{1}", applicationId, documentType);
        }

        /// <summary>
        /// Implements GET /Applications/{id}/Documents
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IEnumerable<ApplicationScan>> Get(Guid id)
        {
            IEnumerable<ApplicationScan> applicationDocuments = this.Repository.GetApplicationScans(id);

            // Get back to UI only FileName without mimeType
            foreach (ApplicationScan scan in applicationDocuments)
            {
                if (scan.FILE_NAME != null)
                {
                    int splitIndex = scan.FILE_NAME.LastIndexOf('|');
                    if (splitIndex >= 0)
                    {
                        scan.FILE_NAME = scan.FILE_NAME.Substring(0, splitIndex);
                    }
                }
            }

            return applicationDocuments;
        }

        private string NullString()
        {
            return "Չի պահանջվում";
        }

        private string TextToBeFilledIn()
        {
            return "/ենթակա է լրացման Բանկի կողմից վարկի հաստատումից հետո/";
        }

        private async Task IsApplicationEligibleForDocumentChange(Guid id)
        {
            string statusState = await this.Repository.GetApplicationStatusState(id);
            if (statusState != "PRE_APPROVAL_REVIEW_ADDITIONAL_DATA" &&
                statusState != "ADDITIONAL_ATTACHMENTS_NEEDED")
            {
                throw new ApplicationException("E-0310", "Այս փուլում հնարավոր չէ փաստաթուղթ կցել կամ ջնջել");
            }
        }

        /// <summary>
        /// Implements GET /Applications/{id}/Documents/{documentType}
        /// </summary>
        /// <param name="id"></param>
        /// <param name="documentType"></param>
        /// <returns></returns>
        [HttpGet("{documentType}")]
        public async Task<IActionResult> Get(Guid id, string documentType)
        {
            IActionResult result;
            Stream stream;
            string mimeType = "application/octet-stream";
            string originalFileName = null;
            if (documentType == "DOC_ARBITRAGE_AGREEMENT")
            {
                mimeType = "text/html; charset=utf-8";
                Dictionary<string, string> data = new Dictionary<string, string>();

                ApplicationContractDetails appContract = await this.Repository.GetApplicationContractDetails(id);
                ERegisterData eRegisterData = await this.Repository.GetERegisterContractDetails(id);
                NorqData norqData = await this.Repository.GetNorqContractDetails(id);
                bool isCompanyLLC = this.Repository.IsCompanyLLC(id);

                if (appContract == null)
                {
                    throw new ApplicationException("E-5001", string.Format("Unknown application (id {0})", id));
                }

                string addressFormat1 = "{0} {1}, {2}, {3}, {4}";
                string addressFormat2 = "{0} {1}, բն․ {2}, {3}, {4}, {5}";

                string individualAddress = "";

                if (string.IsNullOrWhiteSpace(appContract.INDIVIDUAL_APARTMENT))
                {
                    individualAddress = string.Format(addressFormat1,
                        appContract.INDIVIDUAL_STREET,
                        appContract.INDIVIDUAL_BUILDNUM,
                        appContract.INDIVIDUAL_CITY_NAME,
                        appContract.INDIVIDUAL_STATE_NAME,
                        appContract.INDIVIDUAL_COUNTRY_NAME);
                }
                else
                {
                    individualAddress = string.Format(addressFormat2,
                        appContract.INDIVIDUAL_STREET,
                        appContract.INDIVIDUAL_BUILDNUM,
                        appContract.INDIVIDUAL_APARTMENT,
                        appContract.INDIVIDUAL_CITY_NAME,
                        appContract.INDIVIDUAL_STATE_NAME,
                        appContract.INDIVIDUAL_COUNTRY_NAME);
                }

                data["APPLICATION_ID"] = this.TextToBeFilledIn();

                data["COMPANY_NAME_AM"] = eRegisterData.NAME_AM;
                data["COMPANY_TYPE"] = eRegisterData.TYPE;
                data["REGISTRATION_ADDRESS"] = eRegisterData.ADDRESS;

                data["FIRST_NAME"] = norqData.FIRST_NAME_AM;
                data["LAST_NAME"] = norqData.LAST_NAME_AM;
                data["PASSPORT_NUMBER"] = norqData.DOCUMENT_NUMBER;
                data["PASSPORT_BY"] = norqData.DOCUMENT_GIVEN_BY;
                data["PASSPORT_EXPIRY_DATE"] = norqData.DOCUMENT_EXPIRY_DATE.ToString("dd/MM/yyyy");

                data["DATE"] = DateTime.Now.ToString("dd/MM/yyyy");
                data["INDIVIDUAL_ADDRESS"] = individualAddress;

                data["IS_LLC"] = isCompanyLLC ? "show" : "hidden";
                data["IS_NOT_LLC"] = isCompanyLLC ? "hidden" : "show";

                stream = await this.printableFormGenerator.GnerateFormAsync(documentType, data);
            }
            else if (documentType == "DOC_GUARANTEE_AGREEMENT")
            {
                mimeType = "text/html; charset=utf-8";
                Dictionary<string, string> data = new Dictionary<string, string>();
                ApplicationContractDetails appContract = await this.Repository.GetApplicationContractDetails(id);
                ERegisterData eRegisterData = await this.Repository.GetERegisterContractDetails(id);
                NorqData norqData = await this.Repository.GetNorqContractDetails(id);

                if (appContract == null)
                {
                    throw new ApplicationException("E-5001", string.Format("Unknown application (id {0})", id));
                }

                data["DOCUMENT_NUMBER"] = this.TextToBeFilledIn();

                data["COMPANY_NAME_AM"] = eRegisterData.NAME_AM;
                data["COMPANY_TYPE"] = eRegisterData.TYPE;
                data["REGISTRATION_ADDRESS"] = eRegisterData.ADDRESS;

                data["FIRST_NAME"] = norqData.FIRST_NAME_AM;
                data["LAST_NAME"] = norqData.LAST_NAME_AM;
                data["PASSPORT_NUMBER"] = norqData.DOCUMENT_NUMBER;
                data["PASSPORT_BY"] = norqData.DOCUMENT_GIVEN_BY;
                data["PASSPORT_EXPIRY_DATE"] = norqData.DOCUMENT_EXPIRY_DATE.ToString("dd/MM/yyyy");

                data["DATE"] = DateTime.Now.ToString("dd/MM/yyyy");
                data["APPLICATION_ID"] = this.TextToBeFilledIn();
                data["CELL_PHONE_NUMBER"] = appContract.MOBILE_PHONE;
                data["EMAIL"] = appContract.EMAIL;
                data["APPROVED_AMOUNT"] = appContract.FINAL_AMOUNT.ToString("#,###");
                data["APPROVED_AMOUNT_TEXT"] = appContract.FINAL_AMOUNT.ToWords();
                data["CURRENCY_NAME"] = appContract.CURRENCY_NAME;
                data["APPLICATION_SUBMISSION_DATE"] = appContract.CREATION_DATE.ToString("dd/MM/yyyy");

                stream = await this.printableFormGenerator.GnerateFormAsync(documentType, data);
            }
            else if (documentType == "DOC_PLEDGE_AGREEMENT")
            {
                mimeType = "text/html; charset=utf-8";
                Dictionary<string, string> data = new Dictionary<string, string>();
                ApplicationContractDetails appContract = await this.Repository.GetApplicationContractDetails(id);
                ERegisterData eRegisterData = await this.Repository.GetERegisterContractDetails(id);
                NorqData norqData = await this.Repository.GetNorqContractDetails(id);

                if (appContract == null)
                {
                    throw new ApplicationException("E-5001", string.Format("Unknown application (id {0})", id));
                }

                data["DOCUMENT_NUMBER"] = this.TextToBeFilledIn();
                data["ACCOUNT_NUMBER"] = this.TextToBeFilledIn();

                data["COMPANY_NAME_AM"] = eRegisterData.NAME_AM;
                data["COMPANY_TYPE"] = eRegisterData.TYPE;
                data["COMPANY_REGISTRATION_CODE"] = eRegisterData.REGISTRATION_CODE;
                data["COMPANY_CERTIFICATE_CODE"] = eRegisterData.CERTIFICATE_CODE;
                data["REGISTRATION_ADDRESS"] = eRegisterData.ADDRESS;

                data["FIRST_NAME"] = norqData.FIRST_NAME_AM;
                data["LAST_NAME"] = norqData.LAST_NAME_AM;
                data["PASSPORT_NUMBER"] = norqData.DOCUMENT_NUMBER;
                data["PASSPORT_BY"] = norqData.DOCUMENT_GIVEN_BY;
                data["PASSPORT_EXPIRY_DATE"] = norqData.DOCUMENT_EXPIRY_DATE.ToString("dd/MM/yyyy"); ;

                data["DATE"] = DateTime.Now.ToString("dd/MM/yyyy");
                data["APPLICATION_ID"] = this.TextToBeFilledIn();
                data["TAX_ID_NUMBER"] = appContract.TAX_ID_NUMBER;
                data["CELL_PHONE_NUMBER"] = appContract.MOBILE_PHONE;
                data["EMAIL"] = appContract.EMAIL;
                data["APPROVED_AMOUNT"] = appContract.FINAL_AMOUNT.ToString("#,###");
                data["APPROVED_AMOUNT_TEXT"] = appContract.FINAL_AMOUNT.ToWords();
                data["CURRENCY_NAME"] = appContract.CURRENCY_NAME;
                data["APPROVED_LOAN_INTEREST"] = appContract.INTEREST.ToString("#,###.##") + "%";
                data["APPROVED_REPAYMENT_PERIOD"] = appContract.REPAYMENT_END_DATE.ToString("dd/MM/yyyy");
                data["APPLICATION_SUBMISSION_DATE"] = appContract.CREATION_DATE.ToString("dd/MM/yyyy");

                stream = await this.printableFormGenerator.GnerateFormAsync(documentType, data);
            }
            else if (documentType == "DOC_CONTRACT")
            {
                Application app = await this.Repository.GetInitialApplication(id);

                if (app == null)
                {
                    throw new ApplicationException("E-5001", string.Format("Unknown application (id {0})", id));
                }

                string template = null;
                if (this.printTemplateConfiguration != null)
                {
                    template = this.printTemplateConfiguration[app.LOAN_TYPE_ID];
                }

                if (template != null)
                {
                    mimeType = "text/html; charset=utf-8";
                    Dictionary<string, string> data = new Dictionary<string, string>();
                    ApplicationContractDetails appContract = await this.Repository.GetApplicationContractDetails(id);
                    ERegisterData eRegisterData = await this.Repository.GetERegisterContractDetails(id);

                    if (appContract == null)
                    {
                        throw new ApplicationException("E-5001", string.Format("Unknown application (id {0})", id));
                    }

                    string branchName = "";
                    Client client = await this.Repository.GetClientData(appContract.CLIENT_CODE);
                    if (client != null)
                    {
                        branchName = client.BranchName;
                    }

                    string addressFormat1 = "{0} {1}, {2}, {3}, {4}";
                    string addressFormat2 = "{0} {1}, բն․ {2}, {3}, {4}, {5}";

                    string currentAddress = "";

                    if (string.IsNullOrWhiteSpace(appContract.CURRENT_APARTMENT))
                    {
                        currentAddress = string.Format(addressFormat1,
                            appContract.CURRENT_STREET,
                            appContract.CURRENT_BUILDNUM,
                            appContract.CURRENT_CITY_NAME,
                            appContract.CURRENT_STATE_NAME,
                            appContract.CURRENT_COUNTRY_NAME);
                    }
                    else
                    {
                        currentAddress = string.Format(addressFormat2,
                            appContract.CURRENT_STREET,
                            appContract.CURRENT_BUILDNUM,
                            appContract.CURRENT_APARTMENT,
                            appContract.CURRENT_CITY_NAME,
                            appContract.CURRENT_STATE_NAME,
                            appContract.CURRENT_COUNTRY_NAME);
                    }

                    data["IS_REFINANCING"] = appContract.IS_REFINANCING ? "show" : "hidden";

                    if (appContract.IS_REFINANCING)
                    {
                        IEnumerable<RefinancingLoan> refinancingLoans = await Repository.GetRefinancingLoans(id);
                        string delimiter = ", ";
                        data["REFINANCING_LOAN_CODES"] = refinancingLoans.Select(r => r.LOAN_CODE).Aggregate((i, j) => i + delimiter + j);
                    }

                    data["DOCUMENT_NUMBER"] = this.TextToBeFilledIn();
                    data["ACCOUNT_NUMBER"] = this.TextToBeFilledIn();

                    data["DATE"] = DateTime.Now.ToString("dd/MM/yyyy");
                    data["BRANCH_NAME"] = branchName;
                    data["CLIENT_CODE"] = appContract.CLIENT_CODE;
                    data["CLIENT_LOAN_CODE"] = this.TextToBeFilledIn();
                    data["TAX_ID_NUMBER"] = appContract.TAX_ID_NUMBER;
                    data["ACTUAL_ADDRESS"] = currentAddress;
                    data["CELL_PHONE_NUMBER"] = appContract.MOBILE_PHONE;
                    data["EMAIL"] = appContract.EMAIL;
                    data["FACEBOOK"] = appContract.FACEBOOK;
                    data["WEBSITE"] = appContract.WEBSITE;
                    data["FACTUAL_INDUSTRY_NAME"] = appContract.FACTUAL_INDUSTRY_NAME;
                    data["ANNUAL_TURNOVER"] = appContract.ANNUAL_TURNOVER.ToString("#,###");
                    data["LOAN_TERM"] = appContract.LOAN_TERM + " ամիս";
                    data["INITIAL_AMOUNT"] = appContract.INITIAL_AMOUNT.ToString("#,###");
                    data["CURRENCY_NAME"] = appContract.CURRENCY_NAME;
                    data["REQUESTED_REPAYMENT_DAY"] = appContract.REPAYMENT_DAY.ToString();
                    data["APPLICATION_SUBMISSION_DATE"] = appContract.CREATION_DATE.ToString("dd/MM/yyyy");
                    data["APPLICATION_ACCEPTANCE_DATE"] = data["DATE"];
                    data["APPROVED_AMOUNT"] = appContract.FINAL_AMOUNT.ToString("#,###");
                    data["APPROVED_AMOUNT_TEXT"] = appContract.FINAL_AMOUNT.ToWords();
                    data["APPROVED_REPAYMENT_DAY"] = appContract.REPAYMENT_DAY.ToString();
                    data["APPROVED_LOAN_INTEREST"] = appContract.INTEREST.ToString("#,###.##") + "%";

                    data["COMPANY_NAME_AM"] = eRegisterData.NAME_AM;
                    data["COMPANY_TYPE"] = eRegisterData.TYPE;
                    data["COMPANY_REGISTRATION_CODE"] = eRegisterData.REGISTRATION_CODE;
                    data["COMPANY_REGISTRATION_DATE"] = eRegisterData.REGISTRATION_DATE.ToString("dd/MM/yyyy");
                    data["REGISTRATION_ADDRESS"] = eRegisterData.ADDRESS;
                    data["EMPLOYER_TYPE"] = eRegisterData.INDUSTRY_NAME;

                    data["REPAYMENT_START_DATE"] = appContract.REPAYMENT_BEGIN_DATE.ToString("dd/MM/yyyy");
                    data["APPROVED_REPAYMENT_PERIOD"] = appContract.REPAYMENT_END_DATE.ToString("dd/MM/yyyy");
                    stream = await this.printableFormGenerator.GnerateFormAsync(template, data);
                }
                else
                {
                    mimeType = "application/pdf";
                    originalFileName = "Contract.pdf";
                    byte[] content = this.Repository.GetApplicationPrint(id);

                    if (content == null)
                    {
                        throw new ApplicationException("E-5002", string.Format("The contract file does not exist for the application {0}", id));
                    }
                    stream = new MemoryStream(content);
                    stream.Position = 0;
                }
            }
            else if (documentType == "DOC_LOAN_CONTRACT_FINAL")
            {
                mimeType = "application/pdf";
                originalFileName = "Contract.pdf";
                byte[] content = this.Repository.GetApplicationPrint(id);

                if (content == null)
                {
                    throw new ApplicationException("E-5002", string.Format("The contract file does not exist for the application {0}", id));
                }
                stream = new MemoryStream(content);
                stream.Position = 0;
            }
            else
            {
                ////stream = await this.documentStore.RetriveDocumentAsync(this.GetDocumentUniqueName(id, documentType));
                stream = null;
                IEnumerable<ApplicationScan> applicationDocuments = this.Repository.GetApplicationScans(id);
                if (applicationDocuments != null)
                {
                    foreach (ApplicationScan documentMetadata in applicationDocuments)
                    {
                        if (documentMetadata.APPLICATION_SCAN_TYPE_CODE == documentType)
                        {
                            if (documentMetadata.FILE_NAME != null)
                            {
                                int splitIndex = documentMetadata.FILE_NAME.LastIndexOf('|');
                                if (splitIndex >= 0)
                                {
                                    originalFileName = documentMetadata.FILE_NAME.Substring(0, splitIndex);
                                    mimeType = documentMetadata.FILE_NAME.Substring(splitIndex + 1);
                                    byte[] content = this.Repository.GetApplicationScanContent(id, documentType);
                                    if (content == null)
                                    {
                                        throw new ApplicationException("E-5002", string.Format("The contract file does not exist for the application {0}", id));
                                    }
                                    stream = new MemoryStream(content);
                                    stream.Position = 0;
                                }
                            }
                            break;
                        }
                    }
                }
            }
            result = File(stream, mimeType, originalFileName);
            return result;
        }

        /// <summary>
        /// Implements PUT /Applications/{id}/Documents/{documentType}
        /// </summary>
        /// <param name="id"></param>
        /// <param name="documentType"></param>
        /// <returns></returns>
        [HttpPut("{documentType}")]
        public async Task<string> Put(Guid id, string documentType)
        {
            //await this.IsApplicationEligibleForDocumentChange(id);

            if (HttpContext.Request.HasFormContentType)
            {
                if (HttpContext.Request.Form != null
                    && HttpContext.Request.Form.Files != null)
                {
                    foreach (IFormFile file in HttpContext.Request.Form.Files)
                    {
                        string originalFileName = file.FileName;
                        string outputFileName = this.GetDocumentUniqueName(id, documentType);

                        try
                        {
                            char prefix = documentType[0];
                            int sequenceNumber = int.Parse(documentType.Substring(documentType.Length - 2));

                            if (sequenceNumber <= 0)
                            {
                                throw new Exception("Incorrect scanned document number");
                            }

                            int scanMaxCount = this.Repository.GetScanMaxCount(prefix);
                            IEnumerable<ApplicationScan> prefixes = this.Repository.GetApplicationScans(id, prefix);
                            if (prefixes.Count() >= scanMaxCount)
                            {
                                throw new Exception("Application scan limit exceeded");
                            }

                            ////await this.documentStore.StoreDocumentAsync(outputFileName, file.OpenReadStream());
                            using (MemoryStream ms = new MemoryStream())
                            {
                                file.OpenReadStream().CopyTo(ms);
                                this.Repository.SaveApplicationScan(id, documentType, string.Format("{0}|{1}", originalFileName, file.ContentType), ms.ToArray());
                            }

                            string statusState = await this.Repository.GetApplicationStatusState(id);
                            if (statusState == "ADDITIONAL_ATTACHMENTS_NEEDED")
                            {
                                this.Repository.UpdateMessage(id, documentType[0]);
                            }

                        }
                        catch (Exception ex)
                        {
                            throw new ApplicationException("E-0010", string.Format("Failed to save uploaded file {0}", originalFileName), ex);
                        }
                    }
                }
            }
            else
            {
                throw new ApplicationException("E-0310", string.Format("The request for saving document {0} for application {1} does not contain valid payload", documentType, id));
            }
            return "{Status: Success}";
        }

        /// <summary>
        /// Implements DELETE /Applications/{id}/Documents/{documentType}
        /// </summary>
        /// <param name="id"></param>
        /// <param name="documentType"></param>
        /// <returns></returns>
        [HttpDelete("{documentType}")]
        public async Task Delete(Guid id, string documentType)
        {
            ////await this.documentStore.DeleteDocumentAsync(this.GetDocumentUniqueName(id, documentType));
            //await this.IsApplicationEligibleForDocumentChange(id);
            this.Repository.DeleteApplicationScan(id, documentType);
        }
    }
}
