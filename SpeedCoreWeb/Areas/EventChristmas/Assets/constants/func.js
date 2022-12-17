function setCookie(name, value) {
    var day = new Date();
    var exdays = 365*10;
    day.setTime(day.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + day.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function eraseCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function checkCookie(name) {
    var isCookie = getCookie(name);
    if (isCookie == null) {
        window.location.assign('/Admin/ClientGUID');
    }
    return true;

}

function createGUID() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function IsEmail(email) {
    var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!regex.test(email)) {
        return false;
    } else {
        return true;
    }
}

function isEmpty(el){
    return !$.trim(el);
}

function numberFormat(num) {
    Number.prototype.format = function (n, x) {
        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
        return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
    };
    return parseFloat(num).format();
};

function costFormat(num) {
    if(num == null || num == NaN || num == undefined)
    {
        num = 0;
    }
	num = parseFloat(num).toPrecision(12)
	num = Number(num);
    num = num.toFixed(3);
    num = parseFloat(num);
    num = num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    return num;
};

function costExcelFormat(num) {
	num = parseFloat(num).toPrecision(12)
	num = Number(num);
	num = num.toFixed(3);
	//num = Math.round(num * 1000) / 1000;
	num = parseFloat(num);
	
	return num;
};


function decimalFormat(num) {
    num = num.toFixed(decimalPlaces(num) > 2 ? 2 : decimalPlaces(num));
    return num;
};

function decimalPlaces(num) {
    var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) { return 0; }
    return Math.max(
         0,
         // Number of digits right of decimal point.
         (match[1] ? match[1].length : 0)
         // Adjust for scientific notation.
         - (match[2] ? +match[2] : 0));
}


function renderDayOfWeek(_id) {
    $('#selectStartOfWeek option[value='+new Date().getUTCDay()+']').attr('selected','selected');
    const data = [{value:1,label:"Monday"},{value:2,label:"Tuesday"},{value:3,label:"Wednesday"},{value:4,label:"Thursday"},{value:5,label:"Friday"},{value:6,label:"Saturday"},{value:0,label:"Sunday"}];
    $.each(data, function (i, el) {
        if(el.value == new Date().getUTCDay()){
            $(_id).append(
                '<option value='+el.value+' selected>'+el.label+'</option>'
                );
        }else{
            $(_id).append(
                    '<option value='+el.value+'>'+el.label+'</option>'
                    );
        }
    });
}

function removeZero(_number){
    _number = _number.replace(/^0+/, '');
    if(_number.startsWith('.')||_number.startsWith(','))
        _number = _number.replace(/^.||,/, '0.');
    return _number;
}

function removeComma(_number){
    _number = String(_number);
    _number = _number.replace(/\,/g, '');
    return _number;
}


function roundNumber(_number){
    if(!String(_number).endsWith('0') && _number > 10 && !_number < 100){
        _number = Number(_number.toString().charAt(0) + _number.toString().charAt(1).replace(_number.toString().charAt(1),'5'));
    }
    return _number
}

function getBase64Image(img) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    let MAX_WIDTH = 400;
    let MAX_HEIGHT = 400;
    let width = img.width;
    let height = img.height;

    if (width > height) {
        if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
        }
    } else {
        if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
        }
    }
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);
    let dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function resetPreviews(name, src, fname = '') {
    let input = $('input[name="' + name + '"]');
    let wrapper = input.closest('.dropify-wrapper');
    let preview = wrapper.find('.dropify-preview');
    let filename = wrapper.find('.dropify-filename-inner');
    let render = wrapper.find('.dropify-render').html('');

    input.val('').attr('title', fname);
    wrapper.removeClass('has-error').addClass('has-preview');
    filename.html(fname);

    render.append($('<img />').attr('src', src).css('max-height', input.data('height') || ''));
    preview.fadeIn();
}

const createAccessToken = () => {
    let exp = Math.round(new Date().getTime() / 1000 + 300).toString();
    let stringO = btoa('{"alg":"RS256"}');
    let stringT = btoa(
        '{"iss": "3MVG9aWdXtdHRrI3D9obQdrAEgSLMP5r3s1FLrG_94uQxbRFwBf1RH7pseVlO4p4M6T1UV_2kjD4EId7EadEG","sub": "wgs@crimsonworks.com.speedpos","aud": "https://test.salesforce.com", "exp": ' +
        exp +
        '}',
    );
    return stringO + '.' + stringT;
}