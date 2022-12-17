using System.Web.Mvc;

namespace SpeedCoreWeb.Areas.EventChristmas
{
    public class EventChristmasAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "EventChristmas";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "EventChristmas_default",
                "EventChristmas/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
