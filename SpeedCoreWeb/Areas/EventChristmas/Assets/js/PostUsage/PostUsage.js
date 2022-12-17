let dataManual = [];
let dataItemSelect = [];
let table;
let pageSize = 1000;
let pageNum = 0;
let dataWarehouse = [];
let dataStockLevel = [];
$(document).ready(function () {
    setDataTable();
    getStore();
    getProduct();
    getStockItem();
    getWarehouse();
    getCategory();
    getSubCategory();
    getSupplier();
    $('#timeStart').val(moment(new Date()).format("MM/DD/YYYY"));
    $('#timeEnd').val(moment(new Date()).format("MM/DD/YYYY"));
    $('#dataTable').css('display', 'none');
    $('.lds-hourglass').css('display', 'none');
    $('#btnCreate').attr('disabled', true);
})
$('#btnCreate').click(function () {
    $('a[href="#bybill"]').trigger('click');
    $('.start-date-trans').val(moment(Date.now()).format('MM/DD/YYYY'));
    $('.end-date-trans').val(moment(Date.now()).format('MM/DD/YYYY'));
    $('.start-date-by-date').val(moment(Date.now()).format('MM/DD/YYYY'));
    $('.end-date-by-date').val(moment(Date.now()).format('MM/DD/YYYY'));
    $('#select-transaction-store').val(-1).trigger("change");
    $('#select-product').val(-1).trigger("change");
    $('#btn-query-transaction').trigger('click');
    $('#tbody-stockitem-by-bill').empty();
    addHtmlTableByBill();
    $('#modal-create-post-usage').modal('show');
})
function getTransactionManual() {
    $.ajax({
        url: ulrTransByFilter(),
        type: 'get',
        headers: {
            'ClientGUID': getCookie('ClientGUID'),
        },
        success: function (_Result) {
            if (_Result.Status == 200) {
                valueTransactionManual(_Result.Data);
                dataManual = _Result.Data;
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: _Result.Description.en,
                    showConfirmButton: false,
                    showCloseButton: true,
                });
            }
        }
    });
}
$('#btn-query-transaction').click(function () {
    $('#tbDataTrans').empty();
    let td = '<tr><td class="text-center" colspan="11"><div class="lds-hourglass"></div></td></tr>';
    $('#tbDataTrans').append(td);
    getTransactionManual();
})
function valueTransactionManual(_data) {
    $('#tbDataTrans').empty();
    let td = "";
    if (_data.length != 0) {
        $.each(_data, function (k, v) {
            td += '<tr storeid=' + v.Store.StoreID + '>';
            td += '<td class="text-center">' + v.TransactionCode + '</td>';
            td += '<td>' + v.TransactionHeader.TableName + '</td>';
            td += '<td>' + v.TransactionHeader.WhoCloseName + '</td>';
            td += '<td class="text-center">' + v.TransactionDetailID + '</td>';
            td += '<td>' + '(' + v.Product.ProductCode + ')' + v.Product.ProductName + '</td>';
            td += '<td class="text-right">' + v.Quantity + '</td>';
            td += '<td class="text-right">' + numberFormat(v.CostEach) + '</td>';
            td += '<td>' + v.Store.StoreName + '</td>';
            td += '<td>' + moment(v.TimeEnd).format("MM/DD/YYYY HH:ss") + '</td>';
            td += '<td class="text-right">' + numberFormat(v.TransactionHeader.FinalTotal) + '</td>';
            td += '<td class="text-center"> <button class="btn btn-sm btn-primary btn-post-by-item"> <i class="fa fa-edit"></i> </button> </td>';
            td += '</tr>';
        });
    }
    else {
        td += '<tr><td class="text-center" colspan="11">No transaction available</td></tr>';
    }
    $('#tbDataTrans').append(td);
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
                
                $('#select-transaction-store').empty().append('<option value=-1>All</option>');
                $('#select-store-by-bill').empty().append('<option value=-1>---Select---</option>');
                $('#select-store-by-date').empty().append('<option value=-1>---Select---</option>');
                let option = "";
                $.each(_Result.Data, function (k, v) {
                    option += "<option value=" + v.StoreID + ">" + v.StoreName + "</option>";
                });
                $('#select-store-by-bill').append(option);
                $('#select-store-by-date').append(option);
                $('#select-transaction-store').append(option);
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: _Result.Description.en,
                    showConfirmButton: false,
                    showCloseButton: true,
                });
            }
        }
    });
}
let dataProduct = [];
function getProduct() {
    $.ajax({
        url: '/api/Product?IsActive=true&ManualPrice=3',
        type: 'get',
        headers: {
            'ClientGUID': getCookie('ClientGUID'),
        },
        success: function (_Result) {
            if (_Result.Status == 200) {
                dataProduct = _Result.Data;
                $('#select-product').empty().append('<option value=-1>All</option>');
                $('#select-product-by-bill').empty().append('<option value=-1>---Select---</option>');
                $('#select-product-by-date').empty().append('<option value=-1>---Select---</option>');
                //let option = "";
                //$.each(_Result.Data, function (k, v) {
                //    option += "<option value=" + v.ProductID + ">" + v.ProductName + "</option>";
                //});
                //$('#select-product').append(option);
                //$('#select-product-by-bill').append(option);
                //$('#select-product-by-date').append(option);
            }
            else {
                dataProduct = [];
                Swal.fire({
                    icon: 'error',
                    title: _Result.Description.en,
                    showConfirmButton: false,
                    showCloseButton: true,
                });
            }
        }
    });
}
function getCategory() {
    $.ajax({
        url: '/api/Category?IsActive=true',
        type: 'get',
        headers: {
            'ClientGUID': getCookie('ClientGUID'),
        },
        success: function (_Result) {
            if (_Result.Status == 200) {
                $('#selectFilterCategory').empty().append('<option value=-1>All</option>');
                let option = "";
                $.each(_Result.Data, function (k, v) {
                    option += "<option value=" + v.CategoryID + ">" + v.CategoryName + "</option>";
                });
                $('#selectFilterCategory').append(option);
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: _Result.Description.en,
                    showConfirmButton: false,
                    showCloseButton: true,
                });
            }
        }
    });
}
function getSubCategory() {
    $.ajax({
        url: '/api/SubCategory?IsActive=true',
        type: 'get',
        headers: {
            'ClientGUID': getCookie('ClientGUID'),
        },
        success: function (_Result) {
            if (_Result.Status == 200) {
                $('#selectFilterSubCategory').empty().append('<option value=-1>All</option>');
                let option = "";
                $.each(_Result.Data, function (k, v) {
                    option += "<option value=" + v.SubCategoryID + ">" + v.CategoryName + "</option>";
                });
                $('#selectFilterSubCategory').append(option);
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: _Result.Description.en,
                    showConfirmButton: false,
                    showCloseButton: true,
                });
            }
        }
    });
}
function getSupplier() {
    $.ajax({
        url: '/api/Supplier?IsActive=true',
        type: 'get',
        headers: {
            'ClientGUID': getCookie('ClientGUID'),
        },
        success: function (_Result) {
            if (_Result.Status == 200) {
                $('#selectFilterSupplier').empty().append('<option value=-1>All</option>');
                let option = "";
                $.each(_Result.Data, function (k, v) {
                    option += "<option value=" + v.SupplierID + ">" + v.SupplierName + "</option>";
                });
                $('#selectFilterSupplier').append(option);
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: _Result.Description.en,
                    showConfirmButton: false,
                    showCloseButton: true,
                });
            }
        }
    });
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
                dataWarehouse = _Result.Data;
                $('#selectFilterWarehouse').empty().append('<option value=-1>All</option>');
                let option = "";
                $.each(_Result.Data, function (k, v) {
                    option += "<option value=" + v.WarehouseID + " storeid=" + v.StoreID + ">" + v.WarehouseName + "</option>";
                });
                $('#selectFilterWarehouse').append(option);
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: _Result.Description.en,
                    showConfirmButton: false,
                    showCloseButton: true,
                });
            }
        }
    });
}
function getWarehouseTrans(_storeID) {
    //$('#warehouse-by-item').empty().append('<option value=-1>---Select---</option>');
    let data = dataWarehouse.filter(x => x.StoreID == _storeID && x.IsPrimary == true);
    let option = "";
    $.each(data, function (k, v) {
        option += "<option value=" + v.WarehouseID + " >" + v.WarehouseName + "</option>";
    });
    $('#warehouse-by-item').append(option);
    getStockLevel(data[0].WarehouseID);
}
function ulrTransByFilter() {
    let timeStart = moment($('.start-date-trans').val()).format('YYYY/MM/DD 00:00:00');
    let timeEnd = moment($('.end-date-trans').val()).format('YYYY/MM/DD 23:59:59');
    let storeID = $('#select-transaction-store').val();
    let productCode = $('#select-product').val();

    let url = '/api/TransactionManual?IsActive=true&OpenDate=' + timeStart + ',' + timeEnd + '';
    if (storeID != -1)
        url += '&StoreID=' + storeID + '';
    if (productCode != -1)
        url += '&ProductCode=' + productCode + '';

    return url;
}
$('.txt-search-manual').keyup(function () {
    let txtSeach = $(this).val().trim();
    function filterSearch(query) {
        return dataManual.filter(function (el) {
            regex = /^([a-zA-Z0-9 _-]+)$/;
            if (regex.test(txtSeach)) {
                let data = [];
                data = xoa_dau(el.TransactionCode).toLowerCase().indexOf(query.toLowerCase()) > -1;
                return data;
            } else {
                return el.TransactionCode.toLowerCase().indexOf(query.toLowerCase()) > -1;
            }
        })
    }
    let data = filterSearch(txtSeach);
    valueTransactionManual(data);
})
$(document).on('click', '.btn-post-by-item', function () {
    $(this).addClass('btn-loading');
    valueModalByItem($(this));
    let storeID = $(this).closest('tr').attr('storeid');
    $('#total-cost-by-item').val(0);
    getWarehouseTrans(storeID);
})
$('#modalByItem').on('hide.bs.modal', function (e) {
    $('#modal-create-post-usage').css({ 'z-index': '1050', 'overflow-y': 'scroll' });
});
function valueModalByItem(_btn) {
    let prodName = $(_btn.closest('tr').find('td')[4]).text();
    let table = $(_btn.closest('tr').find('td')[1]).text();
    let serv = $(_btn.closest('tr').find('td')[2]).text();
    let date = $(_btn.closest('tr').find('td')[8]).text();
    let trans = $(_btn.closest('tr').find('td')[3]).text();
    let quantity = $(_btn.closest('tr').find('td')[5]).text();
    let costEach = $(_btn.closest('tr').find('td')[6]).text();
    let transCode = $(_btn.closest('tr').find('td')[0]).text();

    $('#warehouse-by-item').val(-1).trigger('change');
    $('#modalByItemTitle').text("Post by Item " + prodName + "");
    $('#tableName').text("Table: "+table);
    $('#tableTrans').text("#"+trans);
    $('#tableServ').text("Serv: "+serv);
    $('#tableDate').text("Date: " + date);
    $('#tableQuantity').text("Quantity: " + quantity);
    $('#tableCostEach').text("CostEach: " + costEach);
    $('#tableTransCode').text("Trans.Code: " + transCode);

    $('#tbodyByItem').empty();
    addHtmlTableByItem();

    $('.type-post-item').prop('checked', false);
    $('#type-post-item-full').prop('checked', true);
    $('#info-by-item').text('Post stock item for quantity ' + quantity + ' => ' + prodName +' ');

    _btn.removeClass('btn-loading');
    $('#modalByItem').modal('show');
    $('#modal-create-post-usage').css('z-index', 0);
}
function getStockItem() {
    dataItemSelect = [];
    $.ajax({
        url: '/api/StockItem?IsActive=true',
        type: 'get',
        headers: {
            'ClientGUID': getCookie('ClientGUID'),
        },
        success: function (_Result) {
            if (_Result.Status == 200) {
                $('#btnCreate').attr('disabled', false);
                let data = _Result.Data.filter(x => x.StockItemType != 2 && x.StockItemType != 3);
                dataItemSelect = data;
            }
            else {
                dataItemSelect = [];
                $('#btnCreate').attr('disabled', true);
                Swal.fire({
                    icon: 'error',
                    title: _Result.Description.en,
                    showConfirmButton: false,
                    showCloseButton: true,
                });
            }
        }
    });
}
function setSelect2ByItem(_this,_add) {
    if (_add == true)
        _this.append('<option value=-1> --- Select --- </option>');
    let dataItem = getDataPushByItem();
    $.each(dataItemSelect, function (k, v) {
        let check = dataItem.findIndex(x => x.StockItemID == v.StockItemID);
        if (check == -1) {
            let op = '<option value=' + v.StockItemID + '> ' + v.StockItemName + ' </option>';
            _this.append(op);
        }
    });
    _this.select2();
    _this.removeClass('sl-item-by-item-1').addClass('sl-item-by-item');
}
$(document).on('select2:select','.sl-item-by-item',function () {
    let dataTr = $(this).closest('tr').attr('data');
    if (dataTr == "") {
        addHtmlTableByItem();
    }

    let id = $(this).val();
    let itemOld = [];
    if (dataTr != "") {
        let dataOld = JSON.parse(dataTr);
        itemOld = dataItemSelect.find(x => x.StockItemID == dataOld.StockItemID);
    }
    let data = dataItemSelect.find(x => x.StockItemID == id);
    let trans = $('#tableTrans').text();

    let dataValue = {
        "StockItemID": data.StockItemID,
        "TransactionDetailID": trans.replace("#", ""),
        "Units": 0,
        "ManualCost": 1,
        "CostPerUnit": data.CostPerUnit
    }

    $(this).closest('tr').find('.ip-units-by-item').val(0).attr('disabled', false);
    $(this).closest('tr').find('.ip-cost-by-item').val(0);
    $(this).closest('tr').find('.sl-unit-by-item').empty().append('<option value="0"> ' + data.UnitDes + ' </option><option value="1"> ' + data.ContDes + ' </option><option value="2"> ' + data.PackDes + ' </option>').attr('disabled', false);
    $(this).closest('tr').attr('data', JSON.stringify(dataValue));
    $(this).removeClass('sl-item-by-item');
    $(this).find('option[value=-1]').remove();

    $('.sl-item-by-item').find('option[value=' + id + ']').remove();
    if (itemOld.length != 0) {
        $('.sl-item-by-date').append('<option value=' + itemOld.StockItemID + '> ' + itemOld.StockItemName, itemOld.StockItemID + '</option>');
    }
    $(this).addClass('sl-item-by-item');

})
$(document).on('keyup', '.ip-units-by-item', function () {
    let val = $(this).val();
    let unit = $(this).closest('tr').find('.sl-unit-by-item').val();
    let dataTr = $(this).closest('tr').attr('data');
    let dataValue = JSON.parse(dataTr);
    let id = dataValue.StockItemID;
    let data = dataItemSelect.find(x => x.StockItemID == id);
    let units = val * (unit == 2 ? data.UnitPerCont * data.ContPerPack : unit == 1 ? data.UnitPerCont : 1);
    let type = $('#type-post-item-partial').is(":checked");
    let strQuantity = $('#tableQuantity').text();
    let quantity = strQuantity.replace(/Quantity: /g, "");
    if (type == true) {
        units = units * parseFloat(quantity);
    }
    let costPerUnit = numberFormat(data.CostPerUnit * units);
    $(this).closest('tr').find('.ip-cost-by-item').val(costPerUnit);
    dataValue["Units"] = units;
    
    $(this).closest('tr').attr('data', JSON.stringify(dataValue));
    valuaTotalCostByItem();
})
$(document).on('change', '.sl-unit-by-item', function () {
    let val = $(this).val();
    let units = $(this).closest('tr').find('.ip-units-by-item').val();
    let dataTr = $(this).closest('tr').attr('data');
    if (dataTr != "") {
        let dataValue = JSON.parse(dataTr);
        let id = dataValue.StockItemID;
        let data = dataItemSelect.find(x => x.StockItemID == id);
        let unitsNew = units * (val == 2 ? data.UnitPerCont * data.ContPerPack : val == 1 ? data.UnitPerCont : 1);
        let type = $('#type-post-item-partial').is(":checked");
        let strQuantity = $('#tableQuantity').text();
        let quantity = strQuantity.replace(/Quantity: /g, "");
        if (type == true) {
            unitsNew = unitsNew * parseFloat(quantity);
        }
        let costPerUnit = numberFormat(data.CostPerUnit * unitsNew);
        $(this).closest('tr').find('.ip-cost-by-item').val(costPerUnit);
        dataValue["Units"] = unitsNew;

        $(this).closest('tr').attr('data', JSON.stringify(dataValue));
    }
    valuaTotalCostByItem();
})
$(document).on('click', '.btn-delete-by-item', function () {
    let data = $(this).closest('tr').attr('data');
    let id = $(this).closest('tr').find('.ip-item-by-item').val();
    let name = $(this).closest('tr').find('.ip-item-by-item:selected').text();

    if (data != "") {
        $(this).closest('tr').remove();
        $('.sl-item-by-date').append('<option value=' + id + '> ' + name + '</option>');
    }
    valuaTotalCostByItem();
})
function addHtmlTableByItem() {

    let html = '<tr data="">';
    html += '<td><select class="form-control sl-item-by-item-1" style="width:100%"></select ></td>';
    html += '<td><input class="form-control text-right ip-units-by-item" type="number" disabled></td>';
    html += '<td><select class="form-control sl-unit-by-item" style="width:100%" disabled></select ></td>';
    html += '<td><input class="form-control text-right ip-cost-by-item" type="text" value="0" disabled></td>';
    html += '<td><button class="btn btn-sm btn-primary btn-delete-by-item"> <i class="fa fa-trash"></i> </button></td>';
    html += "</tr>";
    $('#tbodyByItem').append(html);
    setSelect2ByItem($('.sl-item-by-item-1'), true);
}
function getDataPushByItem() {
    let data = [];
    let el = $('#tbodyByItem').find('tr');
    if (el.length > 0) {
        $.each(el, function (k, v) {
            let i = $(v).attr("data");
            if (i != "") {
                let obj = JSON.parse(i);
                data.push(obj);
            }
            
        })
    }
    return data;
}
$('#btn-save-by-item').click(function () {
    $(this).attr('disabled', true);
    Swal.fire({
        icon: '',
        title: '<div class="lds-hourglass"></div>',
        showConfirmButton: false
    });
    let data = getDataPushByItem();
    let warehouseID = $('#warehouse-by-item').val();
    if (warehouseID == -1) {
        Swal.fire({
            icon: 'error',
            title: "Warehouse can not be empty",
            showConfirmButton: false,
            showCloseButton: true,
        });
        $(this).attr('disabled', false);
        return;
    }
    if (data.length == 0) {
        Swal.fire({
            icon: 'error',
            title: "Stock Item can not be empty",
            showConfirmButton: false,
            showCloseButton: true,
        });
        $(this).attr('disabled', false);
        return;
    }
    $.each(data, function (k, v) {
        data[k]["WarehouseID"] = warehouseID;
    });
    Swal.fire({
        title: 'Are you sure ?',
        text: "Backup data when save could not be edit, continue",
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonText: "No",
        cancelButtonColor: '#d33'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                icon: '',
                title: '<div class="lds-hourglass"></div>',
                showConfirmButton: false
            });
            postDataByItem(data);
        } else {
            $(this).attr('disabled', false);
        }
    })
})
function postDataByItem(_data) {
    $.ajax({
        url: '/api/PostUsage',
        type: 'POST',
        headers: {
            'ClientGUID': getCookie('ClientGUID'),
        },
        data: JSON.stringify(_data),
        success: function (_Result) {
            if (_Result.Status == 200) {
                Swal.fire({
                    icon: 'success',
                    title: _Result.Description.en,
                    showConfirmButton: false
                });
                $('#modalByItem').modal('hide');
                $('#modal-create-post-usage').modal('hide');
                $('#btnQuery').trigger('click');
                $('.btn-create-by-bill').attr('disabled', false);
                $('#btn-save-by-item').attr('disabled', false);
                $('.btn-create-by-date').attr('disabled', false);
            }
            else {
                dataItemSelect = [];
                $('.btn-create-by-bill').attr('disabled', false);
                $('#btn-save-by-item').attr('disabled', false);
                $('.btn-create-by-date').attr('disabled', false);
                Swal.fire({
                    icon: 'error',
                    title: _Result.Description.en,
                    showConfirmButton: false,
                    showCloseButton: true,
                });
            }
        }
    });
}
function setDataTable() {
    table = $('#data-tb').on('processing.dt', function (e, settings, processing) {
    }).DataTable({
        "scrollY": true,
        "scrollX": true,
        "paging": false,
        "lengthChange": false,
        "pageLength": false,
        "searching": true,
        "order": [[0, 'desc']],
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
                "data": "StockPOSUsedID",
                "name": "StockPOSUsedID",
                "autoWidth": true,
                render: function (data, type, row) {
                    return data
                },
                "className": "dt-body-center "
            },
            {
                "data": "TransactionCode",
                "name": "TransactionCode",
                "autoWidth": true,
                "className": "dt-body-right",
                render: function (data, type, row) {
                    return data
                },
                "className": "dt-body-center"
            },
            {
                "data": "ProductName",
                "name": "ProductName",
                "autoWidth": true,
                render: function (data, type, row) {
                    return data
                },
            },
            {
                "data": "Quantity",
                "name": "Quantity",
                "autoWidth": true,
                render: function (data, type, row) {
                    return data
                },
            },
            {
                "data": "StockItem.StockItemName",
                "name": "StockItemName",
                "autoWidth": true,
                render: function (data, type, row) {
                    return data
                },
            },
            {
                "data": "Units",
                "name": "Usage",
                "autoWidth": true,
                render: function (data, type, row) {
                    return numberFormat(data) + '<span class="badge badge-primary badge-pill">' + row.StockItem.UnitDes + '</span>'
                },
                "className": "dt-body-center"
            },
            {
                "data": "CostPerUnit",
                "name": "CostPerUnit",
                "autoWidth": true,
                "className": "dt-body-right",
                render: function (data, type, row) {
                    return numberFormat(data)
                },
                "className": "dt-body-right"
            },
            {
                "data": "CostPerUnit",
                "name": "CostUsage",
                "autoWidth": true,
                "className": "dt-body-right",
                render: function (data, type, row) {
                    return numberFormat(data * row.Units)
                },
                "className": "dt-body-right"
            },
            {
                "data": "ManualCost",
                "name": "ManualCost",
                "autoWidth": true,
                "className": "dt-body-right",
                render: function (data, type, row) {
                    let typeManual = ["", "By Item", "By Bill", "By Date"];
                    if (data != 3)
                        return typeManual[data];
                    else
                        return '<a>' + typeManual[data] + '</a>' + '</br>' + '<span class="badge badge-primary badge-pill">' + moment(row.ByDateStart).format('MM/DD/YYYY') + '</span></br>';
                },
                "className": "dt-body-center"
            },
            {
                "data": "Supplier.SupplierName",
                "name": "SupplierName",
                "autoWidth": true,
                render: function (data, type, row) {
                    return data
                },
            },
            {
                "data": "SubCategory.CategoryName",
                "name": "CategoryName",
                "autoWidth": true,
                render: function (data, type, row) {
                    return data
                },
            },
            {
                "data": "Cycle",
                "name": "Cycle",
                "autoWidth": true,
                render: function (data, type, row) {
                    let cycle = ["Daily", "Weekly", "Monthly", "Quarterly", "Annually"];
                    return cycle[data]
                },
            },
            {
                "data": "WarehouseName",
                "name": "WarehouseName",
                "autoWidth": true,
                render: function (data, type, row) {
                    return data
                },
            },
            {
                "data": "OpenDate",
                "name": "OpenDate",
                "autoWidth": true,
                render: function (data, type, row) {
                    return moment(data).format("MM/DD/YYYY");
                },
            },
            {
                "data": "DateCreated",
                "name": "DateCreated",
                "autoWidth": true,
                render: function (data, type, row) {
                    return moment(data).format("MM/DD/YYYY HH:mm");
                },
            },
        ],
    });

}
function getUrlByFilter() {
    let timeStart = moment($('#timeStart').val()).format('YYYY/MM/DD 00:00:00');
    let timeEnd = moment($('#timeEnd').val()).format('YYYY/MM/DD 23:59:59');
    let url = '/api/PostUsage?IsActive=true&PageSize=' + pageSize + '&PageNum=' + pageNum + '&DateCreated=' + timeStart + ',' + timeEnd + '';

    let supplierId = $('#selectFilterSupplier').val();
    let warehouseId = $('#selectFilterWarehouse').val();
    let reduceStatus = $('#selectFilterType').val();
    let categoryId = $('#selectFilterCategory').val();
    let subCategoryId = $('#selectFilterSubCategory').val();
    let manualCost = $('#selectFilterType').val();


    if (supplierId != -1) {
        url += '&SupplierID=' + supplierId + '';
    }
    if (warehouseId != -1) {
        url += '&WarehouseID=' + warehouseId + '';
    }
    if (reduceStatus != -1) {
        url += '&ReduceStatus=' + reduceStatus + '';
    }
    if (categoryId != -1) {
        url += '&CategoryID=' + categoryId + '';
    }
    if (subCategoryId != -1) {
        url += '&SubCategoryID=' + subCategoryId + '';
    }
    if (manualCost != -1) {
        url += '&ManualCost=' + manualCost + '';
    }

    return url;
}
function getDataTable() {
    $.ajax({
        url: getUrlByFilter(),
        type: 'GET',
        headers: {
            'ClientGUID': getCookie('ClientGUID'),
        },
        success: function (res) {
            if (res.Status == 200) {
                $('#pagination').empty();
                setPaginationBtn(res.TotalRow);
                addRowDataTable(table, res.Data);
                let sumCostUsage = parseFloat(res.Description.SumCostUsage);
                $('.number-sum-total').text(numberFormat(sumCostUsage));
            } else {
                Swal.fire({
                    icon: 'error',
                    title: res.Description.en,
                    showConfirmButton: false,
                    showCloseButton: true,
                });
            }
        }
    });
}
function addRowDataTable(_table, _data) {
    $('#dataTable').css('display', 'block');
    $('.lds-hourglass').css('display', 'none');
    $('#btnQuery').attr('disabled', false);
    _table.clear();
    _table.rows.add(_data);
    _table.draw(false);
}
$('#btnQuery').click(function () {
    $(this).attr('disabled', true);
    getDataTable();
    $('#dataTable').css('display', 'none');
    $('.lds-hourglass').css('display', 'block');
})
$("#pagination").on("click", "li", function () {
    if ($(this).text() != '…') {
        if ($(this).text() == 'Next') {
            pageNum += 1;
            $('#btnQuery').trigger('click');
        } else if ($(this).text() == 'Prev') {
            pageNum -= 1;
            $('#btnQuery').trigger('click');
        } else {
            pageNum = parseInt($(this).text() - 1);
            $('#btnQuery').trigger('click');
        }
    }
})
$('#select-store-by-bill').on('select2:select', function () {
    let storeID = $(this).val();
    let data = dataWarehouse.find(x => x.StoreID == storeID && x.IsPrimary == true);
    //$('#select-warehouse-by-bill').empty().append('<option value=-1>---Select---</option>');
    let option = "<option value=" + data.WarehouseID + " >" + data.WarehouseName + "</option>";
    $('#select-warehouse-by-bill').append(option);
    getStockLevel(data.WarehouseID);
    let _dataProduct = dataProduct.filter(x => x.StoreID == storeID);
    $('#select-product-by-bill').empty().append('<option value=-1>---Select---</option>');
    let option1 = "";
    $.each(_dataProduct, function (k, v) {
        option1 += "<option value=" + v.ProductID + ">" + v.ProductName + "</option>";
    });
    $('#select-product-by-bill').append(option1);
})
$('#select-store-by-date').on('select2:select', function () {
    let storeID = $(this).val();
    let _dataProduct = dataProduct.filter(x => x.StoreID == storeID);
    $('#select-product-by-date').empty().append('<option value=-1>---Select---</option>');
    let option1 = "";
    $.each(_dataProduct, function (k, v) {
        option1 += "<option value=" + v.ProductID + ">" + v.ProductName + "</option>";
    });
    $('#select-product-by-date').append(option1);

    let data = dataWarehouse.find(x => x.StoreID == storeID && x.IsPrimary == true);
    if (typeof data != 'undefined') {
        let option = "<option value=" + data.WarehouseID + " >" + data.WarehouseName + "</option>";
        getStockLevel(data.WarehouseID);
        $('#select-warehouse-by-date').append(option);
        getPeriod(data.WarehouseID);
    } 
})
$('#select-transaction-store').on('select2:select', function () {
    let storeID = $(this).val();
    let _dataProduct = dataProduct.filter(x => x.StoreID == storeID);
    $('#select-product').empty().append('<option value=-1>--S-Select---</option>');
    let option = "";
    $.each(_dataProduct, function (k, v) {
        option += "<option value=" + v.ProductID + ">" + v.ProductName + "</option>";
    });
    $('#select-product').append(option);
})
function addHtmlTableByBill() {
    let html = '<tr data="">';
    html += '<td><select class="form-control sl-item-by-bill-1" style="width:100%"></select ></td>';
    html += '<td><input class="form-control text-right ip-units-by-bill" type="number" disabled></td>';
    html += '<td><select class="form-control sl-unit-by-bill" style="width:100%" disabled></select ></td>';
    html += '<td><input class="form-control text-right ip-cost-by-bill" type="text" value="0" disabled></td>';
    html += '<td><button class="btn btn-sm btn-primary btn-delete-by-bill"> <i class="fa fa-trash"></i> </button></td>';
    html += "</tr>";
    $('#tbody-stockitem-by-bill').append(html);
    setSelect2ByBill($('.sl-item-by-bill-1'), true);
}
function addHtmlTableByDate() {
    let html = '<tr data="">';
    html += '<td><select class="form-control sl-item-by-date-1" style="width:100%"></select ></td>';
    html += '<td><input class="form-control text-right ip-units-by-date" type="number" disabled></td>';
    html += '<td><select class="form-control sl-unit-by-date" style="width:100%" disabled></select ></td>';
    html += '<td><input class="form-control text-right ip-cost-by-date" type="text" value="0" disabled></td>';
    html += '<td><button class="btn btn-sm btn-primary btn-delete-by-date"> <i class="fa fa-trash"></i> </button></td>';
    html += "</tr>";
    $('#tbody-stockitem-by-date').append(html);
    setSelect2ByDate($('.sl-item-by-date-1'), true);
}
function setSelect2ByBill(_this, _add) {
    if (_add == true)
        _this.append('<option value=-1> --- Select --- </option>');
    let dataItem = getDataPushByBill();
    $.each(dataItemSelect, function (k, v) {
        let check = dataItem.findIndex(x => x.StockItemID == v.StockItemID);
        if (check == -1) {
            let op = '<option value=' + v.StockItemID + '> ' + v.StockItemName + ' </option>';
            _this.append(op);
        }
    });
    _this.select2();
    _this.removeClass('sl-item-by-bill-1').addClass('sl-item-by-bill');
}
function setSelect2ByDate(_this, _add) {
    if (_add == true)
        _this.append('<option value=-1> --- Select --- </option>');
    let dataItem = getDataPushByDate();
    $.each(dataItemSelect, function (k, v) {
        let check = dataItem.findIndex(x => x.StockItemID == v.StockItemID);
        if (check == -1) {
            let op = '<option value=' + v.StockItemID + '> ' + v.StockItemName + ' </option>';
            _this.append(op);
        }
    });
    _this.select2();
    _this.removeClass('sl-item-by-date-1').addClass('sl-item-by-date');
}
$(document).on('select2:select', '.sl-item-by-bill', function () {
    let dataTr = $(this).closest('tr').attr('data');
    if (dataTr == "") {
        addHtmlTableByBill();
    }

    let id = $(this).val();
    let itemOld = [];
    if (dataTr != "") {
        let dataOld = JSON.parse(dataTr);
        itemOld = dataItemSelect.filter(x => x.StockItemID == dataOld.StockItemID);
    }
    let data = dataItemSelect.find(x => x.StockItemID == id);

    let dataValue = {
        "StockItemID": data.StockItemID,
        "Units": 0,
        "ManualCost": 2,
        "CostPerUnit": data.CostPerUnit
    }

    $(this).closest('tr').find('.ip-units-by-bill').val(0).attr('disabled', false);
    $(this).closest('tr').find('.sl-unit-by-bill').empty().append('<option value="0"> ' + data.UnitDes + ' </option><option value="1"> ' + data.ContDes + ' </option><option value="2"> ' + data.PackDes + ' </option>').attr('disabled', false);
    $(this).closest('tr').attr('data', JSON.stringify(dataValue));
    $(this).removeClass('sl-item-by-bill');
    $(this).find('option[value=-1]').remove();

    $('.sl-item-by-bill').find('option[value=' + id + ']').remove();
    if (itemOld.length != 0) {
        let newOption = new Option(itemOld[0].StockItemName, itemOld[0].StockItemID, false, false);
        $('.sl-item-by-bill').append(newOption).trigger('change');
    }
    $(this).addClass('sl-item-by-bill');
})
$(document).on('select2:select', '.sl-item-by-date', function () {
    let dataTr = $(this).closest('tr').attr('data');
    if (dataTr == "") {
        addHtmlTableByDate();
    }

    let id = $(this).val();
    let itemOld = [];
    if (dataTr != "") {
        let dataOld = JSON.parse(dataTr);
        itemOld = dataItemSelect.filter(x => x.StockItemID == dataOld.StockItemID);
    }
    let data = dataItemSelect.find(x => x.StockItemID == id);

    let dataValue = {
        "StockItemID": data.StockItemID,
        "Units": 0,
        "ManualCost": 3,
        "CostPerUnit": data.CostPerUnit
    }

    $(this).closest('tr').find('.ip-units-by-date').val(0).attr('disabled', false);
    $(this).closest('tr').find('.sl-unit-by-date').empty().append('<option value="0"> ' + data.UnitDes + ' </option><option value="1"> ' + data.ContDes + ' </option><option value="2"> ' + data.PackDes + ' </option>').attr('disabled', false);
    $(this).closest('tr').attr('data', JSON.stringify(dataValue));
    $(this).removeClass('sl-item-by-date');
    $(this).find('option[value=-1]').remove();

    $('.sl-item-by-date').find('option[value=' + id + ']').remove();
    if (itemOld.length != 0) {
        $('.sl-item-by-date').append('<option value=' + itemOld[0].StockItemID + '> ' + itemOld[0].StockItemName, itemOld[0].StockItemID +'</option>');
    }
    $(this).addClass('sl-item-by-date');
})

function getDataPushByBill() {
    let data = [];
    let el = $('#tbody-stockitem-by-bill').find('tr');
    if (el.length > 0) {
        $.each(el, function (k, v) {
            let i = $(v).attr("data");
            if (i != "") {
                let obj = JSON.parse(i);
                data.push(obj);
            }

        })
    }
    return data;
}
function getDataPushByDate() {
    let data = [];
    let el = $('#tbody-stockitem-by-date').find('tr');
    if (el.length > 0) {
        $.each(el, function (k, v) {
            let i = $(v).attr("data");
            if (i != "") {
                let obj = JSON.parse(i);
                data.push(obj);
            }

        })
    }
    return data;
}
$('a[href="#bybill"]').click(function () {
    $('#select-store-by-bill').val(-1).trigger('change');
    $('#select-product-by-bill').val(-1).trigger('change');
    $('#tbody-stockitem-by-bill').empty();
    $('#ip-costeach-by-bill').val(0);
    $('#g-tax-by-bill').find('.custom-control-input').prop('checked', false);
    $('#ip-vatcosteach-by-bill').val(0);
    $('#total-cost-by-bill').val(0);
    addHtmlTableByBill();
    $('.btn-create-by-bill').remove();
    $('.btn-create-by-date').remove();
    $('.modal-footer').append('<button type="button" class="btn btn-primary btn-create-by-bill">Post Usage</button>');
})
$('a[href="#bydate"]').click(function () {
    $('#select-store-by-date').val(-1).trigger('change');
    $('#select-product-by-date').val(-1).trigger('change');
    $('#tbody-stockitem-by-date').empty();
    $('#ip-costeach-by-date').val(0);
    $('#g-tax-by-date').find('.custom-control-input').prop('checked', false);
    $('#ip-vatcosteach-by-date').val(0);
    addHtmlTableByDate();
    $('.btn-create-by-bill').remove();
    $('.btn-create-by-date').remove();
    $('.start-date-by-date').attr('disabled', true);
    $('.modal-footer').append('<button type="button" class="btn btn-primary btn-create-by-date">Post Usage</button>');
})
$('a[href="#byitem"]').click(function () {
    $('.btn-create-by-date').remove();
    $('.btn-create-by-bill').remove();
})
$(document).on('click','.btn-create-by-bill',function () {
    $(this).attr('disabled', true);
    Swal.fire({
        icon: '',
        title: '<div class="lds-hourglass"></div>',
        showConfirmButton: false
    });
    let data = getDataPushByBill();
    let warehouseID = $('#select-warehouse-by-bill').val();
    let costEach = $('#ip-costeach-by-bill').val().replace(/,/g, "");
    let vatCostEach = $('#ip-vatcosteach-by-bill').val().replace(/,/g, "");
    if (costEach == "") {
        Swal.fire({
            icon: 'error',
            title: "CostEach can not be empty",
            showConfirmButton: false,
            showCloseButton: true,
        });
        $(this).attr('disabled', false);
        return;
    }
    if (vatCostEach == "") {
        Swal.fire({
            icon: 'error',
            title: "VATCostEach can not be empty",
            showConfirmButton: false,
            showCloseButton: true,
        });
        $(this).attr('disabled', false);
        return;
    }
    if (warehouseID == -1) {
        Swal.fire({
            icon: 'error',
            title: "Warehouse can not be empty",
            showConfirmButton: false,
            showCloseButton: true,
        });
        $(this).attr('disabled', false);
        return;
    }
    let storeID = $('#select-store-by-bill').val();
    if (storeID == -1) {
        Swal.fire({
            icon: 'error',
            title: "Store can not be empty",
            showConfirmButton: false,
            showCloseButton: true,
        });
        $(this).attr('disabled', false);
        return;
    }
    let productID = $('#select-product-by-bill').val();
    if (productID == -1) {
        Swal.fire({
            icon: 'error',
            title: "Product can not be empty",
            showConfirmButton: false,
            showCloseButton: true,
        });
        $(this).attr('disabled', false);
        return;
    }
    if (data.length == 0) {
        Swal.fire({
            icon: 'error',
            title: "StockItem can not be empty",
            showConfirmButton: false,
            showCloseButton: true,
        });
        $(this).attr('disabled', false);
        return;
    }
    $.each(data, function (k, v) {
        data[k]["WarehouseID"] = warehouseID;
        data[k]["StoreID"] = storeID;
        data[k]["ProductID"] = productID;
        data[k]["EmployeeID"] = employeeID;
        data[k]["VATCostEach"] = parseFloat(vatCostEach);
        data[k]["CostEach"] = parseFloat(costEach);
    });
    Swal.fire({
        title: 'Are you sure ?',
        text: "Backup data when save could not be edit, continue",
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonText: "No",
        cancelButtonColor: '#d33'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                icon: '',
                title: '<div class="lds-hourglass"></div>',
                showConfirmButton: false
            });
            postDataByItem(data);
        } else {
            $(this).attr('disabled', false);
        }
    })
})
$(document).on('keyup', '.ip-units-by-bill', function () {
    let val = $(this).val();
    let unit = $(this).closest('tr').find('.sl-unit-by-bill').val();
    let dataTr = $(this).closest('tr').attr('data');
    let dataValue = JSON.parse(dataTr);
    let id = dataValue.StockItemID;
    let data = dataItemSelect.find(x => x.StockItemID == id);
    let units = val * (unit == 2 ? data.UnitPerCont * data.ContPerPack : unit == 1 ? data.UnitPerCont : 1);
    let costPerUnit = numberFormat(data.CostPerUnit * units);
    $(this).closest('tr').find('.ip-cost-by-bill').val(costPerUnit);
    dataValue["Units"] = units;
    $(this).closest('tr').attr('data', JSON.stringify(dataValue));
    valuaTotalCostByBill();
})
$(document).on('change', '.sl-unit-by-bill', function () {
    let val = $(this).val();
    let units = $(this).closest('tr').find('.ip-units-by-bill').val();
    let dataTr = $(this).closest('tr').attr('data');
    let dataValue = JSON.parse(dataTr);
    let id = dataValue.StockItemID;
    let data = dataItemSelect.find(x => x.StockItemID == id);
    let unitsNew = units * (val == 2 ? data.UnitPerCont * data.ContPerPack : val == 1 ? data.UnitPerCont : 1);
    dataValue["Units"] = unitsNew;
    let costPerUnit = numberFormat(data.CostPerUnit * unitsNew);
    $(this).closest('tr').find('.ip-cost-by-bill').val(costPerUnit);
    $(this).closest('tr').attr('data', JSON.stringify(dataValue));
    valuaTotalCostByBill();
})
$(document).on('click', '.btn-delete-by-bill', function () {
    let data = getDataPushByBill();
    let id = $(this).closest('tr').find('.ip-item-by-bill').val();
    let name = $(this).closest('tr').find('.ip-item-by-bill:selected').text();

    if (data.length > 0) {
        $(this).closest('tr').remove();
        $('.sl-item-by-bill').append('<option value=' + id + '> ' + name + '</option>');
    }
    valuaTotalCostByBill();
})
$('#tax1-by-bill,#tax2-by-bill,#tax3-by-bill').change(function () {
    $(this).closest('.input-group').find('.custom-control-input').prop('checked', false);
    $(this).prop('checked', true);

    let isTax1 = $('#tax1-by-bill').is(":checked");
    let isTax2 = $('#tax2-by-bill').is(":checked");
    let isTax3 = $('#tax3-by-bill').is(":checked");

    let lineTotal = $('#ip-costeach-by-bill').val().replace(/,/g, "");

    let tax1 = isTax1 == true ? parseFloat(lineTotal) * 0.05 : 0;
    let tax2 = isTax2 == true ? parseFloat(lineTotal) * 0.10 : 0;
    let tax3 = isTax3 == true ? parseFloat(lineTotal) * 0.08 : 0;

    $('#ip-vatcosteach-by-bill').val(numberFormat(parseFloat(lineTotal) + tax1 + tax2 + tax3));
})

$('#ip-costeach-by-bill').keyup(function () {

    let isTax1 = $('#tax1-by-bill').is(":checked");
    let isTax2 = $('#tax2-by-bill').is(":checked");
    let isTax3 = $('#tax3-by-bill').is(":checked");

    let lineTotal = $(this).val().replace(/,/g, "");
    if (lineTotal == "")
        lineTotal = "0";
    let tax1 = isTax1 == true ? parseFloat(lineTotal) * 0.05 : 0;
    let tax2 = isTax2 == true ? parseFloat(lineTotal) * 0.10 : 0;
    let tax3 = isTax3 == true ? parseFloat(lineTotal) * 0.08 : 0;

    $('#ip-vatcosteach-by-bill').val(numberFormat(parseFloat(lineTotal) + tax1 + tax2 + tax3));
    $(this).val(numberFormat(parseFloat(lineTotal)));
})

$(document).on('keyup', '.ip-units-by-date', function () {
    let val = $(this).val();
    let unit = $(this).closest('tr').find('.sl-unit-by-date').val();
    let dataTr = $(this).closest('tr').attr('data');
    let dataValue = JSON.parse(dataTr);
    let id = dataValue.StockItemID;
    let data = dataItemSelect.find(x => x.StockItemID == id);
    let units = val * (unit == 2 ? data.UnitPerCont * data.ContPerPack : unit == 1 ? data.UnitPerCont : 1);
    let costPerUnit = numberFormat(data.CostPerUnit * units);
    $(this).closest('tr').find('.ip-cost-by-date').val(costPerUnit);
    dataValue["Units"] = units;

    $(this).closest('tr').attr('data', JSON.stringify(dataValue));
    valuaTotalCostByDate();
})
$(document).on('change', '.sl-unit-by-date', function () {
    let val = $(this).val();
    let units = $(this).closest('tr').find('.ip-units-by-date').val();
    let dataTr = $(this).closest('tr').attr('data');
    let dataValue = JSON.parse(dataTr);
    let id = dataValue.StockItemID;
    let data = dataItemSelect.find(x => x.StockItemID == id);
    let unitsNew = units * (val == 2 ? data.UnitPerCont * data.ContPerPack : val == 1 ? data.UnitPerCont : 1);
    dataValue["Units"] = unitsNew;
    let costPerUnit = numberFormat(data.CostPerUnit * unitsNew);
    $(this).closest('tr').find('.ip-cost-by-date').val(costPerUnit);
    $(this).closest('tr').attr('data', JSON.stringify(dataValue));
    valuaTotalCostByDate();
})
$(document).on('click', '.btn-delete-by-date', function () {
    let data = getDataPushByDate();
    let id = $(this).closest('tr').find('.ip-item-by-date').val();
    let name = $(this).closest('tr').find('.ip-item-by-date:selected').text();

    if (data.length > 0) {
        $(this).closest('tr').remove();
        $('.sl-item-by-date').append('<option value=' + id + '> ' + name + '</option>');
    }
    valuaTotalCostByDate();
})
$('#tax1-by-date,#tax2-by-date,#tax3-by-date').change(function () {
    $(this).closest('.input-group').find('.custom-control-input').prop('checked', false);
    $(this).prop('checked', true);

    let isTax1 = $('#tax1-by-date').is(":checked");
    let isTax2 = $('#tax2-by-date').is(":checked");
    let isTax3 = $('#tax3-by-date').is(":checked");

    let lineTotal = $('#ip-costeach-by-date').val().replace(/,/g, "");

    let tax1 = isTax1 == true ? parseFloat(lineTotal) * 0.05 : 0;
    let tax2 = isTax2 == true ? parseFloat(lineTotal) * 0.10 : 0;
    let tax3 = isTax3 == true ? parseFloat(lineTotal) * 0.08 : 0;

    $('#ip-vatcosteach-by-date').val(numberFormat(parseFloat(lineTotal) + tax1 + tax2 + tax3));
})

$('#ip-costeach-by-date').keyup(function () {

    let isTax1 = $('#tax1-by-date').is(":checked");
    let isTax2 = $('#tax2-by-date').is(":checked");
    let isTax3 = $('#tax3-by-date').is(":checked");

    let lineTotal = $(this).val().replace(/,/g, "");
    if (lineTotal == "")
        lineTotal = "0";
    let tax1 = isTax1 == true ? parseFloat(lineTotal) * 0.05 : 0;
    let tax2 = isTax2 == true ? parseFloat(lineTotal) * 0.10 : 0;
    let tax3 = isTax3 == true ? parseFloat(lineTotal) * 0.08 : 0;

    $('#ip-vatcosteach-by-date').val(numberFormat(parseFloat(lineTotal) + tax1 + tax2 + tax3));
    $(this).val(numberFormat(parseFloat(lineTotal)));
})
$(document).on('click', '.btn-create-by-date', function () {
    $(this).attr('disabled', true);
    let data = getDataPushByDate();
    let warehouseID = $('#select-warehouse-by-date').val();
    let costEach = $('#ip-costeach-by-date').val().replace(/,/g, "");
    let vatCostEach = $('#ip-vatcosteach-by-date').val().replace(/,/g, "");
    let date = moment($('.start-date-by-date').val()).format('YYYY-MM-DD');
    //let endDate = moment($('.end-date-by-date').val()).format('YYYY-MM-DD');
    if (costEach == "") {
        Swal.fire({
            icon: 'error',
            title: "CostEach can not be empty",
            showConfirmButton: false,
            showCloseButton: true,
        });
        $(this).attr('disabled', false);
        return;
    }
    if (vatCostEach == "") {
        Swal.fire({
            icon: 'error',
            title: "VATCostEach can not be empty",
            showConfirmButton: false,
            showCloseButton: true,
        });
        $(this).attr('disabled', false);
        return;
    }
    if (warehouseID == -1) {
        Swal.fire({
            icon: 'error',
            title: "Warehouse can not be empty",
            showConfirmButton: false,
            showCloseButton: true,
        });
        $(this).attr('disabled', false);
        return;
    }
    let storeID = $('#select-store-by-date').val();
    if (storeID == -1) {
        Swal.fire({
            icon: 'error',
            title: "Store can not be empty",
            showConfirmButton: false
        });
        $(this).attr('disabled', false);
        return;
    }
    let productID = $('#select-product-by-date').val();
    if (productID == -1) {
        Swal.fire({
            icon: 'error',
            title: "Product can not be empty",
            showConfirmButton: false
        });
        $(this).attr('disabled', false);
        return;
    }
    if (data.length == 0) {
        Swal.fire({
            icon: 'error',
            title: "StockItem can not be empty",
            showConfirmButton: false
        });
        $(this).attr('disabled', false);
        return;
    }
    $.each(data, function (k, v) {
        data[k]["WarehouseID"] = warehouseID;
        data[k]["StoreID"] = storeID;
        data[k]["ProductID"] = productID;
        data[k]["EmployeeID"] = employeeID;
        data[k]["VATCostEach"] = parseFloat(vatCostEach);
        data[k]["CostEach"] = parseFloat(costEach);
        data[k]["ByDateStart"] = date;
        //data[k]["ByDateEnd"] = endDate;
    });
    Swal.fire({
        title: 'Are you sure ?',
        text: "Backup data when save could not be edit, continue",
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonText: "No",
        cancelButtonColor: '#d33'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                icon: '',
                title: '<div class="lds-hourglass"></div>',
                showConfirmButton: false
            });
            postDataByItem(data);
        } else {
            $(this).attr('disabled', false);
        }
    })
})
$('.type-post-item').change(function () {
    $('.type-post-item').prop('checked', false);
    $(this).prop('checked', true);
    $('.sl-unit-by-item').trigger('change');
    let quantity = $('#tableQuantity').text();
    let type = $('#type-post-item-full').is(':checked');
    let productName = $('#modalByItemTitle').text();
    if (type == true) {
        $('#info-by-item').text('Post stock item for quantity ' + quantity.replace(/Quantity: /, "") + ' => ' + productName.replace(/Post by Item /, "") +'');
    } else {
        $('#info-by-item').text('Post stock item for quantity 1 => ' + productName.replace(/Post by Item /, "") +'');
    }   
})
function getStockLevel(_warehouseID) {
    $('.sl-item-by-item').attr('disabled', true);
    $('.sl-item-by-bill').attr('disabled', true);
    $('.sl-item-by-date').attr('disabled', true);
    let data = dataStockLevel.filter(x => x.WarehouseID == _warehouseID);
    if (data.length == 0) {
        $.ajax({
            url: '/api/StockLevel?IsActive=true&WarehouseID=' + _warehouseID + '',
            type: 'get',
            headers: {
                'ClientGUID': getCookie('ClientGUID'),
            },
            success: function (_Result) {
                if (_Result.Status == 200) {
                    dataStockLevel = dataStockLevel.concat(_Result.Data);
                    let dataJoin = dataStockLevel.filter(x => x.WarehouseID == _warehouseID);
                    joinStockLevel(dataJoin);
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: _Result.Description.en,
                        showConfirmButton: false,
                        showCloseButton: true,
                    });
                }
            }
        });
    } else {
        joinStockLevel(data);
    }
    
}
function joinStockLevel(_data) {
    $.each(dataItemSelect, function (k, v) {
        let data = _data.find(x => x.StockItemID == v.StockItemID);
        dataItemSelect[k]["CostPerUnit"] = data.CostPerUnit;
    })
    $('.sl-item-by-item').attr('disabled', false);
    $('.sl-item-by-bill').attr('disabled', false);
    $('.sl-item-by-date').attr('disabled', false);
}
function valuaTotalCostByItem() {
    let data = getDataPushByItem();
    let total = 0;
    $.each(data, function (k, v) {
        total += (v.CostPerUnit * v.Units);
    });
    $('#total-cost-by-item').val(numberFormat(total));
}
function valuaTotalCostByBill() {
    let data = getDataPushByBill();
    let total = 0;
    $.each(data, function (k, v) {
        total += (v.CostPerUnit * v.Units);
    });
    $('#total-cost-by-bill').val(numberFormat(total));
}
function valuaTotalCostByDate() {
    let data = getDataPushByDate();
    let total = 0;
    $.each(data, function (k, v) {
        total += (v.CostPerUnit * v.Units);
    });
    $('#total-cost-by-date').val(numberFormat(total));
}
function getPeriod(warehouseID) {
    $('#btnBackDate').addClass('btn-loading');
    $.ajax({
        url: '/api/Period?IsActive=true&Islock=false&WarehouseID=' + warehouseID + '',
        type: 'GET',
        headers: {
            'ClientGUID': getCookie('ClientGUID'),
        },
        success: function (res) {
            if (res.Status == 200) {
                $.each(res.Data, function (i, el) {
                    let StartYear = parseInt(moment(el.DateStart).format('YYYY'));
                    let StartMonth = parseInt(moment(el.DateStart).format('MM'));
                    let StartDay = parseInt(moment(el.DateStart).format('DD'));

                    let date = new Date();
                    date.setDate(date.getDate());

                    $('.start-date-by-date').datepicker('option', 'maxDate', new Date(date));
                    $('.start-date-by-date').datepicker('option', 'minDate', new Date(StartYear, StartMonth - 1, StartDay));
                    $('.start-date-by-date').attr('disabled', false);
                });
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