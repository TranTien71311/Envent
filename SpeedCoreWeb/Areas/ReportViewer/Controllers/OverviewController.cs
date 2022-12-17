using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SpeedCoreWeb.Areas.ReportViewer.Controllers
{
    public class OverviewController : Controller
    {
        //
        // GET: /ReportViewer/Overview/

        public ActionResult Index()
        {
            //if (Session["UserId"] == null)
            //{
            //    return RedirectToAction("Index", "Login");
            //}
            return View();
        }

    }
}
