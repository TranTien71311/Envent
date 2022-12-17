let table;
let storeID;

$(document).ready(() => {
    initializeDataTable();
    $('#dataTable').css('display', 'none');
    $('.lds-hourglass').css('display', 'none');

    getAllStore();
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
                "data": "StoreID",
                "name": "StoreID",
                "autoWidth": true,
                render: function (data, type, row) {
                    return data;
                },
                "className": "dt-body-center "
            },

            {
                "data": "StoreName",
                "name": "StoreName",
                "autoWidth": true,
                render: function (data, type, row) {
                    return data
                },
                "className": "dt-body-left "
            },
            {
                "data": "Email",
                "name": "Email",
                "autoWidth": true,
                render: function (data, type, row) {
                    return data
                },
                "className": "dt-body-center "
            },
            {
                "data": "DateCreated",
                "name": "DateCreated",
                "autoWidth": true,
                render: function (data, type, row) {
                    return moment(data).format('DD/MM/YYYY');
                },
                "className": "dt-body-left",
            },
            {
                "data":"DateModified",
                "name": "DateModified",
                "autoWidth": true,
                render: function (data, type, row) {
                    return moment(data).format('DD/MM/YYYY');
                },
                "className": "dt-body-left",
            },
            {
                "data":"StoreID",
                "name": "Edit",
                "autoWidth": true,
                render: function (data, type, row) {
                    return '<a class="btn btn-sm btn-primary" value="'+data+'" onclick="getDataConfig(this)" ><i class="fa fa-edit text-white"></i></a>';
                },
                "className": "dt-body-center",
            },
        ],
        "fnCreatedRow": function (nRow, aData, iDataIndex) {
            
        },
    });
}

const addRowDataTable = (_data) => {
    table.clear();
    table.rows.add(_data);
    table.draw(false);
}

const getAllStore = () => {
    $('#dataTable').css('display', 'none');
    $('.lds-hourglass').css('display', 'block');
    GET(getApiUrl().GetStore()).then(res => {
        if (res.Status == 200) {
            $('#dataTable').css('display', 'block');
            $('.lds-hourglass').css('display', 'none');
            addRowDataTable(res.Data);
        }
        else showToast().Error(res.Description.en);
    }).catch(err => {
        showToast().Error(err);
    })
};

const getDataConfig = (elemt) => {
    elemt.classList.add('btn-loading');
    elemt.querySelector('i').classList.remove('fa-edit');

    storeID = elemt.closest('td').closest('tr').querySelectorAll("td")[0].innerHTML;
    GET(getApiUrl().Config(storeID)).then(res => {
        if (res.Status == 200 && res.Data.length > 0)
            setDataConfig(res.Data[0]);
        else
            clearDataModal();
            $('input[name="StoreID"]').val(storeID);
        $('#modalEditConfig').modal("show");

        elemt.classList.remove('btn-loading');
        elemt.querySelector('i').classList.add('fa-edit');
    }).catch(err => {
        showToast().Error(err);
        elemt.classList.remove('btn-loading');
        elemt.querySelector('i').classList.add('fa-edit');
    })
}

const setDataConfig = (configObj) => {
    clearDataModal();
    let lstCbx = ['IsMultiTaxes', 'AutoSendEmail', 'IsAllocateByAmount', 'IsAllocateSVC', 'IsDetail', 'IsShowSVCInDetail','IsShowDiscount','RoundAmount'];

    for (const [key, value] of Object.entries(configObj)) {
        if (lstCbx.includes(key)) {
            if (value == 1)
                $('input[name="' + key + '"]').prop('checked', true)
            else
                $('input[name="' + key + '"]').prop('checked', false);
        }
        else {
            $('input[name="' + key + '"]').val(value);
        }
    }
}

const saveConfig = (data) => {
    POST(getApiUrl().Config(), JSON.stringify(data)).then(res => {
        if (res.Status == 200) {
            $('#modalEditConfig').modal('hide');
            showToast().Succes('Cập nhật thành công!');
        }
        else
            throw res.Message;
    }).catch(err => {
        showToast().Error(err);
    })
}

const convertFormToObj = (ob) => {
    let obj = {};
    $('#formConfig').find('input').each((index, elemt) => {
        if (elemt.type == 'checkbox')
            obj[elemt.name] = elemt.checked ? "1" : "0";
        if (elemt.type == 'text')
            obj[elemt.name] = elemt.value;
    })
    return obj
}

const clearDataModal = () => {
    $('#formConfig').find('input').each((index, elemt) => {
        if (elemt.type == 'checkbox')
            elemt.checked = false;
        if (elemt.type == 'text')
            elemt.value = "";
    })
}

const getApiUrl = () => {
    return {
        GetStore: () => {
            return '/api/Store?IsActive=true';
        },
        Config: (_storeID = null) => {
            let storeIDParam = _storeID ? "?StoreID=" + _storeID : "";
            return '/api/EInvoiceConfig' + storeIDParam;
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
                timer: 3500
            });
        },
        Error: (msg) => {
            Swal.fire({
                icon: 'error',
                title: msg,
                showConfirmButton: true,
                timer: 5000
            });
        }
    }
}

/****** EVENT HANDLE REGION ******/
/*    -----------------------------------------------------------------*/

$('#btn-modalClose').click(() => {
    $('#modalEditConfig').modal('hide');
})

$('#btn-modalSave').click(() => {
    let data = convertFormToObj();
    saveConfig(data);
});

$('#btn-Confirm-no').click(() => {
    $('#modalEditConfig').modal('hide');
})


