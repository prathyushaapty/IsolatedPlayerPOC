// function getWindows() {
//     var result = [];
//     var stack = [{
//         idVal: null,
//         wi: window.top,
//         href: window.top.location.href
//     }];
//     while (stack && stack.length > 0) {
//         var popWindow = stack.pop();
//         if (popWindow && popWindow.wi) {
//             result.push(popWindow);
//             // if (!(popWindow.idVal === 'letznav-frame-player' || popWindow.idVal === 'letznav-iframe-script')) {
//             try {
//                 var popWindowFrames = popWindow.wi.document.getElementsByTagName('iframe');
//                 if (popWindowFrames && popWindowFrames.length) {
//                     for (let i = 0; i < popWindowFrames.length; i++) {
//                         var coWin = popWindowFrames[i].contentWindow;
//                         if (coWin) {



//                             console.log('&&&cw', coWin);

//                             stack.push({
//                                 idVal: popWindowFrames[i].id,
//                                 wi: coWin,
//                                 href: 'coWin.location.href'
//                             });
//                         }
//                     }
//                 }
//             } catch (ex) {
//                 console.info('exception occured', ex);
//             }
//             // }
//         }
//     }
//     return result;
// }

// function getWindows() {
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
//                             // console.log('&&ref', popWindowFrames[i].contentWindow.location.href);
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
        console.log(ex);
    }
}

window.addEventListener('message', function (request) {
    if (request.data.type === 'letznav_update_windows_property') {
        var letznavIframe2 = window.top.document.querySelector('#letznav-frame-player');
        if (letznavIframe2 && letznavIframe2.contentWindow) {
            var allWindows = [window.top];
            window.top.postMessage(request.data.postedMessage, "*");
            var allIfs = window.top.document.getElementsByTagName('iframe');
            for (i = 0; i < allIfs.length; i++) {
                // allWindows.push(allIfs[i].contentWindow);
                var toPosttt = request.data.postedMessage;
                toPosttt.pratposition = allIfs[i].getBoundingClientRect();
                allIfs[i].contentWindow.postMessage(toPosttt, "*");
                // console.info('**position', allIfs[i].contentWindow.)
            }
            // console.log('**all windows', allWindows);
            // letznavIframe2.contentWindow['letznav-all-windows'] = allWindows;
            // letznavIframe2.contentWindow.postMessage({
            //     type: 'letznav_all_windows_value',
            //     postedMessage: request.data.postedMessage
            // }, '*'); //send to letznav iframe
        }
    }

        if (request.data.type === 'letznav_set_element_node_value') {
            var stepId = request.data.stepId;
            var elementData = request.data.elementData;
            var iframePath = elementData.iframePath;
            var allIframes = document.getElementsByTagName('iframe');
            var elementNode;
            for (i = 0; i < allIframes.length; i++) {
                var hrefVal ;
                try {
                    hrefVal = allIframes[i].contentWindow.location.href;
                } catch(ex) {

                }
                if (i === 2) {
                    elementNode = allIframes[i].contentWindow.document.querySelector(elementData.selector);
                    break;
                }
            }
            setElemNode(stepId, elementNode);
        }
        // window.postMessage({
        //     type: 'letznav_all_windows_value',
        //     postedMessage: toPost,
        //     allWindows: allWindows
        // }, '*');
        // postedMessage: toPost
    
});