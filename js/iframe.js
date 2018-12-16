function getIframeHtml() {
    var jsUrl = chrome.extension.getURL('js/iframe-internal.js');
    var ifmHtml = `
    <!DOCTYPE html>
    <html>
        <head> 
            <script type="text/javascript" src=${jsUrl}></script>
        </head>
        <body>
        </body>
    </html>
    `;
    return ifmHtml;
}

function createIframe() {
    if (!document.querySelector('#letznav-iframe-script')) {
        console.log('adding iframe in', window.location.href);
        var ifm = document.createElement('iframe');
        ifm.setAttribute("src", "about:blank");
        ifm.setAttribute("id", "letznav-iframe-script");
        ifm.setAttribute("allowTransparency", true);
        document.body.appendChild(ifm);
        // receiveForMessage();

        var ifmHtml = getIframeHtml();
        var ifmDoc = ifm.contentWindow.document;
        ifmDoc.open();
        ifmDoc.write(ifmHtml);
        ifmDoc.close();
    }
}

createIframe();

window.addEventListener("message", request => {
    if (request.data.type === "letznav_get_element_data") {
        var childIframe = document.querySelector('#letznav-iframe-script');
        var inputRequestData = request.data;
        inputRequestData.type = 'child_letznav_updated_element_data';
        childIframe.contentWindow.postMessage(inputRequestData, '*');
    }
    if (request.data.type === 'letznav_set_element_node_value_subiframe') {
        var href = window.location.href;
        var inputRequest = request.data;
        inputRequest.type = 'letznav_set_element_node_value';
        window.top.postMessage(inputRequest, '*');
    }
});

window.top.postMessage({
    test: 'abc',
    href: window.location.href
}, '*');