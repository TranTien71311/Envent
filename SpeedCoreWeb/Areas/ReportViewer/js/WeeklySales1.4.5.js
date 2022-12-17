var days = new Array("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun");
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
LoadWeeklySales(index, date);

$("#lstStore").on('change', function () {
    var index = $("#lstStore")[0].selectedIndex;
    var datesplit = $("#txtDate").val().split('/');
    var date = datesplit[2] + '-' + datesplit[0] + '-' + datesplit[1];
    LoadWeeklySales(index, date);
});

$("#txtDate").on('change', function () {
    var index = $("#lstStore")[0].selectedIndex;
    var datesplit = $("#txtDate").val().split('/');
    var date = datesplit[2] + '-' + datesplit[0] + '-' + datesplit[1];
    LoadWeeklySales(index, date);
});

var WeeklyChart = Morris.Bar({
    element: 'weekly-bar-chart',
    xkey: 'SaleDate',
    ykeys: ['SaleValue'],
    labels: ['VNĐ'],
    barRatio: 0.4,
    xLabelAngle: 35,
    hideHover: 'auto',
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

function LoadWeeklySales(index, date) {
    $('#store_name').text($("#lstStore option:selected").text());
    $("#LoadingTable, #LoadingChart").show();
    $('#lstStore, #txtDate').attr("disabled", "disabled");
    var maxcountdown = 0;
    circlesloading.update(0, 0);
    $("#circlesloading").show();

    if ($('#lstStore').val() != "0") {

        var job = "WeeklySales" + date + index;
        jobs.push(job);
        maxcountdown = jobs.length;
        $("#requestcountdown").text(maxcountdown.toString());
        $("#maxcountdown").text(maxcountdown.toString());

        $.ajax({
            type: "POST",
            url: "DbGet.asmx/WeeklySales",
            data: "{index:" + index + ", date:'" + date + "', isall:0, job:'" + job + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                try {
                    var json = $.parseJSON(data.d);
                    if (json.Status.toString() == "1") {
                        $("#UpdateLast").text("Update Last: " + json.Data.UpdateLast[0].UpdateLast.toString() + " | Copyright © Speed Report Online 2016");
                        var wdt = 0;
                        var html = "";
                        $("#Week1").empty();
                        for (var d = 0; d < 7; d++) {
                            wdt += json.Data.WeeklyData[d].SaleValue;
                            var datesplit = json.Data.WeeklyData[d].SaleDate.toString().split('/');
                            var clickdate = datesplit[2] + '-' + datesplit[0] + '-' + datesplit[1];
                            html = html + '<tr style="cursor: pointer;" onclick="clickurl(\'DailySales.aspx?date=' + clickdate + '\');"><td>' + days[d] + '</td><td>' + json.Data.WeeklyData[d].SaleDate + '</td><td align="right">' + json.Data.WeeklyData[d].SaleValue.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</td><td align="right">' + wdt.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</td></tr>';
                        }
                        $("#Week1").html(html);
                        wdt = 0;
                        html = "";
                        $("#Week2").empty();
                        for (var d = 7; d < 14; d++) {
                            wdt += json.Data.WeeklyData[d].SaleValue;
                            var datesplit = json.Data.WeeklyData[d].SaleDate.toString().split('/');
                            var clickdate = datesplit[2] + '-' + datesplit[0] + '-' + datesplit[1];
                            html = html + '<tr style="cursor: pointer;" onclick="clickurl(\'DailySales.aspx?date=' + clickdate + '\');"><td>' + days[d - 7] + '</td><td>' + json.Data.WeeklyData[d].SaleDate + '</td><td align="right">' + json.Data.WeeklyData[d].SaleValue.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</td><td align="right">' + wdt.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</td></tr>';
                        }
                        $("#Week2").html(html);
                        wdt = 0;
                        html = "";
                        $("#Week3").empty();
                        for (var d = 14; d < 21; d++) {
                            wdt += json.Data.WeeklyData[d].SaleValue;
                            var datesplit = json.Data.WeeklyData[d].SaleDate.toString().split('/');
                            var clickdate = datesplit[2] + '-' + datesplit[0] + '-' + datesplit[1];
                            html = html + '<tr style="cursor: pointer;" onclick="clickurl(\'DailySales.aspx?date=' + clickdate + '\');"><td>' + days[d - 14] + '</td><td>' + json.Data.WeeklyData[d].SaleDate + '</td><td align="right">' + json.Data.WeeklyData[d].SaleValue.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</td><td align="right">' + wdt.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</td></tr>';
                        }
                        $("#Week3").html(html);
                        $("#LoadingTable").hide();
                        WeeklyChart.setData(json.Data.WeeklyData);
                        $("#LoadingChart").hide();
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
        var loadedWeekly = 0;
        var WeeklyDataT = [];
        for (var idx = 1; idx < $('#lstStore option').length; idx++) {
            var job = "WeeklySalesALL" + date + idx;
            jobs.push(job);
            maxcountdown = jobs.length;
            $("#requestcountdown").text(maxcountdown.toString());
            $("#maxcountdown").text(maxcountdown.toString());

            $.ajax({
                type: "POST",
                url: "DbGet.asmx/WeeklySales",
                data: "{index:" + idx + ", date:'" + date + "', isall:1, job:'" + job + "'}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    loadedWeekly++;
                    if (loadedWeekly == $('#lstStore option').length - 1) {
                        $("#LoadingTable, #LoadingChart").hide();
                    }

                    try {

                        var json = $.parseJSON(data.d);
                        if (json.Status.toString() == "1") {
                            $("#UpdateLast").text("Copyright © Speed Report Online 2016");

                            WeeklyDataT = WeeklyDataT.concat(json.Data.WeeklyData);
                            var ArrTempKey = [];
                            var ArrTempObject = [];
                            $.each(WeeklyDataT, function (ix, obj) {
                                var existingObj;
                                if ($.inArray(obj.SaleDate, ArrTempKey) >= 0) {
                                    var index = ArrTempObject.map(function (o, i) {
                                        if (o.SaleDate == obj.SaleDate) return i;
                                    }).filter(isFinite);
                                    ArrTempObject[index].SaleValue += obj.SaleValue;
                                } else {
                                    ArrTempObject.push(obj);
                                    ArrTempKey.push(obj.SaleDate);
                                }
                            });
                            WeeklyDataT = ArrTempObject;

                            var wdt = 0;
                            var html = "";
                            $("#Week1").empty();
                            for (var d = 0; d < 7; d++) {
                                wdt += WeeklyDataT[d].SaleValue;
                                var datesplit = WeeklyDataT[d].SaleDate.toString().split('/');
                                var clickdate = datesplit[2] + '-' + datesplit[0] + '-' + datesplit[1];
                                html = html + '<tr style="cursor: pointer;" onclick="clickurl(\'DailySales.aspx?date=' + clickdate + '\');"><td>' + days[d] + '</td><td>' + WeeklyDataT[d].SaleDate + '</td><td align="right">' + WeeklyDataT[d].SaleValue.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</td><td align="right">' + wdt.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</td></tr>';
                            }
                            $("#Week1").html(html);
                            wdt = 0;
                            html = "";
                            $("#Week2").empty();
                            for (var d = 7; d < 14; d++) {
                                wdt += WeeklyDataT[d].SaleValue;
                                var datesplit = WeeklyDataT[d].SaleDate.toString().split('/');
                                var clickdate = datesplit[2] + '-' + datesplit[0] + '-' + datesplit[1];
                                html = html + '<tr style="cursor: pointer;" onclick="clickurl(\'DailySales.aspx?date=' + clickdate + '\');"><td>' + days[d - 7] + '</td><td>' + WeeklyDataT[d].SaleDate + '</td><td align="right">' + WeeklyDataT[d].SaleValue.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</td><td align="right">' + wdt.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</td></tr>';
                            }
                            $("#Week2").html(html);
                            wdt = 0;
                            html = "";
                            $("#Week3").empty();
                            for (var d = 14; d < 21; d++) {
                                wdt += WeeklyDataT[d].SaleValue;
                                var datesplit = WeeklyDataT[d].SaleDate.toString().split('/');
                                var clickdate = datesplit[2] + '-' + datesplit[0] + '-' + datesplit[1];
                                html = html + '<tr style="cursor: pointer;" onclick="clickurl(\'DailySales.aspx?date=' + clickdate + '\');"><td>' + days[d - 14] + '</td><td>' + WeeklyDataT[d].SaleDate + '</td><td align="right">' + WeeklyDataT[d].SaleValue.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</td><td align="right">' + wdt.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</td></tr>';
                            }
                            $("#Week3").html(html);
                            WeeklyChart.setData(WeeklyDataT);

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

