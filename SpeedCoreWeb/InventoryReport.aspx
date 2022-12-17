<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="InventoryReport.aspx.cs" Inherits="SpeedCoreWeb.InventoryReport" %>

<%@ Register Assembly="Microsoft.ReportViewer.WebForms, Version=11.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91" Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title runat="server">Inventory Report| <%= Session["ClientName"] %> </title>
    <link rel="icon" href="data:image/jpeg;base64,<%= Session["Logo"] %>" type="image/x-icon" />
    <link rel="shortcut icon" type="image/x-icon" href="data:image/jpeg;base64,<%= Session["Logo"]%>" />
</head>

<body>
    <style>
        body {
            
            background-image: none !important;
            margin: 0;
            overflow: auto;
            padding: 0;
        }

        #rptViewer_ReportViewer {
            height: 100%;
            overflow: auto;
            display: block;
            
        }
    </style>
    <form id="form1" runat="server">
        <div>
            <asp:ScriptManager ID="scriptManager" runat="server"></asp:ScriptManager>
            <rsweb:ReportViewer ID="rptViewer" runat="server" EnableTheming="true" PromptAreaCollapsed="true" AsyncRendering="False" SizeToReportContent="True" Height="100%" Width="100%"></rsweb:ReportViewer>
        </div>

    </form>
</body>
</html>
