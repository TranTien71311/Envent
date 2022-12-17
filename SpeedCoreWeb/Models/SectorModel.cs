using Newtonsoft.Json.Linq;
using SpeedCoreWeb.Codes;
using SpeedCoreWeb.Frameworks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Web;
using iAnywhere.Data.SQLAnywhere;
using Newtonsoft.Json;

namespace SpeedCoreWeb.Models
{
    public class SectorModel
    {
        public APIResult Get(ClientDbContextExtend ClientDbContext,
            Nullable<int> SectorID = null,
            string SectorName = null,
            Nullable<bool> IsActive = null,
            Nullable<int> PageSize = null,
            Nullable<int> PageNum = null,
            string OrderBy = null)
        {
            APIResult _Result = new APIResult();
            List<Sector> _Data = null;
            Expression<Func<Sector, bool>> _Filter = r => true;
            int _Row = 0;

            if (SectorID != null)
                _Filter = FunctionHelper.AndAlso(_Filter, r => r.SectorID == SectorID);

            if (SectorName != null)
                _Filter = FunctionHelper.AndAlso(_Filter, r => r.SectorName.Contains(SectorName));

            if (IsActive != null)
                _Filter = FunctionHelper.AndAlso(_Filter, r => r.IsActive == IsActive);

            _Data = ClientDbContext.Sectors.Where(_Filter).ToList();
            _Row = _Data.Count();

            if (OrderBy != null)
                if (OrderBy.Equals("ASC"))
                    _Data = _Data.OrderBy(o => o.SectorID).ToList();
                else
                    if (OrderBy.Equals("DESC"))
                    _Data = _Data.OrderByDescending(o => o.SectorID).ToList();

            if (PageNum != null && PageSize != null)
                _Data = _Data.Skip((int)PageNum * (int)PageSize).Take((int)PageSize).ToList();

            _Result.Status = 200;
            _Result.Message = "Thành công";
            _Result.Description.Clear();
            _Result.Description.Add("en", "Successfully");
            _Result.Data = _Data;
            _Result.TotalRow = _Row;
            return _Result;
        }
    }
}