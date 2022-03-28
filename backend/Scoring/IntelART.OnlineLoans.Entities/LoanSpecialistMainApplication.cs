using System;
using System.Collections.Generic;

namespace IntelART.OnlineLoans.Entities
{
    /// <summary>
    /// Main application filled in by loan specialist
    /// </summary>
    public class LoanSpecialistMainApplication : MainApplication
    {
        public string TAX_ID_NUMBER       { get; set; }
        public string COMPANY_NAME        { get; set; }
        public decimal BUSINESS_SPACE     { get; set; }
        public string BUSINESS_STATE_CODE { get; set; }
        public int EMPLOYEE_COUNT         { get; set; }
        public int FAMILY_MEMBER_COUNT    { get; set; }
        public int VEHICLE_COUNT          { get; set; }
        public string LS_LOAN_TYPE_ID     { get; set; }
        public decimal LS_LOAN_AMOUNT     { get; set; }
        public string LS_CURRENCY_CODE    { get; set; }
        public string LS_LOAN_TERM        { get; set; }
        public byte LS_REPAYMENT_DAY      { get; set; }
        public DateTime? LS_ENTRY_DATE     { get; set; }
        public bool IS_AREA_RENTED        { get; set; }
        public string AREA_RENTED_COMMENT { get; set; }
        public string ACTIVITY_DESCRIPTION { get; set; }
        public string APPROVED_AMOUNT     { get; set; }
        public IEnumerable<ApplicationCompanyData> PROFITS   { get; set; }
        public List<ApplicationCompanyOverheadGrouped> OVERHEADS { get; set; }
        public IEnumerable<ApplicationCompanyData> COSTS     { get; set; }
        public IEnumerable<ApplicationCompanyData> BALANCES  { get; set; }
        public IEnumerable<ApplicationCompanyData> OPERATIONAL_EXPENSES    { get; set; }
        public IEnumerable<ApplicationCompanyData> NONOPERATIONAL_EXPENSES { get; set; }
        public IEnumerable<ApplicationCompanyData> OTHER_STATISTICS        { get; set; }
        public IEnumerable<ApplicationCompanyData> GOOD_MONTH_EARNINGS     { get; set; }
        public IEnumerable<ApplicationCompanyData> BAD_MONTH_EARNINGS      { get; set; }
        public IEnumerable<ApplicationRelatedPerson> GUARANTORS            { get; set; }

        // Pledge Section

        public bool? IS_REAL_ESTATE                { get; set; }
        public bool SHOULD_MAIN_AGREEMENT_SIGNED   { get; set; }
        public bool IS_MAIN_AGREEMENT_SIGNED       { get; set; }
        public bool IS_SUCCESSIVE_PLEDGING         { get; set; }
        public decimal MARKET_PRICE                { get; set; }
        public decimal LIQUID_PRICE                { get; set; }
        public bool IS_INSURANCE_CONDITION         { get; set; }
        public bool IS_INSURANCE_BY_BANK           { get; set; }
        public string INSURANCE_COMPANY_CODE       { get; set; }
        public string APPRAISAL_COMPANY_CODE       { get; set; }
        public DateTime? APPRAISAL_DATE             { get; set; }
        public string ESTATE_ADDRESS               { get; set; }
        public decimal ESTATE_RESIDENTIAL_AREA     { get; set; }
        public decimal ESTATE_LAND_AREA            { get; set; }
        public string OWNERSHIP_CERTIFICATE_NUMBER { get; set; }
        public DateTime? OWNERSHIP_CERTIFICATE_DATE { get; set; }
        public string VEHICLE_MODEL                { get; set; }
        public string VEHICLE_VIN                  { get; set; }
        public DateTime? VEHICLE_DATE               { get; set; }
        public IEnumerable<ApplicationRelatedPerson> PLEDGERS { get; set; }

        public LoanSpecialistMainApplication()
        {
            this.PROFITS   = new List<ApplicationCompanyData>();
            this.OVERHEADS = new List<ApplicationCompanyOverheadGrouped>();
            this.COSTS     = new List<ApplicationCompanyData>();
            this.BALANCES  = new List<ApplicationCompanyData>();
            this.OPERATIONAL_EXPENSES    = new List<ApplicationCompanyData>();
            this.NONOPERATIONAL_EXPENSES = new List<ApplicationCompanyData>();
            this.OTHER_STATISTICS        = new List<ApplicationCompanyData>();
            this.GUARANTORS              = new List<ApplicationRelatedPerson>();
            this.PLEDGERS                = new List<ApplicationRelatedPerson>();
        }
    }
}
