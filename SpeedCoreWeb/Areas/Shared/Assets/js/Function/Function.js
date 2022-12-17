function forgeRequestBody(body, type = "json") {
  if (type === "formData") {
    const formValues = body;
    const formData = new FormData();

    Object.keys(formValues).forEach(fieldKey => {
      if (Array.isArray(formValues[fieldKey]) && formValues[fieldKey][0] instanceof File) {
        formValues[fieldKey].forEach(file => {
          formData.append(fieldKey, file);
        });
      } else {
        formData.append(fieldKey, formValues[fieldKey]);
      }
    });

    return formData;
  } else {
    return JSON.stringify(body);
  }
}

async function fetchAPI(url, cookieGUID) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'ClientGUID': cookieGUID
    }
  });
  return await response.json();
}

async function pushAPI(url, cookieGUID, body, type = "json") {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'ClientGUID': cookieGUID
    },
    body: forgeRequestBody(body, type)
  });
  return await response.json();

}

async function putAPI(url, cookieGUID, body, type = "json") {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'ClientGUID': cookieGUID
    },
    body: forgeRequestBody(body, type)
  });
  return await response.json();

}

async function pushAPIImage(url, cookieGUID, body) {
  const response = await fetch(url, {
    method: 'POST',
    body: body
  });
  return await response.json();
}

function convertDate(dateISO) {
  // ISO-8601 formatted date returned from server
  let localDate = new Date(dateISO);
  let dateTimeFormat = moment(localDate).format('MM/DD/YYYY HH:mm');
  return dateTimeFormat;
}

function convertTime(dateISO) {
  let localDate = new Date(dateISO);
  let dateTimeFormat = moment(localDate).format('HH:mm');
  return dateTimeFormat;
}

function ShowToast(head, text, icon, stack, hideAfter = 4000) {
  $.toast({
    heading: head,
    text: text,
    icon: icon,
    loader: true, // Change it to false to disable loader
    loaderBg: '#215DBF',
    allowToastClose: true,
    showHideTransition: 'slide',
    stack: stack,
    hideAfter: hideAfter,
    position: 'bottom-right' // To change the background
  })
}

function CRU(isCreate, isDelete = true) {
  let html = "";
  if (isCreate) {
    html = `
            <button id="btn-add" type="submit" class="btn btn-primary">Add</button>
        `;
  } else {
    html = `
            <button id="btn-update" type="submit" class="btn btn-primary  mr-2">Update</button>     
            ${isDelete ? `
              <button id="btn-delete" type="submit" class="btn btn-error mr-2">Delete</button>
            ` : ""}
            <button class="btn btn-primary btn-cancel" style="background-color: transparent !important;color: black;border:1px solid #215DBF !important;" data-dismiss="modal">Cancel</button>
        `;
  }
  return html;
}

function datatablesLoadData(table, newData) {
  table.clear();
  table.rows.add(newData);

  // Render (keep pagination)
  table.draw(false);
}

/**
 * Reorder an array based on changes given by datatables event handler
 * Originally written by Luu Minh Hoang, for SPAY_AES
 * @param arr
 * @param objKey
 * @param triggerRowData
 * @param dtDiff
 * @param qualifyChecker
 * @param ignoreChecker
 * @returns {null|*[]}
 */
function reorderArrayByTable({ arr, objKey, triggerRowData = null, dtDiff = null, qualifyChecker = null, ignoreChecker = null }) {
  // If the only params are {arr, objKey} => Perform assign correct order values for arr[i][objKey]

  let newArr = []; // The result array
  let sortingArr = JSON.parse(JSON.stringify(arr)); // contains items to be sorted
  let skippedArr = []; // contains items that are skipped for sorting, will be added at the end of the final arr
  let tempArr = JSON.parse(JSON.stringify(arr)); // Processing array (update after every validating mechanism)
  let willContinueOperation = true;

  // NOTE: It is advised to use EITHER Qualify or Ignore... for now

  // Reorder based on dtDiff
  if (!!dtDiff) {
    dtDiff.forEach(d => {
      sortingArr[d.newPosition] = tempArr[d.oldPosition];
    });
  }
  tempArr = JSON.parse(JSON.stringify(sortingArr));

  // Qualify Mechanism
  if (!!qualifyChecker && !!triggerRowData) {
    for (let i = 0; i < tempArr.length; i++) {
      Object.keys(tempArr[i]).forEach(checkingKey => {
        if (qualifyChecker[checkingKey] != null && tempArr[i][checkingKey] !== qualifyChecker[checkingKey]) {
          // Invalid => Move from SortingArr to SkippedArr
          if (JSON.stringify(triggerRowData) === JSON.stringify(tempArr[i])) {
            // If TriggerRow is the one that got Skipped => CANCEL OPERATION
            willContinueOperation = false;
          }
          sortingArr = sortingArr.filter(o => JSON.stringify(o) !== JSON.stringify(tempArr[i])); // remove tempArr[i] from sortingArr
          skippedArr.push(tempArr[i]);
        }
      });
      if (!willContinueOperation) {
        return null;
      }
    }
  }
  tempArr = JSON.parse(JSON.stringify(sortingArr));
  // Ignore Mechanism (ignoreChecker: if object[key] has value == ignoreChecker => Skip sorting for it)
  if (!!ignoreChecker && !!triggerRowData) {
    for (let i = 0; i < tempArr.length; i++) {
      Object.keys(tempArr[i]).forEach(checkingKey => {
        if (qualifyChecker[checkingKey] != null && tempArr[i][checkingKey] === ignoreChecker[checkingKey]) {
          // Invalid => Move from SortingArr to SkippedArr
          if (JSON.stringify(triggerRowData) === JSON.stringify(tempArr[i][checkingKey])) {
            // If TriggerRow is the one that got Skipped => CANCEL OPERATION
            willContinueOperation = false;
          }
          sortingArr = sortingArr.filter(o => JSON.stringify(o) !== JSON.stringify(tempArr[i])); // remove tempArr[i] from sortingArr
          if (!skippedArr.includes(tempArr[i])) {
            skippedArr.push(tempArr[i]);
          }
        }
      });
      if (!willContinueOperation) {
        return null;
      }
    }
  }
  // Resetting objKey value for the sorting array
  for (let i = 0; i < sortingArr.length; i++) {
    sortingArr[i][objKey] = i;
  }
  // Sort clonedArr and add it to the result
  newArr = newArr.concat(sortingArr.sort((a, b) => (a[objKey] > b[objKey] ? 1 : -1)));
  // Add the skipped ones at the end
  newArr = newArr.concat(skippedArr);

  return newArr;
};

function setGlobalLoading(visible) {
  if (visible)
    $("#global-loader").show();
  else
    $("#global-loader").fadeOut();
}

function imageOnError() {
  return `this.onerror=null;this.src='/Areas/OrderX/Assets/images/icons/missing.png'`;
}

function generateNewGuid() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  ); 
}
function generateNewGuidNoDash() {
  return generateNewGuid().replaceAll("-", "");
}

const jsonDecompressArr = (arr) => {
  let result = [];
  arr.forEach(obj => {
    result.push(jsonDecompress(obj));
  });
  return result;
}
const jsonDecompress = (obj) => {
  let result = {};
  Object.keys(obj).forEach(objK => {
    let newValue = obj[objK];
    if (typeof(newValue) === "object") {
      if (Array.isArray(newValue)) {
        newValue = jsonDecompressArr(newValue);
      }
      else {
        newValue = jsonDecompress(newValue);
      }
    }
    result[jsonCompressDict[objK]] = newValue;
  });
  return result;
}

const formToState = (form, state) => {
  Object.keys(form).forEach(prop => {
    if (state[prop] !== undefined) {
      let value = null;
      //#region Try getting value
      // Pickr (Color)
      if (!!form[prop].getColor)
        value = form[prop].getColor().toHEXA().toString();
      // Dropfify (File Upload)
      else if (!!form[prop].data("dropify"))
        value = form[prop].data("dropify").file.object;
      // Boolean Switch
      else if (form[prop].val() === "on")
        value = form[prop].prop("checked");
      // Multiple Select
      else if (!!form[prop].val && !!form[prop].prop("multiple") && !Array.isArray(form[prop].val()))
        value = [ form[prop].val() ];
      // Text Input
      else if (!!form[prop].val)
        value = form[prop].val();
      //#endregion
      if (!!value !== value &&
          value !== "" &&
          !isNaN(value) &&
          !Array.isArray(value) &&
          form[prop].attr("type") !== "file"
      ) { // if input value is a number
        value = +value; // convert string to number, so cool
      }
      state[prop] = value;
    }
  });
};

const stateToForm = (state, form) => {
  Object.keys(form).forEach(prop => {
    if (state[prop] !== undefined) {
      //#region Try setting value
      // Pickr
      if (!!form[prop].setColor)
        form[prop].setColor(state[prop]);
      // Dropfify (File Upload)
      else if (!!form[prop].data("dropify")) {
        form[prop].data("dropify").settings.defaultFile = state[prop];
        form[prop].data("dropify").destroy();
        form[prop].data("dropify").init();
      }
      // Boolean Switch
      else if (form[prop].val() === "on")
        form[prop].prop("checked", state[prop])
      // Text Input
      else if (!!form[prop].val)
        form[prop].val(state[prop]);
      //#endregion
    }
  });
};

const generateGuid = (length = 32) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
  }
  return result; 
};

const subscribeToEvent = (event, func) => {
  event.push(func);
};

const publishEvent = async (event) => {
  await Promise.all(event.map(eventFunc => eventFunc()));
};

const base64Encode = (str) => {
  return window.btoa(unescape(encodeURIComponent( str )));}

const base64Decode = (str) => {
  return decodeURIComponent(escape(window.atob( str )));};

var LanguageCountry = `
[
    {
      "value": "US",
      "group": "U",
      "text": "United States"
    },
    {
      "value": "CN",
      "group": "C",
      "text": "China"
    },
    {
      "value": "KR",
      "group": "K",
      "text": "Korea"
    },
    {
      "value": "VN",
      "group": "V",
      "text": "Viet Nam"
    }
  ]
`;

const jsonCompressDict = {
  ac: "IsActive",
  cc: "ColorCode",
  clI: "ClientID",
  co: "Count",
  de: "Description",
  dl: "IsDelete",
  dn: "DisplayName",
  gp: "GrossPrice",
  icI: "ItemComboID",
  icO: "ItemCombo",
  iclI: "ItemComboLinkID",
  iclS: "ItemComboLinks",
  itI: "ItemID",
  itO: "Item",
  itn: "ItemName",
  ma: "Max",
  mgI: "ModifierGroupID",
  mgO: "ModifierGroup",
  mi: "Min",
  moI: "ModifierID",
  moL: "Modifiers",
  na: "Name",
  np: "NetPrice",
  osI: "OptionSetID",
  osS: "OptionSets",
  pt: "PriceType",
  re: "IsRequired",
  sc: "Schedule",
  scI: "SaleChannelID",
  sd: "SizeDown",
  seI: "SectionID",
  siI: "SaleItemID",
  sit: "SaleItemType",
  sm: "IsStackModifier",
  spI: "SalePriceID",
  su: "SizeUp",
  t: "Type",
  toiI: "TableOrderItemID",
  topI: "TableOrderPageID",
  tr1: "TaxRate1",
  tr2: "TaxRate2",
  tr3: "TaxRate3",
  tr4: "TaxRate4",
  tr5: "TaxRate5",
  tv1: "TaxValue1",
  tv2: "TaxValue2",
  tv3: "TaxValue3",
  tv4: "TaxValue4",
  tv5: "TaxValue5",
  up: "UnitPrice",
  vnI: "VenueID",
};