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
    var createdIframe = document.querySelector('#letznav-iframe-script');
    if (!createdIframe) {
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

console.info('**creating iframe', window.location.href);
createIframe();

window.addEventListener('message', function (request) {
    if (request.data.a === 'b') {
        console.log('****coming pr');
    }
}, false);