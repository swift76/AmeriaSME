using System;

namespace IntelART.OnlineLoans.Entities
{
    public class Message
    {
        public Guid APPLICATION_ID { get; set; }
        public DateTime DATE       { get; set; }
        public char SCAN_TYPE      { get; set; }
        public string TEXT         { get; set; }
        public bool IS_APPROVED    { get; set; }
    }
}
