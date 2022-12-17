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
    public class MemberModel
    {
        public APIResult Get(ClientDbContextExtend ClientDbContext,
            Nullable<int> CompanyID = null,
            Nullable<int> MemberID = null,
            Nullable<bool> IsConfirm = null,
            Nullable<bool> IsActive = null,
            Nullable<int> PageSize = null,
            Nullable<int> PageNum = null,
            string OrderBy = null)
        {
            APIResult _Result = new APIResult();
            List<Member> _Data = null;
            Expression<Func<Member, bool>> _Filter = r => true;
            int _Row = 0;

            if (CompanyID != null)
                _Filter = FunctionHelper.AndAlso(_Filter, r => r.CompanyID == CompanyID);

            if (MemberID != null)
                _Filter = FunctionHelper.AndAlso(_Filter, r => r.MemberID == MemberID);

            if (IsConfirm != null)
                _Filter = FunctionHelper.AndAlso(_Filter, r => r.IsConfirm == IsConfirm);

            if (IsActive != null)
                _Filter = FunctionHelper.AndAlso(_Filter, r => r.IsActive == IsActive);

            _Data = ClientDbContext.Members.Where(_Filter).ToList();

            var _JoinData = (from d in _Data
                             join c in ClientDbContext.Companies on d.CompanyID equals c.CompanyID
                             select new
                             {
                                 MemberID = d.MemberID,
                                 FullName = d.FullName,
                                 Title = d.Title,
                                 IsConfirm = d.IsConfirm,
                                 Company = c,
                                 IsActive = d.IsActive,
                                 Table = d.Table
                             }).ToList();

            if (OrderBy != null)
                if (OrderBy.Equals("ASC"))
                    _JoinData = _JoinData.OrderBy(o => o.MemberID).ToList();
                else
                    if (OrderBy.Equals("DESC"))
                    _JoinData = _JoinData.OrderByDescending(o => o.MemberID).ToList();

            if (PageNum != null && PageSize != null)
                _JoinData = _JoinData.Skip((int)PageNum * (int)PageSize).Take((int)PageSize).ToList();

            _Result.Status = 200;
            _Result.Message = "Thành công";
            _Result.Description.Clear();
            _Result.Description.Add("en", "Successfully");
            _Result.Data = _JoinData;
            return _Result;
        }

        public APIResult Update(ClientDbContextExtend ClientDbContext,
            Member Member, JObject JObject)
        {
            APIResult _Result = new APIResult();

            Member _Member = null;
            _Member = ClientDbContext.Members.SingleOrDefault(s => s.MemberID == Member.MemberID);

            if (_Member == null)
            {
                _Result.Status = 0;
                _Result.Message = "Mã người dùng không tồn tại";
                _Result.Description.Clear();
                _Result.Description.Add("en", "Member ID does not exist");
                return _Result;
            }

            if (Member.IsActive != null)
            {
                _Member.IsActive = Member.IsActive;
            }

            if (Member.IsConfirm != null)
            {
                _Member.IsConfirm = Member.IsConfirm;
            }

            _Result.Status = 200;
            _Result.Message = "Thành công";
            _Result.Description.Clear();
            _Result.Description.Add("en", "Successfully");
            _Result.Data = _Member;
            return _Result;
        }
    }
}