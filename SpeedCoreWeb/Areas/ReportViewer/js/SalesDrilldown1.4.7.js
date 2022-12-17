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

$('#TableTransactions').on('click', 'tr', function (event) {
    if ($(this).attr('id').length > 0) {
        $(this).addClass('active').siblings().removeClass('active');
        ViewDetail($(this).attr('id'));
    }
});

var index = $("#lstStore")[0].selectedIndex;
var datesplit = $("#txtDate").val().split('/');
var date = datesplit[2] + '-' + datesplit[0] + '-' + datesplit[1];
var saletype = $("#lstSaleType").val();
var hour = $("#lstHour").val();
var clerk = $("#lstClerk").val();
var tendertype = $("#lstTender").val();
var transaction = "-1";
if ($("#txtTransaction").val().length > 0)
    transaction = $("#txtTransaction").val();
var discounts = $("#lstDiscount").val();
var station = $("#lstStation").val();
LoadSalesDrilldown(index, date, saletype, hour, clerk, tendertype, transaction, discounts, station);
var loading = false;

$("#lstStore").on('change', function () {
    $("#Transactions, #DetailTransaction, #DetailTransactionMobile").empty();
    var index = $("#lstStore")[0].selectedIndex;
    LoadFilter(index);
});

$("#btnSearch").click(function (e) {
    var index = $("#lstStore")[0].selectedIndex;
    var datesplit = $("#txtDate").val().split('/');
    var date = datesplit[2] + '-' + datesplit[0] + '-' + datesplit[1];
    var saletype = $("#lstSaleType").val();
    var hour = $("#lstHour").val();
    var clerk = $("#lstClerk").val();
    var tendertype = $("#lstTender").val();
    var transaction = "-1";
    if ($("#txtTransaction").val().length > 0)
        transaction = $("#txtTransaction").val();
    var discounts = $("#lstDiscount").val();
    var station = $("#lstStation").val();
    LoadSalesDrilldown(index, date, saletype, hour, clerk, tendertype, transaction, discounts, station);
    e.preventDefault();
});

function printPage(id) {
    var html = "<html><body style=\"font-size: 14px;font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif;\">";
    html += document.getElementById(id).innerHTML;
    html += "</body></html>";
    var printWin = window.open('', '_blank', 'left=0,top=0,width=302,height=500,toolbar=0,scrollbars=0,status=1,titlebar=1');
    printWin.document.write(html);
    printWin.document.close();
    printWin.focus();
    printWin.print();
    printWin.close();
}


function remove(arr, what) {
    var found = arr.indexOf(what);

    while (found !== -1) {
        arr.splice(found, 1);
        found = arr.indexOf(what);
    }
}

function ViewDetail(transact) {
    if($(window).width() < 751)
        $('#myModal').modal('toggle'); 
    $("#print, #printmoblie").hide();
    $("#LoadingTransaction, #LoadingTransactionMoblie").show();
    var index = $("#lstStore")[0].selectedIndex;
    var datesplit = $("#txtDate").val().split('/');
    var date = datesplit[2] + '-' + datesplit[0] + '-' + datesplit[1];
    var maxcountdown = 0;
    circlesloading.update(0, 0);
    $("#circlesloading").show();

    var job = "ViewDetail" + date + index + transact;
    jobs.push(job);
    maxcountdown = jobs.length;
    $("#requestcountdown").text(maxcountdown.toString());
    $("#maxcountdown").text(maxcountdown.toString());

    $.ajax({
        type: "POST",
        url: "DbGet.asmx/ViewDetail",
        data: "{transact:" + transact + ", index:" + index + ", date:'" + date + "', job:'" + job + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            try
            {
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
                    format += "<tr><td width=\"30%\" align=\"left\">Member: </td><td width=\"70%\" align=\"right\">" + json.Data.Header[0].MEMBERNAME + "</td></tr>";
                    format += "</tbody></table>";
                    $("#DetailTransaction, #DetailTransactionMoblie").html(format);
                    $("#print, #printmoblie").show();
                    $("#LoadingTransaction, #LoadingTransactionMoblie").hide();
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
                    $("#circlesloading").hide();
                }
                $("#requestcountdown").text(jobs.length.toString());
            }
            catch (ex) {
                alert(ex.message);
            }
        },
        error: function (error) {
            if (error.responseText.length > 0)
                alert(error.responseText);
        }
    });
}

function LoadFilter(index) {
    $('#lstStore, #btnSearch, #txtDate').attr("disabled", "disabled");
    $("#LoadingSalesDrilldown").show();
    var maxcountdown = 0;
    circlesloading.update(0, 0);
    $("#circlesloading").show();

    var job = "SalesDrilldownFilter" + date + index;
    jobs.push(job);
    maxcountdown = jobs.length;
    $("#requestcountdown").text(maxcountdown.toString());
    $("#maxcountdown").text(maxcountdown.toString());

    $.ajax({
        type: "POST",
        url: "DbGet.asmx/SalesDrilldownFilter",
        data: "{index:" + index + ", date:'" + date + "', job:'" + job + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            
            try
            {
                var json = $.parseJSON(data.d);
                if (json.Status.toString() == "1") {
                    $("#UpdateLast").text(json.Data.UpdateLast[0].UpdateLast.toString());
                    $('#lstSaleType').empty();
                    $.each(json.Data.SalesType, function (key, item) {
                        $('#lstSaleType').append($('<option>', { 
                            value: item.value,
                            text : item.text 
                        }));
                    });

                    $('#lstClerk').empty();
                    $.each(json.Data.Employee, function (key, item) {
                        $('#lstClerk').append($('<option>', {
                            value: item.value,
                            text: item.text
                        }));
                    });

                    $('#lstTender').empty();
                    $.each(json.Data.Methodpay, function (key, item) {
                        $('#lstTender').append($('<option>', {
                            value: item.value,
                            text: item.text
                        }));
                    });

                    $('#lstDiscount').empty();
                    $.each(json.Data.Promo, function (key, item) {
                        $('#lstDiscount').append($('<option>', {
                            value: item.value,
                            text: item.text
                        }));
                    });

                    $('#lstStation').empty();
                    $.each(json.Data.StationInfo, function (key, item) {
                        $('#lstStation').append($('<option>', {
                            value: item.value,
                            text: item.text
                        }));
                    });

                    $("#LoadingSalesDrilldown").hide();
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
                    $('#lstStore, #btnSearch, #txtDate').removeAttr('disabled');
                    $("#circlesloading").hide();
                }
                $("#requestcountdown").text(jobs.length.toString());
            }
            catch (ex) {
                $('#lstStore, #btnSearch, #txtDate').removeAttr('disabled');
                alert(ex.message);
            }
        },
        error: function (error) {
            $('#lstStore, #btnSearch, #txtDate').removeAttr('disabled');
            if (error.responseText.length > 0)
                alert(error.responseText);
        }
    });
}

function LoadSalesDrilldown(index, date, saletype, hour, clerk, tendertype, transaction, discounts, station) {
    $('#store_name').text($("#lstStore option:selected").text());
    $('#lstStore, #btnSearch, #txtDate').attr("disabled", "disabled");
    $("#LoadingTransactions").show();

    var maxcountdown = 0;
    circlesloading.update(0, 0);
    $("#circlesloading").show();

    var job = "SalesDrilldown" + date + index;
    jobs.push(job);
    maxcountdown = jobs.length;
    $("#requestcountdown").text(maxcountdown.toString());
    $("#maxcountdown").text(maxcountdown.toString());

    $.ajax({
        type: "POST",
        url: "DbGet.asmx/SalesDrilldown",
        data: "{index:" + index + ", date:'" + date + "', saletype:" + saletype + ", hour:'" + hour + "', clerk:" + clerk + ", tendertype:" + tendertype + ", transaction:" + transaction + ", discounts:" + discounts + ", station: " + station + ", job:'" + job + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            try
            {
                var json = $.parseJSON(data.d);
                if (json.Status.toString() == "1") {
                    $("#UpdateLast").text(json.Data.UpdateLast[0].UpdateLast.toString());
                    $("#Transactions, #DetailTransaction, #DetailTransactionMobile").empty();
                    var html = "";
                    $.each(json.Data.Transactions, function (key, item) {
                        html = html + "<tr id='" + item.Trans + "'><td>" + item.Trans + "</td><td>" + item.TableNum + "</td><td>" + item.TransDateTime.toString() + "</td><td align=right>" + item.GrossTotal.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</td><td class=\"visible-lg\">" + item.Clerk + "</td><td class=\"visible-lg\">" + item.Member + "</td><td class=\"visible-lg\">" + item.SalesMode + "</td><td>" + item.Status + "</td></tr>";
                    });
                    $("#Transactions").html(html);
                    $("#LoadingTransactions").hide();
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
                    $('#lstStore, #btnSearch, #txtDate').removeAttr('disabled');
                    $("#circlesloading").hide();
                }
                $("#requestcountdown").text(jobs.length.toString());
            }
            catch (ex) {

                $('#lstStore, #btnSearch, #txtDate').removeAttr('disabled');
                alert(ex.message);
            }
        },
        error: function (error) {
            $('#lstStore, #btnSearch, #txtDate').removeAttr('disabled');
            if (error.responseText.length > 0)
                alert(error.responseText);
        }
    });
}
