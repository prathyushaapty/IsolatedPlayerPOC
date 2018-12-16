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
    try {
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
    } catch (ex) {
        console.log('error occured', ex);
        throw new Error();
    }
}

function updateElementPosition(elementData, stepId, iframePosition) {
    var currentPath = getIframePath();
    console.info('***is main windoww top', window.top === window.parent);
    console.info('%%%%iframe path is', currentPath, 'parent', window.parent.location.href);
    if ((elementData.iframePath === '' && window.top === window.parent) || elementData.iframePath === currentPath) {
        console.log('inside');
        // if ()
        elementData.checked = true;
        var sourceElNode = getElement(elementData.selector);
        // console.info( '&&&style',  sourceElNode.offsetParent === null);
        var boundingRect = getElementBoundingClientRect(sourceElNode);
        console.info('&&&bounding rect', boundingRect);
        // var iframePosition = getIframePosition();
        if (boundingRect && boundingRect.top>=0 && boundingRect.left>=0) {
            try {
                setElemNode(stepId, sourceElNode);
            } catch (ex) {
                window.parent.postMessage({
                    type: "letznav_set_element_node_value_subiframe",
                    stepId: stepId,
                    elementData: elementData
                });
                // sendMessageToParentFrame({
                //     type: "letznav_set_element_node_value",
                //     stepId: stepId,
                //     elementData: elementData
                //   });

            }

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
        if (request.data.type === 'child_letznav_updated_element_data') {
            var element = request.data.element.elem;
            var stepId = request.data.element.stepId;
            var iframePosition = request.data.pratposition;
            var updatedElem = request.data.element;
            updatedElem.elem = updateElementPosition(element, stepId, iframePosition);
            sendMessageToParentFrame({
                type: 'letznav_updated_element_data',
                element: updatedElem,
                elementType: request.data.elementType
            })
        }
    }, false);
}

receiveForMessage();