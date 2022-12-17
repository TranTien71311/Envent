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
    public class SectorController : ApiController
    {
        SectorModel _ClientModel = new SectorModel();
        [HttpGet]
        public APIResult Get(
            Nullable<int> SectorID = null,
            string SectorName = null,
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
                        SectorID,
                        SectorName,
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



        //[HttpPut]
        //public APIResult Put([NakedBody] string Body)
        //{
        //    APIResult _Result = new APIResult();
        //    try
        //    {
        //        using (ClientDbContextExtend _ClientDbContext = new ClientDbContextExtend())
        //        {
        //            int _PartnerID = 0;
        //            string _ConnectionString = "";
        //            _Result = _CoreModel.Auth(this, ref _ConnectionString, ref _PartnerID, Body);
        //            if (_Result.Status == 200)
        //            {
        //                _ClientDbContext.Database.Connection.ConnectionString = _ConnectionString;
        //                Category _Category = JsonConvert.DeserializeObject<Category>(Body);
        //                using (_ClientDbContext.SAConnection = new SAConnection(_ConnectionString))
        //                {
        //                    _ClientDbContext.SAConnection.Open();
        //                    _Result = _ClientModel.Update(_ClientDbContext, _Category, JObject.Parse(Body));
        //                    if (_Result.Status == 200)
        //                        _ClientDbContext.SaveChanges();
        //                }
        //                return _Result;
        //            }
        //            else
        //            {
        //                return _Result;
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _Result.Status = 0;
        //        _Result.Message = "Lỗi ngoại lệ (" + ex.Message + ")";
        //        _Result.Description.Clear();
        //        _Result.Description.Add("en", ex.Message);
        //        _Result.Exception = ex.ToString();
        //        _Result.Data = null;
        //    }
        //    return _Result;
        //}
    }
}
