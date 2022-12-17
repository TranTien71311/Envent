var days = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
var jobs = new Array();
$('#txtDate').datetimepicker({
    language: 'en',
    weekStart: 1,
    todayBtn: 1,
    autoclose: 1,
    todayHighlight: 1,
    startView: 2,
    minView: 2,
    forceParse: 0,
    format: 'mm/dd/yyyy'
});

var simplebar = new Nanobar();

var circlesloading = Circles.create({
    id: 'circlesloading',
    value: 0,
    radius: 15,
    width: 3,
    duration: 1,
    colors: ['#BEE3F7', '#45AEEA']
});

var index = $("#lstStore")[0].selectedIndex;
var datesplit = $("#txtDate").val().split('/');
var date = datesplit[2] + '-' + datesplit[0] + '-' + datesplit[1];
LoadOverview(index, date);

$("#lstStore").on('change', function () {
    var index = $("#lstStore")[0].selectedIndex;
    var datesplit = $("#txtDate").val().split('/');
    var date = datesplit[2] + '-' + datesplit[0] + '-' + datesplit[1];
    LoadOverview(index, date);
});


$("#txtDate").on('change', function () {
    var index = $("#lstStore")[0].selectedIndex;
    var datesplit = $("#txtDate").val().split('/');
    var date = datesplit[2] + '-' + datesplit[0] + '-' + datesplit[1];
    LoadOverview(index, date);
});

var arSummaryGroup = [];

$("#OptionSummary").on('change', function () {
    switch ($('#OptionSummary').val()) {
        case "0":
            {
                $("#morris-donut-chart").empty();
                $("#legend").empty();
                if (arSummaryGroup.length > 0) {
                    $.each(arSummaryGroup, function (key, item) {
                        item.value = item.value_backup;
                    });
                    var SummaryGroupChart = Morris.Donut({
                        element: 'morris-donut-chart',
                        data: arSummaryGroup,
                        colors: ['#71AACD', '#34495E', '#ACADAC', '#3498DB', '#FF9966', '#26B99A', '#34495E', '#ACADAC', '#3498DB'],
                        resize: true
                    });
                    SummaryGroupChart.options.data.forEach(function (data, color) {
                        var legend = $('<span></span>').text(data['label'] + " (" + data['value'].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + ")").prepend('<span>&nbsp;</span>');
                        legend.find('span')
                          .css('backgroundColor', SummaryGroupChart.options.colors[color])
                          .css('width', '20px')
                          .css('display', 'inline-block')
                          .css('margin', '3px').css('border-radius', '10px');
                        $('#legend').append(legend)
                    });
                    SummaryGroupChart = null;
                }
                break;
            }
        case "1":
            {
                $("#morris-donut-chart").empty();
                $("#legend").empty();
                if (arSummaryGroup.length > 0) {
                    $.each(arSummaryGroup, function (key, item) {
                        item.value = item.qty;
                    });
                    var SummaryGroupChart = Morris.Donut({
                        element: 'morris-donut-chart',
                        data: arSummaryGroup,
                        colors: ['#71AACD', '#34495E', '#ACADAC', '#3498DB', '#FF9966', '#26B99A', '#34495E', '#ACADAC', '#3498DB'],
                        resize: true
                    });
                    SummaryGroupChart.options.data.forEach(function (data, color) {
                        var legend = $('<span></span>').text(data['label'] + " (" + data['value'].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + ")").prepend('<span>&nbsp;</span>');
                        legend.find('span')
                          .css('backgroundColor', SummaryGroupChart.options.colors[color])
                          .css('width', '20px')
                          .css('display', 'inline-block')
                          .css('margin', '3px').css('border-radius', '10px');
                        $('#legend').append(legend)
                    });
                    SummaryGroupChart = null;
                }
                break;
            }
    }
});

var arTop5ProductNet = [];
var arTop5ProductQty = [];

$("#OptionTop5PLUs").on('change', function () {
    switch ($('#OptionTop5PLUs').val()) {
        case "0":
            {
                Top5ProductChart.setData(arTop5ProductNet);
                Top5ProductChart.options.labels = ['VNĐ'];
                break;
            }
        case "1":
            {
                Top5ProductChart.setData(arTop5ProductQty);
                Top5ProductChart.options.labels = ['Quantity'];
                break;
            }
    }
});

$("#OptionTransStatus").on('change', function () {
    switch ($('#OptionTransStatus').val()) {
        case "0":
            {
                $('.ShowClosed').show();
                $('.ShowOpen').hide();
                break;
            }
        case "1":
            {
                $('.ShowClosed').hide();
                $('.ShowOpen').show();
                break;
            }
    }
});


var arSale30Days = [];

$("#Option30Days").on('change', function () {
    switch ($('#Option30Days').val()) {
        case "0":
            {
                Sale30DaysChart.options.ykeys = ['SaleValueNet'];
                Sale30DaysChart.options.labels = ['VNĐ'];
                Sale30DaysChart.setData(arSale30Days);
                break;
            }
        case "1":
            {
                Sale30DaysChart.options.ykeys = ['SaleValueGross'];
                Sale30DaysChart.options.labels = ['VNĐ'];
                Sale30DaysChart.setData(arSale30Days);
                break;
            }
        case "2":
            {
                Sale30DaysChart.options.ykeys = ['SaleValueTrans'];
                Sale30DaysChart.options.labels = ['Transactions'];
                Sale30DaysChart.setData(arSale30Days);
                break;
            }
        case "3":
            {
                Sale30DaysChart.options.ykeys = ['SaleValueCust'];
                Sale30DaysChart.options.labels = ['Customers'];
                Sale30DaysChart.setData(arSale30Days);
                break;
            }
    }
});

var Top5ProductChart = Morris.Bar({
    element: 'morris-bar-chart',
    xkey: 'ProductName',
    ykeys: ['ProductValue'],
    labels: ['VNĐ'],
    barRatio: 0.4,
    xLabelAngle: 30,
    hideHover: 'auto',
    resize: true,
    grid: true
});

var Sale30DaysChart = Morris.Line({
    element: 'morris-line-chart-month',
    xkey: 'SaleDate',
    ykeys: ['SaleValueNet'],
    labels: ['VNĐ'],
    resize: true
});

var YearOnYearChart = Morris.Line({
    element: 'morris-year-chart',
    xkey: 'ThisYear',
    ykeys: ['ThisValue', 'LastValue'],
    labels: ['This Year', 'Last Year'],
    xLabels: "month",
    resize: true
});

window.Morris.Donut.prototype.setData = function (data, redraw) {
    if (redraw == null) {
        redraw = true;
    }
    this.data = data;
    this.values = (function () {
        var _i, _len, _ref, _results;
        _ref = this.data;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            row = _ref[_i];
            _results.push(parseFloat(row.value));
        }
        return _results;
    }).call(this);
    this.dirty = true;
    if (redraw) {
        return this.redraw();
    }
}

function selectstore(idx) {
    if (jobs.length == 0) {
        index = idx;
        $("#lstStore")[0].selectedIndex = index;
        var datesplit = $("#txtDate").val().split('/');
        var date = datesplit[2] + '-' + datesplit[0] + '-' + datesplit[1];
        LoadOverview(index, date);
    }
}

if ($('#lstStore option').length > 1) {
    for (var idx = 1; idx < $('#lstStore option').length; idx++) {
        var id = document.getElementById('lstStore').options[idx].value;
        var text = document.getElementById('lstStore').options[idx].text;
        $("#SalesByStore").append('<div class="col-md-12 col-sm-12 col-xs-12" id="Store' + id + '" style="display:block;">\
                                       <div class="panel panel-default">\
                                          <div class="panel-heading">\
                                             <h4 class="panel-title store" onclick="selectstore(' + idx + ');" title="View Detail"><i class="fa fa-home"></i> ' + text + ' <span id="UpdateLast' + id + '"></span></h4>\
                                             <i class="spin-loader fa fa-cog fa-spin spin-loader-black fa-2x" id="LoadingSalesfor' + id + '"></i>\
                                          </div>\
                                          <div class="panel-body">\
                                             <div class="ShowOpen" style="display:none;">\
                                                <div class="col-md-4 col-sm-4 col-xs-12" title="Daily net sales value">\
                                                   <div class="text-center">Net sales</div>\
                                                   <div class="text-center border-s">\
                                                      <h1 id="TotalNetSalesOpen' + id + '">0</h1>\
                                                   </div>\
                                                </div>\
                                                <div class="col-md-4 col-sm-4 col-xs-12" title="Daily transaction counts">\
                                                   <div class="text-center">Transaction</div>\
                                                   <div class="text-center border-s">\
                                                      <h1 id="TransactionsOpen' + id + '">0</h1>\
                                                   </div>\
                                                </div>\
                                                <div class="col-md-4 col-sm-4 col-xs-12" title="Daily customer counts">\
                                                   <div class="text-center">Customer</div>\
                                                   <div class="text-center border-s">\
                                                      <h1 id="CustomersOpen' + id + '">0</h1>\
                                                   </div>\
                                                </div>\
                                             </div>\
                                             <div class="ShowClosed">\
                                                <div class="col-md-3 col-sm-6 col-xs-12" title="Daily net sales value, compared to the same day in the previous week">\
                                                   <div class="text-center">Net sales</div>\
                                                   <div class="text-center">\
                                                      <h4 id="TotalNetSales' + id + '">0</h4>\
                                                   </div>\
                                                   <div class="text-center"><i id="CompareNetSales' + id + '" class="compare-icon fa fa-2x fa-arrow-up text-success"></i></div>\
                                                   <div class="text-center text-muted">Last <span class="daytext"></span></div>\
                                                   <div class="text-center text-muted border-s" id="SalesPreviousWeekly' + id + '">0</div>\
                                                </div>\
                                                <div class="col-md-3 col-sm-6 col-xs-12" title="Daily transaction counts, compared to the same day in the previous week">\
                                                   <div class="text-center">Transaction</div>\
                                                   <div class="text-center">\
                                                      <h4 id="Transactions' + id + '">0</h4>\
                                                   </div>\
                                                   <div class="text-center"><i id="CompareTransaction' + id + '" class="compare-icon fa fa-2x fa-arrow-up text-success"></i></div>\
                                                   <div class="text-center text-muted">Last <span class="daytext"></span></div>\
                                                   <div class="text-center text-muted border-s" id="TransactionsPreviousWeekly' + id + '">0</div>\
                                                </div>\
                                                <div class="col-md-3 col-sm-6 col-xs-12" title="Daily customer counts, compared to the same day in the previous week">\
                                                   <div class="text-center">Customer</div>\
                                                   <div class="text-center">\
                                                      <h4 id="Customers' + id + '">0</h4>\
                                                   </div>\
                                                   <div class="text-center"><i id="CompareCustomer' + id + '" class="compare-icon fa fa-2x fa-arrow-up text-success"></i></div>\
                                                   <div class="text-center text-muted">Last <span class="daytext"></span></div>\
                                                   <div class="text-center text-muted border-s" id="CustomersPreviousWeekly' + id + '">0</div>\
                                                </div>\
                                                <div class="col-md-3 col-sm-6 col-xs-12" title="Total net sales value for the week to date, starting from the week start day (monday), compared to the same point in time for the previous week">\
                                                   <div class="text-center">Week to date</div>\
                                                   <div class="text-center">\
                                                      <h4 id="WeekToDate' + id + '">0</h4>\
                                                   </div>\
                                                   <div class="text-center"><i id="CompareWeekToDate' + id + '" class="compare-icon fa fa-2x fa-arrow-up text-success"></i></div>\
                                                   <div class="text-center text-muted">Week to last <span class="daytext"></span></div>\
                                                   <div class="text-center text-muted border-s" id="WeekToLast' + id + '">0</div>\
                                                </div>\
                                             </div>\
                                          </div>\
                                       </div>\
                                    </div>');
    }
}

$.xhrPool = [];
$.xhrPool.abortAll = function () {
    $(this).each(function (idx, jqXHR) {
        jqXHR.abort();
    });
};
$.ajaxSetup({
    beforeSend: function (jqXHR) {
        $.xhrPool.push(jqXHR);
    }
});
$(document).ajaxComplete(function () {
    $.xhrPool.pop();
});

function remove(arr, what) {
    var found = arr.indexOf(what);

    while (found !== -1) {
        arr.splice(found, 1);
        found = arr.indexOf(what);
    }
}

function LoadOverview(index, date) {
    var dateshow = new Date(date);
    $('#date').html(days[dateshow.getDay()] + " " + $("#txtDate").val());
    $('.daytext').html(days[dateshow.getDay()]);
    $('#store_name').text($("#lstStore option:selected").text());
    $('#lstStore, #txtDate').attr("disabled", "disabled");
    var maxcountdown = 0;
    circlesloading.update(0, 0);
    $("#circlesloading").show();

    if ($('#lstStore').val() != "0") {
        $("#YearOnYear, #Top5ANDSummaryChart").fadeIn();
        $("#SalesByStore").fadeOut();
        $("#LoadingSalesfor").show();

        var job = "OverviewNumber" + date + index;
        jobs.push(job);
        maxcountdown = jobs.length;
        $("#requestcountdown").text(maxcountdown.toString());
        $("#maxcountdown").text(maxcountdown.toString());

        $.ajax({
            type: "POST",
            url: "DbGet.asmx/OverviewNumber",
            data: "{index:" + index + ", date:'" + date + "', isall:0, job:'" + job + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                try {
                    var json = $.parseJSON(data.d);
                    if (json.Status.toString() == "1") {
                        $("#UpdateLast").text("Update Last: " + json.Data.UpdateLast[0].UpdateLast.toString() + " | Copyright © Speed Report Online 2016");
                        var TotalNetSales = json.Data.SalesNow[0].TotalNetSales;
                        var TotalNetSalesOpen = json.Data.SalesNowOpen[0].TotalNetSales;
                        var SalesPreviousWeekly = json.Data.SalesPrevious[0].SalesPreviousWeekly;
                        $("#TotalNetSales").text(TotalNetSales.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                        $("#TotalNetSalesOpen").text(TotalNetSalesOpen.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                        $("#SalesPreviousWeekly").text(SalesPreviousWeekly.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                        if (TotalNetSales > SalesPreviousWeekly)
                            $("#CompareNetSales").attr('class', 'compare-icon fa fa-3x fa-arrow-up text-success');
                        else
                            $("#CompareNetSales").attr('class', 'compare-icon fa fa-3x fa-arrow-down text-danger');

                        var Transactions = json.Data.SalesNow[0].Transactions;
                        var TransactionsOpen = json.Data.SalesNowOpen[0].Transactions;

                        var TransactionsPreviousWeekly = json.Data.SalesPrevious[0].TransactionsPreviousWeekly;
                        $("#Transactions").text(Transactions.toString());
                        $("#TransactionsOpen").text(TransactionsOpen.toString());

                        $("#TransactionsPreviousWeekly").text(TransactionsPreviousWeekly.toString());
                        if (Transactions > TransactionsPreviousWeekly)
                            $("#CompareTransaction").attr('class', 'compare-icon fa fa-3x fa-arrow-up text-success');
                        else
                            $("#CompareTransaction").attr('class', 'compare-icon fa fa-3x fa-arrow-down text-danger');
                        var Customers = json.Data.SalesNow[0].Customers;
                        var CustomersOpen = json.Data.SalesNowOpen[0].Customers;

                        var CustomersPreviousWeekly = json.Data.SalesPrevious[0].CustomersPreviousWeekly;
                        $("#Customers").text(Customers.toString());
                        $("#CustomersOpen").text(CustomersOpen.toString());
                        $("#CustomersPreviousWeekly").text(CustomersPreviousWeekly.toString());
                        if (Customers > CustomersPreviousWeekly)
                            $("#CompareCustomer").attr('class', 'compare-icon fa fa-3x fa-arrow-up text-success');
                        else
                            $("#CompareCustomer").attr('class', 'compare-icon fa fa-3x fa-arrow-down text-danger');
                        var WeekToDate = json.Data.WeekToDate[0].WeekToDate;
                        var WeekToLast = json.Data.WeekToLast[0].WeekToLast;
                        $("#WeekToDate").text(WeekToDate.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                        $("#WeekToLast").text(WeekToLast.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                        if (WeekToDate > WeekToLast)
                            $("#CompareWeekToDate").attr('class', 'compare-icon fa fa-3x fa-arrow-up text-success');
                        else
                            $("#CompareWeekToDate").attr('class', 'compare-icon fa fa-3x fa-arrow-down text-danger');
                        $("#LoadingSalesfor").hide();
                    }
                    else {
                        if (json.Message.toString() === "Session Time Out!")
                            window.location.href = 'Login.aspx';
                        else
                            alert(json.Message.toString());
                    }

                    remove(jobs, json.Job.toString());
                    var progressvalue = Math.round(((parseInt($("#maxcountdown").text()) - jobs.length) / parseInt($("#maxcountdown").text())) * 100);
                    circlesloading.update(progressvalue, 250);
                    simplebar.go(progressvalue);
                    if (jobs.length == 0) {
                        $('#lstStore, #txtDate').removeAttr('disabled');
                        $("#circlesloading").hide();
                    }
                    $("#requestcountdown").text(jobs.length.toString());

                }
                catch (ex) {
                    $('#lstStore, #txtDate').removeAttr('disabled');
                    alert(ex.message);
                }
            },
            error: function (error) {
                $('#lstStore, #txtDate').removeAttr('disabled');
                if (error.responseText.length > 0) {
                    alert(error.responseText);
                }
            }
        });

        job = "OverviewTopProductSummary" + date + index;
        jobs.push(job);
        maxcountdown = jobs.length;
        $("#requestcountdown").text(maxcountdown.toString());
        $("#maxcountdown").text(maxcountdown.toString());
        $("#LoadingTop5PLUs, #LoadingDailySummary").show();

        var ax = $.ajax({
            type: "POST",
            url: "DbGet.asmx/OverviewTopProductSummary",
            data: "{index:" + index + ", date:'" + date + "', isall:0, job:'" + job + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                try {
                    var json = $.parseJSON(data.d);
                    if (json.Status.toString() == "1") {
                        $("#UpdateLast").text("Update Last: " + json.Data.UpdateLast[0].UpdateLast.toString() + " | Copyright © Speed Report Online 2016");
                        arTop5ProductNet = json.Data.Top5ProductNet;
                        arTop5ProductQty = json.Data.Top5ProductQty;
                        switch ($('#OptionTop5PLUs').val()) {
                            case "0":
                                {
                                    Top5ProductChart.setData(arTop5ProductNet);
                                    Top5ProductChart.options.labels = ['VNĐ'];
                                    break;
                                }
                            case "1":
                                {
                                    Top5ProductChart.setData(arTop5ProductQty);
                                    Top5ProductChart.options.labels = ['Quantity'];
                                    break;
                                }
                        }

                        arSummaryGroup = json.Data.SummaryGroup;
                        $("#morris-donut-chart").empty();
                        $("#legend").empty();
                        if (arSummaryGroup.length > 0) {
                            switch ($('#OptionSummary').val()) {
                                case "0":
                                    {

                                        var SummaryGroupChart = Morris.Donut({
                                            element: 'morris-donut-chart',
                                            data: arSummaryGroup,
                                            colors: ['#71AACD', '#34495E', '#ACADAC', '#3498DB', '#FF9966', '#26B99A', '#34495E', '#ACADAC', '#3498DB'],
                                            resize: true
                                        });
                                        SummaryGroupChart.options.data.forEach(function (data, color) {
                                            var legend = $('<span></span>').text(data['label'] + " (" + data['value'].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + ")").prepend('<span>&nbsp;</span>');
                                            legend.find('span')
                                              .css('backgroundColor', SummaryGroupChart.options.colors[color])
                                              .css('width', '20px')
                                              .css('display', 'inline-block')
                                              .css('margin', '3px').css('border-radius', '10px');
                                            $('#legend').append(legend)
                                        });
                                        SummaryGroupChart = null;

                                        break;
                                    }
                                case "1":
                                    {
                                        $.each(arSummaryGroup, function (key, item) {
                                            item.value = item.qty;
                                        });
                                        var SummaryGroupChart = Morris.Donut({
                                            element: 'morris-donut-chart',
                                            data: arSummaryGroup,
                                            colors: ['#71AACD', '#34495E', '#ACADAC', '#3498DB', '#FF9966', '#26B99A', '#34495E', '#ACADAC', '#3498DB'],
                                            resize: true
                                        });
                                        SummaryGroupChart.options.data.forEach(function (data, color) {
                                            var legend = $('<span></span>').text(data['label'] + " (" + data['value'].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + ")").prepend('<span>&nbsp;</span>');
                                            legend.find('span')
                                              .css('backgroundColor', SummaryGroupChart.options.colors[color])
                                              .css('width', '20px')
                                              .css('display', 'inline-block')
                                              .css('margin', '3px').css('border-radius', '10px');
                                            $('#legend').append(legend)
                                        });
                                        SummaryGroupChart = null;
                                        break;
                                    }
                            }
                        }
                        $("#LoadingTop5PLUs, #LoadingDailySummary").hide();
                    }
                    else {
                        if (json.Message.toString() === "Session Time Out!")
                            window.location.href = 'Login.aspx';
                        else
                            alert(json.Message.toString());
                    }

                    remove(jobs, json.Job.toString());
                    var progressvalue = Math.round(((parseInt($("#maxcountdown").text()) - jobs.length) / parseInt($("#maxcountdown").text())) * 100);
                    circlesloading.update(progressvalue, 250);
                    simplebar.go(progressvalue);
                    if (jobs.length == 0) {
                        $('#lstStore, #txtDate').removeAttr('disabled');
                        $("#circlesloading").hide();
                    }
                    $("#requestcountdown").text(jobs.length.toString());
                }
                catch (ex) {
                    $('#lstStore, #txtDate').removeAttr('disabled');
                    alert(ex.message);
                }
            },
            error: function (error) {
                $('#lstStore, #txtDate').removeAttr('disabled');
                if (error.responseText.length > 0) {
                    alert(error.responseText);
                }
            }
        });

        job = "Overview30Days" + date + index;
        jobs.push(job);
        maxcountdown = jobs.length;
        $("#requestcountdown").text(maxcountdown.toString());
        $("#maxcountdown").text(maxcountdown.toString());

        $("#Loading30Days").show();
        $.ajax({
            type: "POST",
            url: "DbGet.asmx/Overview30Days",
            data: "{index:" + index + ", date:'" + date + "', isall:0, job:'" + job + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                try {
                    var json = $.parseJSON(data.d);
                    if (json.Status.toString() == "1") {
                        $("#UpdateLast").text("Update Last: " + json.Data.UpdateLast[0].UpdateLast.toString() + " | Copyright © Speed Report Online 2016");
                        arSale30Days = json.Data.Sale30Days;

                        switch ($('#Option30Days').val()) {
                            case "0":
                                {
                                    Sale30DaysChart.options.ykeys = ['SaleValueNet'];
                                    Sale30DaysChart.options.labels = ['VNĐ'];
                                    Sale30DaysChart.setData(arSale30Days);
                                    break;
                                }
                            case "1":
                                {
                                    Sale30DaysChart.options.ykeys = ['SaleValueGross'];
                                    Sale30DaysChart.options.labels = ['VNĐ'];
                                    Sale30DaysChart.setData(arSale30Days);
                                    break;
                                }
                            case "2":
                                {
                                    Sale30DaysChart.options.ykeys = ['SaleValueTrans'];
                                    Sale30DaysChart.options.labels = ['Transactions:'];
                                    Sale30DaysChart.setData(arSale30Days);
                                    break;
                                }
                            case "2":
                                {
                                    Sale30DaysChart.options.ykeys = ['SaleValueCust'];
                                    Sale30DaysChart.options.labels = ['Customers:'];
                                    Sale30DaysChart.setData(arSale30Days);
                                    break;
                                }
                        }

                        $("#Loading30Days").hide();
                    }
                    else {
                        if (json.Message.toString() === "Session Time Out!")
                            window.location.href = 'Login.aspx';
                        else
                            alert(json.Message.toString());
                    }

                    remove(jobs, json.Job.toString());
                    var progressvalue = Math.round(((parseInt($("#maxcountdown").text()) - jobs.length) / parseInt($("#maxcountdown").text())) * 100);
                    circlesloading.update(progressvalue, 250);
                    simplebar.go(progressvalue);
                    if (jobs.length == 0) {
                        $('#lstStore, #txtDate').removeAttr('disabled');
                        $("#circlesloading").hide();
                    }
                    $("#requestcountdown").text(jobs.length.toString());
                }
                catch (ex) {
                    $('#lstStore, #txtDate').removeAttr('disabled');
                    alert(ex.message);
                }
            },
            error: function (error) {
                $('#lstStore, #txtDate').removeAttr('disabled');
                if (error.responseText.length > 0) {
                    alert(error.responseText);
                }
            }
        });

        $("#LoadingYearOnYear").show();

        job = "OverviewYearOnYear" + date + index;
        jobs.push(job);
        maxcountdown = jobs.length;
        $("#requestcountdown").text(maxcountdown.toString());
        $("#maxcountdown").text(maxcountdown.toString());

        $.ajax({
            type: "POST",
            url: "DbGet.asmx/OverviewYearOnYear",
            data: "{index:" + index + ", date:'" + date + "', isall:0, job:'" + job + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                try {
                    var json = $.parseJSON(data.d);
                    if (json.Status.toString() == "1") {
                        $("#UpdateLast").text("Update Last: " + json.Data.UpdateLast[0].UpdateLast.toString() + " | Copyright © Speed Report Online 2016");
                        YearOnYearChart.setData(json.Data.YearOnYear);
                        $("#LoadingYearOnYear").hide();
                    }
                    else {
                        if (json.Message.toString() === "Session Time Out!")
                            window.location.href = 'Login.aspx';
                        else
                            alert(json.Message.toString());
                    }

                    remove(jobs, json.Job.toString());
                    var progressvalue = Math.round(((parseInt($("#maxcountdown").text()) - jobs.length) / parseInt($("#maxcountdown").text())) * 100);
                    circlesloading.update(progressvalue, 250);
                    simplebar.go(progressvalue);
                    if (jobs.length == 0) {
                        $('#lstStore, #txtDate').removeAttr('disabled');
                        $("#circlesloading").hide();
                    }
                    $("#requestcountdown").text(jobs.length.toString());
                }
                catch (ex) {
                    $('#lstStore, #txtDate').removeAttr('disabled');
                    alert(ex.message);
                }
            },
            error: function (error) {
                $('#lstStore, #txtDate').removeAttr('disabled');
                if (error.responseText.length > 0) {
                    alert(error.responseText);
                }
            }
        });

    }
    else {

        $("#YearOnYear, #Top5ANDSummaryChart").fadeOut();
        $("#SalesByStore").fadeIn();
        $("#UpdateLast").text("Copyright © Speed Report Online 2016");
        var TotalNetSalesT = 0;
        var SalesPreviousWeeklyT = 0;
        var TransactionsT = 0;
        var TransactionsPreviousWeeklyT = 0;
        var CustomersT = 0;
        var CustomersPreviousWeeklyT = 0;
        var WeekToDateT = 0;
        var WeekToLastT = 0;
        arSale30Days = [];
        var loadedOverviewNumber = 0;
        var loadedOverview30Days = 0;
        var TotalNetSalesOpenT = 0;
        var TransactionsOpenT = 0;
        var CustomersOpenT = 0;

        $("#LoadingSalesfor, #Loading30Days").show();

        for (var idx = 1; idx < $('#lstStore option').length; idx++) {

            $("#LoadingSalesfor" + $('#lstStore option').eq(idx).val()).show();
            var job = "OverviewNumberALL" + date + idx;
            jobs.push(job);
            maxcountdown = jobs.length;
            $("#requestcountdown").text(maxcountdown.toString());
            $("#maxcountdown").text(maxcountdown.toString());

            $.ajax({
                type: "POST",
                url: "DbGet.asmx/OverviewNumber",
                data: "{index:" + idx + ", date:'" + date + "', isall:1, job:'" + job + "'}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    loadedOverviewNumber++;
                    if (loadedOverviewNumber == $('#lstStore option').length - 1) {
                        $("#LoadingSalesfor").hide();
                    }

                    try {
                        var json = $.parseJSON(data.d);
                        if (json.Status.toString() == "1") {
                            var id = json.Store_Id.toString();
                            $("#UpdateLast" + id).text(" (" + json.Data.UpdateLast[0].UpdateLast.toString() + ")");
                            var TotalNetSales = json.Data.SalesNow[0].TotalNetSales;
                            var TotalNetSalesOpen = json.Data.SalesNowOpen[0].TotalNetSales;
                            var SalesPreviousWeekly = json.Data.SalesPrevious[0].SalesPreviousWeekly;
                            TotalNetSalesT += TotalNetSales;
                            TotalNetSalesOpenT += TotalNetSalesOpen;
                            SalesPreviousWeeklyT += SalesPreviousWeekly;
                            $("#TotalNetSales" + id).text(TotalNetSales.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                            $("#TotalNetSalesOpen" + id).text(TotalNetSalesOpen.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                            $("#SalesPreviousWeekly" + id).text(SalesPreviousWeekly.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));

                            $("#TotalNetSales").text(TotalNetSalesT.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                            $("#TotalNetSalesOpen").text(TotalNetSalesOpenT.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                            $("#SalesPreviousWeekly").text(SalesPreviousWeeklyT.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));

                            if (TotalNetSales > SalesPreviousWeekly)
                                $("#CompareNetSales" + id).attr('class', 'compare-icon fa fa-2x fa-arrow-up text-success');
                            else
                                $("#CompareNetSales" + id).attr('class', 'compare-icon fa fa-2x fa-arrow-down text-danger');
                            if (TotalNetSalesT > SalesPreviousWeeklyT)
                                $("#CompareNetSales").attr('class', 'compare-icon fa fa-3x fa-arrow-up text-success');
                            else
                                $("#CompareNetSales").attr('class', 'compare-icon fa fa-3x fa-arrow-down text-danger');

                            var Transactions = json.Data.SalesNow[0].Transactions;
                            var TransactionsOpen = json.Data.SalesNowOpen[0].Transactions;
                            var TransactionsPreviousWeekly = json.Data.SalesPrevious[0].TransactionsPreviousWeekly;

                            TransactionsT += Transactions;
                            TransactionsOpenT += TransactionsOpen;
                            TransactionsPreviousWeeklyT += TransactionsPreviousWeekly;

                            $("#Transactions" + id).text(Transactions.toString());
                            $("#TransactionsOpen" + id).text(TransactionsOpen.toString());
                            $("#TransactionsPreviousWeekly" + id).text(TransactionsPreviousWeekly.toString());

                            $("#Transactions").text(TransactionsT.toString());
                            $("#TransactionsOpen").text(TransactionsOpenT.toString());
                            $("#TransactionsPreviousWeekly").text(TransactionsPreviousWeeklyT.toString());

                            if (Transactions > TransactionsPreviousWeekly)
                                $("#CompareTransaction" + id).attr('class', 'compare-icon fa fa-2x fa-arrow-up text-success');
                            else
                                $("#CompareTransaction" + id).attr('class', 'compare-icon fa fa-2x fa-arrow-down text-danger');
                            if (TransactionsT > TransactionsPreviousWeeklyT)
                                $("#CompareTransaction").attr('class', 'compare-icon fa fa-3x fa-arrow-up text-success');
                            else
                                $("#CompareTransaction").attr('class', 'compare-icon fa fa-3x fa-arrow-down text-danger');

                            var Customers = json.Data.SalesNow[0].Customers;
                            var CustomersOpen = json.Data.SalesNowOpen[0].Customers;
                            var CustomersPreviousWeekly = json.Data.SalesPrevious[0].CustomersPreviousWeekly;

                            CustomersT += Customers;
                            CustomersOpenT += CustomersOpen;
                            CustomersPreviousWeeklyT += CustomersPreviousWeekly;

                            $("#Customers" + id).text(Customers.toString());
                            $("#CustomersOpen" + id).text(CustomersOpen.toString());
                            $("#CustomersPreviousWeekly" + id).text(CustomersPreviousWeekly.toString());

                            $("#Customers").text(CustomersT.toString());
                            $("#CustomersOpen").text(CustomersOpenT.toString());
                            $("#CustomersPreviousWeekly").text(CustomersPreviousWeeklyT.toString());

                            if (Customers > CustomersPreviousWeekly)
                                $("#CompareCustomer" + id).attr('class', 'compare-icon fa fa-2x fa-arrow-up text-success');
                            else
                                $("#CompareCustomer" + id).attr('class', 'compare-icon fa fa-2x fa-arrow-down text-danger');
                            if (CustomersT > CustomersPreviousWeeklyT)
                                $("#CompareCustomer").attr('class', 'compare-icon fa fa-3x fa-arrow-up text-success');
                            else
                                $("#CompareCustomer").attr('class', 'compare-icon fa fa-3x fa-arrow-down text-danger');

                            var WeekToDate = json.Data.WeekToDate[0].WeekToDate;
                            var WeekToLast = json.Data.WeekToLast[0].WeekToLast;
                            WeekToDateT += WeekToDate;
                            WeekToLastT += WeekToLast;
                            $("#WeekToDate" + id).text(WeekToDate.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                            $("#WeekToLast" + id).text(WeekToLast.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                            $("#WeekToDate").text(WeekToDateT.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                            $("#WeekToLast").text(WeekToLastT.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                            if (WeekToDate > WeekToLast)
                                $("#CompareWeekToDate" + id).attr('class', 'compare-icon fa fa-2x fa-arrow-up text-success');
                            else
                                $("#CompareWeekToDate" + id).attr('class', 'compare-icon fa fa-2x fa-arrow-down text-danger');
                            if (WeekToDateT > WeekToLastT)
                                $("#CompareWeekToDate").attr('class', 'compare-icon fa fa-3x fa-arrow-up text-success');
                            else
                                $("#CompareWeekToDate").attr('class', 'compare-icon fa fa-3x fa-arrow-down text-danger');
                            $("#LoadingSalesfor" + id).hide();
                        }
                        else {
                            if (json.Message.toString() === "Session Time Out!")
                                window.location.href = 'Login.aspx';
                            else
                                alert(json.Message.toString());
                        }

                        remove(jobs, json.Job.toString());
                        var progressvalue = Math.round(((parseInt($("#maxcountdown").text()) - jobs.length) / parseInt($("#maxcountdown").text())) * 100);
                        circlesloading.update(progressvalue, 250);
                        simplebar.go(progressvalue);
                        if (jobs.length == 0) {
                            $('#lstStore, #txtDate').removeAttr('disabled');
                            $("#circlesloading").hide();
                        }
                        $("#requestcountdown").text(jobs.length.toString());
                    }
                    catch (ex) {
                        $('#lstStore, #txtDate').removeAttr('disabled');
                        alert(ex.message);
                    }
                },
                error: function (error) {
                    $('#lstStore, #txtDate').removeAttr('disabled');
                    if (error.responseText.length > 0) {
                        alert(error.responseText);
                    }
                }
            });

            job = "Overview30DaysALL" + date + idx;
            jobs.push(job);
            maxcountdown = jobs.length;
            $("#requestcountdown").text(maxcountdown.toString());
            $("#maxcountdown").text(maxcountdown.toString());

            $.ajax({
                type: "POST",
                url: "DbGet.asmx/Overview30Days",
                data: "{index:" + idx + ", date:'" + date + "', isall:1, job:'" + job + "'}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    loadedOverview30Days++;
                    if (loadedOverview30Days == $('#lstStore option').length - 1) {
                        $("#Loading30Days").hide();
                    }
                    try {
                        var json = $.parseJSON(data.d);
                        if (json.Status.toString() == "1") {
                            var id = json.Store_Id.toString();
                            $("#UpdateLast" + id).text(" (" + json.Data.UpdateLast[0].UpdateLast.toString() + ")");
                            if (json.Data.Sale30Days.length > 0) {
                                arSale30Days = arSale30Days.concat(json.Data.Sale30Days);
                                var ArrTempKey = [];
                                var ArrTempObject = [];
                                $.each(arSale30Days, function (ix, obj) {
                                    var existingObj;
                                    if ($.inArray(obj.SaleDate, ArrTempKey) >= 0) {
                                        var index = ArrTempObject.map(function (o, i) {
                                            if (o.SaleDate == obj.SaleDate) return i;
                                        }).filter(isFinite);
                                        ArrTempObject[index].SaleValueNet += obj.SaleValueNet;
                                        ArrTempObject[index].SaleValueGross += obj.SaleValueGross;
                                        ArrTempObject[index].SaleValueCust += obj.SaleValueCust;
                                        ArrTempObject[index].SaleValueTrans += obj.SaleValueTrans;
                                    } else {
                                        ArrTempObject.push(obj);
                                        ArrTempKey.push(obj.SaleDate);
                                    }
                                });
                                arSale30Days = ArrTempObject;
                                Sale30DaysChart.setData(arSale30Days);
                            }
                        }
                        else {
                            if (json.Message.toString() === "Session Time Out!")
                                window.location.href = 'Login.aspx';
                            else
                                alert(json.Message.toString());
                        }

                        remove(jobs, json.Job.toString());
                        var progressvalue = Math.round(((parseInt($("#maxcountdown").text()) - jobs.length) / parseInt($("#maxcountdown").text())) * 100);
                        circlesloading.update(progressvalue, 250);
                        simplebar.go(progressvalue);
                        if (jobs.length == 0) {
                            $('#lstStore, #txtDate').removeAttr('disabled');
                            $("#circlesloading").hide();
                        }
                        $("#requestcountdown").text(jobs.length.toString());
                    }
                    catch (ex) {
                        $('#lstStore, #txtDate').removeAttr('disabled');
                        alert(ex.message);
                    }
                },
                error: function (error) {
                    $('#lstStore, #txtDate').removeAttr('disabled');
                    if (error.responseText.length > 0) {
                        alert(error.responseText);
                    }
                }
            });

       
        }        
                
    }
}
