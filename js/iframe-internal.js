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

function getElement(selector) {
    return window.parent.document.querySelector(selector);
}

function getElementBoundingClientRect(elemNode) {
    if (elemNode) {
        return elemNode.getBoundingClientRect();
    }
}

function getIframePath() {
    return window.location.href;
}

function setElemNode(stepId, elementNode) {
    if (window.top['letznav-elements-data']) {
        var existing = window.top['letznav-elements-data'];
        existing.push({
            id: stepId,
            elementNode: elementNode
        });
        window.top['letznav-elements-data'] = existing;

    } else {
        window.top['letznav-elements-data'] = [{
            id: stepId,
            elementNode: elementNode
        }];

    }
}

function updateElementPosition(elementData, stepId) {
    var currentPath = getIframePath();
    if (window.top === window.parent || elementData.iframePath === currentPath) {
        var sourceElNode = getElement(elementData.selector)
        var boundingRect = getElementBoundingClientRect(sourceElNode);
        var iframePosition = getIframePosition();
        if (boundingRect) {
            setElemNode(stepId, sourceElNode);
            // elementData.elNode = sourceElNode;
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
            var stepId = request.data.element.stepId;
            var updatedElem = request.data.element;
            updatedElem.elem = updateElementPosition(element, stepId);
            sendMessageToParentFrame({
                type: 'letznav_updated_element_data',
                element: updatedElem,
                elementType: request.data.elementType
            })
        }
    }, false);
}

receiveForMessage();