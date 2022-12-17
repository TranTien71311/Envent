using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SpeedCoreWeb.Codes
{
    public class APIResult
    {
        public int Status { set; get; }
        public string Message { set; get; }
        public Dictionary<string, string> Description { set; get; }
        public string Exception { set; get; }
        public object Data { set; get; }
        public int? TotalRow { set; get; }
        public APIResult()
        {
            Description = new Dictionary<string, string>();
        }
    }


    
}