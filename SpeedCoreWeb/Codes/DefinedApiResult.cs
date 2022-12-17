using System;
using System.Collections.Generic;

namespace SpeedCoreWeb.Codes
{
    public static class DefinedApiResult
    {
        #region General

        public static ApiResInfo Success = new ApiResInfo(
            200,
            new[]
            {
                "Thành công",
                "Successfully"
            });
        
        public static ApiResInfo BadRequest = new ApiResInfo(
            400,
            new[]
            {
                "Không hợp lệ",
                "Bad Request"
            });

        #endregion

        #region General Data

        public static ApiResInfo NotFoundClient = new ApiResInfo(
            1001,
            new[]
            {
                "Client không tồn tại",
                "Client not found"
            });
        public static ApiResInfo NotFoundVenue = new ApiResInfo(
            1002,
            new[]
            {
                "Venue không tồn tại",
                "Venue not found"
            });
        public static ApiResInfo NotFoundUserCredentials = new ApiResInfo(
            1003,
            new[]
            {
                "Sai thông tin đăng nhập",
                "Invalid username or password"
            });
        public static ApiResInfo NotFoundUser = new ApiResInfo(
            1004,
            new[]
            {
                "User không tồn tại",
                "User not found"
            });
        public static ApiResInfo NotFoundUserGroup = new ApiResInfo(
            1005,
            new[]
            {
                "UserGroup không tồn tại",
                "UserGroup not found"
            });

        #endregion
        
        #region TableServe
        
        public static ApiResInfo TableServe_TableNotAvailable = new ApiResInfo(
            301,
            new[]
            {
                "Bàn này không được mở để phục vụ",
                "This table is out of service"
            });
        public static ApiResInfo TableServe_TableNoServing = new ApiResInfo(
            302,
            new[]
            {
                "Bàn này hiện đang không có nhân viên phục vụ",
                "This table is not being served at the moment"
            });
        public static ApiResInfo TableServe_ServingWaiterOnly = new ApiResInfo(
            303,
            new[]
            {
                "Chỉ có nhân viên đang phục vụ bàn mới có thể thực hiện yêu cầu",
                "Only serving waiter can perform request for the table"
            });
        public static ApiResInfo TableServe_OneWaiterOneTableAtATime = new ApiResInfo(
            304,
            new[]
            {
                "Một nhân viên một lúc chỉ có thể phục vụ một bàn",
                "A waiter can only serve one table at a time"
            });
        public static ApiResInfo TableServe_TableAlreadyOpened = new ApiResInfo(
            305,
            new[]
            {
                "Hiện tại không thể mở bàn này. Vui lòng thử lại sau khi bàn sẳn sàng phục vụ",
                "This table is currently unavailable. Try again when the table is ready"
            });
        public static ApiResInfo TableServe_CantCloseReadyTable = new ApiResInfo(
            306,
            new[]
            {
                "Không thể đóng bàn đang sẳn sàng phục vụ",
                "Cannot close tables in Ready state"
            });
        public static ApiResInfo TableServe_SectionConfiguredIncorrectly = new ApiResInfo(
            307,
            new[]
            {
                "Bàn vừa chọn có cấu hình Section không hợp lệ",
                "This Map Table has section configured incorrectly"
            });
        public static ApiResInfo TableServe_BillNotFound = new ApiResInfo(
            308,
            new[]
            {
                "Không tìm thấy Bill liên kết với Bàn",
                "Cannot find Bill associated with this table"
            });
        public static ApiResInfo TableServe_BillAlreadyClosed = new ApiResInfo(
            309,
            new[]
            {
                "Bill của Bàn đã được đóng",
                "Table's Bill has already been closed"
            });
        public static ApiResInfo TableServe_PayMethodNotFound = new ApiResInfo(
            310,
            new[]
            {
                "Phương thức thanh toán không hợp lệ",
                "Invalid Payment Method"
            });
        public static ApiResInfo TableServe_NoOrderToPay = new ApiResInfo(
            311,
            new[]
            {
                "Không thể thanh toán Bill của Bàn do không có Order",
                "Cannot perform payment on Table's Bill as it has no order"
            });
        public static ApiResInfo TableServe_PayMismatchAmountDue = new ApiResInfo(
            312,
            new[]
            {
                "Số tiền cần trả của Bill không khớp. (Phải là {0})",
                "Mismatch AmountDue between Bill and request"
            });
        public static ApiResInfo TableServe_PayMismatchChange = new ApiResInfo(
            313,
            new[]
            {
                "Số tiền thói / tiền tip không khớp. (Phải là {0})",
                "Mismatch Change between Bill and request"
            });
        public static ApiResInfo TableServe_PayTotalGoesNegative = new ApiResInfo(
            314,
            new[]
            {
                "Tổng tiền thanh toán sẽ có giá trị âm nếu tiến hành thanh toán ({0}). Vui lòng kiểm tra bill",
                "Total paid amount would be negative if proceeded. Please check bill"
            });
        public static ApiResInfo TableServe_PayTotalExceedBillTotal = new ApiResInfo(
            315,
            new[]
            {
                "Tổng tiền thanh toán sẽ có giá trị vượt số tiền tổng của Bill ({0}/{1}). Vui lòng kiểm tra bill",
                "Total paid amount would be negative if proceeded. Please check bill"
            });
        public static ApiResInfo TableServe_PayMethodNotActive = new ApiResInfo(
            316,
            new[]
            {
                "Phương thức thanh toán hiện đã bị vô hiệu hoá",
                "Payment Method is currently disabled"
            });
        public static ApiResInfo TableServe_CannotCloseUnpaidBill = new ApiResInfo(
            316,
            new[]
            {
                "Không thể đóng bàn khi chưa thanh toán hoàn tất",
                "Cannot close table as the bill is unpaid"
            });
        public static ApiResInfo TableServe_PaidNotFound = new ApiResInfo(
            317,
            new[]
            {
                "Đơn thanh toán bàn không hợp lệ",
                "Invalid TableServePaid"
            });
        public static ApiResInfo TableServe_PaidAlreadyCommitted = new ApiResInfo(
            318,
            new[]
            {
                "Không thể tiếp tục do đơn thanh toán bàn đã được xác nhận thành công",
                "Unable to proceed as TableServePaid is already committed"
            });
        public static ApiResInfo TableServe_PaidCannotCancel = new ApiResInfo(
            319,
            new[]
            {
                "Không thể huỷ đơn thanh toán này",
                "Unable to cancel this TableServePaid"
            });
        public static ApiResInfo TableServe_BillSummaryInvalid = new ApiResInfo(
            320,
            new[]
            {
                "Số tiền tổng không khớp (Phải là {0} ; {1})",
                "Mismatch bill total"
            });
        public static ApiResInfo TableServe_BillSummaryTaxInvalid = new ApiResInfo(
            321,
            new[]
            {
                "Số tiền tổng các thuế không khớp (phải là {0}, {1}, {2}, {3}, {4})",
                "Mismatch bill taxes total"
            });
        public static ApiResInfo TableServe_TaxNotFound = new ApiResInfo(
            322,
            new[]
            {
                "Thuế không hợp lệ",
                "Invalid tax"
            });
        public static ApiResInfo TableServe_OrderDetailInvalid = new ApiResInfo(
            323,
            new[]
            {
                "Chi tiết đơn không hợp lệ (DetailUniq: {0}, ParentUniq: {1}, Type: {2})",
                "Invalid Order Detail"
            });
        public static ApiResInfo TableServe_OrderDetailItemNotFound = new ApiResInfo(
            324,
            new[]
            {
                "Chi tiết đơn có Sản phẩm '{0}' ({1}) không tồn tại",
                "Order Detail has invalid Item"
            });
        public static ApiResInfo TableServe_OrderDetailSalePriceInvalid = new ApiResInfo(
            325,
            new[]
            {
                "Chi tiết đơn có Sản phẩm '{0}' ({1}) có giá không khớp so với bảng giá",
                "One or many items in Order Detail has mismatch prices"
            });
        public static ApiResInfo TableServe_OrderDetailItemComboLinkNotFound = new ApiResInfo(
            326,
            new[]
            {
                "Chi tiết đơn có Sản phẩm '{0}' ({1}) với Liên kết sản phẩm combo không hợp lệ",
                "Order Detail has invalid Item Combo Link"
            });
        public static ApiResInfo TableServe_OrderDetailItemComboNotFound = new ApiResInfo(
            327,
            new[]
            {
                "Chi tiết đơn có Combo '{0}' ({1}) không tồn tại",
                "Order Detail has invalid Combo"
            });
        public static ApiResInfo TableServe_OrderDetailModifierNotFound = new ApiResInfo(
            328,
            new[]
            {
                "Chi tiết đơn có Tuỳ biến sản phẩm '{0}' ({1}) không tồn tại",
                "Order Detail has invalid Modifier"
            });
        public static ApiResInfo TableServe_OrderDetailParentInvalid = new ApiResInfo(
            329,
            new[]
            {
                "Chi tiết đơn có quan hệ parent child không hợp lệ (id: {0})",
                "Order Detail has invalid parent-child relationship"
            });
        public static ApiResInfo TableServe_OrderDetailModifierInvalidCount = new ApiResInfo(
            330,
            new[]
            {
                "Chi tiết đơn có số lượng Tuỳ biến sản phẩm cho sản phẩm '{0}' ({1}) không hợp lệ",
                "Order Detail has invalid Modifier Count"
            });
        public static ApiResInfo TableServe_OrderDetailOptionSetNotFound = new ApiResInfo(
            331,
            new[]
            {
                "Tuỳ biến sản phẩm '{0}' ({1}) của chi tiết đơn có OptionSetID không hợp lệ (ID: {2})",
                "Order Detail Modifier has invalid OptionSetID"
            });
        public static ApiResInfo TableServe_TscRefCodeAlreadyExist = new ApiResInfo(
            332,
            new[]
            {
                "Đã tồn tại ConfirmOrder với ReferenceCode='{0}'",
                "TableServeConfirm with specified ReferenceCode has already exist"
            });
        
        #endregion

        #region Payment

        public static ApiResInfo Payment_PayTransactionNotFound = new ApiResInfo(
            401,
            new[]
            {
                "Giao dịch không tồn tại",
                "Pay Transaction not found"
            });
        public static ApiResInfo Payment_PayTransactionUpdateStatusInvalid = new ApiResInfo(
            410,
            new[]
            {
                "Trạng thái giao dịch không hợp lệ (từ {0} đến {1})",
                "Invalid Payment Transaction status"
            });

        #endregion

        #region SyncState

        public static ApiResInfo VenueDataSync_InvalidDbType = new ApiResInfo(
            501,
            new[]
            {
                "Venue không được cấu hình để thực hiện đồng bộ trạng thái",
                "Venue is not configured to perform State Sync"
            });

        #endregion
    }

    public class ApiResInfo
    {
        public static string[] Languages = { "vn", "en" };

        public int Status { get; set; }
        public string[] Descriptions { get; set; }

        public ApiResInfo(int status, string[] descriptions)
        {
            Status = status;
            Descriptions = descriptions;
        }
    }

    public static class ApiResInfoExtension
    {
        public static APIResult Get(this ApiResInfo apiResInfo)
        {
            APIResult apiResult = new APIResult
            {
                Status = apiResInfo.Status,
                Message = apiResInfo.Descriptions[0]
            };
            
            apiResult.Description.Clear();
            for (int i = 1; i < ApiResInfo.Languages.Length; i++)
            {
                apiResult.Description.Add(ApiResInfo.Languages[i], apiResInfo.Descriptions[i]);
            }
            
            return apiResult;
        }
    }
}
