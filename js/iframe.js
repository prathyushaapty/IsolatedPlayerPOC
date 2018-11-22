function getElementBoundingClientRect(selector) {
    var element = document.querySelector(selector);
    if (element) {
        return element.getBoundingClientRect();
    }
}

function getIframePath() {
    return window.location.href;
}

function updateElementPosition(elementData) {
    var currentPath = getIframePath();
    if (window.top === window || elementData.iframePath === currentPath) {
        var boundingRect = getElementBoundingClientRect(elementData.selector);
        if (boundingRect) {
            elementData.position = {
                top: boundingRect.top,
                left: boundingRect.left,
                width: boundingRect.width
            };
            elementData.identified = true;
        }
    }
    return elementData;
}

function sendMessageToParentFrame(toPost) {
    try {
        var letznavIframe = document.querySelector('#letznav-frame-player');
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