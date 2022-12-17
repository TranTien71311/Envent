let table;
let isExcuteSingle;
let storeId = -1;
let totalTrans = 0;
let timeStart = "";
let inputDetail = $('.input-detail');
let storeConfig = {};
let rowData = {};

$(document).ready(() => {
    initializeDataTable();
    $('#filter-date').val(moment(new Date()).format("MM/DD/YYYY"));
    $('#dataTable').css('display', 'none');
    $('.lds-hourglass').css('display', 'block');
    getAllStore()
    addEventClickOnRow();
});

const initializeDataTable = () =>{
    table = $('#data-tb').on('processing.dt', function (e, settings, processing) {
    }).DataTable({
        "destroy": true,
        "scrollY": true,
        "scrollX": true,
        "paging": false,
        "lengthChange": false,
        "searching": true,
        "order": [[0, 'asc']],
        "ordering": true,
        "info": true,
        "processing": false,
        "fixedHeader": {
            headerOffset: 60
        },
        "fnInitComplete": function (oSettings) {
            $(window).resize();
        },
        "fnDrawCallback": function (oSettings) {
            $(window).trigger('resize');
        },
        "columns": [
            {
                "data": "index",
                "name": "index",
                "autoWidth": true,
                render: function (data, type, row) {
                    return data;
                },
                "className": "dt-body-center "
            },
            {
                "name": "CheckBox",
                "autoWidth": true,
                "className": "dt-body-right",
                render: function (data, type, row) {
                    return '<input class="cbx-row" onchange="checkDisabledBtn()" type="checkbox">';
                },
                "className": "dt-body-center"
            },
            {
                "data": "TransactionCode",
                "name": "TransactionCode",
                "autoWidth": true,
                render: function (data, type, row) {
                    return data
                },
                "className": "dt-body-center "
            },
            {
                "data": "NetTotal",
                "name": "NetTotal",
                "autoWidth": true,
                render: function (data, type, row) {
                    return numberFormat(data);
                },
                "className": "dt-body-right",
            },
            {
                "data": "VATAmount",
                "name": "VATAmount",
                "autoWidth": true,
                render: function (data, type, row) {
                    return numberFormat(data);
                },
                "className": "dt-body-right",
            },
            {
                "data": "VATRate",
                "name": "VATRate",
                "autoWidth": true,
                render: function (data, type, row) {
                    return data + " %";
                },
                "visible": (getCookie('IsMultiTaxes') == 0)?true:false,
                "className": "dt-body-right",
            },
            {
                "data": "FinalTotal",
                "name": "FinalTotal",
                "autoWidth": true,
                render: function (data, type, row) {
                    return numberFormat(data) + " VNĐ";
                },
                "className": "dt-body-right",
            },
            {
                "data": "PaymentMethod",
                "name": "PaymentMethod",
                "autoWidth": true,
                render: function (data, type, row) {
                    return data;
                },
                "className": "dt-body-center"
            },
        ],
        "fnCreatedRow": function (nRow, aData, iDataIndex) {
            //
        },
    });
}

const getDataTable = () => {
    $('#dataTable').css('display', 'none');
    $('.lds-hourglass').css('display', 'block');
    GET(getApiUrl().TransactionHeader()).then(res => {
        if (!res.Status)
            throw 'Không tìm thấy giao dịch'
        if (res.Status != 200)
            throw res.Message
        totalRow = res.TotalRow;
        $('#dataTable').css('display', 'block');
        $('.lds-hourglass').css('display', 'none');
        addRowDataTable(res.Data);
    }).catch(err => {
            showToast().Error(err);
        });
}

const addRowDataTable = (_data) => {
    table.clear();
    totalTrans = _data.length;
    _data.filter((transHeader, idx) => {
        transHeader.PaymentMethod = storeConfig.PaymentMethod;
        transHeader.index = ++idx;
        transHeader.VATAmount = transHeader.Tax2 + transHeader.Tax3 + transHeader.Tax4;
        transHeader.VATRate = Math.round(transHeader.VATAmount * 100 / transHeader.NetTotal);
    })
    table.rows.add(_data);
    table.draw(false);
    checkDisabledBtn();
}

const getAllStore = () => {
    GET(getApiUrl().Store()).then(res => {
        if (res.Status == 200) {
            res.Data = res.Data.filter((item) => item.StoreID != 0);
            dataStore = res.Data;
            let storeIDCookie = getCookie('storeID');
            if (storeIDCookie == null)
                setCookie('storeID', res.Data[0].StoreID);
            $.each(res.Data, function (i, el) {
                $('#selectFilterStore').append(
                    '<option value="' + el.StoreID + '" '+((storeIDCookie==el.StoreID)?"selected":'' )+' >' + el.StoreName + '</option>'
                )
            })
            storeId = $('#selectFilterStore').val();
            getStoreConfig();
        } else {
            throw res.Message;
        }
    }).catch(err => {
        showToast().Error(err); 
    });
};

const getStoreConfig = () => {
    GET(getApiUrl().Config()).then(res => {
        if (res.Status != 200 || res.Data.length == 0)
            throw 'Không tìm thấy cấu hình'

        storeConfig = res.Data[0];

        //HIDE-SHOW VAT RATE COLLUMN BY CONFIG 
        if (!getCookie('IsMultiTaxes') || getCookie('IsMultiTaxes') != storeConfig.IsMultiTaxes) {
            table.column(5).visible((storeConfig.IsMultiTaxes == 0) ? true : false);
            table.draw(false);
        }
        setCookie("IsMultiTaxes", storeConfig.IsMultiTaxes)

        $('#btnQuery').prop('disabled', false);
        $('#dataTable').css('display', 'block');
        $('.lds-hourglass').css('display', 'none');
        table.draw(false);
    }).catch(err => {
        showToast().Error(err);
    })
}

const getMultiTransCode = () => {
    let _lstTransCode = "";
    $('.cbx-row:checked').each(function () {
        _lstTransCode += $(this).closest('td').closest('tr').find('td')[2].innerHTML + " ";
    })
    _lstTransCode = _lstTransCode.trim().replaceAll(" ", ",");
    return _lstTransCode;
}

const loadDataDetailModal = (_transactionCode) => {
    clearDataModal();
    //SET STORE INFO
    inputDetail[0].value = storeConfig.InvoiceTaxCode;
    inputDetail[1].value = storeConfig.RestaurantName;
    inputDetail[2].value = storeConfig.StoreAddress;
    inputDetail[3].value = storeConfig.InvoiceSerial;
    inputDetail[4].value = storeConfig.InvoiceForm;
    inputDetail[5].value = moment(new Date()).format('YYYY-MM-DD');
    inputDetail[12].value = moment(new Date()).format('YYYY-MM-DD');
    inputDetail[15].value = storeConfig.PaymentMethod;

    //SET DETAIL TRANS
    let body = {
        Transactions: _transactionCode,
        StoreID: storeId,
    }
    POST(getApiUrl().TransactionDetail(), JSON.stringify(body)).then(res => {
        if (res.Status != 200) 
            throw res.Message
        if (res.Data.Detail.length == 0)   
            throw 'Không tìm thấy chi tiết hóa đơn'
        res.Data.Detail.forEach((row,index) => {
            $('#tbDetailBodyModal').append(`
                                        <tr>
                                        <td class="wd-15p text-center">${++index}</td>
                                        <td class="wd-10p text-left">${row.PrefixName +' '+ row.ProductName}</td>
                                        <td class="wd-25p text-center">${row.UnitDes}</td>
                                        <td class="wd-10p text-right">${row.Quantity}</td>
                                        <td class="wd-10p text-right">${numberFormat(row.CostEachIncSVC)} VNĐ</td>
                                        <td class="wd-25p text-right">${numberFormat(row.AmountIncSVC)} VNĐ</td>
                                        <td class="wd-10p text-center">${row.Discount == 0 ? "Không" : numberFormat(row.Discount * row.Quantity * (1 + row.SVCRate/100)) + ' VNĐ'}</td>
                                        <td class="wd-10p text-center">${(row.VATRate + "%")}</td>
                                        </tr>`) 
        })

        inputDetail[16].value = numberFormat(res.Data.NetTotal) + ' VNĐ';
        inputDetail[17].value = numberFormat(res.Data.SumSVC) + ' VNĐ';
        inputDetail[18].value = numberFormat(res.Data.SumVAT) + ' VNĐ';
        inputDetail[19].value = numberFormat(res.Data.FinalTotal) + ' VNĐ';

        $('#modal-DetailTransaction').modal("show");

        $('#btn-issueSingle').removeClass('btn-loading');
        $('#btn-issueMerge').removeClass('btn-loading');
    }).catch(err => {
        showToast().Error(err);
        $('#btn-issueSingle').removeClass('btn-loading');
        $('btn-issueMerge').removeClass('btn-loading');
    })
}

const issueInvoice = () => {
    try {
        if (inputDetail[10].value != '' && !IsEmail(inputDetail[10].value))
            throw 'Sai định dạng email';
        if (inputDetail[7].value == '' && inputDetail[8].value == '')
            throw 'Tên đơn vị và tên người mua đang đồng thời để trống';

        let invoiceInfo = isExcuteSingle ? rowData.TransactionCode : getMultiTransCode();
        let body = {
            Transactions: invoiceInfo,
            StoreID: storeId,
            CustomerInfo: {
                CustomerTax: inputDetail[6].value,
                BuyernName: inputDetail[7].value,
                CustomerName: inputDetail[8].value,
                CustomerAddress: inputDetail[9].value,
                CustomerEmail: inputDetail[10].value,
                CustomerPhone: inputDetail[13].value,
            },
            InvoiceInfo: {
                Description: inputDetail[11].value,
                IssueDate: inputDetail[12].value,
                InvoiceNote: inputDetail[14].value,
                PaymentMethod: inputDetail[15].value,
                InvoiceDate: inputDetail[5].value,
            }
        }

        POST(getApiUrl().IssueInvoice(), JSON.stringify(body)).then(res => {
            if (res.Status != 200)
                throw res.Message;
            $('#companyName').html(storeConfig.StoreName);
            $('#customerNameSpan').html(res.Data.CustomerInfo.BuyernName);
            $('#companyAddressSpan').html(res.Data.CustomerInfo.CustomerAddress);
            $('#companyNameSpan').html(res.Data.CustomerInfo.CustomerName);
            $('#EmailSpan').html(res.Data.CustomerInfo.CustomerEmail);
            $('#MSTSpan').html(res.Data.CustomerInfo.CustomerTax);
            $('#searchLink').html(storeConfig.WebGetInvoice);
            $('#searchAtTicket').prop('href', storeConfig.WebGetInvoice);
            $('#invoiceNoSpan').html(res.Data.InvoiceInfo.No);
            $('#searchKey').html(res.Data.InvoiceInfo.FKey);
            $('.totalSpan').html(numberFormat(res.Data.InvoiceInfo.FinalTotal));
            generateQRCode(storeConfig.WebGetInvoice + '?FKey=' + res.Data.InvoiceInfo.FKey);

            $('#btn-issueConfirm-yes').removeClass('btn-loading');
            $('#modalConfirm').modal("hide");
            $('#modal-DetailTransaction').modal("hide");
            $('#modal-Ticket').modal('show');
            getDataTable();
        }).catch(err => {
            $('#btn-issueConfirm-yes').removeClass('btn-loading');
            $('#modalConfirm').modal("hide");
            if (err.length < 60) {
                showToast().Error(err);
            }
            else {
                $("#messageFromServer").html("Lỗi xảy ra trong quá trình xuất hóa đơn điện tử!")
                $("#modalGetfileLog").modal("toggle");
                $('#btnDowloadFileLog').one('click',() => {
                    downloadFileLog("Log_" + moment(new Date()).format("DDMMYYYY_hhmmss"), err);
                    $('#btnDowloadFileLog').off('click');
                })
            }
        })
    } catch (err) {
        $('#btn-issueConfirm-yes').removeClass('btn-loading');
        $('#modalConfirm').modal("hide");
        showToast().Error(err);
    }
}

const issueInvoiceEOD = () => {
    let lstTrans = table.column(2).data().join(',');
    let body = {
        Transactions: lstTrans,
        StoreID: storeId,
        CustomerInfo: {
        },
        InvoiceInfo: {
            InvoiceDate: moment(timeStart).format('YYYY-MM-DD')
        }
    }
    POST(getApiUrl().IssueInvoiceEOD(), JSON.stringify(body)).then(res => {
        $('#modal-progress-eod').modal('hide');
        getDataTable();
        if (res.Status != 200) {
            throw res.Message
        }
        if (res.Data.Failure.length == 0 && res.Data.Success.length != 0) {
            showToast().Succes("Đã xuất thành công " + res.Data.Success.length + " hóa đơn");
        }
        if (res.Data.Failure.length != 0) {
            $("#messageFromServer").html("Xuất thành công "+ res.Data.Success.length + " hóa đơn. Lỗi " + res.Data.Failure.length + " hóa đơn. Tải về để xem hóa đơn lỗi!")
            $("#modalGetfileLog").modal("toggle");
            $('#btnDowloadFileLog').one('click', () => {
                downloadFileLog("Log_" + moment(new Date()).format("DDMMYYYY_hhmmss"), "Hóa đơn lỗi: " + res.Data.Failure.join('\n'));
                $('#btnDowloadFileLog').off('click');
            })
        }
    }).catch(err => {
        showToast().Error(err);
    })

}

const lookupTax = () => {
    let Tax = $('#input-taxCode').val().replace(/ /g, '');
    POST(getApiUrl().LookupTax(), {Tax}).then(res => {
        if (!res.error) {
            inputDetail[6].value = res.ma_so_thue;
            inputDetail[7].value = "";
            inputDetail[8].value = res.ten_cty;
            inputDetail[9].value = res.dia_chi;
            showToast().Succes("Thông tin được thêm tự động, Vui lòng kiểm tra lại trước khi xuất");
        }
        else showToast().Error(res.error);
    }).catch(err => {
        showToast().Error("Lỗi ngoại lệ: "+err.statusText);
    })
}   

const printTicket = (width, height) => {
    let prtContent = document.getElementById("reviewInvoiceModal");
    let left = (screen.width / 2) - (width / 2);
    let top = (screen.height / 2) - (height / 2);
    let WinPrint = window.open("", "title", 'toolbar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left);
    WinPrint.document.write(`<link rel="stylesheet" href="/Areas/Admin/Assets/css/printTicket.css">`);
    setTimeout(() => {
        WinPrint.document.write(prtContent.innerHTML);
        WinPrint.document.close();
        WinPrint.print();
        WinPrint.close();
    }, 100);
}

const downloadFileLog = (filename, data) =>{
    const blob = new Blob([data], { type: "txt" });
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    } else {
        const elem = window.document.createElement("a");
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
}

const renderProgressBar =  (counter) => {
    let percent = counter * 100 / totalTrans;
         setTimeout(() => {
             $('#progress').css("width", Math.round(percent) + "%")
             $('#progress').html = Math.round(percent) + "%";
             $('#progressCount').html(counter + "/" + totalTrans);
             if (counter < totalTrans) {
                 counter++;
                 renderProgressBar(counter);
             }
             else {
                 return true;
             }
        },500)
}

const generateQRCode = (data) => {
    let qr;
    qr = new QRious({
        element: document.getElementById('qrCode'),
        size: 200,
        value: data,
        foreground: 'black',
    });
    return qr.toDataURL();
}

const addEventClickOnRow = () => {
    $('#data-tb #tbody').on('click', 'tr', function () {
        let selected = $('#data-tb').find(".selected");
        if (selected[0]) selected[0].className = "odd";
        $(this).addClass("selected");
        rowData = table.row(this).data();
        checkDisabledBtn();
    });
}

const checkDisabledBtn = () => {
    let selected = $('#data-tb').find(".selected");
    let checked = $('.cbx-row:checked');

    if (totalTrans != 0) 
        $('#btn-EOD').prop('disabled',false)
    else
        $('#btn-EOD').prop('disabled', true)

    if (selected.length > 0 && checked.length > 0)
        selected[0].className = "odd";
    if (checked.length >= 2) 
        $('#btn-issueMerge').prop('disabled', false);
    else 
        $('#btn-issueMerge').prop('disabled', true);

    if ((selected.length > 0 && checked.length == 0) || checked.length == 1) {
        $('#btn-issueSingle').prop('disabled', false);
        if (checked.length == 1) {
            rowData.TransactionCode = getMultiTransCode()
        }
    }
    else
        $('#btn-issueSingle').prop('disabled', true);
}

const clearDataModal = () => {
    inputDetail.each((idx,el) => {
        el.value = "";
    })
    $('#tbDetailBodyModal').html(""); 
    $('#cbxRetailCus').prop('checked', false);
}

//API URL
const getApiUrl = () => {
    timeStart = moment($('#filter-date').val()).format('YYYY/MM/DD 00:00:00');
    timeEnd = moment($('#filter-date').val()).format('YYYY/MM/DD 23:59:59');
    return {
        TransactionHeader: () => {
            return (storeId != -1) ? '/api/TransactionHeader?OpenDate=' + timeStart + ',' + timeEnd + '&OrderBy=DESC&IsActive=true&IsEInvoice=true&EInvoiceStatus=0&StoreID=' +storeId:'';
        },
        TransactionDetail: () => {
            return (storeId != -1)?'/api/EInvoiceTransactionIssue':'';
        },
        Store: () => {
            return '/api/Store?IsActive=true';
        },
        LookupTax: (taxCode) => {
            return '/Admin/LookupTax/GetTax';
        },
        Config: () => {
            return '/api/EInvoiceConfig?StoreID=' + storeId;
        },
        TaxInfo: () => {
            return '/api/TaxInfo?StoreID=' + storeId;
        },
        IssueInvoice: () => {
            return '/api/IssueInvoice';
        },
        IssueInvoiceEOD: () => {
            return '/api/IssueInvoiceEOD';
        }
    }
}

const showToast = () => {
    return {
        Succes: (msg) => {
            Swal.fire({
                icon: 'success',
                title: msg,
                showConfirmButton: true,
            });
        },
        Error: (msg) => {
            Swal.fire({
                icon: 'error',
                title: msg,
                showConfirmButton: true,
            });
        }
    }
}

/****** EVENT HANDLE REGION ******/
/*-----------------------------------------------------------------*/

$('#btnQuery').click(() => {
    getDataTable();
})

$('#btn-issueSingle').click(() => {
    isExcuteSingle = true;
    $('#btn-issueSingle').addClass('btn-loading');
    loadDataDetailModal(rowData.TransactionCode);
})

$('#btn-issueMerge').click(() => {
    $('#btn-issueMerge').addClass('btn-loading');
    isExcuteSingle = false;
    let lstTrans = getMultiTransCode();
    loadDataDetailModal(lstTrans);
})

$("#btn-EOD").click(() => {
        let msg = "Bạn có muốn xuất " + totalTrans + " hóa đơn của ngày " + moment($('#filter-date').val()).format('DD/MM/YYYY') + " không?"
        $('#text-EOD').text(msg);
        $('#modalConfirmEOD').modal('show');
})

$('#btn-modalIssue').click(() => {
    $('#modalConfirm').modal("show"); 
})

$('#btn-lookupTax').click(() => {
    lookupTax();
})

$('#btn-issueConfirm-yes').click(() => {
    $('#btn-issueConfirm-yes').addClass('btn-loading');
    issueInvoice();
})

$('#btn-issueEODConfirm-yes').click(() => {
    $('#modalConfirmEOD').modal("hide");
    $('#modal-progress-eod').modal({ backdrop: 'static', keyboard: false })  
    $('#modal-progress-eod').modal('show')
    renderProgressBar(0);
    issueInvoiceEOD();
})

$('#btn-modalPrint').click(() => {
    printTicket(850,700);
})

$('#btn-modalClose').click(() => {
    $('#modal-DetailTransaction').modal("hide");
})

$('#btn-modalCloseTicket').click(() => {
    $('#modal-Ticket').modal("hide");
    table.draw(false)
})

$('#btn-issueConfirm-no').click(() => {
    $('#modalConfirm').modal("hide");
})

$('#btn-issueEODConfirm-no').click(() => {
    $('#modalConfirmEOD').modal("hide");
})

$('#selectFilterStore').on('change', () => {
    storeId = $('#selectFilterStore').val();
    setCookie('storeID', storeId)
    getDataTable();
    getStoreConfig();
})

$('#cbxRetailCus').change((e) => {
    e.target.checked
        ? inputDetail[7].value = inputDetail[8].value = inputDetail[9].value = storeConfig.DefaultAddress
        : inputDetail[7].value = inputDetail[8].value = inputDetail[9].value = inputDetail[6].value = "";
})

//CHECK ALL TRANS
$('#cbx-all-row').change((e) => {
    let selected = $('#data-tb').find(".selected");
    if (selected[0]) selected[0].className = "odd";
    $('.cbx-row').prop('checked', e.target.checked);
    checkDisabledBtn();
})

