using iAnywhere.Data.SQLAnywhere;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SpeedCoreWeb.Frameworks
{
    public class ClientDbContextExtend : ClientDbContext
    {
        public SAConnection SAConnection { set; get; }
        public SATransaction SATransaction { set; get; }
        public SACommand SACommand { set; get; }
    }
}