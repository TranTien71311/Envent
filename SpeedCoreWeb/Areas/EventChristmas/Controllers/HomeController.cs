using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SpeedCoreWeb.Areas.EventChristmas.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /EventChristmas/Home/

        public ActionResult Index(int id)
        {
            Session["MemberID"] = id;
            return View();
        }
    }
}
