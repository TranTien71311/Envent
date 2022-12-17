using SpeedCoreWeb.Frameworks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SpeedCoreWeb.Areas.ReportViewer.DTO
{
    public class LoginDTO
    {
        public class Data
        {
            public int? UserID { get; set; }
            public string GUID { get; set; }
            public int? ClientID { get; set; }
            public string ClientName { get; set; }
            public int? UserGroupID { get; set; }
            public string UserGroupName { get; set; }
            public string UserName { get; set; }
            public bool? AccessAllFunctions { get; set; }
            public string ReferenceCode { get; set; }
            public DateTime? DateModified { get; set; }
            public DateTime? DateCreated { get; set; }
            public bool? IsActive { get; set; }
            public List<UserVenueLink> UserVenueLinks { get; set; }
            public List<UserFunctionLink> UserFunctionLinks { get; set; }
        }

        public class Root
        {
            public List<Data> Login { get; set; }
        }

    }
}
