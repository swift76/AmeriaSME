using System.Collections.Generic;

namespace IntelART.OnlineLoans.Entities
{
    public class ApplicationCompanyOverhead
    {
        public string INDUSTRY_CODE { get; set; }
        public string INDUSTRY_PRODUCT_CODE { get; set; }
        public decimal NET_AMOUNT { get; set; }
        public decimal SALE_AMOUNT { get; set; }
        public decimal PRODUCT_PERCENTAGE { get; set; }
    }

    public class ApplicationCompanyOverheadWithName : ApplicationCompanyOverhead
    {
        public string NAME { get; set; }
        public string INDUSTRY_PRODUCT_NAME { get; set; }
    }

    public class ApplicationCompanyOverheadGrouped
    {
        public string CODE { get; set; }
        public string NAME { get; set; }

        public List<ApplicationCompanyOverheadWithName> PRODUCTS { get; set; }

        public ApplicationCompanyOverheadGrouped()
        {
            PRODUCTS = new List<ApplicationCompanyOverheadWithName>();
        }
    }
}
