function getParentIframeEl() {
    var allIframes = window.parent.parent.document.getElementsByTagName('iframe');
    for (i = 0; i < allIframes.length; i++) {
        if (allIframes[i] && allIframes[i].contentWindow === window.parent) {
            return allIframes[i];
        }
    }
}

function getIframePosition() {
    var parentIfrm = getParentIframeEl();
    if (parentIfrm) {
        var rect = parentIfrm.getBoundingClientRect();
        return rect;
    }

}

function getElementBoundingClientRect(selector) {
    var element = window.parent.document.querySelector(selector);
    if (element) {
        return element.getBoundingClientRect();
    }
}

function getIframePath() {
    return window.location.href;
}

function updateElementPosition(elementData) {
    var currentPath = getIframePath();
    if (window.top === window.parent || elementData.iframePath === currentPath) {
        var boundingRect = getElementBoundingClientRect(elementData.selector);
        var iframePosition = getIframePosition();
        if (boundingRect) {
            elementData.position = {
                top: boundingRect.top + (iframePosition && iframePosition.top || 0),
                left: boundingRect.left + (iframePosition && iframePosition.left || 0),
                width: boundingRect.width
            };
            elementData.identified = true;
        }
    }
    return elementData;
}

function sendMessageToParentFrame(toPost) {
    try {
        var letznavIframe = window.top.document.querySelector('#letznav-frame-player');
        if (letznavIframe && letznavIframe.contentWindow) {
            letznavIframe.contentWindow.postMessage(toPost, '*'); //send to letznav iframe
        }
    } catch (Ex) {
        console.info('**Error while sending message to post frame');
    }
}

function receiveForMessage() {
    window.addEventListener('message', function (request) {
        if (request.data.type === 'letznav_get_element_data') {
            var element = request.data.element.elem;
            var updatedElem = request.data.element;
            updatedElem.elem = updateElementPosition(element);
            sendMessageToParentFrame({
                type: 'letznav_updated_element_data',
                element: updatedElem,
                elementType: request.data.elementType
            })
        }
    }, false);
}

receiveForMessage();