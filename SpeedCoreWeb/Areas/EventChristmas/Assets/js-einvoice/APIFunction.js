const GET = async (_url) => {
    let res = await $.get({
        url: _url,
        headers: {
            'ClientGUID': getCookie('ClientGUID'),
        },
    });
    return res
}

const POST = async (_url, _body) => {
    let res = await $.ajax({
        type: "POST",
        url: _url,
        data: _body,
        headers: {
            'ClientGUID': getCookie('ClientGUID'),
        }
    });
    return res
}

const PUT = async (_url, _body) => {
    let res = await $.ajax({
        type: "PUT",
        url: _url,
        data: _body,
        headers: {
            'ClientGUID': getCookie('ClientGUID'),
        }
    });
    return res
}
