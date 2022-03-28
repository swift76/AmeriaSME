using System;

namespace IntelART.OnlineLoans.Entities
{
    public class ApplicationScan
    {
        public Guid APPLICATION_ID { get; set; }
        public int ID { get; set; }
        public string APPLICATION_SCAN_TYPE_CODE { get; set; }
        public string FILE_NAME { get; set; }
        public DateTime CREATION_DATE { get; set; }
    }
}
