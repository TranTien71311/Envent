using EasyInvoice.Json;
using SpeedCoreWeb.Areas.ReportViewer.DTO;
using SpeedCoreWeb.Codes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Mvc;

namespace SpeedCoreWeb.Areas.ReportViewer.Controllers
{
    public class LoginController : Controller
    {
        //
        // GET: /ReportViewer/Login/

        public ActionResult Index()
        { 
            return View();
        }

        [HttpGet]
        public ActionResult Login([NakedBody] string Body)
        {
            if (Body != null)
            {
                LoginDTO.Data _Data = JsonConvert.DeserializeObject<LoginDTO.Data>(Body);

                Session["UserId"] = _Data.UserID;
                Session["UserName"] = _Data.UserName;
                Session["IsAdmin"] = _Data.AccessAllFunctions;
                Session["Stores"] = _Data.UserVenueLinks;
                Session["Date"] = DateTime.Now.ToString("yyyy-MM-dd");

                //return RedirectToAction("Index", "ReportViewer");
            }
            return RedirectToAction("Index", "Overview");
        }
    }
}
