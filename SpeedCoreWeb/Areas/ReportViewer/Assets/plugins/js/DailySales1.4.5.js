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

$("#HourlyView > .btn").click(function () {
    $(this).addClass("active").siblings().removeClass("active");
    if ($(this).val() == "0") {
        $("#HourlyTableView").hide();
        $("#morris-bar-chart-hourly").show();
        $("#HourlySales").css("overflow", "hidden");
    } else {
        $("#HourlyTableView").show();
        $("#morris-bar-chart-hourly").hide();
        $("#HourlySales").css("overflow", "auto");
    }
});

var HourlyChart = Morris.Bar({
    element: 'morris-bar-chart-hourly',
    xkey: 'TimeArea',
    ykeys: ['NetSales'],
    labels: ['VNĐ'],
    barRatio: 0.4,
    xLabelAngle: 45,
    hideHover: 'auto',
    resize: true,
    grid: true
});


var index = $("#lstStore")[0].selectedIndex;
var datesplit = $("#txtDate").val().split('/');
var date = datesplit[2] + '-' + datesplit[0] + '-' + datesplit[1];
LoadDailySales(index, date);

$("#lstStore").on('change', function () {
    var index = $("#lstStore")[0].selectedIndex;
    var datesplit = $("#txtDate").val().split('/');
    var date = datesplit[2] + '-' + datesplit[0] + '-' + datesplit[1];
    LoadDailySales(index, date);
});

$("#txtDate").on('change', function () {
    var index = $("#lstStore")[0].selectedIndex;
    var datesplit = $("#txtDate").val().split('/');
    var date = datesplit[2] + '-' + datesplit[0] + '-' + datesplit[1];
    LoadDailySales(index, date);
});

function selectstore(idx) {
    if (!loading) {
        index = idx;
        $("#lstStore")[0].selectedIndex = index;
        var datesplit = $("#txtDate").val().split('/');
        var date = datesplit[2] + '-' + datesplit[0] + '-' + datesplit[1];
        LoadDailySales(index, date);
    }
}

function clickurl(url) {
    window.location.href = url;
}

function remove(arr, what) {
    var found = arr.indexOf(what);

    while (found !== -1) {
        arr.splice(found, 1);
        found = arr.indexOf(what);
    }
}

function LoadDailySales(index, date) {
    $('#store_name').text($("#lstStore option:selected").text());
    $("#HourlyView").hide();
    $('#lstStore, #txtDate').attr("disabled", "disabled");
    var maxcountdown = 0;
    circlesloading.update(0, 0);
    $("#circlesloading").show();

    if ($('#lstStore').val() != "0") {

        var job = "DailySalesBreakdown" + date + index;
        jobs.push(job);
        maxcountdown = jobs.length;
        $("#requestcountdown").text(maxcountdown.toString());
        $("#maxcountdown").text(maxcountdown.toString());

        $("#LoadingDailySalesBreakdown").show();
        $.ajax({
            type: "POST",
            url: "DbGet.asmx/DailySalesBreakdown",
            data: "{index:" + index + ", date:'" + date + "', isall:0, job:'" + job + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                try {
                    var json = $.parseJSON(data.d);
                    if (json.Status.toString() == "1") {
                        $("#UpdateLast").text("Update Last: " + json.Data.UpdateLast[0].UpdateLast.toString() + " | Copyright © Speed Report Online 2016");
                        $("#Adjustments").empty();
                        var html = "";
                        $.each(json.Data.Adjustments, function (key, item) {
                            html = html + "<tr><td>" + item.Adjustments + "</td><td align=right>" + item.Quantity + "</td><td align=right>" + item.Value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td></tr>";
                        });
                        $("#Adjustments").html(html);
                        $("#DailySalesBreakdown").empty();
                        $("#DailySalesBreakdown").html($("#DailySalesBreakdown").html() + "<tr><td># Trans</td><td align=right>" + json.Data.DailySalesBreakdown[0].Trans + "</td></tr>");
                        $("#DailySalesBreakdown").html($("#DailySalesBreakdown").html() + "<tr><td># Cust</td><td align=right>" + json.Data.DailySalesBreakdown[0].Cust + "</td></tr>");
                        $("#DailySalesBreakdown").html($("#DailySalesBreakdown").html() + "<tr><td>Total net sales</td><td align=right>" + json.Data.DailySalesBreakdown[0].TotalNetSales.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td></tr>");
                        $("#DailySalesBreakdown").html($("#DailySalesBreakdown").html() + "<tr><td>Average transaction</td><td align=right>" + json.Data.DailySalesBreakdown[0].AverageTransaction.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td></tr>");
                        $("#DailySalesBreakdown").html($("#DailySalesBreakdown").html() + "<tr><td>Average customers</td><td align=right>" + json.Data.DailySalesBreakdown[0].AverageCustomers.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td></tr>");
                        $("#DailySalesBreakdown").html($("#DailySalesBreakdown").html() + "<tr><td>Total Tax</td><td align=right>" + json.Data.DailySalesBreakdown[0].TotalTax.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td></tr>");
                        $("#DailySalesBreakdown").html($("#DailySalesBreakdown").html() + "<tr><td>Total gross sales</td><td align=right>" + json.Data.DailySalesBreakdown[0].TotalGrossSales.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td></tr>");
                        $("#DailySalesBreakdown").html($("#DailySalesBreakdown").html() + "<tr><td>Sales tax %</td><td align=right>" + json.Data.DailySalesBreakdown[0].SalesTax.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td></tr>");
                        $("#LoadingDailySalesBreakdown").hide();
                    } else {
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

                } catch (ex) {
                    $('#lstStore, #txtDate').removeAttr('disabled');
                    alert(ex.message);
                }
            },
            error: function (error) {
                $('#lstStore, #txtDate').removeAttr('disabled');
                if (error.responseText.length > 0)
                    alert(error.responseText);
            }
        });

        job = "HourlySalesBreakdown" + date + index;
        jobs.push(job);
        maxcountdown = jobs.length;
        $("#requestcountdown").text(maxcountdown.toString());
        $("#maxcountdown").text(maxcountdown.toString());

        $("#LoadingHourlySalesBreakdown").show();
        $.ajax({
            type: "POST",
            url: "DbGet.asmx/HourlySalesBreakdown",
            data: "{index:" + index + ", date:'" + date + "', isall:0, job:'" + job + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                try {
                    var json = $.parseJSON(data.d);
                    if (json.Status.toString() == "1") {
                        $("#UpdateLast").text("Update Last: " + json.Data.UpdateLast[0].UpdateLast.toString() + " | Copyright © Speed Report Online 2016");

                        $("#HourlySalesBreakdown").empty();

                        HourlyChart.setData(json.Data.HourlySalesBreakdown);
                        var html = "";
                        $.each(json.Data.HourlySalesBreakdown, function (key, item) {
                            html = html + '<tr style="cursor: pointer;" onclick="clickurl(\'SalesDrilldown.aspx?hour=' + item.TimeArea.replace(" - ", "-") + '\');"><td>' + item.TimeArea + '</td><td align="right">' + item.NetSales.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</td><td align=right>' + item.Trans + '</td><td class="visible-lg" align=right>' + item.AverageTransaction.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</td></tr>';
                        });
                        $("#HourlySalesBreakdown").html(html);
                        $("#HourlyView").show();
                        $("#LoadingHourlySalesBreakdown").hide();
                    } else {
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

                } catch (ex) {
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

        job = "DailySalesDetail" + date + index;
        jobs.push(job);
        maxcountdown = jobs.length;
        $("#requestcountdown").text(maxcountdown.toString());
        $("#maxcountdown").text(maxcountdown.toString());

        $("#LoadingDailyPLUAnalysis").show();
        $("#LoadingDailySummaryGroupAnalysis").show();
        $("#LoadingDailyReportCategoryAnalysis").show();

        $.ajax({
            type: "POST",
            url: "DbGet.asmx/DailySalesDetail",
            data: "{index:" + index + ", date:'" + date + "', isall:0, job:'" + job + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                try {
                    var json = $.parseJSON(data.d);
                    if (json.Status.toString() == "1") {
                        $("#UpdateLast").text("Update Last: " + json.Data.UpdateLast[0].UpdateLast.toString() + " | Copyright © Speed Report Online 2016");
                        $("#DailyPLUAnalysis").empty();
                        var html = "";
                        $.each(json.Data.DailyPLUAnalysis, function (key, item) {
                            html = html + "<tr><td>" + item.PLU + "</td><td align=right>" + item.QTY + "</td><td align=right>" + item.NetSalesBeforeDiscounts.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td></tr>";
                        });
                        $("#DailyPLUAnalysis").html(html);
                        $("#LoadingDailyPLUAnalysis").hide();

                        $("#DailySummaryGroupAnalysis").empty();
                        html = "";
                        $.each(json.Data.DailySummaryGroupAnalysis, function (key, item) {
                            html = html + "<tr id=" + item.SummaryCode + "><td>" + item.SummaryGroup + "</td><td align=right>" + item.QTY + "</td><td align=right>" + item.NetSalesBeforeDiscounts.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td></tr>";
                        });
                        $("#DailySummaryGroupAnalysis").html(html);
                        $("#LoadingDailySummaryGroupAnalysis").hide();

                        $("#DailyReportCategoryAnalysis").empty();
                        html = "";
                        $.each(json.Data.DailyReportCategoryAnalysis, function (key, item) {
                            html = html + "<tr id=" + item.CategoryCode + "><td>" + item.ReportCategory + "</td><td align=right>" + item.QTY + "</td><td align=right>" + item.NetSalesBeforeDiscounts.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td></tr>";
                        });
                        $("#DailyReportCategoryAnalysis").html(html);
                        $("#LoadingDailyReportCategoryAnalysis").hide();

                    } else {
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

                } catch (ex) {
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

        job = "DailyDiscountAnalysis" + date + index;
        jobs.push(job);
        maxcountdown = jobs.length;
        $("#requestcountdown").text(maxcountdown.toString());
        $("#maxcountdown").text(maxcountdown.toString());

        $("#LoadingDailyDiscountAnalysis").show();
        $.ajax({
            type: "POST",
            url: "DbGet.asmx/DailyDiscountAnalysis",
            data: "{index:" + index + ", date:'" + date + "', isall:0, job:'" + job + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                try {
                    var json = $.parseJSON(data.d);
                    if (json.Status.toString() == "1") {
                        $("#UpdateLast").text("Update Last: " + json.Data.UpdateLast[0].UpdateLast.toString() + " | Copyright © Speed Report Online 2016");
                        $("#DailyDiscountAnalysis").empty();
                        var html = "";
                        $.each(json.Data.DailyDiscountAnalysis, function (key, item) {
                            html = html + '<tr style="cursor: pointer;" onclick="clickurl(\'SalesDrilldown.aspx?discount=' + item.DiscountCode + '\');"><td>' + item.Discount + '</td><td align=right>' + item.Quantity + '</td><td align=right>' + item.Amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</td></tr>';
                        });
                        $("#DailyDiscountAnalysis").html(html);
                        $("#LoadingDailyDiscountAnalysis").hide();
                    } else {
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

                } catch (ex) {
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


        job = "DailyTenderBreakdown" + date + index;
        jobs.push(job);
        maxcountdown = jobs.length;
        $("#requestcountdown").text(maxcountdown.toString());
        $("#maxcountdown").text(maxcountdown.toString());
        $("#LoadingDailyTenderBreakdown").show();

        $.ajax({
            type: "POST",
            url: "DbGet.asmx/DailyTenderBreakdown",
            data: "{index:" + index + ", date:'" + date + "', isall:0, job:'" + job + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                try {
                    var json = $.parseJSON(data.d);
                    if (json.Status.toString() == "1") {
                        $("#UpdateLast").text("Update Last: " + json.Data.UpdateLast[0].UpdateLast.toString() + " | Copyright © Speed Report Online 2016");
                        $("#DailyTenderBreakdown").empty();
                        var html = "";
                        $.each(json.Data.DailyTenderBreakdown, function (key, item) {
                            html = html + '<tr style="cursor: pointer;" onclick="clickurl(\'SalesDrilldown.aspx?tender=' + item.TenderCode + '\');"><td>' + item.TenderType + '</a></td><td align=right>' + item.Trans + '</td><td align=right>' + item.Amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</td></tr>';
                        });
                        $("#DailyTenderBreakdown").html(html);

                        $("#LoadingDailyTenderBreakdown").hide();
                    } else {
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

                } catch (ex) {
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

    } else {

        var AdjustmentsT = [];
        var HourlySalesBreakdownT = [];
        var DailySummaryGroupAnalysisT = [];
        var DailyDiscountAnalysisT = [];
        var DailyTenderBreakdownT = [];
        var DailyPLUAnalysisT = [];
        var DailyReportCategoryAnalysisT = [];
        var TransT = 0;
        var CustT = 0;
        var TotalNetSalesT = 0;
        var TotalTaxT = 0;
        var TotalGrossSalesT = 0;
        var loadedDailySalesBreakdown = 0;
        var loadedHourlySalesBreakdown = 0;
        var loadedDailyDiscountAnalysis = 0;
        var loadedDailyTenderBreakdown = 0;
        var loadedDailyPLUAnalysis = 0;
        $("#LoadingDailySalesBreakdown, #LoadingHourlySalesBreakdown, #LoadingDailyPLUAnalysis, #LoadingDailyReportCategoryAnalysis, #LoadingDailySummaryGroupAnalysis, #LoadingDailyDiscountAnalysis, #LoadingDailyTenderBreakdown").show();

        for (var idx = 1; idx < $('#lstStore option').length; idx++) {

            var job = "DailySalesBreakdownALL" + date + idx;
            jobs.push(job);
            maxcountdown = jobs.length;
            $("#requestcountdown").text(maxcountdown.toString());
            $("#maxcountdown").text(maxcountdown.toString());

            $.ajax({
                type: "POST",
                url: "DbGet.asmx/DailySalesBreakdown",
                data: "{index:" + idx + ", date:'" + date + "', isall:1, job:'" + job + "'}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    loadedDailySalesBreakdown++;
                    if (loadedDailySalesBreakdown == $('#lstStore option').length - 1) {
                        $("#LoadingDailySalesBreakdown").hide();
                    }

                    try {
                        var json = $.parseJSON(data.d);
                        if (json.Status.toString() == "1") {
                            $("#UpdateLast").text("Copyright © Speed Report Online 2016");
                            AdjustmentsT = AdjustmentsT.concat(json.Data.Adjustments);
                            var ArrTempKey = [];
                            var ArrTempObject = [];
                            $.each(AdjustmentsT, function (ix, obj) {
                                var existingObj;
                                if ($.inArray(obj.Adjustments, ArrTempKey) >= 0) {
                                    var index = ArrTempObject.map(function (o, i) {
                                        if (o.Adjustments == obj.Adjustments) return i;
                                    }).filter(isFinite);
                                    ArrTempObject[index].Quantity += obj.Quantity;
                                    ArrTempObject[index].Value += obj.Value;
                                } else {
                                    ArrTempObject.push(obj);
                                    ArrTempKey.push(obj.Adjustments);
                                }
                            });
                            AdjustmentsT = ArrTempObject;

                            $("#Adjustments").empty();
                            var html = "";
                            $.each(AdjustmentsT, function (key, item) {
                                html = html + "<tr><td>" + item.Adjustments + "</td><td align=right>" + item.Quantity + "</td><td align=right>" + item.Value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td></tr>";
                            });
                            $("#Adjustments").html(html);

                            $("#DailySalesBreakdown").empty();
                            TransT += json.Data.DailySalesBreakdown[0].Trans;
                            $("#DailySalesBreakdown").html($("#DailySalesBreakdown").html() + "<tr><td># Trans</td><td align=right>" + TransT + "</td></tr>");
                            CustT += json.Data.DailySalesBreakdown[0].Cust;
                            $("#DailySalesBreakdown").html($("#DailySalesBreakdown").html() + "<tr><td># Cust</td><td align=right>" + CustT + "</td></tr>");
                            TotalNetSalesT += json.Data.DailySalesBreakdown[0].TotalNetSales;
                            $("#DailySalesBreakdown").html($("#DailySalesBreakdown").html() + "<tr><td>Total net sales</td><td align=right>" + TotalNetSalesT.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td></tr>");

                            $("#DailySalesBreakdown").html($("#DailySalesBreakdown").html() + "<tr><td>Average transaction</td><td align=right>" + (TransT != 0 ? Math.round(TotalNetSalesT / TransT) : 0).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td></tr>");

                            $("#DailySalesBreakdown").html($("#DailySalesBreakdown").html() + "<tr><td>Average customers</td><td align=right>" + (CustT != 0 ? Math.round(TotalNetSalesT / CustT) : 0).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td></tr>");
                            TotalTaxT += json.Data.DailySalesBreakdown[0].TotalTax;
                            $("#DailySalesBreakdown").html($("#DailySalesBreakdown").html() + "<tr><td>Total Tax</td><td align=right>" + TotalTaxT.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td></tr>");
                            TotalGrossSalesT += json.Data.DailySalesBreakdown[0].TotalGrossSales;
                            $("#DailySalesBreakdown").html($("#DailySalesBreakdown").html() + "<tr><td>Total gross sales</td><td align=right>" + TotalGrossSalesT.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td></tr>");

                            $("#DailySalesBreakdown").html($("#DailySalesBreakdown").html() + "<tr><td>Sales tax %</td><td align=right>" + (TotalNetSalesT != 0 ? Math.round(((TotalTaxT / TotalNetSalesT) * 100), 1) : 0).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td></tr>");

                        } else {
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

                    } catch (ex) {
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

            job = "HourlySalesBreakdownALL" + date + idx;
            jobs.push(job);
            maxcountdown = jobs.length;
            $("#requestcountdown").text(maxcountdown.toString());
            $("#maxcountdown").text(maxcountdown.toString());

            $.ajax({
                type: "POST",
                url: "DbGet.asmx/HourlySalesBreakdown",
                data: "{index:" + idx + ", date:'" + date + "', isall:1, job:'" + job + "'}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    loadedHourlySalesBreakdown++;
                    if (loadedHourlySalesBreakdown == $('#lstStore option').length - 1) {
                        $("#LoadingHourlySalesBreakdown").hide();
                        $("#HourlyView").show();
                    }

                    try {

                        var json = $.parseJSON(data.d);
                        if (json.Status.toString() == "1") {
                            $("#UpdateLast").text("Copyright © Speed Report Online 2016");

                            $("#HourlySalesBreakdown").empty();
                            HourlySalesBreakdownT = HourlySalesBreakdownT.concat(json.Data.HourlySalesBreakdown);
                            var ArrTempKey = [];
                            var ArrTempObject = [];
                            $.each(HourlySalesBreakdownT, function (ix, obj) {
                                var existingObj;
                                if ($.inArray(obj.TimeArea, ArrTempKey) >= 0) {
                                    var index = ArrTempObject.map(function (o, i) {
                                        if (o.TimeArea == obj.TimeArea) return i;
                                    }).filter(isFinite);
                                    ArrTempObject[index].NetSales += obj.NetSales;
                                    ArrTempObject[index].Trans += obj.Trans;
                                    ArrTempObject[index].AverageTransaction = (ArrTempObject[index].Trans > 0 ? Math.round(ArrTempObject[index].NetSales / ArrTempObject[index].Trans) : 0);
                                } else {
                                    ArrTempObject.push(obj);
                                    ArrTempKey.push(obj.TimeArea);
                                }
                            });
                            HourlySalesBreakdownT = ArrTempObject;
                            HourlyChart.setData(HourlySalesBreakdownT);
                            var html = "";
                            $.each(HourlySalesBreakdownT, function (key, item) {
                                html = html + '<tr style="cursor: pointer;"><td>' + item.TimeArea + '</td><td align="right">' + item.NetSales.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</td><td align=right>' + item.Trans + '</td><td class="visible-lg" align=right>' + item.AverageTransaction.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</td></tr>';
                            });
                            $("#HourlySalesBreakdown").html(html);
                        } else {
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
                    } catch (ex) {
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

            job = "DailyDiscountAnalysisALL" + date + idx;
            jobs.push(job);
            maxcountdown = jobs.length;
            $("#requestcountdown").text(maxcountdown.toString());
            $("#maxcountdown").text(maxcountdown.toString());

            $.ajax({
                type: "POST",
                url: "DbGet.asmx/DailyDiscountAnalysis",
                data: "{index:" + idx + ", date:'" + date + "', isall:1, job:'" + job + "'}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    loadedDailyDiscountAnalysis++;
                    if (loadedDailyDiscountAnalysis == $('#lstStore option').length - 1) {
                        $("#LoadingDailyDiscountAnalysis").hide();
                    }

                    try {

                        var json = $.parseJSON(data.d);
                        if (json.Status.toString() == "1") {
                            $("#UpdateLast").text("Copyright © Speed Report Online 2016");

                            $("#DailyDiscountAnalysis").empty();
                            DailyDiscountAnalysisT = DailyDiscountAnalysisT.concat(json.Data.DailyDiscountAnalysis);
                            var ArrTempKey = [];
                            var ArrTempObject = [];
                            $.each(DailyDiscountAnalysisT, function (ix, obj) {
                                var existingObj;
                                if ($.inArray(obj.Discount, ArrTempKey) >= 0) {
                                    var index = ArrTempObject.map(function (o, i) {
                                        if (o.Discount == obj.Discount) return i;
                                    }).filter(isFinite);
                                    ArrTempObject[index].Amount += obj.Amount;
                                    ArrTempObject[index].Quantity += obj.Quantity;
                                } else {
                                    ArrTempObject.push(obj);
                                    ArrTempKey.push(obj.Discount);
                                }
                            });
                            DailyDiscountAnalysisT = ArrTempObject;
                            var html = "";
                            $.each(DailyDiscountAnalysisT, function (key, item) {
                                html = html + '<tr style="cursor: pointer;"><td>' + item.Discount + '</td><td align=right>' + item.Quantity + '</td><td align=right>' + item.Amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</td></tr>';
                            });
                            $("#DailyDiscountAnalysis").html(html);
                        } else {
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
                    } catch (ex) {
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

            job = "DailyTenderBreakdownALL" + date + idx;
            jobs.push(job);
            maxcountdown = jobs.length;
            $("#requestcountdown").text(maxcountdown.toString());
            $("#maxcountdown").text(maxcountdown.toString());

            $.ajax({
                type: "POST",
                url: "DbGet.asmx/DailyTenderBreakdown",
                data: "{index:" + idx + ", date:'" + date + "', isall:1, job:'" + job + "'}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    loadedDailyTenderBreakdown++;
                    if (loadedDailyTenderBreakdown == $('#lstStore option').length - 1) {
                        $("#LoadingDailyTenderBreakdown").hide();
                    }

                    try {

                        var json = $.parseJSON(data.d);
                        if (json.Status.toString() == "1") {
                            $("#UpdateLast").text("Copyright © Speed Report Online 2016");

                            $("#DailyTenderBreakdown").empty();
                            DailyTenderBreakdownT = DailyTenderBreakdownT.concat(json.Data.DailyTenderBreakdown);
                            var ArrTempKey = [];
                            var ArrTempObject = [];
                            $.each(DailyTenderBreakdownT, function (ix, obj) {
                                var existingObj;
                                if ($.inArray(obj.TenderType, ArrTempKey) >= 0) {
                                    var index = ArrTempObject.map(function (o, i) {
                                        if (o.TenderType == obj.TenderType) return i;
                                    }).filter(isFinite);
                                    ArrTempObject[index].Amount += obj.Amount;
                                    ArrTempObject[index].Trans += obj.Trans;
                                } else {
                                    ArrTempObject.push(obj);
                                    ArrTempKey.push(obj.TenderType);
                                }
                            });
                            DailyTenderBreakdownT = ArrTempObject;
                            var html = "";
                            $.each(DailyTenderBreakdownT, function (key, item) {
                                html = html + '<tr style="cursor: pointer;"><td>' + item.TenderType + '</a></td><td align=right>' + item.Trans + '</td><td align=right>' + item.Amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</td></tr>';
                            });
                            $("#DailyTenderBreakdown").html(html);
                        } else {
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
                    } catch (ex) {
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

            job = "DailySalesDetailALL" + date + idx;
            jobs.push(job);
            maxcountdown = jobs.length;
            $("#requestcountdown").text(maxcountdown.toString());
            $("#maxcountdown").text(maxcountdown.toString());

            $.ajax({
                type: "POST",
                url: "DbGet.asmx/DailySalesDetail",
                data: "{index:" + idx + ", date:'" + date + "', isall:1, job:'" + job + "'}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    loadedDailyPLUAnalysis++;
                    if (loadedDailyPLUAnalysis == $('#lstStore option').length - 1) {
                        $("#LoadingDailyPLUAnalysis").hide();
                        $("#LoadingDailyReportCategoryAnalysis").hide();
                        $("#LoadingDailySummaryGroupAnalysis").hide();
                    }

                    try {

                        var json = $.parseJSON(data.d);
                        if (json.Status.toString() == "1") {
                            $("#UpdateLast").text("Copyright © Speed Report Online 2016");

                            $("#DailyPLUAnalysis").empty();
                            DailyPLUAnalysisT = DailyPLUAnalysisT.concat(json.Data.DailyPLUAnalysis);
                            var ArrTempKey = [];
                            var ArrTempObject = [];
                            $.each(DailyPLUAnalysisT, function (ix, obj) {
                                var existingObj;
                                if ($.inArray(obj.PLU, ArrTempKey) >= 0) {
                                    var index = ArrTempObject.map(function (o, i) {
                                        if (o.PLU == obj.PLU) return i;
                                    }).filter(isFinite);
                                    ArrTempObject[index].NetSalesBeforeDiscounts += obj.NetSalesBeforeDiscounts;
                                    ArrTempObject[index].QTY += obj.QTY;
                                } else {
                                    ArrTempObject.push(obj);
                                    ArrTempKey.push(obj.PLU);
                                }
                            });
                            DailyPLUAnalysisT = ArrTempObject;
                            var html = "";
                            $.each(DailyPLUAnalysisT, function (key, item) {
                                html = html + "<tr><td>" + item.PLU + "</td><td align=right>" + item.QTY + "</td><td align=right>" + item.NetSalesBeforeDiscounts.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td></tr>";
                            });
                            $("#DailyPLUAnalysis").html(html);

                            $("#DailyReportCategoryAnalysis").empty();
                            DailyReportCategoryAnalysisT = DailyReportCategoryAnalysisT.concat(json.Data.DailyReportCategoryAnalysis);
                            ArrTempKey = [];
                            ArrTempObject = [];
                            $.each(DailyReportCategoryAnalysisT, function (ix, obj) {
                                var existingObj;
                                if ($.inArray(obj.ReportCategory, ArrTempKey) >= 0) {
                                    var index = ArrTempObject.map(function (o, i) {
                                        if (o.ReportCategory == obj.ReportCategory) return i;
                                    }).filter(isFinite);
                                    ArrTempObject[index].NetSalesBeforeDiscounts += obj.NetSalesBeforeDiscounts;
                                    ArrTempObject[index].QTY += obj.QTY;
                                } else {
                                    ArrTempObject.push(obj);
                                    ArrTempKey.push(obj.ReportCategory);
                                }
                            });
                            DailyReportCategoryAnalysisT = ArrTempObject;
                            html = "";
                            $.each(DailyReportCategoryAnalysisT, function (key, item) {
                                html = html + "<tr><td>" + item.ReportCategory + "</td><td align=right>" + item.QTY + "</td><td align=right>" + item.NetSalesBeforeDiscounts.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td></tr>";
                            });
                            $("#DailyReportCategoryAnalysis").html(html);

                            $("#DailySummaryGroupAnalysis").empty();
                            DailySummaryGroupAnalysisT = DailySummaryGroupAnalysisT.concat(json.Data.DailySummaryGroupAnalysis);
                            ArrTempKey = [];
                            ArrTempObject = [];
                            $.each(DailySummaryGroupAnalysisT, function (ix, obj) {
                                var existingObj;
                                if ($.inArray(obj.SummaryGroup, ArrTempKey) >= 0) {
                                    var index = ArrTempObject.map(function (o, i) {
                                        if (o.SummaryGroup == obj.SummaryGroup) return i;
                                    }).filter(isFinite);
                                    ArrTempObject[index].NetSalesBeforeDiscounts += obj.NetSalesBeforeDiscounts;
                                    ArrTempObject[index].QTY += obj.QTY;
                                } else {
                                    ArrTempObject.push(obj);
                                    ArrTempKey.push(obj.SummaryGroup);
                                }
                            });
                            DailySummaryGroupAnalysisT = ArrTempObject;
                            html = "";
                            $.each(DailySummaryGroupAnalysisT, function (key, item) {
                                html = html + "<tr id=" + item.SummaryCode + "><td>" + item.SummaryGroup + "</td><td align=right>" + item.QTY + "</td><td align=right>" + item.NetSalesBeforeDiscounts.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td></tr>";
                            });
                            $("#DailySummaryGroupAnalysis").html(html);


                        } else {
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
                    } catch (ex) {
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


$(document).ready(function () {
    $("#txtSearchProduct").keyup(function () {
        var searchTerm = $("#txtSearchProduct").val();
        var listItem = $('#TableDailyPLUAnalysis tbody').children('tr');
        var searchSplit = searchTerm.replace(/ /g, "'):containsi('")

        $.extend($.expr[':'], {
            'containsi': function (elem, i, match, array) {
                return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
            }
        });

        $("#TableDailyPLUAnalysis tbody tr").not(":containsi('" + searchSplit + "')").each(function (e) {
            $(this).attr('visible', 'false');
        });

        $("#TableDailyPLUAnalysis tbody tr:containsi('" + searchSplit + "')").each(function (e) {
            $(this).attr('visible', 'true');
        });
    });

    $("#txtSearchCategory").keyup(function () {
        var searchTerm = $("#txtSearchCategory").val();
        var listItem = $('#TableDailyReportCategoryAnalysis tbody').children('tr');
        var searchSplit = searchTerm.replace(/ /g, "'):containsi('")


        $.extend($.expr[':'], {
            'containsi': function (elem, i, match, array) {
                return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
            }
        });

        $("#TableDailyReportCategoryAnalysis tbody tr").not(":containsi('" + searchSplit + "')").each(function (e) {
            $(this).attr('visible', 'false');
        });

        $("#TableDailyReportCategoryAnalysis tbody tr:containsi('" + searchSplit + "')").each(function (e) {
            $(this).attr('visible', 'true');
        });
    });
});