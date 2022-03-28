using System;
using System.Collections.Generic;

namespace IntelART.Ameria.CLRServices
{
    public class ACRALegalQueryResult
    {
        public Guid? ApplicationID { get; set; }

        public List<ACRAQueryResultDetails> Details { get; set; }
        public List<ACRAQueryResultQueries> Queries { get; set; }

        public ACRALegalQueryResult()
        {
            Details = new List<ACRAQueryResultDetails>();
            Queries = new List<ACRAQueryResultQueries>();
        }
    }
}
