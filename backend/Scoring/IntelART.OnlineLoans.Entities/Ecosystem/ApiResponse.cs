using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace IntelART.OnlineLoans.Entities.Ecosystem
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public ResponseMessage Message { get; set; }
        public T Data { get; set; }

        public ApiResponse()
        {
            Success = false;
        }
    }

    public class ResponseMessage
    {
        public string eng { get; set; }
        public string arm { get; set; }
    }
}
