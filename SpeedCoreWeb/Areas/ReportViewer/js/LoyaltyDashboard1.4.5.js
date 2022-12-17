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

$("#selectall").change(function () {
    if (this.checked) {
        $('.checkbox').prop('checked', true);
    }
    else {
        $('.checkbox').prop('checked', false);
    }
});

var index = $("#lstStore")[0].selectedIndex;
var datesplit = $("#txtDate").val().split('/');
var date = datesplit[2] + '-' + datesplit[0] + '-' + datesplit[1];
LoadMemberLoyalty(index, date);

$("#lstStore").on('change', function () {
    var index = $("#lstStore")[0].selectedIndex;
    var datesplit = $("#txtDate").val().split('/');
    var date = datesplit[2] + '-' + datesplit[0] + '-' + datesplit[1];
    LoadMemberLoyalty(index, date);
});


$("#txtDate").on('change', function () {
    var index = $("#lstStore")[0].selectedIndex;
    var datesplit = $("#txtDate").val().split('/');
    var date = datesplit[2] + '-' + datesplit[0] + '-' + datesplit[1];
    LoadMemberLoyalty(index, date);
});

var mintrans = 0;
var cardnum = "";

$('#Birthday7Days, #Top10MemberWeek, #Top10MemberMonth').on('click', 'tr', function (event) {
    if ($(this).attr('id').length > 0 && event.target.type != "checkbox") {
        $('#MemberDetailBody, #MemberDetailFooter').show();
        $('#TransactionDetailBody, #TransactionDetailFooter').hide();
        cardnum = $(this).attr('id');
        var index = $("#lstStore")[0].selectedIndex;
        var datesplit = $("#txtDate").val().split('/');
        var date = datesplit[2] + '-' + datesplit[0] + '-' + datesplit[1];
        mintrans = 0;
        MemberInfo(cardnum, index, date);
    }
});

$('#ListTransactionMember').on('click', 'tr', function (event) {
    if ($(this).attr('id').length > 0) {
        var text = $(this).attr('id').split(',');
        ViewDetail(text[1], $("#lstStore option[value='" + text[0] + "']").index());
    }
});

$("#btnBack").on('click', function () {
    $('#MemberDetailBody, #MemberDetailFooter').show();
    $('#TransactionDetailBody, #TransactionDetailFooter').hide();
});

$('#historyTab').on('scroll', function () {
    if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
        var index = $("#lstStore")[0].selectedIndex;
        var datesplit = $("#txtDate").val().split('/');
        var date = datesplit[2] + '-' + datesplit[0] + '-' + datesplit[1];
        AddMore(cardnum, index, date, mintrans);
    }
});

$("#btnSendEmail").on('click', function () {
    alert("This feature is being developed that connects to the MailChimp API");
});

$("#btnSendSMS").on('click', function () {
    if ($("#SMSContent").val() != "") {
        jsonData = [];
        $('#Birthday7Days tr').each(function () {
            if ($(this).find(".checkbox").is(":checked") && $(this).find(".CellNum").html() != "null") {

                var MemberName = $(this).find(".MemberName").html();
                var MemberGroup = $(this).find(".MemberGroup").html();
                var CellNum = $(this).find(".CellNum").html();
                var ADDRESS = $(this).find(".ADDRESS").html();
                var Birthday = $(this).find(".Birthday").html();
                var Age = $(this).find(".Age").html();
                var content = $("#SMSContent").val();
                content = content.replace("[Member name]", MemberName);
                content = content.replace("[Group]", MemberGroup);
                content = content.replace("[Phone]", CellNum);
                content = content.replace("[Address]", ADDRESS);
                content = content.replace("[Birthday]", Birthday);
                content = content.replace("[Age]", Age);
                item = {};
                item["phone"] = CellNum;
                item["content"] = content;
                jsonData.push(item);
            }
        });
        if(jsonData.length > 0)
            alert(JSON.stringify(jsonData));
    }
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

function LoadMemberLoyalty(index, date) {
    $('#store_name').text($("#lstStore option:selected").text());
    $("#LoadingTop10MemberWeek, #LoadingTop10MemberMonth, #LoadingTop10GroupWeek, #LoadingTop10GroupMonth, #LoadingMemberStatistics, #LoadingBirthday7Days, #LoadingBirthday30Days").show();
    $('#lstStore, #txtDate').attr("disabled", "disabled");
    var maxcountdown = 0;
    circlesloading.update(0, 0);
    $("#circlesloading").show();

    var job = "Top10MemberWeek" + date + index;
    jobs.push(job);
    maxcountdown = jobs.length;
    $("#requestcountdown").text(maxcountdown.toString());
    $("#maxcountdown").text(maxcountdown.toString());

    $.ajax({
        type: "POST",
        url: "DbGet.asmx/Top10MemberWeek",
        data: "{index:" + index + ", date:'" + date + "', job:'" + job + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            try {
                var json = $.parseJSON(data.d);
                if (json.Status.toString() == "1") {
                    $("#UpdateLast").text("Update Last: " + json.Data.UpdateLast[0].UpdateLast.toString() + " | Copyright © Speed Report Online 2016");

                    $("#Top10MemberWeek").empty();
                    var no = 1;
                    var html = "";
                    $.each(json.Data.Top10MemberWeek, function (key, item) {
                        html = html + "<tr id=" + item.MemberCode + "><td>" + no + "</td><td>" + item.MemberName + "</td><td>" + item.MemberGroup + "</td><td align=right>" + item.NumOfTran + "</td><td align=right>" + item.TotalAmount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td></tr>";
                        no++;
                    });
                    $("#Top10MemberWeek").html(html);
                    $("#LoadingTop10MemberWeek").hide();

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
            alert(error.responseText);
        }
    });


    job = "Top10MemberMonth" + date + index;
    jobs.push(job);
    maxcountdown = jobs.length;
    $("#requestcountdown").text(maxcountdown.toString());
    $("#maxcountdown").text(maxcountdown.toString());

    $.ajax({
        type: "POST",
        url: "DbGet.asmx/Top10MemberMonth",
        data: "{index:" + index + ", date:'" + date + "', job:'" + job + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            try {
                var json = $.parseJSON(data.d);
                if (json.Status.toString() == "1") {
                    $("#UpdateLast").text("Update Last: " + json.Data.UpdateLast[0].UpdateLast.toString() + " | Copyright © Speed Report Online 2016");


                    $("#Top10MemberMonth").empty();
                    var no = 1;
                    var html = "";
                    $.each(json.Data.Top10MemberMonth, function (key, item) {
                        html = html + "<tr id=" + item.MemberCode + "><td>" + no + "</td><td>" + item.MemberName + "</td><td>" + item.MemberGroup + "</td><td align=right>" + item.NumOfTran + "</td><td align=right>" + item.TotalAmount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td></tr>";
                        no++;
                    });
                    $("#Top10MemberMonth").html(html);
                    $("#LoadingTop10MemberMonth").hide();

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
            alert(error.responseText);
        }
    });


    job = "Top10GroupWeek" + date + index;
    jobs.push(job);
    maxcountdown = jobs.length;
    $("#requestcountdown").text(maxcountdown.toString());
    $("#maxcountdown").text(maxcountdown.toString());

    $.ajax({
        type: "POST",
        url: "DbGet.asmx/Top10GroupWeek",
        data: "{index:" + index + ", date:'" + date + "', job:'" + job + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            try {
                var json = $.parseJSON(data.d);
                if (json.Status.toString() == "1") {
                    $("#UpdateLast").text("Update Last: " + json.Data.UpdateLast[0].UpdateLast.toString() + " | Copyright © Speed Report Online 2016");
                    $("#Top10GroupWeek").empty();
                    var no = 1;
                    var html = "";
                    $.each(json.Data.Top10GroupWeek, function (key, item) {
                        html = html + "<tr><td>" + no + "</td><td>" + item.GroupName + "</td><td align=right>" + item.NumOfTran + "</td><td align=right>" + item.TotalAmount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td></tr>";
                        no++;
                    });
                    $("#Top10GroupWeek").html(html);
                    $("#LoadingTop10GroupWeek").hide();

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
            alert(error.responseText);
        }
    });


    job = "Top10GroupMonth" + date + index;
    jobs.push(job);
    maxcountdown = jobs.length;
    $("#requestcountdown").text(maxcountdown.toString());
    $("#maxcountdown").text(maxcountdown.toString());

    $.ajax({
        type: "POST",
        url: "DbGet.asmx/Top10GroupMonth",
        data: "{index:" + index + ", date:'" + date + "', job:'" + job + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            try {
                var json = $.parseJSON(data.d);
                if (json.Status.toString() == "1") {
                    $("#UpdateLast").text("Update Last: " + json.Data.UpdateLast[0].UpdateLast.toString() + " | Copyright © Speed Report Online 2016");
                    $("#Top10GroupMonth").empty();
                    var no = 1;
                    var html = "";
                    $.each(json.Data.Top10GroupMonth, function (key, item) {
                        html = html + "<tr><td>" + no + "</td><td>" + item.GroupName + "</td><td align=right>" + item.NumOfTran + "</td><td align=right>" + item.TotalAmount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td></tr>";
                        no++;
                    });
                    $("#Top10GroupMonth").html(html);
                    $("#LoadingTop10GroupMonth").hide();

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
            alert(error.responseText);
        }
    });

    job = "MemberStatistics" + date + index;
    jobs.push(job);
    maxcountdown = jobs.length;
    $("#requestcountdown").text(maxcountdown.toString());
    $("#maxcountdown").text(maxcountdown.toString());

    $.ajax({
        type: "POST",
        url: "DbGet.asmx/MemberStatistics",
        data: "{index:" + index + ", date:'" + date + "', job:'" + job + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            try {
                var json = $.parseJSON(data.d);
                if (json.Status.toString() == "1") {
                    $("#UpdateLast").text("Update Last: " + json.Data.UpdateLast[0].UpdateLast.toString() + " | Copyright © Speed Report Online 2016");
                    $("#MemberStatistics").empty();
                    var html = "";
                    $.each(json.Data.MemberStatistics, function (key, item) {
                        html = html + "<tr><td>" + item.GroupName + "</td><td align=right>" + item.Quantity + "</td></tr>";
                    });
                    $("#MemberStatistics").html(html);
                    $("#LoadingMemberStatistics").hide();

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
            alert(error.responseText);
        }
    });


    job = "Birthday7Days" + date + index;
    jobs.push(job);
    maxcountdown = jobs.length;
    $("#requestcountdown").text(maxcountdown.toString());
    $("#maxcountdown").text(maxcountdown.toString());

    $.ajax({
        type: "POST",
        url: "DbGet.asmx/Birthday7Days",
        data: "{index:" + index + ", date:'" + date + "', job:'" + job + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            try {
                var json = $.parseJSON(data.d);
                if (json.Status.toString() == "1") {
                    $("#UpdateLast").text("Update Last: " + json.Data.UpdateLast[0].UpdateLast.toString() + " | Copyright © Speed Report Online 2016");
                    $("#Birthday7Days").empty();
                    var html = "";
                    $.each(json.Data.Birthday7Days, function (key, item) {
                        html = html + "<tr id=" + item.MemberCode + "><td class=\"MemberName\">" + item.MemberName + "</td><td class=\"MemberGroup\">" + item.MemberGroup + "</td><td class=\"CellNum\">" + item.CellNum + "</td><td class=\"EMAIL\">" + item.EMAIL + "</td><td class=\"ADDRESS\">" + item.ADRESS + "</td><td class=\"Birthday\">" + item.Monthb + "/" + item.Dateb + "/" + item.Yearb + "</td><td class=\"Age\">" + item.Age + "</td><td><input type=\"checkbox\" class=\"checkbox\"></td></tr>";
                    });
                    $("#Birthday7Days").html(html);
                    $("#LoadingBirthday7Days").hide();

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
            alert(error.responseText);
        }
    });
}

function MemberInfo(cardnum, index, date) {
    var maxcountdown = 0;
    circlesloading.update(0, 0);
    $("#circlesloading").show();

    var job = "MemberInfo" + date + index + cardnum;
    jobs.push(job);
    maxcountdown = jobs.length;
    $("#requestcountdown").text(maxcountdown.toString());
    $("#maxcountdown").text(maxcountdown.toString());
    $('#lstStore, #txtDate').attr("disabled", "disabled");
    $("#LoadingTop10MemberWeek, #LoadingTop10MemberMonth, #LoadingTop10GroupWeek, #LoadingTop10GroupMonth, #LoadingMemberStatistics, #LoadingBirthday7Days, #LoadingBirthday30Days").show();

    $.ajax({
        type: "POST",
        url: "DbGet.asmx/MemberInfo",
        data: "{cardnum:'" + cardnum + "', index:" + index + ", date:'" + date + "', job: '" + job + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            try {

                var json = $.parseJSON(data.d);
                if (json.Status.toString() == "1") {
                    $("#UpdateLast").text("Update Last: " + json.Data.UpdateLast[0].UpdateLast.toString() + " | Copyright © Speed Report Online 2016");
                    $("#CARDNUM").text(json.Data.MemberInfo[0].CARDNUM);
                    $("#REF").text(json.Data.MemberInfo[0].REF);
                    $("#SALUT").text(json.Data.MemberInfo[0].SALUT);
                    $("#FIRSTNAME").text(json.Data.MemberInfo[0].FIRSTNAME);
                    $("#LASTNAME").text(json.Data.MemberInfo[0].LASTNAME);
                    $("#GROUPNAME").text(json.Data.MemberInfo[0].GROUPNAME);
                    $("#ADRESS1").text(json.Data.MemberInfo[0].ADRESS1);
                    $("#ADRESS2").text(json.Data.MemberInfo[0].ADRESS2);
                    $("#HOMETELE").text(json.Data.MemberInfo[0].HOMETELE);
                    $("#BUSTELE").text(json.Data.MemberInfo[0].BUSTELE);
                    $("#CellNum").text(json.Data.MemberInfo[0].CellNum);
                    $("#BirthDate").text(json.Data.MemberInfo[0].BirthDate);
                    $("#EXPDATE").text(json.Data.MemberInfo[0].EXPDATE);
                    $("#ANNIVER").text(json.Data.MemberInfo[0].ANNIVER);
                    $("#CRLIMIT").text(json.Data.MemberInfo[0].CRLIMIT.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                    $("#AmountDue").text(json.Data.MemberInfo[0].AmountDue.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                    $("#Comment").text(json.Data.MemberInfo[0].Comment);
                    $("#Directions").text(json.Data.MemberInfo[0].Directions);
                    $("#NUMVISITS").text(json.Data.MemberInfo[0].NUMVISITS);
                    $("#LASTVISIT").text(json.Data.MemberInfo[0].LASTVISIT);
                    $("#NumDeliverys").text(json.Data.MemberInfo[0].NumDeliverys);
                    $("#LastOrderDate").text(json.Data.MemberInfo[0].LastOrderDate);
                    $("#CurPoints").text(json.Data.MemberInfo[0].CurPoints);
                    $("#PointsUsed").text(json.Data.MemberInfo[0].PointsUsed);
                    $("#TOTALPOINT").text(json.Data.MemberInfo[0].CurPoints + json.Data.MemberInfo[0].PointsUsed);

                    $("#ListTransactionMember").empty();
                    var html = "";
                    $.each(json.Data.History, function (key, item) {
                        html = html + "<tr id=" + item.UID + "><td>" + item.Transact + "</td><td>" + item.Timeend + "</td><td align=right>" + item.Finaltotal.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td><td>" + $("#lstStore option[value='" + item.Store_Id + "']").text() + "</td></tr>";
                        mintrans = item.Transact;
                    });
                    $("#ListTransactionMember").html(html);
                    $("#ListTopProduct").empty();
                    html = "";
                    $.each(json.Data.FavoriteFood, function (key, item) {
                        html = html + "<tr><td>" + item.ProductName + "</td><td>" + item.Quantity + "</td><td align=right>" + item.TotalAmount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td></tr>";
                    });
                    $("#ListTopProduct").html(html);
                    $('#MemberDetailModal').modal('toggle');
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
                    $("#LoadingTop10MemberWeek, #LoadingTop10MemberMonth, #LoadingTop10GroupWeek, #LoadingTop10GroupMonth, #LoadingMemberStatistics, #LoadingBirthday7Days, #LoadingBirthday30Days").hide();
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
            alert(error.responseText);
        }
    });


}

function AddMore(cardnum, index, date, mintransact) {

    var maxcountdown = 0;
    circlesloading.update(0, 0);
    $("#circlesloading").show();

    $("#closebutton").hide();
    $("#LoadingTransaction").show();
    $('#lstStore, #txtDate').attr("disabled", "disabled");
    var job = "TransactionAddMore" + date + index + mintransact;
    jobs.push(job);
    maxcountdown = jobs.length;
    $("#requestcountdown").text(maxcountdown.toString());
    $("#maxcountdown").text(maxcountdown.toString());
    $("#LoadingTop10MemberWeek, #LoadingTop10MemberMonth, #LoadingTop10GroupWeek, #LoadingTop10GroupMonth, #LoadingMemberStatistics, #LoadingBirthday7Days, #LoadingBirthday30Days").show();

    $.ajax({
        type: "POST",
        url: "DbGet.asmx/TransactionAddMore",
        data: "{cardnum:'" + cardnum + "', index:" + index + ", date:'" + date + "', mintrans:" + mintransact + ", job: '" + job + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            try {
                var json = $.parseJSON(data.d);
                if (json.Status.toString() == "1") {
                    $("#UpdateLast").text("Update Last: " + json.Data.UpdateLast[0].UpdateLast.toString() + " | Copyright © Speed Report Online 2016");
                    var html = $("#ListTransactionMember").html();
                    $.each(json.Data.History, function (key, item) {
                        html = html + "<tr id=" + item.UID + "><td>" + item.Transact + "</td><td>" + item.Timeend + "</td><td align=right>" + item.Finaltotal.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td><td>" + $("#lstStore option[value='" + item.Store_Id + "']").text() + "</td></tr>";
                        mintrans = item.Transact;
                    });
                    $("#ListTransactionMember").html(html);
                    $("#closebutton").show();
                    $("#LoadingTransaction").hide();
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
                    $("#LoadingTop10MemberWeek, #LoadingTop10MemberMonth, #LoadingTop10GroupWeek, #LoadingTop10GroupMonth, #LoadingMemberStatistics, #LoadingBirthday7Days, #LoadingBirthday30Days").hide();
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
            alert(error.responseText);
        }
    });


}

function ViewDetail(transact, index) {

    var maxcountdown = 0;
    circlesloading.update(0, 0);
    $("#circlesloading").show();

    $('#lstStore, #txtDate').attr("disabled", "disabled");
    var datesplit = $("#txtDate").val().split('/');
    var date = datesplit[2] + '-' + datesplit[0] + '-' + datesplit[1];
    $("#closebutton").hide();
    $("#LoadingTransaction").show();
    var job = "ViewDetail" + date + index;
    jobs.push(job);
    maxcountdown = jobs.length;
    $("#requestcountdown").text(maxcountdown.toString());
    $("#maxcountdown").text(maxcountdown.toString());
    $("#LoadingTop10MemberWeek, #LoadingTop10MemberMonth, #LoadingTop10GroupWeek, #LoadingTop10GroupMonth, #LoadingMemberStatistics, #LoadingBirthday7Days, #LoadingBirthday30Days").show();

    $.ajax({
        type: "POST",
        url: "DbGet.asmx/ViewDetail",
        data: "{transact:" + transact + ", index:" + index + ", date:'" + date + "', job:'" + job + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            try {
                var json = $.parseJSON(data.d);
                if (json.Status.toString() == "1") {

                    var format = "<div align=\"center\" style=\"font-weight: bold; font-size:16pt;\">Table# " + json.Data.Header[0].TABLENUM + "</div><div><span style=\"float:left;\">Trans#: " + json.Data.Header[0].TRANSACT + "</span><span style=\"float:right;\">Serv: " + json.Data.Header[0].POSNAME + "</span></div><div class=\"clearfix\"></div><div><span style=\"float:left;\">" + json.Data.Header[0].TIMEEND.toString() + "</span><span style=\"float:right;\">#Cust: " + json.Data.Header[0].NUMCUST + "</span></div><div class=\"clearfix\"></div><table width=\"100%\" style=\"border-top: 1px dashed; border-bottom: 1px dashed;\"><thead style=\"border-bottom: 1px dashed;\"><tr style=\"font-weight: bold;\"><td width=\"15%\" align=\"center\">Quan</td><td width=\"55%\">Description</td><td width=\"30%\" align=\"right\">Cost</td></tr></thead><tbody>";
                    $.each(json.Data.Detail, function (key, item) {
                        format += "<tr><td width=\"15%\" align=\"center\">" + item.qty + "</td><td width=\"55%\">" + item.descript + "</td><td width=\"30%\" align=\"right\">" + item.amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td></tr>";
                    });
                    format += "</tbody></table><table width=\"100%\"><tbody><tr><td width=\"70%\" align=\"right\">Net Total:</td><td width=\"30%\" align=\"right\">" + json.Data.Header[0].NETTOTAL.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td></tr>";
                    if (json.Data.Header[0].SVC > 0)
                        format += "<tr><td width=\"70%\" align=\"right\">" + json.Data.Sysinfo[0].TAXDES1 + ":</td><td width=\"30%\" align=\"right\">" + json.Data.Header[0].SVC.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td></tr>";
                    if (json.Data.Header[0].VAT > 0)
                        format += "<tr><td width=\"70%\" align=\"right\">" + json.Data.Sysinfo[0].TAXDES2 + ":</td><td width=\"30%\" align=\"right\">" + json.Data.Header[0].VAT.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td></tr>";
                    format += "</tbody></table><hr align=\"right\" style=\"border-bottom: 1px dashed black;\" width=\"50%\"/><table width=\"100%\" style=\"font-weight: bold;font-size:12pt;\"><tbody><tr><td width=\"70%\" align=\"right\">Total:</td><td width=\"30%\" align=\"right\">" + json.Data.Header[0].FINALTOTAL.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td></tr></tbody></table><table width=\"100%\"><tbody>";
                    $.each(json.Data.Payment, function (key, item) {
                        format += "<tr><td width=\"70%\" align=\"left\">" + item.descript + "</td><td width=\"30%\" align=\"right\">" + (item.tender + item.change).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td></tr><tr><td width=\"70%\" align=\"left\">Change</td><td width=\"30%\" align=\"right\">" + item.change.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td></tr>";
                    });
                    format += "</tbody></table>";
                    $("#TransactionDetailBody").html("<div style=\"margin: 10px;\">" + format + "</div>");
                    $('#TransactionDetailBody, #TransactionDetailFooter, #closebutton').show();
                    $('#MemberDetailBody, #MemberDetailFooter, #LoadingTransaction').hide();

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
                    $("#LoadingTop10MemberWeek, #LoadingTop10MemberMonth, #LoadingTop10GroupWeek, #LoadingTop10GroupMonth, #LoadingMemberStatistics, #LoadingBirthday7Days, #LoadingBirthday30Days").hide();
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
            if (error.responseText.length > 0)
                alert(error.responseText);
        }
    });
}
