using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SpeedCoreWeb.Codes;
using SpeedCoreWeb.Frameworks;
using SpeedCoreWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using iAnywhere.Data.SQLAnywhere;
using System.ComponentModel.Design;

namespace SpeedCoreWeb.Controllers
{
    public class CompanyController : ApiController
    {
        CompanyModel _ClientModel = new CompanyModel();
        [HttpGet]
        public APIResult Get(
            Nullable<int> CompanyID = null,
            Nullable<int> SectorID = null,
            string CompanyName = null,
            Nullable<bool> IsActive = null,
            Nullable<int> PageSize = null,
            Nullable<int> PageNum = null,
            string OrderBy = null)
        {
            APIResult _Result = new APIResult();
            try
            {
                using (ClientDbContextExtend _ClientDbContext = new ClientDbContextExtend())
                {
                    return _ClientModel.Get(_ClientDbContext,
                        CompanyID,
                        SectorID,
                        CompanyName,
                        IsActive,
                        PageSize,
                        PageNum,
                        OrderBy);
                }
            }
            catch (Exception ex)
            {
                _Result.Status = 0;
                _Result.Message = "Lỗi ngoại lệ (" + ex.Message + ")";
                _Result.Description.Clear();
                _Result.Description.Add("en", ex.Message);
                _Result.Exception = ex.ToString();
                _Result.Data = null;
                _Result.TotalRow = null;
            }
            return _Result;
        }
    }
}
