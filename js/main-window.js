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

    const scriptElement = window.document.createElement('script');
    scriptElement.setAttribute('src', chrome.extension.getURL('js/dummy-script.js'));
    scriptElement.setAttribute('type', 'text/javascript');
    window.document.head.appendChild(scriptElement);

    var iscreated = document.querySelector('#letznav-frame-player');
    if (!iscreated) {
        createBalloonNode();
        var tempDiv = document.createElement('div');
        var idxHtml = getPlayerHtml();
        // tempDiv.innerHTML = `<iframe src="data:text/html id="letznav-frame-player", 
        // <!DOCTYPE html>
        // <html>
        //     <head> 
        //         <link rel="stylesheet" href="css/letznav-frame.css"> 
        //         <script type="text/javascript" src="js/letznav-frame.js"></script>
        //         <script type="text/javascript" src="lib/tether.js"></script>
        //         <script type="text/javascript" src="polyfills/polyfills.bundle.js"></script>
        //     </head>
        //     <body>
                // <div class="letznav-banner-message">letzNav Player</div>
                // <button class="letznav-play-flow-row" data-flowid="1" onclick="playFlow(1)">play Flow 1 </button>
                // <button class="letznav-play-flow-row" data-flowid="2" onclick="playFlow(2)">play Flow 2 </button>
                // <button class="letznav-play-flow-row" data-flowid="2" onclick="playFlow(3)">play iframe flow </button>
                // <button class="letznav-play-flow-row" data-flowid="2" onclick="playFlow(4)">SFC flow </button>
        //     </body>
        // </html>
        // ></iframe>`;

        var cssUrl = chrome.extension.getURL('css/letznav-frame.css');
        var jsUrl = chrome.extension.getURL('js/letznav-frame.js');
        var tetherUrl = chrome.extension.getURL('lib/tether.js');
        var cddddssUrl = chrome.extension.getURL('polyfills/polyfills.bundle.js');

       var htmlToInsert =`<iframe id='letznav-frame-player' src="data:text/html, 
       <link rel='stylesheet' href=${cssUrl}> 
       <script type='text/javascript' src=${jsUrl}></script>
       <script type='text/javascript' src=${tetherUrl}></script>
       <script type='text/javascript' src=${cddddssUrl}></script>
        <div class='letznav-banner-message'>letzNav Player</div> 
        <button class='letznav-play-flow-row' data-flowid='1' onclick='playFlow(1)'>play Flow 1 </button>
        <button class='letznav-play-flow-row' data-flowid='1' onclick='playFlow(2)'>play Flow 2 </button>
        <button class='letznav-play-flow-row' data-flowid='1' onclick='playFlow(3)'>play iframe Flow  </button>
        <button class='letznav-play-flow-row' data-flowid='1' onclick='playFlow(4)'>SFC Flow 1 </button>
        "></iframe>`
        // tempDiv.
        // var ifm = document.createElement("iframe");
        // ifm.setAttribute("src", "about:blank");
        // ifm.setAttribute("id", "letznav-frame-player");
        // ifm.setAttribute("allowTransparency", true);
        document.body.insertAdjacentHTML('beforeend', htmlToInsert);

        // var ifm = document.querySelector('#letznav-frame-player');


        // var idxHtml = getPlayerHtml();
        // var ifmDoc = ifm.contentWindow.document;
        // ifmDoc.open();
        // ifmDoc.write(idxHtml);
        // ifmDoc.close();


    }


    // var cddddssUrl = chrome.extension.getURL('polyfills/polyfills.bundle.js');
    // var divnode = document.createElement('script');
    // divnode.setAttribute('src', cddddssUrl);
    // divnode.setAttribute('type', 'text/javascript')
    // window.document.head.appendChild(divnode);

}

if (window.top === window) {
    createPlayerPanel();



}

function getWindows() {
    var result = [];
    var stack = [window.top];
    while (stack && stack.length > 0) {
        var popWindow = stack.pop();
        if (popWindow) {
            result.push(popWindow);
            try {
                var popWindowFrames = popWindow.document.getElementsByTagName('iframe');
                if (popWindowFrames && popWindowFrames.length) {
                    for (let i = 0; i < popWindowFrames.length; i++) {
                        if (popWindowFrames[i].contentWindow) {
                            stack.push(popWindowFrames[i].contentWindow);
                        }
                    }
                }
            } catch (ex) {
                console.info('**exception occured', ex);
            }
        }
    }
    return result;
}

function sendMessageToAllIFrames(toPost) {
    var iframeWindows = getWindows();
    // var iframeElems = window.top.document.getElementsByTagName("iframe");
    // for (i = 0; i < iframeElems.length; i++) {
    //     if (iframeElems[i].contentWindow) {
    //         iframeWindows.push(iframeElems[i].contentWindow);
    //     }
    // }
    window.top.postMessage(toPost, "*");
    if (iframeWindows.length > 0) {
        console.info('**iframes', iframeWindows);
        for (let i = iframeWindows.length - 1; i >= 0; i--) {
            try {
                if (iframeWindows[i] && iframeWindows[i].postMessage) {
                    console.info('**sending message from main window to frame', iframeWindows[i].location.href);
                    //to-do: restrict posting to letznav iframe
                    iframeWindows[i].postMessage(toPost, "*");
                }
            } catch (err) {
                console.warn("Error posting message to iframe: ", err);
            }
        }
    }
}

// sendMessageToAllIFrames('abc');