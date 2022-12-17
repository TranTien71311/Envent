
let leng = [
    {
        "en": "StockItem",
        "vi": "Nguyên Vật Liệu"
    },
    {
        "en": "ReferenceCode",
        "vi": "Mã Nguyên Vật Liệu"
    },
    {
        "en": "Order",
        "vi": "Số lượng"
    },
    {
        "en": "Units",
        "vi": "Đơn vị"
    },
    {
        "en": "Cost Each",
        "vi": "Giá"
    },
    {
        "en": "Line Total",
        "vi": "Tổng giá"
    },
    {
        "en": "Total Tax",
        "vi": "Thuế"
    },
    {
        "en": "Purchase Order",
        "vi": "Nhập Nguyên Vật Liệu"
    },
    {
        "en": "Date :",
        "vi": "Ngày :"
    },
    {
        "en": "Date",
        "vi": "Ngày"
    },
    {
        "en": "No. :",
        "vi": "Số. :"
    },
    {
        "en": "No",
        "vi": "Số"
    },
    {
        "en": "Ref. No. :",
        "vi": "Mã phiếu nhập:"
    },
    {
        "en": "Ship Date:",
        "vi": "Ngày giao:"
    },
    {
        "en": "Supplier:",
        "vi": "Nhà cung cấp:"
    },
    {
        "en": "Supplier",
        "vi": "Nhà cung cấp"
    },
    {
        "en": "Total Tax:",
        "vi": "Tổng thuế:"
    },
    {
        "en": "Total Tax",
        "vi": "Tổng thuế"
    },
    {
        "en": "Shipping:",
        "vi": "Vận chuyển:"
    },
    {
        "en": "Shipping",
        "vi": "Vận chuyển"
    },
    {
        "en": "Total:",
        "vi": "Tổng:"
    },
    {
        "en": "Total",
        "vi": "Tổng"
    },
    {
        "en": "Sub Total:",
        "vi": "Tổng giá:"
    },
    {
        "en": "Sub Total",
        "vi": "Tổng giá"
    }
];

function translate(_el, _fleng, _tleng) {
    $.each(leng, function (k, v) {
        let el = _el;
        $.each(el, function (i, u) {
            let tleng = $(u).text().replace(/ |\n/g, "").toLowerCase();
            let fleng = v[_fleng].replace(/ |\n/g, "").toLowerCase();
            if (tleng == fleng)
                $(u).text(v[_tleng]);
        });
    })
}
function translateVIPrintPO() {
    translate($('#iH-header'), "en","vi");
    translate($('#iH-date'), "en", "vi");
    translate($('#iH-no'), "en", "vi");
    translate($('#iH-ref'), "en", "vi");
    translate($('#iH-ship'), "en", "vi");
    translate($('#iH-supplier'), "en", "vi");
    let elTrans = $("#iDataPO").closest(".table").find('th');
    translate(elTrans, "en", "vi");
    translate($('#iF-subtotal'), "en", "vi");
    translate($('#iF-totaltax'), "en", "vi");
    translate($('#iF-shipping'), "en", "vi");
    translate($('#iF-total'), "en", "vi");
}
function translateENPrintPO() {
    translate($('#iH-header'), "vi", "en");
    translate($('#iH-date'), "vi", "en");
    translate($('#iH-no'), "vi", "en");
    translate($('#iH-ref'), "vi", "en");
    translate($('#iH-ship'), "vi", "en");
    translate($('#iH-supplier'), "vi", "en");
    let elTrans = $("#iDataPO").closest(".table").find('th');
    translate(elTrans, "vi", "en");
    translate($('#iF-subtotal'), "vi", "en");
    translate($('#iF-totaltax'), "vi", "en");
    translate($('#iF-shipping'), "vi", "en");
    translate($('#iF-total'), "vi", "en");
}