/// <reference path="ClosingPeriod.js" />
document.addEventListener("DOMContentLoaded", function () {
    getWarehouses().then(dataWarehouse => {
        getStores().then(dataStore => {
            selectForStore(dataStore);
            selectForFilterStore(dataStore);
            $('#Loader').hide();
        });
        lstWarehouse = [...dataWarehouse];
    });

    getStockItem().then(res => {
        if (res.Status == 200) {
            lstStockFromAPI = [...res.Data];
        }
    });
});
const width = $(window).width();
const dropListStore = document.getElementById('SelectStore');
const dropListWarehouse = document.getElementById('SelectWarehouse');
const filterStoreSelect = document.getElementById('selectFilterStore');
const filterWarehouseSelect = document.getElementById('selectFilterWarehouse');
const tblBody = document.getElementById('lbPeriod');
const tblBodyModal = document.getElementById('tbModalPeriodDetail');
const btnInQuery = document.getElementById('btnInQuery');
const btnShowAll = document.getElementById('btnShowAll');
const btnExport = document.getElementById('btnExport');
const btnSearch = document.getElementById('btnSearch');

let lstWarehouse = [];
let lstPeriodDetails = [];

async function fetchDataFromAPI(url, cookieGUID) {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'ClientGUID': getCookie(cookieGUID)
        }
    });
    return await response.json();
}

async function putDataFromAPI(url, cookieGUID,body) {
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'ClientGUID': getCookie(cookieGUID)
        },
        body: JSON.stringify(body)
    });
    return await response.json();
}

async function postDataFromAPI(url, cookieGUID, body) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'ClientGUID': getCookie(cookieGUID)
        },
        body: JSON.stringify(body)
    });
    return await response.json();
}

const reLoad = (filterStore, filterWarehouse) => {
    getWarehouses().then(dataWarehouse => {
        getStores().then(dataStore => {
            if (width > 768) {
                getPeriods(dataWarehouse, dataStore, filterStore, filterWarehouse).then(res => {
                    const table = document.getElementById('tbData');
                    const tblBody = table.getElementsByTagName('tbody')
                    const rows = tblBody[0].getElementsByTagName('tr');
                    onClick(table, rows, res);
                });
            }
            else {
                getPeriodExport().then(res => {
                    loadDataResponsive(res, dataStore, dataWarehouse, filterStore, filterWarehouse);
                    onClickForMobile(res, dataWarehouse)
                });
            }

            selectForStore(dataStore);
            selectForFilterStore(dataStore);
            $('#Loader').hide();

            selectForStore(dataStore);
            selectForFilterStore(dataStore);
        });
        lstWarehouse = [...dataWarehouse];
    });

    getStockItem().then(res => {
        if (res.Status == 200) {
            lstStockFromAPI = [...res.Data];
        }
    });

    getPeriodsDetail().then(res => {
    	
        if (res.length > 0) {
            lstPeriodDetails = [...res];
        }
    });
}

const getWarehouses = () => {
    return new Promise(async (resolve, reject) => {
        const response = await fetchDataFromAPI('/api/Warehouse?IsActive=true', 'ClientGUID');
        resolve(response.Data);
    });
}

const getStores = () => {
    return new Promise(async (resolve, reject) => {
        const response = await fetchDataFromAPI('/api/Store?IsActive=true', 'ClientGUID');
        resolve(response.Data);
    });
}

const getStockLevel = () => {
    return new Promise(async (resolve, reject) => {
        const response = await fetchDataFromAPI('/api/StockLevel', 'ClientGUID');
        resolve(response.Data);
    });
}

const getWarehouseName = (id, lstWarehouse) => {
    const _Warehouse = lstWarehouse.find(s => s.WarehouseID == id);
    return _Warehouse.WarehouseName;
}

const getStoreName = (id, lstStore) => {
    const _Store = lstStore.find(s => s.StoreID == id);
    return _Store.StoreName;
}

const getPeriods = (lstWarehouse, lstStore, filterStore,filterWarehouse) => {
    return new Promise(async (reslove, reject) => {
        const response = await fetchDataFromAPI('/api/Period?IsActive=true&OrderBy=ASC', 'ClientGUID');
        let i = 1;
        let lstPrd = getListBySession(response.Data, lstWarehouseIDs,1,null,null,null);
        btnInQuery.classList.remove('btn-loading');
        if (filterStore != -1 && filterWarehouse != -1) {
            $('#selectFilterStore').val(filterStore).trigger('change');
            filterWarehouseSelect.value = filterWarehouse;

            let lstPeriod = lstPrd.filter(s => s.StoreID == filterStore && s.WarehouseID == filterWarehouse);
            lstPrd = lstPeriod; 
        }        
        
        lstPrd.forEach(k => {
            let _GUID = k.GUID;
            let _PeriodID = k.PeriodID;
            let _DateStart = convertDate(k.DateStart);
            let _DateEnd = (k.DateEnd == null || k.DateEnd == undefined || k.DateEnd == "") ? "" : convertDate(k.DateEnd);
            let _StoreID = getStoreName(k.StoreID, lstStore);
            let _WarehouseID = getWarehouseName(k.WarehouseID, lstWarehouse);
            let _isLock = k.IsLock;
            let _IsActive = (k.IsActive == true ? ` <label class="custom-switch">
                                                            <input class="custom-switch-input" type = "checkbox" checked disabled />
                                                            <span class="custom-switch-indicator"></span>
                                                    </label > ` :
                ` <label class="custom-switch">
                                                            <input class="custom-switch-input" type="checkbox" disabled/>
                                                            <span class="custom-switch-indicator"></span>
                                                    </label>`);
            let _IsLock = (k.IsLock == false ? `<button style="width:80px;font-weight:bold" value="${_isLock}" class="btn btn-sm btn-primary Show">OPENING</button>` : `<button style="width:80px;font-weight:bold" value="${_isLock}" class="btn btn-sm btn-primary Show">CLOSED</button>`);
            const tr = document.createElement('tr');
            tr.id = _GUID;
            const html = `
                    <td id="${_PeriodID}" class="text-right">${_PeriodID}</td>
                    <td>${_StoreID}</td>
                    <td>${_WarehouseID}</td>
                    <td>${_DateStart}</td>
                    <td>${_DateEnd}</td>
                    <td style="text-align: center;color: #fff;">${_IsActive}</td>
                    <td style="text-align: center;color: #fff;">${_IsLock}</td> 
                    `;
            tr.innerHTML = html;
            tblBody.appendChild(tr);
            ++i;
        });
        $('#tbData').prop('hidden', false);
        $('#tbData').dataTable({
            'paging': false,
            'lengthChange': false,
            'searching': false,
            'ordering': true,
            'order': [[0, 'asc']],
            'info': false,
            'processing': false,
            'columnDefs': [
                { "targets": 5, "className": "text-center", "width": "25px", "orderable": false },
                { "targets": 6, "className": "text-center", "width": "30px", "orderable": false },
            ]
        });

        $('#Loader').hide();
        reslove(response.Data);
    });
}

const getPeriodAlls = (lstWarehouse, lstStore, filterStore, filterWarehouse) => {
    return new Promise(async (reslove, reject) => {
        const response = await fetchDataFromAPI('/api/Period?OrderBy=ASC', 'ClientGUID');
        let i = 1;


        if (filterStore != -1 && filterWarehouse != -1) {
            $('#selectFilterStore').val(filterStore).trigger('change');
            filterWarehouseSelect.value = filterWarehouse;

            let lstPeriod = response.Data.filter(s => s.StoreID == filterStore && s.WarehouseID == filterWarehouse);
            response.Data = lstPeriod;
        }

        response.Data.forEach(k => {
            let _GUID = k.GUID;
            let _PeriodID = k.PeriodID;
            let _DateStart = convertDate(k.DateStart);
            let _DateEnd = (k.DateEnd == null || k.DateEnd == undefined || k.DateEnd == "") ? "" : convertDate(k.DateEnd);
            let _StoreID = getStoreName(k.StoreID, lstStore);
            let _WarehouseID = getWarehouseName(k.WarehouseID, lstWarehouse);
            let _isLock = k.IsLock;
            let _IsActive = (k.IsActive == true ? ` <label class="custom-switch">
                                                            <input class="custom-switch-input" type = "checkbox" checked disabled />
                                                            <span class="custom-switch-indicator"></span>
                                                    </label > ` :
                ` <label class="custom-switch">
                                                            <input class="custom-switch-input" type="checkbox" disabled/>
                                                            <span class="custom-switch-indicator"></span>
                                                    </label>`);
            let _IsLock = (k.IsLock == false ? `<button style="width:80px;font-weight:bold" value="${_isLock}" class="btn btn-sm btn-primary Show">OPENING</button>` : `<button style="width:80px;font-weight:bold" value="${_isLock}" class="btn btn-sm btn-primary Show">CLOSED</button>`);
            const tr = document.createElement('tr');
            tr.id = _GUID;
            const html = `
                    <td id="${_PeriodID}" >${i}</td>
                    <td>${_StoreID}</td>
                    <td>${_WarehouseID}</td>
                    <td>${_DateStart}</td>
                    <td>${_DateEnd}</td>
                    <td style="text-align: center;color: #fff;">${_IsActive}</td>
                    <td style="text-align: center;color: #fff;">${_IsLock}</td> 
                    `;
            tr.innerHTML = html;
            tblBody.appendChild(tr);
            ++i;
        });
        $('#tbData').prop('hidden', false);
        $('#tbData').dataTable({
            'paging': false,
            'lengthChange': false,
            'searching': false,
            'ordering': true,
            'order': [[0, 'asc']],
            'info': false,
            'processing': false,
            'columnDefs': [
                { "targets": 5, "className": "text-center", "width": "25px", "orderable": false },
                { "targets": 6, "className": "text-center", "width": "30px", "orderable": false },
            ]
        });

        $('#Loader').hide();
        reslove(response.Data);
    });
}

const getPeriodExport = () => {
    return new Promise(async (reslove, reject) => {
        const response = await fetchDataFromAPI('/api/Period?OrderBy=ASC', 'ClientGUID');
        reslove(response.Data);
    });
};

/*Area Button Event */

btnInQuery.addEventListener('click', function () {
    btnInQuery.classList.add('btn-loading');
    $('#Loader').show();
    if (width > 768) {
        $('#tbData').dataTable().fnDestroy();
        tblBody.innerHTML = "";
        reLoad(filterStoreSelect.value, filterWarehouseSelect.value);
    }
    else {
        document.getElementById('responsive').innerHTML = "";
        reLoad(filterStoreSelect.value, filterWarehouseSelect.value);
    }

});

btnShowAll.addEventListener('click', function () {
    $('#Loader').show();
    $('#tbData').dataTable().fnDestroy();
    tblBody.innerHTML = "";
    getWarehouses().then(dataWarehouse => {
        getStores().then(dataStore => {
            getPeriodAlls(dataWarehouse, dataStore, filterStoreSelect.value, filterWarehouseSelect.value).then(res => {
                const table = document.getElementById('tbData');
                const tblBody = table.getElementsByTagName('tbody')
                const rows = tblBody[0].getElementsByTagName('tr');
                onClick(table, rows, res);
            });
        });
        lstWarehouse = [...dataWarehouse];
    });

    getStockItem().then(res => {
        if (res.Status == 200) {
            lstStockFromAPI = [...res.Data];
        }
    });
});

btnExport.addEventListener('click', function () {
    if (width > 768) {
        let myTable = $("#tbData").DataTable();
        let form_data = myTable.rows().data();
        for (let i = 0; i < myTable.rows().data().length; i++) {
            if (form_data[i][5].search('checked') != -1) {
                form_data[i][5] = "True";
            }
            else {
                form_data[i][5] = "False";
            }

            if (form_data[i][6].search('OPENING') != -1) {
                form_data[i][6] = "OPENING";
            }
            else {
                form_data[i][6] = "CLOSED";
            }
        }
        exportExcel(form_data);
    }
    else {
        //Export Excel theo Mobile
        let lstObj = [];
        let obj;
        let item = [];
        let j = 1;
        getPeriodExport().then(res => {
            let lstPrd = getListBySession(res, lstWarehouseIDs, 1, null, null, null);

            if (filterStoreSelect.value != -1 && filterWarehouseSelect.value != -1) {
                item = lstPrd.filter(s => s.StoreID == filterStoreSelect.value && s.WarehouseID == filterWarehouseSelect.value);
            }
            else {
                item = lstPrd;
            }
            for (let i = 0; i < item.length; i++) {
                obj = {
                    'index': j,
                    'StoreName': document.querySelectorAll('.list-unstyled')[i].querySelectorAll('li h9')[0].innerText,
                    'WarehouseName': document.querySelectorAll('.list-unstyled')[i].querySelectorAll('li h9')[1].innerText,
                    'DateStart': document.querySelectorAll('.list-unstyled')[i].querySelectorAll('li h9')[2].innerText,
                    'DateEnd': document.querySelectorAll('.list-unstyled')[i].querySelectorAll('li h9')[3].innerText,
                    'IsActive': document.querySelectorAll('.list-unstyled')[i].querySelectorAll('li')[4].id,
                    'Status': document.querySelectorAll('.mt-6')[i].getElementsByTagName('button')[0].innerText,
                }
                lstObj.push(obj);
                j++;
            }
            exportExcel(lstObj);
        });
    }

});

/*End of Area Button Event */

const getPeriodsForCheck = () => {
    return new Promise(async (reslove, reject) => {
        const response = await fetchDataFromAPI('/api/Period?IsActive=true', 'ClientGUID');
        reslove(response.Data);
    });
}

const getPeriodsDetail = () => {
    return new Promise(async (reslove, reject) => {
        const response = await fetchDataFromAPI('/api/PeriodDetail?IsActive=true', 'ClientGUID');
        reslove(response.Data);
    });
}

const getStockItem = () => {
    return new Promise(async (resolve, reject) => {
        const response = await fetchDataFromAPI('/api/StockItem?IsActive=true', 'ClientGUID');
        resolve(response);
    });
}

const getStockItems = () => {
    return new Promise(async (resolve, reject) => {
        const response = await fetchDataFromAPI('/api/StockItem', 'ClientGUID');
        resolve(response);
    });
}

const selectForWarehouse = (id,lstWarehouse) => {
    dropListWarehouse.innerHTML = "";
    let option = document.createElement('option');
    option.value = -1;
    option.text = "--- Select One Warehouse ---";
    dropListWarehouse.appendChild(option);
    let lstWarehouseFilter = lstWarehouse.filter(s => s.WarehouseID == id);

    for (let i = 0; i < lstWarehouseFilter.length; i++) {
        let option = document.createElement('option');
        option.value = lstWarehouseFilter[i].WarehouseID;
        option.text = lstWarehouseFilter[i].WarehouseName;
        dropListWarehouse.appendChild(option);
    }
    document.getElementById('tblModalPeriodDetail').hidden = true;
}

const selectForStore = (lstStore) => {
    dropListStore.innerHTML = "";
    let option = document.createElement('option');
    option.value = -1;
    option.text = "--- Select One Store ---";
    dropListStore.appendChild(option);

    for (let i = 0; i < lstStore.length; i++) {
        let option = document.createElement('option');
        option.value = lstStore[i].StoreID;
        option.text = lstStore[i].StoreName;
        dropListStore.appendChild(option);
    }
}

const selectForFilterStore = (lstStore) => {
    let _lstStore = getListBySession(null,null,2,lstStore, lstStoreIDs);
    filterStoreSelect.innerHTML = "";
    let option = document.createElement('option');
    option.value = -1;
    option.text = "All";
    filterStoreSelect.appendChild(option);

    for (let i = 0; i < _lstStore.length; i++) {
        let option = document.createElement('option');
        option.value = _lstStore[i].StoreID;
        option.text = _lstStore[i].StoreName;
        filterStoreSelect.appendChild(option);
    }
}

const selectForFilterWarehouse = (lstWarehouse, storeID) => {
    let _lstWarehouse = getListBySession(null, lstWarehouseIDs, 3, null, null, lstWarehouse);
    filterWarehouseSelect.innerHTML = "";
    let option = document.createElement('option');
    option.value = -1;
    option.text = "All";
    filterWarehouseSelect.appendChild(option);

    let lstWarehouseAfterQuery = _lstWarehouse.filter(s => s.StoreID == storeID);
    for (let i = 0; i < lstWarehouseAfterQuery.length; i++) {
        let option = document.createElement('option');
        option.value = lstWarehouseAfterQuery[i].WarehouseID;
        option.text = lstWarehouseAfterQuery[i].WarehouseName;
        filterWarehouseSelect.appendChild(option);
    }
}

const closingPeriod = (objPeriod) => {
    return new Promise(async (resolve, reject) => {
        const response = await putDataFromAPI('/api/Period', 'ClientGUID', objPeriod);
        resolve(response);
    }); 
} 

const openPeriod = (objPeriod) => {
    return new Promise(async (resolve, reject) => {
        const response = await postDataFromAPI('/api/Period', 'ClientGUID', objPeriod);
        resolve(response);
    }); 
}

const addPeriodDetail = (objPeriodDetail) => {
    return new Promise(async (resolve, reject) => {
        const response = await postDataFromAPI('/api/PeriodDetail', 'ClientGUID', objPeriodDetail);
        resolve(response);
    }); 
}

const updatePeriodDetail = (objPeriodDetail) => {
    return new Promise(async (resolve, reject) => {
        const response = await putDataFromAPI('/api/PeriodDetail', 'ClientGUID', objPeriodDetail);
        resolve(response);
    }); 
}

function Period (periodID,guid,startDate,endDate,storeID,warehouseID,isActive,isLock) {
    this.PeriodID = periodID;
    this.GUID = guid;
    this.DateStart = startDate;
    this.DateEnd = endDate;
    this.StoreID = storeID;
    this.WarehouseID = warehouseID;
    this.IsActive = isActive;
    this.IsLock = isLock;
}

function PeriodDetail(periodDetailID, guid, costStart, costEnd, unitStart, unitEnd, periodID, stockItemID,isActive) {
    this.PeriodDetailID = periodDetailID;
    this.GUID = guid;
    this.CostStart = costStart;
    this.CostEnd = costEnd;
    this.UnitStart = unitStart;
    this.UnitEnd = unitEnd;
    this.PeriodID = periodID;
    this.StockItemID = stockItemID;
    this.IsActive = isActive;
}

/*Area Select Event */

dropListStore.addEventListener('change', function () {
    selectForWarehouse(dropListStore.value, lstWarehouse);
});

dropListWarehouse.addEventListener('change', function () {
    if (dropListWarehouse.value != -1) {
        document.getElementById('tblModalPeriodDetail').hidden = false;
    }
});

filterStoreSelect.addEventListener('change', function () {
    if (filterStoreSelect.value != -1) {
        selectForFilterWarehouse(lstWarehouse, filterStoreSelect.value);
    }
    else {
        filterWarehouseSelect.value = -1;
        filterWarehouseSelect.innerHTML = "";
        let option = document.createElement('option');
        option.value = -1;
        option.text = "All";
        filterWarehouseSelect.appendChild(option);
        //$('#Loader').show();
        //reLoad(-1, -1);
    }
});

$('#selectFilterStore').on('select2:select', function () {
    if (filterStoreSelect.value != -1) {
        selectForFilterWarehouse(lstWarehouse, filterStoreSelect.value);
    }
    else {
        filterWarehouseSelect.value = -1;
        filterWarehouseSelect.innerHTML = "";
        let option = document.createElement('option');
        option.value = -1;
        option.text = "All";
        filterWarehouseSelect.appendChild(option);
        //$('#Loader').show();
        //reLoad(-1, -1);
    }
});

$('#selectFilterWarehouse').on('select2:select', function () {
    if (filterWarehouseSelect.value == -1) {
        filterWarehouseSelect.value = -1;
        $('#selectFilterStore').val(-1).trigger('change');
        filterWarehouseSelect.innerHTML = "";
        let option = document.createElement('option');
        option.value = -1;
        option.text = "All";
        filterWarehouseSelect.appendChild(option);
        //$('#Loader').show();
    }
});

/*End of Area Select Event */


const onClick = (table, rows, lstPeriod) => {
    const dateStart = document.getElementById('DateStart');
    const dateEnd = document.getElementById('DateEnd');
    const selectStore = document.getElementById('SelectStore');
    const selectWarehouse = document.getElementById('SelectWarehouse');
    const guid = document.getElementById('PeriodGUID');

    let buttons = document.getElementsByClassName('Show');
    let _guid = "";
    let _periodID = "";
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function () {
            for (let j = 1; j < rows.length + 1; j++) {
                let currentRow = table.rows[j];
                let createClickHandler = function (row) {
                    return function () {
                        _guid = table.rows[j].id;
                        _periodID = row.getElementsByTagName("td")[0].id;
                        let period = lstPeriod.find(s => s.GUID == _guid);
                        selectForWarehouse(period.WarehouseID, lstWarehouse);
                        checkPeriodDetailIsActive(lstPeriodDetails, _periodID, period.WarehouseID);
                        guid.value = _guid;
                        dateStart.value = convertDate(period.DateStart);
                        dateEnd.value = (period.DateEnd == null || period.DateEnd == undefined || period.DateEnd == "") ? convertDate(new Date()) : convertDate(period.DateEnd);
                        selectStore.value = period.StoreID;
                        selectWarehouse.value = period.WarehouseID;
                        selectWarehouse.setAttribute("disabled", "disabled");
                        selectStore.setAttribute("disabled", "disabled");
                        dateStart.setAttribute("disabled", "disabled");
                        dateEnd.setAttribute("disabled", "disabled");
                        document.getElementById('tblModalPeriodDetail').hidden = false;
                    };
                };
                currentRow.onclick = createClickHandler(currentRow); 
            }
            //Set button Closing 
            document.getElementById('inputSearch').value = "";
            let isTrueSet = (buttons[i].value === 'true')
            const modalFooter = document.getElementById('modalFooter');
            modalFooter.innerHTML = "";
            if (!isTrueSet) {
                const btnEndPeriod = document.createElement('button');
                btnEndPeriod.className = "btn btn-primary";
                btnEndPeriod.id = "btnClosing";
                btnEndPeriod.innerText = "Closing Period";
                modalFooter.appendChild(btnEndPeriod);

                const btnClosingPeriod = document.getElementById('btnClosing');
                btnClosingPeriod.addEventListener('click', function () {
                    const _period = new Period(_periodID, guid.value, null, dateEnd.value, null, null, null, true);
                    getPeriodsDetail().then(res => {
                        let checkExist = res.filter(s => s.PeriodID == _periodID);
                        if (checkExist.length > 0) {
                            closingPeriod(_period).then(res => {
                                if (res.Status == 200) {
                                    const _newPeriod = new Period(-1, null, convertDate(new Date()), null, selectStore.value, selectWarehouse.value, true, false);
                                    openPeriod(_newPeriod).then(res => {
                                        let periodIDNew = res.Data.PeriodID;
                                        if (res.Status == 200) {
                                            //Check kì đầu tiên hay là kì tiếp theo kì cũ
                                            getPeriodsForCheck().then(res => {
                                                if (res.length > 0) {
                                                    let lstPeriod = res;
                                                    getPeriodsDetail().then(res => {
                                                        isFirstPeriodOrNextPeriod(lstPeriod, selectWarehouse.value, periodIDNew, _periodID, res);
                                                    });
                                                }
                                            })
                                        }
                                        else {
                                            Swal.fire({
                                                icon: 'error',
                                                title: res.Message,
                                                showConfirmButton: true,
                                                confirmButtonText: "Close",
                                            });
                                        }
                                    });
                                }
                                else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: res.Message,
                                        showConfirmButton: true,
                                        confirmButtonText: "Close",
                                    });
                                }
                                $('#tbData').dataTable().fnDestroy();
                                tblBody.innerHTML = "";
                                $('#Loader').show();
                                reLoad(filterStoreSelect.value, filterWarehouseSelect.value);
                            });
                        }
                        else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Không thể đóng kỳ vì không có Item trong PeriodDetail vui lòng kiểm tra lại',
                                showConfirmButton: true,
                                confirmButtonText: "Close",
                            });
                        }
                    });
                    $('#PeriodModal').modal('hide');
                });
            }

            $('#PeriodModal').modal('toggle');
        });
    }

    btnSearch.addEventListener('click', function () {
        function filterSearch(query) {
            return lstStockFromAPI.filter(function (el) {
                regex = /^([a-zA-Z0-9 _-]+)$/; // Chỉ chấp nhận ký tự alphabet thường hoặc ký tự hoa
                // true nếu text chỉ chứa ký tự alphabet thường hoặc hoa, false trong trường hợp còn lại.
                if (regex.test(document.getElementById('inputSearch').value)) {
                    return xoa_dau(el.StockItemName).toLowerCase().indexOf(query.toLowerCase()) > -1;
                }
                else {
                    return (el.StockItemName).toLowerCase().indexOf(query.toLowerCase()) > -1;
                }
            })
        }

        let lstFitler = filterSearch(document.getElementById('inputSearch').value);
        let lstStockItemID = [];
        for (let i = 0; i < lstFitler.length; i++) {
            lstStockItemID.push(lstFitler[i].StockItemID);
        }
        showTableModal(_periodID, false, lstStockItemID);
    });
}

const isFirstPeriodOrNextPeriod = (lstPeriod, warehouseID, periodIDNew, periodOld, lstPeriodDetail) => { 
    let check = lstPeriod.filter(s => s.WarehouseID == warehouseID && s.IsLock == 1);
    //Nếu kì đầu tiên k cần tạo PeriodDetail
    if (check.length > 0) {
        getStockLevel().then(res => {
            let lstStockFilter = res.filter(s => s.WarehouseID == warehouseID && s.IsActive == true);
            //Check có StockItem trong StockLevel chưa ?
            if (lstStockFilter.length > 0) {
                let checkPeriodDetailExistedOrNot = lstPeriodDetail.filter(s => s.PeriodID == periodOld);
                //Có trong PeriodDetail
                let listPeriodDetail = [];
                let _lstPeriodDetail = [...checkPeriodDetailExistedOrNot];                 
                for (let i = 0; i < _lstPeriodDetail.length; i++) {
                    for (let j = 0; j < lstStockFilter.length; j++) {
                        if (_lstPeriodDetail[i].StockItemID == lstStockFilter[j].StockItemID) {
                            let obj = lstPeriodDetail.find(s => s.PeriodID == periodOld && s.StockItemID == lstStockFilter[j].StockItemID);
                            const _PeriodDetailUpdate = new PeriodDetail(obj.PeriodDetailID, obj.GUID, obj.CostStart, lstStockFilter[j].CostPerUnit, obj.UnitStart, lstStockFilter[j].Units, periodOld, lstStockFilter[j].StockItemID, true);
                            const _PeriodDetailNew = new PeriodDetail(-1, null, _PeriodDetailUpdate.CostEnd, null, _PeriodDetailUpdate.UnitEnd, null, periodIDNew, _PeriodDetailUpdate.StockItemID, true);
                            listPeriodDetail.push(_PeriodDetailUpdate);
                            listPeriodDetail.push(_PeriodDetailNew);
                            break;
                        }
                    }
                }

                updatePeriodDetail(listPeriodDetail).then(res => {
                    if (res.Status == 200) {
                        Swal.fire({
                            icon: 'success',
                            title: res.Message,
                            showConfirmButton: true,
                            confirmButtonText: "Close",
                        });
                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            title: res.Message,
                            showConfirmButton: true,
                            confirmButtonText: "Close",
                        });
                    }
                });
            }       
        });
    }   
}

const showTableModal = (periodID, isFilter,lstStock) => {
    if (isFilter) {
        tblBodyModal.innerHTML = "";
        document.getElementById('tblModalPeriodDetail').hidden = false;
        getPeriodsDetail().then(res => {

            let lstPeriodDetails = res.filter(s => s.PeriodID == periodID && s.IsActive == true);
            let lstUnitPrice = getObjectUnits(lstStockFromAPI, lstPeriodDetails);

            let i = 1;
            if (lstPeriodDetails.length > 0) {
                lstPeriodDetails.forEach(k => {
                    let _GUID = k.GUID;
                    let _StockItemID = getNameFromStockItem(k.StockItemID);
                    let _UnitStart = k.UnitStart == null ? "" : calCountPackUnitDes(lstUnitPrice, k.StockItemID);
                    let _UnitEnd = k.UnitEnd == null ? "" : calCountPackUnitDes(lstUnitPrice, k.StockItemID);
                    let _CostStart = k.CostStart == null ? "" : numberFormat(k.CostStart);
                    let _CostEnd = k.CostEnd == null ? "" : numberFormat(k.CostEnd);
                    let _IsActive = (k.IsActive == true ? `YES` : `NO`);

                    const tr = document.createElement('tr');
                    tr.id = _GUID;
                    const html = `
                    <td class="text-center" id="${_GUID}" >${i}</td>
                    <td class="text-left">${_StockItemID}</td>
                    <td class="text-right">${isMinusNumberOrNot(_UnitStart[0].NameStart)}&ensp;<span class="badge badge-primary badge-pill">${_UnitStart[0].UnitStart}</span></td>
                    <td class="text-right">${isMinusNumberOrNot(_UnitStart[1].NameStart)}&ensp;<span class="badge badge-primary badge-pill">${_UnitStart[1].UnitStart}</span></td>
                    <td class="text-right">${isMinusNumberOrNot(_UnitStart[2].NameStart)}&ensp;<span class="badge badge-primary badge-pill">${_UnitStart[2].UnitStart}</span></td>
                    <td class="text-right">${_UnitEnd == "" ? "" : isMinusNumberOrNot(_UnitEnd[3].NameStart)}&ensp;<span class="badge badge-primary badge-pill">${_UnitEnd == "" ? "" :_UnitEnd[3].UnitStart}</span></td>
                    <td class="text-right">${_UnitEnd == "" ? "" : isMinusNumberOrNot(_UnitEnd[4].NameStart)}&ensp;<span class="badge badge-primary badge-pill">${_UnitEnd == "" ? "" :_UnitEnd[4].UnitStart}</span></td>
                    <td class="text-right">${_UnitEnd == "" ? "" : isMinusNumberOrNot(_UnitEnd[5].NameStart)}&ensp;<span class="badge badge-primary badge-pill">${_UnitEnd == "" ? "" :_UnitEnd[5].UnitStart}</span></td>
                    <td class="text-right">${isMinusNumberOrNot(_CostStart)}</td>
                    <td class="text-right">${isMinusNumberOrNot(_CostEnd)}</td>
                    <td style="text-align: center;">${_IsActive}</td>
                    `;
                    tr.innerHTML = html;
                    tblBodyModal.appendChild(tr);
                    ++i;
                });
                $('#tbDataModal').prop('hidden', false);
            }
            else {
                document.getElementById('tblModalPeriodDetail').hidden = true;
            }
        });
    }
    else {
        tblBodyModal.innerHTML = "";
        document.getElementById('tblModalPeriodDetail').hidden = false;
        let newListPeriodDetail = [];
        getPeriodsDetail().then(res => {
            newListPeriodDetail.length = 0;
            let listPeriodDetail = res.filter(s => s.IsActive == true && s.PeriodID == periodID);
            let lstUnitPrice = getObjectUnits(lstStockFromAPI, lstPeriodDetails);
            for (let i = 0; i < lstStock.length; i++) {
                let found = listPeriodDetail.filter(s => s.StockItemID == lstStock[i]);
                if (found.length > 0) {
                    newListPeriodDetail.push(found[0]);
                }
            }
            let i = 1;
            if (newListPeriodDetail.length > 0) {
                newListPeriodDetail.forEach(k => {
                    let _GUID = k.GUID;
                    let _StockItemID = getNameFromStockItem(k.StockItemID);
                    let _UnitStart = k.UnitStart == null ? "" : calCountPackUnitDes(lstUnitPrice, k.StockItemID);
                    let _UnitEnd = k.UnitEnd == null ? "" : calCountPackUnitDes(lstUnitPrice, k.StockItemID);
                    let _CostStart = k.CostStart == null ? "" : numberFormat(k.CostStart);
                    let _CostEnd = k.CostEnd == null ? "" : numberFormat(k.CostEnd);
                    let _IsActive = (k.IsActive == true ? `YES` : `NO`);

                    const tr = document.createElement('tr');
                    tr.id = _GUID;
                    const html = `
                    <td class="text-center" id="${_GUID}" >${i}</td>
                    <td class="text-left">${_StockItemID}</td>
                    <td class="text-right">${isMinusNumberOrNot(_UnitStart[0].NameStart)}&ensp;<span class="badge badge-primary badge-pill">${_UnitStart[0].UnitStart}</span></td>
                    <td class="text-right">${isMinusNumberOrNot(_UnitStart[1].NameStart)}&ensp;<span class="badge badge-primary badge-pill">${_UnitStart[1].UnitStart}</span></td>
                    <td class="text-right">${isMinusNumberOrNot(_UnitStart[2].NameStart)}&ensp;<span class="badge badge-primary badge-pill">${_UnitStart[2].UnitStart}</span></td>
                    <td class="text-right">${_UnitEnd == "" ? "" : isMinusNumberOrNot(_UnitEnd[0].NameStart)}&ensp;<span class="badge badge-primary badge-pill">${_UnitEnd == "" ? "" : _UnitEnd[0].UnitStart}</span></td>
                    <td class="text-right">${_UnitEnd == "" ? "" : isMinusNumberOrNot(_UnitEnd[1].NameStart)}&ensp;<span class="badge badge-primary badge-pill">${_UnitEnd == "" ? "" : _UnitEnd[1].UnitStart}</span></td>
                    <td class="text-right">${_UnitEnd == "" ? "" : isMinusNumberOrNot(_UnitEnd[2].NameStart)}&ensp;<span class="badge badge-primary badge-pill">${_UnitEnd == "" ? "" : _UnitEnd[2].UnitStart}</span></td>
                    <td class="text-right">${_CostStart}</td>
                    <td class="text-right">${_CostEnd}</td>
                    <td style="text-align: center;">${_IsActive}</td>
                    `;
                    tr.innerHTML = html;
                    tblBodyModal.appendChild(tr);
                    ++i;
                });
                $('#tbDataModal').prop('hidden', false);
            }
            else {
                document.getElementById('tblModalPeriodDetail').hidden = true;
            }
        });
    }

}

const findDifferentID = (listPeriodDetail, listStock, periodID) => {
    let lstPeriodDetailFilter = [];
    for (let i = 0; i < listPeriodDetail.length; i++) {
        if (listPeriodDetail[i].PeriodID == periodID) {
            lstPeriodDetailFilter.push(listPeriodDetail[i].StockItemID);
        }
    }
    let listStockFilter = listStock.map(obj);
    //Tìm Stock mới trong Stock Level
    let arrayAfterFilter = listStockFilter.filter(function (val) { return lstPeriodDetailFilter.indexOf(val) == -1; });
    return arrayAfterFilter;
}

const obj = (objs) => {
    return objs.StockItemID;
}

const getNameFromStockItem = (id) => {
    if (id != null) {
        return lstStockFromAPI.find(s => s.StockItemID == id).StockItemName;
    }
    else {
        return "";
    }
}

const isMinusNumberOrNot = (number) => {
    if (number < 0) {
        return '<h9 style="color:red">' + number + '</h9>';
    }
    else {
        return number;
    }
} 

//EXPORT EXCEL
function exportExcel(data) {
    var createXLSLFormatObj = [];

    /* XLS Head Columns */
    var xlsHeader = ["#", "Store Name", "Warehouse Name", "Date Start", "Date End", "IsActive","Status"];

    /* XLS Rows Data */
    var xlsRows = data;

    createXLSLFormatObj.push(xlsHeader);
    $.each(xlsRows, function (index, value) {
        var innerRowData = [];
        $.each(value, function (ind, val) {

            innerRowData.push(val);
        });
        createXLSLFormatObj.push(innerRowData);
    });
    /* File Name */
    var filename = "ClosingPeriod.xlsx";

    /* Sheet Name */
    var ws_name = "Sheet";
    var wb = XLSX.utils.book_new();
    ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);

    /* Add worksheet to workbook */
    XLSX.utils.book_append_sheet(wb, ws, ws_name);
    XLSX.writeFile(wb, filename);

}

function loadDataResponsive(data,lstStore,lstWarehouse,filterStore,filterWarehouse) {
    $('#responsive').empty();
    $('#dataTable').hide();
    btnInQuery.classList.remove('btn-loading');
    if (data.length == 0) {
        let notfound = '<div class="col-12 page-content mt-0">';
        notfound += '<div class="container text-center text-dark">';
        notfound += '<div class="display-2  text-dark mb-5 mt-9">NOT FOUND</div></div></div>';
        $('#responsive').append(notfound);
        $("#btnRefresh").removeClass("btn-loading");
        $("#btnShowAll").removeClass("btn-loading");
        $('#responsive').show();
        $('#Loader').hide();
        return;
    }
    let i = 1;
    let lstPrd = getListBySession(data, lstWarehouseIDs, 1, null, null, null);
    $('#selectFilterStore').val(filterStore).trigger('change');
    $('#selectFilterWarehouse').val(filterWarehouse).trigger('change');

    if (filterStore != -1 && filterWarehouse != -1) {
        let item = lstPrd.filter(s => s.StoreID == filterStore && s.WarehouseID == filterWarehouse);
        lstPrd = item;
    }

    lstPrd.forEach(k => {
        let GUID = k.GUID;
        let PeriodID = k.PeriodID;
        let StoreID = k.StoreID;
        let WarehouseID = k.WarehouseID;
        let StoreName = getStoreName(k.StoreID, lstStore);
        let WarehouseName = getWarehouseName(k.WarehouseID, lstWarehouse);
        let DateStart = IsNullDate(k.DateStart);
        let DateEnd = IsNullDate(k.DateEnd);
        let IsActive = k.IsActive;
        let IsActiveText = IsTrueOrFalse(k.IsActive);
        let IsLockText = k.IsLock ? 'CLOSED' : 'OPENING';
        let IsLock = k.IsLock;

        const html = `
                        <div class="col-sm-6 col-lg-3">
                            <div class="card">
                            <div class="card-status bg-primary"></div>
                            <div id="${GUID}" class="card-body text-left PeridGUID">
                                <div id="${PeriodID}" class="card-category"># ${i}</div>
                                <ul class="list-unstyled leading-loose">
                                   <li id="${StoreID}"><b>Store Name: </b><h9>${StoreName}</h9>.</li>
                                   <li id="${WarehouseID}"><b>Warehouse Name : </b><h9>${WarehouseName}</h9>.</li>
                                   <li id="${DateStart}"><b>Date Start: </b><h9>${DateStart}</h9>.</li>
                                   <li id="${DateEnd}"><b>Date End: </b><h9>${DateEnd}</h9>.</li>
                                   <li id="${IsActive}"><b>IsActive: </b><h9>${IsActiveText}</h9>.</li>
                                </ul>
                            <div class="text-right mt-6">
                            <button style="width:80px;font-weight:bold" value="${IsLock}" class="btn btn-sm btn-primary Show">${IsLockText}</button>
                            </div>
                            </div>
                        </div>
                        `;
        const responsive = document.querySelector('#responsive');
        responsive.insertAdjacentHTML("beforeend", html);    
        i++;
    });
        
    $('#responsive').show();
    $('#Loader').hide();
    $('html, body').scrollTop(($('.card-header').offset().top) + 90);
}

const IsTrueOrFalse = (isActive) => {
    if (isActive) {
        return 'YES';
    }
    else {
        return 'NO';
    }
}

const IsNullDate = (date) => {
    if (date == null || date == undefined || date == "") {
        return "";
    }
    else {
        return convertDate(date);
    }
}

const onClickForMobile = (items,lstWarehouse) => {
    const dateStart = document.getElementById('DateStart');
    const dateEnd = document.getElementById('DateEnd');
    const selectStore = document.getElementById('SelectStore');
    const selectWarehouse = document.getElementById('SelectWarehouse');
    const guid = document.getElementById('PeriodGUID');

    let buttons = document.getElementsByClassName('Show');
    let _guid = "";
    let _periodID = "";
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function () {
            for (let j = 1; j < items.length + 1; j++) {
                _periodID = document.getElementsByClassName('card-category')[i].id;
                let currentRow = buttons[i];
                let createClickHandler = function (row) {
                    selectForWarehouse(document.querySelectorAll('.list-unstyled')[i].querySelectorAll('li')[1].id, lstWarehouse);
                    guid.value = document.querySelectorAll('.PeridGUID')[i].id
                    selectStore.value = document.querySelectorAll('.list-unstyled')[i].querySelectorAll('li')[0].id;
                    selectWarehouse.value = document.querySelectorAll('.list-unstyled')[i].querySelectorAll('li')[1].id;
                    dateStart.value = document.querySelectorAll('.list-unstyled')[i].querySelectorAll('li')[2].id;
                    dateEnd.value = IsNullDate(document.querySelectorAll('.list-unstyled')[i].querySelectorAll('li')[3].id) == "" ? convertDate(new Date()) : IsNullDate(document.querySelectorAll('.list-unstyled')[i].querySelectorAll('li')[3].id);
                    checkPeriodDetailIsActive(lstPeriodDetails, _periodID, selectWarehouse.value);
                    selectWarehouse.setAttribute("disabled", "disabled");
                    selectStore.setAttribute("disabled", "disabled");
                    dateStart.setAttribute("disabled", "disabled");
                    dateEnd.setAttribute("disabled", "disabled");
                    document.getElementById('tblModalPeriodDetail').hidden = false;
                }
                currentRow.onclick = createClickHandler(currentRow);
                break;
            }
            //Set button Closing 
            document.getElementById('inputSearch').value = "";
            let isTrueSet = (buttons[i].value === 'true')
            const modalFooter = document.getElementById('modalFooter');
            modalFooter.innerHTML = "";
            if (!isTrueSet) {
                const btnEndPeriod = document.createElement('button');
                btnEndPeriod.className = "btn btn-primary";
                btnEndPeriod.id = "btnClosing";
                btnEndPeriod.innerText = "Closing Period";
                modalFooter.appendChild(btnEndPeriod);

                const btnClosingPeriod = document.getElementById('btnClosing');
                btnClosingPeriod.addEventListener('click', function () {
                    const _period = new Period(_periodID, guid.value, null, dateEnd.value, null, null, null, true);
                    getPeriodsDetail().then(res => {
                        let checkExist = res.filter(s => s.PeriodID == _periodID);
                        if (checkExist.length > 0) {
                            closingPeriod(_period).then(res => {
                                if (res.Status == 200) {
                                    const _newPeriod = new Period(-1, null, convertDate(new Date()), null, selectStore.value, selectWarehouse.value, true, false);
                                    openPeriod(_newPeriod).then(res => {
                                        let periodIDNew = res.Data.PeriodID;
                                        if (res.Status == 200) {
                                            //Check kì đầu tiên hay là kì tiếp theo kì cũ
                                            getPeriodsForCheck().then(res => {
                                                if (res.length > 0) {
                                                    let lstPeriod = res;
                                                    getPeriodsDetail().then(res => {
                                                        isFirstPeriodOrNextPeriod(lstPeriod, selectWarehouse.value, periodIDNew, _periodID, res);
                                                    });
                                                }
                                            })
                                        }
                                        else {
                                            Swal.fire({
                                                icon: 'error',
                                                title: res.Message,
                                                showConfirmButton: true,
                                                confirmButtonText: "Close",
                                            });
                                        }
                                    });
                                }
                                else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: res.Message,
                                        showConfirmButton: true,
                                        confirmButtonText: "Close",
                                    });
                                }
                                filterStoreSelect.value = selectStore.value;
                                document.getElementById('responsive').innerHTML = "";
                                $('#Loader').show();
                                reLoad(filterStoreSelect.value, filterWarehouseSelect.value);
                            });
                        }
                        else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Không thể đóng kỳ vì không có Item trong PeriodDetail vui lòng kiểm tra lại',
                                showConfirmButton: true,
                                confirmButtonText: "Close",
                            });
                        }
                    });
                    $('#PeriodModal').modal('hide');
                });
            }
            $('#PeriodModal').modal('toggle');
        });
    }

    btnSearch.addEventListener('click', function () {
        function filterSearch(query) {
            return lstStockFromAPI.filter(function (el) {
                regex = /^([a-zA-Z0-9 _-]+)$/; // Chỉ chấp nhận ký tự alphabet thường hoặc ký tự hoa
                // true nếu text chỉ chứa ký tự alphabet thường hoặc hoa, false trong trường hợp còn lại.
                if (regex.test(document.getElementById('inputSearch').value)) {
                    return xoa_dau(el.StockItemName).toLowerCase().indexOf(query.toLowerCase()) > -1;
                }
                else {
                    return (el.StockItemName).toLowerCase().indexOf(query.toLowerCase()) > -1;
                }
            })
        }

        let lstFitler = filterSearch(document.getElementById('inputSearch').value);
        let lstStockItemID = [];
        for (let i = 0; i < lstFitler.length; i++) {
            lstStockItemID.push(lstFitler[i].StockItemID);
        }
        showTableModal(_periodID, false, lstStockItemID);
    });
}

const checkPeriodDetailIsActive = (lstPeriodDetail, PeriodID) => {
    let lstUpdate = [];
    getStockItems().then(res => {
        let lstStock = res.Data;
        let lstPeriodDetailFilter = lstPeriodDetail.filter(s => s.PeriodID == PeriodID);
        for (let i = 0; i < lstPeriodDetailFilter.length; i++) {
            for (let j = 0; j < lstStock.length; j++) {
                if (lstStock[j].StockItemID == lstPeriodDetailFilter[i].StockItemID) {
                    if (lstStock[j].IsActive != lstPeriodDetailFilter[i].IsActive) {
                        lstPeriodDetailFilter[i].IsActive = lstStock[j].IsActive;
                        lstUpdate.push(lstPeriodDetailFilter[i]); 
                    }
                    break;
                }
            }
        }

        if (lstUpdate.length > 0) {
            updatePeriodDetail(lstUpdate).then(res => {
                showTableModal(PeriodID,true);
            });
        }
        else {
            showTableModal(PeriodID, true);
        }
    });   
}

const xoa_dau = (str) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
}

const getObjectUnits = (lstStockItem, lstPeriodDetail) => {
    //lstPeriodDetails đã filter theo PeriodID rồi
    let lstUnit = [];
    for (let i = 0; i < lstPeriodDetail.length; i++) {
        for (let j = 0; j < lstStockItem.length; j++) {
            if (lstPeriodDetail[i].StockItemID == lstStockItem[j].StockItemID) {
                let objPrice = {};
                objPrice.StockItemID = lstStockItem[j].StockItemID;
                objPrice.UnitStart = lstPeriodDetail[i].UnitStart;
                objPrice.UnitEnd = lstPeriodDetail[i].UnitEnd;
                objPrice.UnitPerCont = lstStockItem[j].UnitPerCont;
                objPrice.ContPerPack = lstStockItem[j].ContPerPack;
                objPrice.UnitDes = lstStockItem[j].UnitDes;
                objPrice.ContDes = lstStockItem[j].ContDes;
                objPrice.PackDes = lstStockItem[j].PackDes;
                lstUnit.push(objPrice); 
                break;
            } 
        }
    }
    return lstUnit;
}

const calCountPackUnitDes = (lstConstUnit, StockItemID) => {
    let array = [];
    let unit = lstConstUnit.find(s => s.StockItemID == StockItemID);
    let PackStart = costFormat(parseInt(unit.UnitStart / (unit.UnitPerCont * unit.ContPerPack)));
    let ContStart = costFormat(parseInt((unit.UnitStart - (PackStart * (unit.UnitPerCont * unit.ContPerPack))) / unit.UnitPerCont));
    let UnitStart = costFormat(unit.UnitStart - ((PackStart * (unit.UnitPerCont * unit.ContPerPack)) + (ContStart * (unit.UnitPerCont))));
    let PackEnd;
    let ContEnd;
    let UnitEnd;

    if (unit.UnitEnd != null) {
        PackEnd = costFormat(parseInt(unit.UnitEnd / (unit.UnitPerCont * unit.ContPerPack)));
        ContEnd = costFormat(parseInt((unit.UnitEnd - (PackEnd * (unit.UnitPerCont * unit.ContPerPack))) / unit.UnitPerCont));
        UnitEnd = costFormat(unit.UnitEnd - ((PackEnd * (unit.UnitPerCont * unit.ContPerPack)) + (ContEnd * (unit.UnitPerCont))));
    }
 
    let objStart = {};
    objStart.NameStart = PackStart;
    objStart.UnitStart = unit.PackDes;
    array.push(objStart);

    objStart = {};
    objStart.NameStart = ContStart;
    objStart.UnitStart = unit.ContDes;
    array.push(objStart);

    objStart = {};
    objStart.NameStart = UnitStart;
    objStart.UnitStart = unit.UnitDes;
    array.push(objStart);

    if (unit.UnitEnd != null) {
        objEnd = {};
        objEnd.NameStart = PackEnd;
        objEnd.UnitStart = unit.PackDes;
        array.push(objEnd);

        objEnd = {};
        objEnd.NameStart = ContEnd;
        objEnd.UnitStart = unit.ContDes;
        array.push(objEnd);

        objEnd = {};
        objEnd.NameStart = UnitEnd;
        objEnd.UnitStart = unit.UnitDes;
        array.push(objEnd);
    }
    return array;
}

const getListBySession = (lstPeriod, lstWarehouseID, typeGetList, lstStore, lstStoreID,lstWarehouse) => {
    if (typeGetList == 1) {
        let _lstPeriods = [];
        if (lstWarehouseID.length > 0) {
            for (let i = 0; i < lstWarehouseID.length; i++) {
                for (let j = 0; j < lstPeriod.length; j++) {
                    if (lstPeriod[j].WarehouseID == lstWarehouseID[i]) {
                        _lstPeriods.push(lstPeriod[j]);
                    }
                }
            }
        }
        return _lstPeriods;
    }
    else if (typeGetList == 2) {
        let _lstStores = [];
        if (lstStoreID.length > 0) {
            for (let i = 0; i < lstStoreID.length; i++) {
                for (let j = 0; j < lstStore.length; j++) {
                    if (lstStore[j].StoreID == lstStoreID[i]) {
                        _lstStores.push(lstStore[j]);
                    }
                }
            }
        }
        return _lstStores;
    }
    else if (typeGetList == 3) {
        let _lstWarehouse = [];
        if (lstWarehouseID.length > 0) {
            for (let i = 0; i < lstWarehouseID.length; i++) {
                for (let j = 0; j < lstWarehouse.length; j++) {
                    if (lstWarehouse[j].WarehouseID == lstWarehouseID[i]) {
                        _lstWarehouse.push(lstWarehouse[j]);
                    }
                }
            }
        }
        return _lstWarehouse;
    }
}

