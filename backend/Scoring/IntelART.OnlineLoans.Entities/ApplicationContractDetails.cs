using System;

namespace IntelART.OnlineLoans.Entities
{
    /// <summary>
    /// The application details necessary for the contracts
    /// </summary>
    public class ApplicationContractDetails
    {
        public DateTime CREATION_DATE       { get; set; }
        public string CLIENT_CODE           { get; set; }
        public string SOCIAL_CARD_NUMBER    { get; set; }
        public string TAX_ID_NUMBER         { get; set; }
        public string CURRENT_COUNTRY_NAME  { get; set; }
        public string CURRENT_STATE_NAME    { get; set; }
        public string CURRENT_CITY_NAME     { get; set; }
        public string CURRENT_STREET        { get; set; }
        public string CURRENT_BUILDNUM      { get; set; }
        public string CURRENT_APARTMENT     { get; set; }
        public string INDIVIDUAL_COUNTRY_NAME { get; set; }
        public string INDIVIDUAL_STATE_NAME { get; set; }
        public string INDIVIDUAL_CITY_NAME  { get; set; }
        public string INDIVIDUAL_STREET     { get; set; }
        public string INDIVIDUAL_BUILDNUM   { get; set; }
        public string INDIVIDUAL_APARTMENT  { get; set; }
        public string MOBILE_PHONE          { get; set; }
        public string EMAIL                 { get; set; }
        public string FACEBOOK              { get; set; }
        public string WEBSITE               { get; set; }
        public string FACTUAL_INDUSTRY_NAME { get; set; }
        public decimal ANNUAL_TURNOVER      { get; set; }
        public string LOAN_TERM             { get; set; }
        public decimal INITIAL_AMOUNT       { get; set; }
        public string CURRENCY_NAME         { get; set; }
        public byte REPAYMENT_DAY           { get; set; }
        public decimal FINAL_AMOUNT         { get; set; }
        public decimal INTEREST             { get; set; }
        public bool IS_REFINANCING          { get; set; }
        public bool? IS_NEW_CARD            { get; set; }
        public string EXISTING_CARD_CODE    { get; set; }
        public string NEW_CARD_TYPE_NAME    { get; set; }
        public string CARD_DELIVERY_BANK_BRANCH_NAME { get; set; }
        public string CARD_DELIVERY_ADDRESS { get; set; }
        public string TEMPLATE_CODE         { get; set; }
        public string LOAN_TYPE_ID          { get; set; }
        public DateTime REPAYMENT_BEGIN_DATE { get; set; }
        public DateTime REPAYMENT_END_DATE   { get; set; }
    }
}
