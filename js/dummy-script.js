setTimeout(function () {
    var allIframes = window.top.document.getElementsByTagName('iframe');
    console.info('**all iframes', allIframes);
    for (i = 0; i < allIframes.length; i++) {
        var iframeId = allIframes[i].id;
        if (iframeId === 'letznav-frame-player' || iframeId === 'letznav-iframe-script') {

        } else {
            try {
                console.info('**sending message');
                allIframes[i].contentWindow.postMessage({
                    'a': 'b'
                }, '*');
            } catch (ex) {
                console.info('exception occured', ex);
            }
        }
    }
}, 10000);