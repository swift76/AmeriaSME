namespace IntelART.OnlineLoans.Entities
{
    public class User : ApplicationUser
    {
        public string FIRST_NAME_EN             { get; set; }
        public string LAST_NAME_EN              { get; set; }
        public string SOCIAL_CARD_NUMBER        { get; set; }
        public string TAX_ID_NUMBER             { get; set; }
        public decimal ANNUAL_TURNOVER          { get; set; }
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
        public string FACEBOOK                  { get; set; }
        public string WEBSITE                   { get; set; }
        public string COMPANY_NAME              { get; set; }
        public string ACTIVITY_CODE             { get; set; }
        public string FACTUAL_INDUSTRY_CODE     { get; set; }
        public string CLIENT_CODE               { get; set; }
    }
}
