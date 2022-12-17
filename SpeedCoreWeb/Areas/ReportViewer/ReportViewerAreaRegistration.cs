using System.Web.Mvc;

namespace SpeedCoreWeb.Areas.ReportViewer
{
    public class ReportViewerAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "ReportViewer";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "ReportViewer_default",
                "ReportViewer/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional },
                 new[] { "SpeedCoreWeb.Areas.ReportViewer.Controllers" }
            );
        }
    }
}
