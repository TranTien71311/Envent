let dataReport = [];

$(document).ready(function () {
    setDataTable();
    $('#timeStart').val(moment(Date.now()).format('MM/DD/YYYY'));
    $('#timeEnd').val(moment(Date.now()).format('MM/DD/YYYY'));
    getStore();
    getSupplier();
    $('#dataTable').hide();
    $('.lds-hourglass').hide();
})
function getData() {
    $.ajax({
        url: ulrByFilter(),
        type: 'get',
        headers: {
            'ClientGUID': getCookie('ClientGUID'),
        },
        success: function (_Result) {
            if (_Result.Status == 200) {
                dataReport = _Result.Data;
                addRowDataTable(_Result.Data);

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
function exportExcel(data,dataSum) {



    var createXLSLFormatObj = [];

    /* XLS Head Columns */
    var xlsHeader = ["Stock Item ID", "Stock Item Name", "Product Code", "Product Name", "Quantity", "Usage", "Unit Des", "Net Amount", "Recipe Cost", "Recipe Margin", "Stock Item Sale", "Stock Item Cost", "Stock Item Margin", "%", "Store"];
    /* XLS Rows Data */
    var xlsRows = data;
    createXLSLFormatObj.push(xlsHeader);
    const accessWarehouse = '@Session["WAREHOUSEID"]';
    const arrWarehouse = accessWarehouse.split(',');
    $.each(xlsRows, function (index, value) {

        var innerRowData = [];
        $.each(value, function (ind, val) {
            innerRowData.push(val);
        });
        createXLSLFormatObj.push(innerRowData);

    });
    /* File Name */
    var filename = "Report_StockPOSUsed_Analysis.xlsx";
    /* Sheet Name */
    var ws_name = "StockPOSUsed Analysis";
    var wb = XLSX.utils.book_new();
    ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);
    ws['!cols'] = [
        { wch: 10 },
        { wch: 15 },
        { wch: 20 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 25 },
        { wch: 25 },
        { wch: 10 },
        { wch: 30 },

    ];



    var createXLSLFormatObjSum = [];

    /* XLS Head Columns */
    var xlsHeaderSum = ["Stock Item ID", "Stock Item Name", "Count of Product", "Sum Quantity", "Sum Usage", "Unit Des", "Sum Net Amount", "Sum Recipe Cost", "Sum Recipe Margin", "Sum Stock Item Sale", "Stock Item Cost", "Sum Stock Item Margin", "%", "Store"];
    /* XLS Rows Data */
    var xlsRowsSum = dataSum;
    createXLSLFormatObjSum.push(xlsHeaderSum);
    $.each(xlsRowsSum, function (index, value) {

        var innerRowDataSum = [];
        $.each(value, function (ind, val) {
            innerRowDataSum.push(val);
        });
        createXLSLFormatObjSum.push(innerRowDataSum);

    });

    wsSum = XLSX.utils.aoa_to_sheet(createXLSLFormatObjSum);
    wsSum['!cols'] = [
        { wch: 10 },
        { wch: 30 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 25 },
        { wch: 25 },
        { wch: 10 },
        { wch: 30 },

    ];



    /* Add worksheet to workbook */
    let createXLSLCheckDate = [];
    let timeStart = moment($('#timeStart').val()).format('MM/DD/YYYY');
    let timeEnd = moment($('#timeEnd').val()).format('MM/DD/YYYY');
    let storeName = $('#selectFilterStore :selected').text();
    let supplierName = $('#selectFilterSupplier :selected').text();
    /* XLS Head Columns */
    var xlsHeaderCheckDate = ["Stock POS Used Analysis", ""];
    /* XLS Rows Data */
    var xlsRowsCheckDate = [
        { "1": "" },
        { "1": "Check Date: ", "2": "" + timeStart + " To " + timeEnd + "" },
        { "1": "Store: ", "2": "" + storeName + "" },
        { "1": "Supplier: ", "2": "" + supplierName + "" },
    ];

    createXLSLCheckDate.push(xlsHeaderCheckDate);

    $.each(xlsRowsCheckDate, function (index, value) {
        var innerRowDataCheckDate = [];
        $.each(value, function (ind, val) {
            innerRowDataCheckDate.push(val);
        });
        createXLSLCheckDate.push(innerRowDataCheckDate);
    });
    wscd = XLSX.utils.aoa_to_sheet(createXLSLCheckDate);
    wscd['!cols'] = [
        { wch: 20 },
        { wch: 30 },
    ];
    XLSX.utils.book_append_sheet(wb, wscd, "Description");
    XLSX.utils.book_append_sheet(wb, wsSum, "Sum OF Usage");
    XLSX.utils.book_append_sheet(wb, ws, ws_name);
    XLSX.writeFile(wb, filename);
    $('#btnExport').removeClass('btn-loading');
}
function pushArray(data, dataSum) {

    let dataR = [];
    $.each(data, function (i, el) {
        let _marginRecipe = el.NetAmount - el.ReceiptCost;
        let _marginPercentRecipe = el.NetAmount != 0 ? _marginRecipe / el.NetAmount * 100 : 0;
        let _stockSale = el.ReceiptCost != 0 ? el.NetAmount / el.ReceiptCost * el.StockCost : 0;
        let _marginStock = _stockSale - el.StockCost;
        var obj = {};
        obj["0"] = el.StockItemID;
        obj["1"] = el.StockItem.StockItemName;
        obj["2"] = el.ProductCode;
        obj["3"] = el.ProductName;
        obj["4"] = el.Quantity.toFixed(0);
        obj["5"] = costExcelFormat(el.Units.toFixed(0));
        obj["6"] = el.StockItem.UnitDes;
        obj["7"] = costExcelFormat(el.NetAmount.toFixed(0));
        obj["8"] = costExcelFormat(el.ReceiptCost.toFixed(0));
        obj["9"] = costExcelFormat(_marginRecipe.toFixed(0));
        obj["10"] = costExcelFormat(_stockSale.toFixed(0));
        obj["11"] = costExcelFormat(el.StockCost.toFixed(0));
        obj["12"] = costExcelFormat(_marginStock.toFixed(0));
        obj["13"] = numberFormat(_marginPercentRecipe) + '%';
        obj["14"] = el.StoreName;
        dataR.push(obj);
    });
    exportExcel(dataR, dataSum);
}
function groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};
function setDataTable() {
    table = $('#data-tb').on('processing.dt', function (e, settings, processing) {
    }).DataTable({
        "scrollY": true,
        "scrollX": true,
        "paging": false,
        "lengthChange": false,
        "pageLength": false,
        "searching": true,

        "ordering": false,
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
                "data": "StockItemID",
                "name": "StockItemID",
                "autoWidth": true,
                render: function (data, type, row) {
                    return row.StockItemID
                },
                "className": "dt-body-center " 
            },
            {
                "data": "StockItem.StockItemName",
                "name": "StockItemName",
                "autoWidth": true,
                render: function (data, type, row) {
                    return row.StockItem.StockItemName
                }
            },
            {
                "name": "ProductCode",
                "autoWidth": true,
                render: function (data, type, row) {
                    return row.ProductCode
                },
                "className": "dt-body-right"
            },
            {
                "name": "ProductName",
                "autoWidth": true,
                render: function (data, type, row) {
                    return row.ProductName
                }
            },
            {
                "name": "Quantity",
                "autoWidth": true,
                render: function (data, type, row) {
                    return row.Quantity.toFixed(0)
                },
                "className": "dt-body-right"
            },
            {
                "name": "Usage",
                "autoWidth": true,
                render: function (data, type, row) {
                    return numberFormat(row.Units.toFixed(0))
                },
                "className": "dt-body-right"
            },
            {
                "name": "UnitDes",
                "autoWidth": true,
                render: function (data, type, row) {
                    return row.StockItem.UnitDes
                },
                "className": "dt-body-center "
            },
            {
                "name": "NetAmount",
                "autoWidth": true,
                render: function (data, type, row) {
                    return numberFormat(row.NetAmount.toFixed(0))
                },
                "className": "dt-body-right"
            },
            {
                "name": "CostRecipe",
                "autoWidth": true,
                render: function (data, type, row) {
                    return numberFormat(row.ReceiptCost.toFixed(0))
                },
                "className": "dt-body-right"
            },
            {
                "name": "MarginRecipe",
                "autoWidth": true,
                render: function (data, type, row) {
                    let _marginRecipe = row.NetAmount - row.ReceiptCost;
                    return numberFormat(_marginRecipe.toFixed(0))
                },
                "className": "dt-body-right"
            },
            {
                "name": "StockSale",
                "autoWidth": true,
                render: function (data, type, row) {
                    let _stockSale = row.ReceiptCost != 0 ? row.NetAmount / row.ReceiptCost * row.StockCost : 0;
                    return numberFormat(_stockSale.toFixed(0))
                },
                "className": "dt-body-right"
            },
            {
                "name": "StockCost",
                "autoWidth": true,
                render: function (data, type, row) {
                    return numberFormat(row.StockCost.toFixed(0))
                },
                "className": "dt-body-right"
            },
            {
                "name": "MarginStock",
                "autoWidth": true,
                render: function (data, type, row) {
                    let _stockSale = row.ReceiptCost != 0 ? row.NetAmount / row.ReceiptCost * row.StockCost : 0;
                    let _marginStock = _stockSale - row.StockCost;
                    return numberFormat(_marginStock.toFixed(0))
                },
                "className": "dt-body-right"
            },
            {
                "name": "MarginPercentRecipe",
                "autoWidth": true,
                render: function (data, type, row) {
                    let _marginRecipe = row.NetAmount - row.ReceiptCost;
                    let _marginPercentRecipe = row.NetAmount != 0 ? _marginRecipe / row.NetAmount * 100 : 0;
                    return numberFormat(_marginPercentRecipe.toFixed(0)) + '%'
                },
                "className": "dt-body-right"
            },
            {
                "data": "StoreName",
                "name": "StoreName",
                "autoWidth": true,
                render: function (data, type, row) {
                    return row.StoreName
                }
            },
        ],
        "drawCallback": function (settings) {
            let api = this.api();
            let rows = api.rows({ page: 'current' }).nodes();
            let last = null;

            api.column(0, { page: 'current' }).data().each(function (group, i) {
                let id = i;
                let unit;
                if (last !== group) {
                    let lengthProduct = 0;
                    let sumQuantity = 0;
                    let sumUsage = 0;
                    let sumNet = 0;
                    let sumCostRecipe = 0;
                    let sumCostItem = 0;
                    let sumSaleItem = 0;
                    let sumMarginItem = 0;
                    let sumMargin = 0;
                    api.rows().data().each(function (item, k) {
                        if (item.StockItemID == group) {
                            lengthProduct += 1;
                            unit = item.StockItem.UnitDes;
                            sumQuantity = sumQuantity + (+item.Quantity);
                            sumUsage = sumUsage + (+item.Units);
                            sumNet = sumNet + (+item.NetAmount);
                            sumCostRecipe = sumCostRecipe + (+item.ReceiptCost);
                            sumCostItem = sumCostItem + (+item.StockCost);
                            id = id + (+1);
                        }
                    });

                    let _marginRecipe = sumNet - sumCostRecipe;
                    let _stockSale = sumCostRecipe != 0 ? sumNet / sumCostRecipe * sumCostItem : 0;
                    let _marginStock = _stockSale - sumCostItem;
                    let _marginPercentRecipe = sumNet != 0 ? _marginRecipe / sumNet * 100 : 0;
                    let tr = '<tr class="group text-success">';
                    tr += '<td style="background-color: #e7e7e7;" colspan="2" class="text-right">' + lengthProduct+'</td>';
                    tr += '<td style="background-color: #e7e7e7;"class="text-right">' + sumQuantity.toFixed(0) + '</td>';
                    tr += '<td style="background-color: #e7e7e7;"class="text-right">' + numberFormat(sumUsage.toFixed(0)) + '</td>';
                    tr += '<td style="background-color: #e7e7e7;"class="text-center">' + unit + '</td>';
                    tr += '<td style="background-color: #e7e7e7;"class="text-right">' + numberFormat(sumNet.toFixed(0)) + '</td>';
                    tr += '<td style="background-color: #e7e7e7;"class="text-right">' + numberFormat(sumCostRecipe.toFixed(0)) + '</td>';
                    tr += '<td style="background-color: #e7e7e7;"class="text-right">' + numberFormat(_marginRecipe.toFixed(0)) + '</td>';
                    tr += '<td style="background-color: #e7e7e7;"class="text-right">' + numberFormat(_stockSale.toFixed(0)) + '</td>';
                    tr += '<td style="background-color: #e7e7e7;"class="text-right">' + numberFormat(sumCostItem.toFixed(0)) + '</td>';
                    tr += '<td style="background-color: #e7e7e7;"class="text-right">' + numberFormat(_marginStock.toFixed(0)) + '</td>';
                    tr += '<td style="background-color: #e7e7e7;"class="text-right">' + numberFormat(_marginPercentRecipe.toFixed(0)) + '%</td>';
                   
                    tr += '</tr>';
                    let rowspan = $($(rows).eq(i).find('td[rowspan]')[0]).attr('rowspan');
                    $($(rows).eq(i).find('td[rowspan]')).attr('rowspan', (parseInt(rowspan) + 1));
                    $(rows).eq(id - 1).after(
                        tr
                    );
                    last = group;
                    sumQuantity = 0;
                }
            });
        },
        rowsGroup: [0, 1, 14],
    });
}
function addRowDataTable(_data) {
    table.clear();
    table.rows.add(_data);
    table.draw(false);
    $('#dataTable').show();
    $('.lds-hourglass').hide();
    $(window).trigger('resize');
    $('#btnQuery').attr('disabled', false);
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
                $('#selectFilterStore').empty();
                let option = "";
                $.each(_Result.Data, function (k, v) {
                    option += "<option value=" + v.StoreID + ">" + v.StoreName + "</option>";
                });
                $('#selectFilterStore').append(option);
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
                    timer: 3500
                });
            }
        }
    });
}
function ulrByFilter() {
    let timeStart = moment($('#timeStart').val()).format('YYYY/MM/DD 00:00:00');
    let timeEnd = moment($('#timeEnd').val()).format('YYYY/MM/DD 23:59:59');
    let storeID = $('#selectFilterStore').val();
    let supplierID = $('#selectFilterSupplier').val();

    let url = '/api/StockPOSUsedAnalysis?OpenDate=' + timeStart + ',' + timeEnd + '';
    if (storeID != -1)
        url += '&StoreID=' + storeID + ''

    if (supplierID != -1)
        url += '&SupplierID=' + supplierID + ''

    return url;
}
$('#btnQuery').click(function () {
    $('#btnQuery').attr('disabled', true);
    $('#dataTable').hide();
    $('.lds-hourglass').show();
    getData();
})
$('#btnExport').click(function () {
    $(this).addClass('btn-loading');
    getDataSumReport();
})
function getDataSumReport() {
    $.ajax({
        url: ulrByFilter() + '&ReferenceCode==1',
        type: 'get',
        headers: {
            'ClientGUID': getCookie('ClientGUID'),
        },
        success: function (_Result) {
            if (_Result.Status == 200) {
                let dataR = [];
                $.each(_Result.Data, function (i, el) {
                    let _marginRecipe = el.NetAmount - el.ReceiptCost;
                    let _marginPercentRecipe = el.NetAmount != 0 ? _marginRecipe / el.NetAmount * 100 : 0;
                    let _stockSale = el.ReceiptCost != 0 ? el.NetAmount / el.ReceiptCost * el.StockCost : 0;
                    let _marginStock = _stockSale - el.StockCost;
                    var obj = {};
                    obj["0"] = el.StockItemID;
                    obj["1"] = el.StockItemName;
                    obj["2"] = el.ProductCount.toFixed(0);
                    obj["3"] = costExcelFormat(el.Quantity.toFixed(0));
                    obj["4"] = costExcelFormat(el.Units.toFixed(0));
                    obj["5"] = el.UnitDes;
                    obj["6"] = costExcelFormat(el.NetAmount.toFixed(0));
                    obj["7"] = costExcelFormat(el.ReceiptCost.toFixed(0));
                    obj["8"] = costExcelFormat(_marginRecipe.toFixed(0));
                    obj["9"] = costExcelFormat(_stockSale.toFixed(0));
                    obj["10"] = costExcelFormat(el.StockCost.toFixed(0));
                    obj["11"] = costExcelFormat(_marginStock.toFixed(0));
                    obj["12"] = numberFormat(_marginPercentRecipe) + '%';
                    obj["13"] = el.StoreName;
                    dataR.push(obj);
                });
                console.log(_Result.Data);
                pushArray(dataReport, dataR);
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