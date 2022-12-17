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

namespace SpeedCoreWeb.Controllers
{
    public class MemberController : ApiController
    {
        MemberModel _ClientModel = new MemberModel();
        [HttpGet]
        public APIResult Get(
            Nullable<int> CompanyID = null,
            Nullable<int> MemberID = null,
            Nullable<bool> IsConfirm = null,
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
                    //_ClientDbContext.Database.Connection.ConnectionString = "";
                    return _ClientModel.Get(_ClientDbContext,
                        CompanyID,
                        MemberID,
                        IsConfirm,
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



        [HttpPut]
        public APIResult Put([NakedBody] string Body)
        {
            APIResult _Result = new APIResult();
            try
            {
                using (ClientDbContextExtend _ClientDbContext = new ClientDbContextExtend())
                {
                    Member _Member = JsonConvert.DeserializeObject<Member>(Body);
                    _Result = _ClientModel.Update(_ClientDbContext, _Member, JObject.Parse(Body));
                    if (_Result.Status == 200)
                        _ClientDbContext.SaveChanges();
                    return _Result;
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
            }
            return _Result;
        }
    }
}
