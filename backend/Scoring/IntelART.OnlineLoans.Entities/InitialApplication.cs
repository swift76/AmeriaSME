namespace IntelART.OnlineLoans.Entities
{
    /// <summary>
    /// The preapproval application for the loan
    /// It contain all the info from the applicatin metadata, thus inheriting it
    /// </summary>
    public class InitialApplication : Application
    {
        public decimal INITIAL_AMOUNT           { get; set; }
        public string CURRENCY_CODE             { get; set; }
        public decimal ANNUAL_TURNOVER          { get; set; }
        public string FIRST_NAME_EN             { get; set; }
        public string LAST_NAME_EN              { get; set; }
        public string SOCIAL_CARD_NUMBER        { get; set; }
        public string TAX_ID_NUMBER             { get; set; }
        public string MOBILE_PHONE              { get; set; }
        public string EMAIL                     { get; set; }
        public string DOCUMENT_NUMBER           { get; set; }
        public string COMPANY_NAME              { get; set; }
        public string COMPANY_EMAIL             { get; set; }
        public string FACEBOOK                  { get; set; }
        public string WEBSITE                   { get; set; }
        public bool IS_CURRENT_ADDRESS_SAME     { get; set; }
        public string CURRENT_COUNTRY_CODE      { get; set; }
        public string CURRENT_STATE_CODE        { get; set; }
        public string CURRENT_CITY_CODE         { get; set; }
        public string CURRENT_STREET            { get; set; }
        public string CURRENT_BUILDNUM          { get; set; }
        public string CURRENT_APARTMENT         { get; set; }
        public bool IS_INDIVIDUAL_ADDRESS_SAME  { get; set; }
        public string INDIVIDUAL_COUNTRY_CODE   { get; set; }
        public string INDIVIDUAL_STATE_CODE     { get; set; }
        public string INDIVIDUAL_CITY_CODE      { get; set; }
        public string INDIVIDUAL_STREET         { get; set; }
        public string INDIVIDUAL_BUILDNUM       { get; set; }
        public string INDIVIDUAL_APARTMENT      { get; set; }
        public string ACTIVITY_CODE             { get; set; }
        public string FACTUAL_INDUSTRY_CODE     { get; set; }
        public bool AGREED_WITH_TERMS           { get; set; }
        public string CLIENT_CODE               { get; set; }
        public bool IS_DATA_COMPLETE            { get; set; }
        public string REFUSAL_REASON            { get; set; }
        public string MANUAL_REASON             { get; set; }
        public string IDENTIFICATION_REASON     { get; set; }
        public int ISN { get; set; }
    }
}
