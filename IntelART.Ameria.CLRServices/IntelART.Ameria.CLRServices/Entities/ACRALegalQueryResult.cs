using System;
using System.Collections.Generic;

namespace IntelART.Ameria.CLRServices
{
    public class ACRALegalQueryResult
    {
        public Guid? ApplicationID { get; set; }

        public List<ACRAQueryResultDetails> Details { get; set; }
        public List<ACRAQueryResultQueries> Queries { get; set; }
        public List<ACRAQueryResultInterrelated> Interrelated { get; set; }
        public List<ACRAQueryResultPayments> Payments { get; set; }
        public List<ACRAQueryResultDueDates> DueDates { get; set; }
        public TaxData TaxData { get; set; }
        public string ResponseXml { get; set; }
        public string Presence { get; set; }
        public int ClassificationCount { get; set; }
        public DateTime? ReviewDate { get; set; }
        public string LoanWorstClass { get; set; }
        public string GuaranteeWorstClass { get; set; }
        public string FicoScore { get; set; }

        public ACRALegalQueryResult()
        {
            Details = new List<ACRAQueryResultDetails>();
            Queries = new List<ACRAQueryResultQueries>();
            Interrelated = new List<ACRAQueryResultInterrelated>();
            Payments = new List<ACRAQueryResultPayments>();
            DueDates = new List<ACRAQueryResultDueDates>();
            TaxData = new TaxData();
        }
    }
}
