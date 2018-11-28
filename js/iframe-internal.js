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
        var isAlreadyPresent = existing.find(data => data.id === stepId);
        if (!isAlreadyPresent) {
            existing.push({
                id: stepId,
                elementNode: elementNode
            });
        }
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
    if ((elementData.iframePath === '' && window.top === window.parent) || elementData.iframePath === currentPath) {
        // if ()
        elementData.checked = true;
        var sourceElNode = getElement(elementData.selector);
        console.info( '&&&style',  sourceElNode.offsetParent === null);
        var boundingRect = getElementBoundingClientRect(sourceElNode);
        console.info('&&&bounding rect', boundingRect);
        var iframePosition = getIframePosition();
        if (boundingRect && boundingRect.top>=0 && boundingRect.left>=0) {
            setElemNode(stepId, sourceElNode);
            // elementData.elNode = sourceElNode;
            elementData.position = {
                top: boundingRect.top + (iframePosition && iframePosition.top || 0),
                left: boundingRect.left + (iframePosition && iframePosition.left || 0),
                width: boundingRect.width
            };
            elementData.identified = true;
        } else {
            elementData.identified = false;
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
console.info('**in internal iframe', window.location.href);