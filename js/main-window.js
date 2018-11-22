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


    var idxHtml = `
        <!DOCTYPE html>
        <html>
            <head> 
                <link rel="stylesheet" href=${cssUrl}> 
                <script type="text/javascript" src=${jsUrl}></script>
                <script type="text/javascript" src=${tetherUrl}></script>
            </head>
            <body>
                <div class="letznav-banner-message">letzNav Player</div>
                <button class="letznav-play-flow-row" data-flowid="1" onclick="playFlow(1)">play Flow 1 </button>
                <button class="letznav-play-flow-row" data-flowid="2" onclick="playFlow(2)">play Flow 2 </button>
                <button class="letznav-play-flow-row" data-flowid="2" onclick="playFlow(3)">play iframe flow </button>
            </body>
        </html>
    `;
    return idxHtml;
}

function createPlayerPanel() {
    createBalloonNode();

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

if (window.top === window) {
    createPlayerPanel();
}

