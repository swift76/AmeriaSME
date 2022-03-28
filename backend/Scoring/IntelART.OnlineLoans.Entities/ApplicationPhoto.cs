using System;

namespace IntelART.OnlineLoans.Entities
{
    public class ApplicationPhoto
    {
        public Guid APPLICATION_ID { get; set; }
        public int ID { get; set; }
        public string FILE_NAME { get; set; }
        public bool IS_PLEDGE { get; set; }
        public DateTime CREATION_DATE { get; set; }
    }
}
