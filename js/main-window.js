function createBalloonNode() {
    var balloonNode = document.createElement('div');
    balloonNode.setAttribute('class', 'letznav-balloon-step');
    balloonNode.innerHTML = `
        <div class="letznav-step-heading"></div>
        <div class="letznav-step-description"></div>
        <button class="letznav-balloon-next-btn"> next </button>
    `;
    document.body.appendChild(balloonNode);
}

function getPlayerHtml() {
    var cssUrl = chrome.extension.getURL('css/letznav-frame.css');
    var jsUrl = chrome.extension.getURL('js/letznav-frame.js');
    var tetherUrl = chrome.extension.getURL('lib/tether.js');
    var cddddssUrl = chrome.extension.getURL('polyfills/polyfills.bundle.js');
    // <script type="text/javascript" src=${cddddssUrl}></script>



    var idxHtml = `
        <!DOCTYPE html>
        <html>
            <head> 
                <link rel="stylesheet" href=${cssUrl}> 
                <script type="text/javascript" src=${jsUrl}></script>
                <script type="text/javascript" src=${tetherUrl}></script>
                <script type="text/javascript" src=${cddddssUrl}></script>
            </head>
            <body>
                <div class="letznav-banner-message">letzNav Player</div>
                <button class="letznav-play-flow-row" data-flowid="1" onclick="playFlow(1)">play Flow 1 </button>
                <button class="letznav-play-flow-row" data-flowid="2" onclick="playFlow(2)">play Flow 2 </button>
                <button class="letznav-play-flow-row" data-flowid="2" onclick="playFlow(3)">play iframe flow </button>
                <button class="letznav-play-flow-row" data-flowid="2" onclick="playFlow(4)">SFC flow </button>
            </body>
        </html>
    `;
    return idxHtml;
}

function createPlayerPanel() {

    if (!document.querySelector('#letznav-frame-player')) {
        createBalloonNode();

        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', chrome.extension.getURL('js/window.vars.js'));
        window.top.document.head.appendChild(script);

        var ifm = document.createElement("iframe");
        ifm.setAttribute("src", "about:blank");
        ifm.setAttribute("id", "letznav-frame-player");
        ifm.setAttribute("allowTransparency", true);
        document.body.appendChild(ifm);

        var idxHtml = getPlayerHtml();
        var ifmDoc = ifm.contentWindow.document;
        ifmDoc.open();
        ifmDoc.write(idxHtml);
        ifmDoc.close();
    }

    // var cddddssUrl = chrome.extension.getURL('polyfills/polyfills.bundle.js');
    // var divnode = document.createElement('script');
    // divnode.setAttribute('src', cddddssUrl);
    // divnode.setAttribute('type', 'text/javascript')
    // window.document.head.appendChild(divnode);

}

// function getPrathyushaWindows() {
//     var result = [];
//     var stack = [window.top];
//     while (stack && stack.length > 0) {
//         var popWindow = stack.pop();
//         if (popWindow) {
//             result.push(popWindow);
//             try {
//                 var popWindowFrames = popWindow.document.getElementsByTagName('iframe');
//                 if (popWindowFrames && popWindowFrames.length) {
//                     for (let i = 0; i < popWindowFrames.length; i++) {
//                         if (popWindowFrames[i].contentWindow) {
//                             stack.push(popWindowFrames[i].contentWindow);
//                         }
//                     }
//                 }
//             } catch (ex) {
//                 console.info('**exception occured', ex);
//             }
//         }
//     }
//     return result;
// }



if (window.top === window) {
    createPlayerPanel();
    // setTimeout(function () {
    //     console.log(allWindows);
    // }, 5000);



    // setTimeout(function () {
    //     var allWindows = getPrathyushaWindows();
    //     console.log('**allwindowsprathyusha', allWindows);
    // }, 5000);


}