var days = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
$('#txtDateFrom, #txtDateEnd').datetimepicker({
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

$("#btnViewReport").click(function (e) {
    var index = $("#lstStore")[0].selectedIndex;
    var report = $("#lstReport")[0].selectedIndex;
    var fromsplit = $("#txtDateFrom").val().split('/');
    var datefrom = fromsplit[2] + '-' + fromsplit[0] + '-' + fromsplit[1];
    var endsplit = $("#txtDateEnd").val().split('/');
    var dateend = endsplit[2] + '-' + endsplit[0] + '-' + endsplit[1];
    window.open("ReportViewer.aspx?isCustomize=0&index=" + index + "&report=" + report + "&from=" + datefrom + "&end=" + dateend, '_blank');
    e.preventDefault();
});