function createPlayerPanel() {
    var balloonNode = document.createElement('div');
    balloonNode.setAttribute('class', 'letznav-balloon-step');
    balloonNode.innerHTML = `
    <div class="letznav-balloon-step">
        <div class="letznav-step-heading"></div>
        <div class="letznav-step-description"></div>
        <button class="letznav-balloon-next-btn"> next </button>
    </div> 
    `;
    document.body.appendChild(balloonNode);

    var ifm = document.createElement("iframe");
    ifm.setAttribute("src", "about:blank");
    ifm.setAttribute("id", "letznav-frame-player");
    ifm.setAttribute("allowTransparency", true);
    document.body.appendChild(ifm);
    var cssUrl = chrome.extension.getURL('index.css');
    var jsUrl = chrome.extension.getURL('iframe.js');
    var idxHtml = `
    <!DOCTYPE html>
    <html>
        <head> 
            <link rel="stylesheet" href=${cssUrl}> 
            <script type="text/javascript" src=${jsUrl}></script>
        </head>
        <body>
            <div class="letznav-banner-message">letzNav Player</div>
            <button class="letznav-play-flow" onclick="playFlow()">play Flow </button>
        </body>
    </html>
`;


    var ifmDoc = ifm.contentWindow.document;
    ifmDoc.open();
    ifmDoc.write(idxHtml);
    ifmDoc.close();
}

if (window.top === window) {
    console.info('**creating player panel');
    createPlayerPanel();
}