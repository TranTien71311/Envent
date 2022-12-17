
    let listWarehouse = [];
    let table;
    let pageSize = 1000;
    let pageNum = 0;
    let dataPeriodDetail = [];
    $(document).ready(function () {
        getWarehouse();
    getStore();
    setDataTable();
    loading(2);
    })
    function loading(_status) {
        if (_status == 0) {
        $('#dataTable').hide();
    $('#Loader').show();
        }
    if (_status == 1) {
        $('#dataTable').show();
    $('#Loader').hide();
        }
    if (_status == 2) {
        $('#dataTable').hide();
    $('#Loader').hide();
        }
    }
    function getWarehouse() {
        $.ajax({
            url: '/api/Warehouse?IsActive=true',
            type: 'get',
            headers: {
                'ClientGUID': getCookie('ClientGUID'),
            },
            success: function (_Result) {
                if (_Result.Status == 200) {
                    valueFilterWarehouse(_Result.Data);
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: _Result.Description.en,
                        showConfirmButton: false,
                        timer: 3500
                    });
                }
            }
        });
    }
    function valueFilterWarehouse(_data) {
        const listIsWarehouse = Array.from('@Session["WarehouseID"]'.split(','), Number);
        $('#selectFilterWarehouse').empty().append('<option value="-1">All</option>');
        $('#SelectWarehouse').empty().append('<option value="-1">All</option>');
    listWarehouse = [];
    $.each(_data, function (k,v) {
            const IsWarehouse = jQuery.inArray(v.WarehouseID, listIsWarehouse);
    let option;
    if (IsWarehouse !== -1) {
        listWarehouse.push(v);
    option = '<option value="' + v.WarehouseID + '">' + v.WarehouseName
        option += '</option>';
            }
    $('#SelectWarehouse').append(option);
    $('#selectFilterWarehouse').append(option);
        })
    }

    function getStore() {
        $.ajax({
            url: '/api/Store?IsActive=true',
            type: 'get',
            headers: {
                'ClientGUID': getCookie('ClientGUID'),
            },
            success: function (_Result) {
                if (_Result.Status == 200) {
                    valueFilterStore(_Result.Data);
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: _Result.Description.en,
                        showConfirmButton: false,
                        timer: 3500
                    });
                }
            }
        });
    }
    function valueFilterStore(_data) {
        const listStore = Array.from('@Session["StoreID"]'.split(','), Number);
    $('#selectFilterStore').empty().append('<option value="-1">All</option>');
    $('#SelectStore').empty().append('<option value="-1">All</option>');
    $.each(_data, function (k,v) {
            const IsStore = jQuery.inArray(v.StoreID, listStore);
    let option;
    if (IsStore !== -1) {
        option = '<option value="' + v.StoreID + '">' + v.StoreName
                option += '</option>';
        }
        $('#SelectStore').append(option);
$('#selectFilterStore').append(option);
        })
    }

$('#selectFilterStore').on('select2:select', function () {
    let storeID = $(this).val();
    let listDataWarehouse = [];
    if (storeID != -1)
        listDataWarehouse = listWarehouse.filter(x => x.StoreID == storeID);
    else
        listDataWarehouse = listWarehouse;

    const listIsWarehouse = Array.from('@Session["WarehouseID"]'.split(','), Number);
    $('#selectFilterWarehouse').empty().append('<option value="-1">All</option>');

    $.each(listDataWarehouse, function (k, v) {
        const IsWarehouse = jQuery.inArray(v.WarehouseID, listIsWarehouse);
        let option;
        if (IsWarehouse !== -1) {
            option = '<option value="' + v.WarehouseID + '">' + v.WarehouseName
            option += '</option>';
        }
        $('#selectFilterWarehouse').append(option);
    })
});

function getURLfromFilter() {
    let url = '/api/Period?IsActive=true&PageSize=' + pageSize + '&PageNum=' + pageNum + '';
    let filterWarehouse = $('#selectFilterWarehouse').val();
    let filterStore = $('#selectFilterStore').val();

    if (filterWarehouse != -1) {
        url += '&WarehouseID=' + filterWarehouse + '';
    }
    if (filterStore != -1) {
        url += '&StoreID=' + filterStore + '';
    }

    return url;
}
function getDataTable() {
    loading(0);
    $.ajax({
        url: getURLfromFilter(),
        type: 'GET',
        headers: {
            'ClientGUID': getCookie('ClientGUID'),
        },
        success: function (res) {
            if (res.Status == 200) {
                loading(1);
                addRowDataTable(table, res.Data);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: res.Description.en,
                    showConfirmButton: false,
                    timer: 3500
                });
            }
        }
    });
}
function addRowDataTable(_table, _data) {
    _table.clear();
    _table.rows.add(_data);
    _table.draw(false);
}
function setDataTable() {
    table = $('#tbData').on('processing.dt', function (e, settings, processing) {
    }).DataTable({
        "scrollY": true,
        "scrollX": true,
        "paging": false,
        "lengthChange": false,
        "pageLength": false,
        "searching": false,
        "order": [[0, 'asc']],
        "ordering": true,
        "info": true,
        "processing": false,
        "fixedColumns": {
            left: 2
        },
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
                "data": "PeriodID",
                "name": "PeriodID",
                "autoWidth": true,
                "className": "dt-body-center"
            },
            {
                "data": "Store",
                "name": "Store",
                "autoWidth": true,
                render: function (data, type, row) {
                    return data.StoreName
                },
            },
            {
                "data": "Warehouse",
                "name": "Warehouse",
                "autoWidth": true,
                render: function (data, type, row) {
                    return data.WarehouseName
                },
            },
            {
                "data": "DateStart",
                "name": "DateStart",
                "autoWidth": true,
                render: function (data, type, row) {
                    return data != null ? moment(data).format("MM/DD/YYYY HH:ss") : "";
                },
            },
            {
                "data": "DateEnd",
                "name": "DateEnd",
                "autoWidth": true,
                render: function (data, type, row) {
                    return data != null ? moment(data).format("MM/DD/YYYY HH:ss") : "";
                },
            },
            {
                "data": "IsActive",
                "name": "IsActive",
                "autoWidth": true,
                render: function (data, type, row) {
                    return data == true ? "Yes" : "No";
                },
            },
            {
                "data": "IsLock",
                "name": "IsLock",
                render: function (data, type, row) {
                    return data == false ? '<button style="width:80px;font-weight:bold" class="btn btn-sm btn-primary btn-opening" id=' + row.PeriodID + '>OPENING</button>' : '<button style="width:80px;font-weight:bold" class="btn btn-sm btn-primary btn-closed"  id=' + row.PeriodID + '>CLOSED</button>';
                },
            },
        ],
        "columnDefs": [

            { "targets": 6, "className": "text-center", "width": "20px", "orderable": false }
        ]
    });
}
$('#btnInQuery').click(function () {
    getDataTable();
});
function getDetailPeriod(_periodID,_btn) {
    _btn.addClass('btn-loading');
    $.ajax({
        url: '/api/PeriodDetail?IsActive=true&PeriodID=' + _periodID+'',
        type: 'get',
        headers: {
            'ClientGUID': getCookie('ClientGUID'),
        },
        success: function (_Result) {
            if (_Result.Status == 200) {
                valuePeriodDetail(_Result.Data, _btn);
                dataPeriodDetail = _Result.Data;
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: _Result.Description.en,
                    showConfirmButton: false,
                    timer: 3500
                });
            }
        }
    });
}
$(document).on('click', '.btn-opening', function () {
    let id = $(this).attr('id');
    let btn = $(this);
    let index = table.row($(this).closest('tr')).index();
    let dateStart = table.row(index).data().DateStart;
    let dateEnd = table.row(index).data().DateEnd;
    let storeName = table.row(index).data().Store.StoreName;
    let warehouseName = table.row(index).data().Warehouse.WarehouseName; 
    $('#DateStart').val(dateStart != null ? moment(dateStart).format('MM/DD/YYYY HH:ss') : "");
    $('#DateEnd').val(dateEnd != null ? moment(dateEnd).format('MM/DD/YYYY HH:ss') : "");
    $('#ModalTitle').empty().text('Period Detail(Store: ' + storeName + " - Warehouse: " + warehouseName + ')');
    getDetailPeriod(id, btn);
    $('#btn-save-closing').attr('periodid', id);
    $('#btn-save-closing').attr('warehouseid', table.row(index).data().Warehouse.WarehouseID);
    $('#btn-save-closing').attr('storeid', table.row(index).data().Store.StoreID);
    $('#btn-save-closing').show();
    $('#inputSearch').val('');
});
$(document).on('click', '.btn-closed', function () {
    let id = $(this).attr('id');
    let btn = $(this);
    let index = table.row($(this).closest('tr')).index();
    let dateStart = table.row(index).data().DateStart;
    let dateEnd = table.row(index).data().DateEnd;
    let storeName = table.row(index).data().Store.StoreName;
    let warehouseName = table.row(index).data().Warehouse.WarehouseName;
    $('#DateStart').val(moment(dateStart).format('MM/DD/YYYY HH:ss'));
    $('#DateEnd').val(moment(dateEnd).format('MM/DD/YYYY HH:ss'));
    $('#ModalTitle').empty().text('Period Detail(Store: ' + storeName + " - Warehouse: " + warehouseName + ')');
    getDetailPeriod(id, btn);
    $('#btn-save-closing').hide();
    $('#inputSearch').val('');
});
function valuePeriodDetail(_data,_btn) {
    $('#tbModalPeriodDetail').empty();
    let isClosing = _btn.hasClass("btn-opening");
    $.each(_data, function (k, v) {
        let pack = parseInt(v.UnitStart / (v.StockItem.UnitPerCont * v.StockItem.ContPerPack));
        let cont = parseInt((v.UnitStart - (parseInt(v.UnitStart / (v.StockItem.UnitPerCont * v.StockItem.ContPerPack)) * (v.StockItem.UnitPerCont * v.StockItem.ContPerPack))) / v.StockItem.UnitPerCont);
        let unit = v.UnitStart - ((parseInt(v.UnitStart / (v.StockItem.UnitPerCont * v.StockItem.ContPerPack)) * (v.StockItem.UnitPerCont * v.StockItem.ContPerPack)) + (parseInt((v.UnitStart - (parseInt(v.UnitStart / (v.StockItem.UnitPerCont * v.StockItem.ContPerPack)) * (v.StockItem.UnitPerCont * v.StockItem.ContPerPack))) / v.StockItem.UnitPerCont) * (v.StockItem.UnitPerCont)));

        let packEnd = parseInt(v.UnitEnd / (v.StockItem.UnitPerCont * v.StockItem.ContPerPack));
        let contEnd = parseInt((v.UnitEnd - (parseInt(v.UnitEnd / (v.StockItem.UnitPerCont * v.StockItem.ContPerPack)) * (v.StockItem.UnitPerCont * v.StockItem.ContPerPack))) / v.StockItem.UnitPerCont);
        let unitEnd = v.UnitEnd - ((parseInt(v.UnitEnd / (v.StockItem.UnitPerCont * v.StockItem.ContPerPack)) * (v.StockItem.UnitPerCont * v.StockItem.ContPerPack)) + (parseInt((v.UnitEnd - (parseInt(v.UnitEnd / (v.StockItem.UnitPerCont * v.StockItem.ContPerPack)) * (v.StockItem.UnitPerCont * v.StockItem.ContPerPack))) / v.StockItem.UnitPerCont) * (v.StockItem.UnitPerCont)));
        let html = '<tr><td class="text-center">' + v.StockItem.StockItemID + '</td>';
        html += '<td class="text-left">' + v.StockItem.StockItemName + '</td>';
        html += '<td class="text-right text-' + getColor(v.UnitStart) +'">' + pack + ''+" "+' <span class="badge badge-primary badge-pill" > ' + v.StockItem.PackDes + '</span></td>';
        html += '<td class="text-right text-' + getColor(v.UnitStart) +'">' + cont + '' + " " + ' <span class="badge badge-primary badge-pill" > ' + v.StockItem.ContDes + '</span></td>';
        html += '<td class="text-right text-' + getColor(v.UnitStart) +'">' + numberFormat(unit) + '' + " " + ' <span class="badge badge-primary badge-pill" > ' + v.StockItem.UnitDes + '</span></td>';
        //if (isClosing == false) {
            html += '<td class="text-right text-' + getColor(v.UnitEnd) +'">' + packEnd + '' + " " + ' <span class="badge badge-primary badge-pill" > ' + v.StockItem.PackDes + '</span></td>';
            html += '<td class="text-right text-' + getColor(v.UnitEnd) +'">' + contEnd + '' + " " + ' <span class="badge badge-primary badge-pill" > ' + v.StockItem.ContDes + '</span></td>';
            html += '<td class="text-right text-' + getColor(v.UnitEnd) +'">' + numberFormat(unitEnd) + '' + " " + ' <span class="badge badge-primary badge-pill" > ' + v.StockItem.UnitDes + '</span></td>';
        //}
        //else {
        //    html += '<td class="text-right"></td>';
        //    html += '<td class="text-right"></td>';
        //    html += '<td class="text-right"></td>';
        //}
        html += '<td class="text-right">' + numberFormat(v.CostStart) + '</td>';
        html += '<td class="text-right">' + (v.CostEnd != null ? numberFormat(v.CostEnd) : "" )+ '</td>';
        html += '<td style="text-align: center;">' + (v.StockItem.IsActive == true ? "YES" : "NO" )+ '</td></tr>';
        $('#tbModalPeriodDetail').append(html);
    });
    $('#PeriodModal').modal('show');
    _btn.removeClass('btn-loading');
}
function getColor(_number) {
    let color = 'black';
    if (_number < 0) {
        color = 'red';
    }
    return color;
}
$('#btn-save-closing').click(function () {
    let PeriodID = $(this).attr('periodid');
    let WarehouseID = $(this).attr('warehouseid');
    let StoreID = $(this).attr('storeid');
    let data = {
        "PeriodID": PeriodID,
        "WarehouseID": WarehouseID,
        "StoreID": StoreID
    }
    Swal.fire({
        title: 'Are you sure ?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonText: "No",
        cancelButtonColor: '#d33'
            }).then((result) => {
                if (result.isConfirmed) {
                    $('#btn-save-closing').addClass("btn-loading");
                    Swal.fire({
                        title: '<div class="lds-hourglass"></div>',
                        showConfirmButton: false,
                    });
                    putDataClosing(data);
                }
        });
})
function putDataClosing(_data) {

    $('#btn-save-closing').removeClass("btn-loading");
    $.ajax({
        url: '/api/PeriodDetail',
        type: 'PUT',
        headers: {
            'ClientGUID': getCookie('ClientGUID'),
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(_data) ,
        success: function (_Result) {
            if (_Result.Status == 200) {
                Swal.fire({
                    icon: 'success',
                    title: _Result.Description.en,
                    showConfirmButton: false,
                    timer: 3500
                });
                $('#PeriodModal').modal('hide');
                $('#btnInQuery').trigger('click');
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: _Result.Description.en,
                    showConfirmButton: false,
                    timer: 3500
                });
            }
        }
    });
}
$('#btnSearch').click(function () {
    let txtSeach = $('#inputSearch').val().trim();
    function filterSearch(query) {
        return dataPeriodDetail.filter(function (el) {
            regex = /^([a-zA-Z0-9 _-]+)$/; // Chỉ chấp nhận ký tự alphabet thường hoặc ký tự hoa
            // true nếu text chỉ chứa ký tự alphabet thường hoặc hoa, false trong trường hợp còn lại. 
            if (regex.test(txtSeach)) {
                return xoa_dau(el.StockItem.StockItemName).toLowerCase().indexOf(query.toLowerCase()) > -1;
            } else {
                return el.StockItem.StockItemName.toLowerCase().indexOf(query.toLowerCase()) > -1;
            }
        })
    }
    let data = filterSearch(txtSeach);
    valuePeriodDetail(data, $(this));

});
function xoa_dau(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
}

$('#btnExport').click(function () {
    $(this).addClass('btn-loading');
    let dataExport = $('#tbData').DataTable().buttons.exportData({ columns: ':visible' });
    let createXLSLFormatObj = [];
    /* XLS Head Columns */
    let xlsHeader = dataExport.header;
    /* XLS Rows Data */
    let xlsRows = dataExport.body;
    createXLSLFormatObj.push(xlsHeader);
    $.each(xlsRows, function (index, value) {
        let innerRowData = [];
        $.each(value, function (ind, val) {
            innerRowData.push(val);
        });
        createXLSLFormatObj.push(innerRowData);
    });
    /* File Name */
    let filename = "Period.xlsx";
    /* Sheet Name */
    let ws_name = "Sheet";
    let wb = XLSX.utils.book_new();
    ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);
    /* Add worksheet to workbook */
    XLSX.utils.book_append_sheet(wb, ws, ws_name);
    XLSX.writeFile(wb, filename);
    $(this).removeClass('btn-loading');
})