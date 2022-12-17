let table;
let indexRow = 0;
let storeId = -1;
let rowData = {};

$(document).ready(() => {
    initializeDataTable();
    $('#timeStart').val(moment(new Date()).format("MM/DD/YYYY"));
    $('#timeEnd').val(moment(new Date()).format("MM/DD/YYYY"));
    $('#dataTable').css('display', 'none');
    $('.lds-hourglass').css('display', 'block');
    getAllStore();
    addEventClickOnRow();
});

const initializeDataTable = () => {
    table = $('#data-tb').on('processing.dt', function (e, settings, processing) {
    }).DataTable({
        "destroy": true,
        "scrollY": true,
        "scrollX": true,
        "paging": true,
        "lengthChange": false,
        "pageLength": 50,
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
                "data": "InvoiceForm",
                "name": "InvoiceForm",
                "autoWidth": true,
                render: function (data, type, row) {
                    return data
                },
                "className": "dt-body-center ",
            },
            {
                "data": "InvoiceNo",
                "name": "InvoiceNo",
                "autoWidth": true,
                render: function (data, type, row) {
                    return data
                },
                "className": "dt-body-center "
            },
            {
                "data": "PushlishTime",
                "name": "PushlishTime",
                "autoWidth": true,
                render: function (data, type, row) {
                    return moment(data).format("DD/MM/YYYY");
                },
                "className": "dt-body-center",
            },
            {
                "data": "CompanyName",
                "name": "CompanyName",
                "autoWidth": true,
                render: function (data, type, row) {
                    return data;
                },
                "className": "dt-body-center truncate"
            },
            {
                "data": "Transact",
                "name": "Transact",
                "autoWidth": true,
                render: function (data, type, row) {
                    return truncateText(data);
                },
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
                "data": "InvoiceSearchKey",
                "name": "InvoiceSearchKey",
                "autoWidth": true,
                render: function (data, type, row) {
                    return data;
                },
                "className": "dt-body-right",
            },
            {
                "data": "InvoiceStatus",
                "name": "InvoiceStatus",
                "autoWidth": true,
                render: function (data, type, row) {
                    return data ==1? "Phát hành": data == 0?"Hủy":"Khác";
                },
                "className": "dt-body-center",
            },
            {
                "data":"InvoiceID",
                "name": "ViewInvoice",
                "autoWidth": true,
                render: function (data, type, row) {
                    return '<div class="btn btn-sm btn-primary" onclick="viewInvoice(this)" value=' + data +'  ><i class="fa fa-eye" data-toggle="tooltip" title="" data-original-title="fa fa-eye"></i></div>';
                },
                "className": "dt-body-center",
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
    GET(getApiUrl().TransactionIssue()).then(res => {
        if (res.Status == 200) {
            totalRow = res.TotalRow;
            $('#dataTable').css('display', 'block');
            $('.lds-hourglass').css('display', 'none');
            addRowDataTable(res.Data);
        } else {
            Swal.fire({
                icon: 'error',
                title: res.Description.en,
                showConfirmButton: false,
                timer: 3500
            });
            showToast().Error(res.Description.en);
        }
    })
}

const checkDisabledBtn = () => {
    let selected = $('#data-tb').find(".selected");

    if (selected.length == 0) {
        $('#btn-cancelInvoice').prop('disabled', true);
    }
    else {
        $('#btn-cancelInvoice').prop('disabled', false);
    }
}
const addRowDataTable = (_data) =>  {
    table.clear();
    _data.filter((item,idx) => {
        item.index =  ++idx
    })
    table.rows.add(_data);
    table.draw(false);
    checkDisabledBtn();
    $('#btnQuery').attr('disabled', false);
}

const cancelInvoice = () => {
    let body = {
        Transactions: rowData.Transact,
        StoreID: storeId,
        InvoiceInfo: {
            IKey: rowData.InvoiceID,
            Serial: rowData.InvoiceSerial,
            InvoiceForm: rowData.InvoiceForm,
            No: rowData.InvoiceNo
        }
    }

    PUT(getApiUrl().CancelInvoice(), JSON.stringify(body)).then(res => {
        if (res.Status != 200)
            throw res.Message;

        $('#btn-cancelConfirm-yes').removeClass('btn-loading');
        $('#modalConfirm').modal('hide');
        getDataTable()
        showToast().Succes('Hủy hóa đơn thành công');

    }).catch(err => {
        $('#btn-cancelConfirm-yes').removeClass('btn-loading');
        $('#modalConfirm').modal('hide');
        getDataTable()
        showToast().Error(err);
    })
}

const viewInvoice = (elemt) => {
    elemt.classList.add('btn-loading');
    elemt.querySelector('i').classList.remove('fa-edit');
    let FKey = elemt.closest('td').closest('tr').querySelectorAll("td")[7].innerHTML;
    let body = {
        StoreID: storeId,
        InvoiceInfo: {
            FKey: FKey,
            IKey: elemt.getAttribute('value'),
        }
    }
    POST(getApiUrl().ViewInvoice(), JSON.stringify(body)).then(res => {
        if (res.Status !=200)
            throw res.Message;
        if (!res.Data) {
            throw "Không tìm thấy hóa đơn hoặc hóa đơn đã được xóa"
        }
        $('#pdf_renderer').html("")
        var obj = document.createElement('object');
        obj.style.width = '100%';
        obj.style.height = '800px';
        obj.type = 'application/pdf';
        obj.data = 'data:application/pdf;base64,' + res.Data.FileToBytes;
        $('#pdf_renderer').append(obj);
        $('#modal-invoice').modal('show');

        elemt.classList.remove('btn-loading');
        elemt.querySelector('i').classList.add('fa-edit');
    }).catch(err => {
        elemt.classList.remove('btn-loading');
        elemt.querySelector('i').classList.add('fa-edit');
        showToast().Error(err);
    })
}

const exportExcel = () => {
    GET(getApiUrl().ExportExcel()).then(res => {
        $('#export-Excel').removeClass('btn-loading')
        console.log(res);
        if (res.Message != '') {
            showToast().Error(res.Message)
        }
    }).catch(err => {
        showToast().Error(err)
    })
}

const truncateText = (text) => {
    if (text.length > 50) {
        text = text.split(',');
        return text[0] + "," + text[1] + "," + text[2] + "," + text[3] + "...." + text[text.length - 3] + "," + text[text.length - 2] + "," + text[text.length - 1];
    } else {
        return text
    }
}

//API URL
const getApiUrl = () => {
    let timeStart = moment($('#timeStart').val()).format('YYYY/MM/DD');
    let timeEnd = moment($('#timeEnd').val()).format('YYYY/MM/DD');

    return {
        TransactionIssue: () => {
            return '/api/TransactionIssueInvoice?FromDate=' + timeStart + '&ToDate=' + timeEnd + '&StoreID=' + storeId;
        },
        ExportExcel: () => {
            return '/api/TransactionIssueInvoice?FromDate=' + timeStart + '&ToDate=' + timeEnd + '&StoreID=' + storeId+'&isExportExcel=true';
        },
        ViewInvoice: () => {
            return '/api/TransactionIssueInvoice';
        },
        Store: () => {
            return '/api/Store?IsActive=true';
        },
        CancelInvoice: () => {
            return '/api/TransactionIssueInvoice';
        }
    }
}


//GET STORE
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
                    '<option value="' + el.StoreID + '" ' + ((storeIDCookie == el.StoreID) ? "selected" : '') + ' >' + el.StoreName + '</option>'
                )
            })
            storeId = $('#selectFilterStore').val();
            getDataTable();
        } else {
            showToast().Error(res.Description.en);
        }
    });
};



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
                    /*    -----------------------------------------------------------------*/

$('#btnQuery').click(() => {
    getDataTable();
})

$('#btn-cancelInvoice').click(() => {
    $('#modalConfirm').modal('show');
})

$('#btn-cancelConfirm-yes').click(() => {
    $('#btn-cancelConfirm-yes').addClass('btn-loading');
    cancelInvoice();
})

$('#btn-cancelConfirm-no').click(() => {
    $('#modalConfirm').modal('hide');
})

$('#selectFilterStore').on('change', () => {
    storeId = $('#selectFilterStore').val();
    setCookie('storeID', storeId);
    getDataTable();
})

$('#export-Excel').click(() => {
    $('#export-Excel').addClass('btn-loading')
    exportExcel();
})


//CLICK TO SELECT ROW
const addEventClickOnRow = () => {
    /*        var table = $('#data-tb').DataTable();*/
    $('#data-tb #tbody').on('click', 'tr', function () {
        /*var data = table.row(this).data();*/
        var selected = $('#data-tb').find(".selected");
        if (selected[0]) {
            selected[0].className = "odd";
        }
        $(this).addClass("selected");
        rowData = table.row(this).data();
        checkDisabledBtn();
    });
}

