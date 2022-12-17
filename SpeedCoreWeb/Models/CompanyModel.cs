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
    public class CompanyModel
    {
        public APIResult Get(ClientDbContextExtend ClientDbContext,
            Nullable<int> CompanyID = null,
            Nullable<int> SectorID = null,
            string CompanyName = null,
            Nullable<bool> IsActive = null,
            Nullable<int> PageSize = null,
            Nullable<int> PageNum = null,
            string OrderBy = null)
        {
            APIResult _Result = new APIResult();
            List<Company> _Data = null;
            Expression<Func<Company, bool>> _Filter = r => true;
            int _Row = 0;

            if (CompanyID != null)
                _Filter = FunctionHelper.AndAlso(_Filter, r => r.CompanyID == CompanyID);

            if (CompanyName != null)
                _Filter = FunctionHelper.AndAlso(_Filter, r => r.CompayName.Contains(CompanyName));

            if (IsActive != null)
                _Filter = FunctionHelper.AndAlso(_Filter, r => r.IsActive == IsActive);

            _Data = ClientDbContext.Companies.Where(_Filter).ToList();
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