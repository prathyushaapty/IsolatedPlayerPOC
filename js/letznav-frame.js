function identifyDomChanges() {
    var observer = new MutationObserver(function (mutations) {
        console.info("**dom change occured");
        addAllBadges();
    });
    var config = {
        subtree: true,
        attributes: true,
        childList: true,
        characterData: true
    };
    observer.observe(window.top.document, config);
}

var flows = [{
        id: 1,
        steps: [{
                title: "flow1step1",
                desc: "This is flow1step1",
                elem: {
                    selector: '#ppm_header_product',
                    iframePath: '',
                    position: {
                        top: '',
                        left: '',
                        width: ''
                    }
                }
            },
            {
                title: "flow1step2",
                desc: "This is flow1step2",
                elem: {
                    selector: '#ppm_header_user',
                    iframePath: '',
                    position: {
                        top: '',
                        left: '',
                        width: ''
                    }
                }
            },
            {
                title: "flow1step3",
                desc: "This is flow1step3",
                elem: {
                    selector: '#ppm_nav_app',
                    iframePath: '',
                    position: {
                        top: '',
                        left: '',
                        width: ''
                    }
                }
            }
        ]
    },
    {
        id: 2,
        steps: [{
                title: "flow2step1",
                desc: "This is flow2step1",
                elem: {
                    selector: 'input[name="name"]',
                    iframePath: '',
                    position: {
                        top: '',
                        left: '',
                        width: ''
                    }
                }
            },
            {
                title: "flow2step2",
                desc: "This is flow2step2",
                elem: {
                    selector: 'textarea[name="description"]',
                    iframePath: '',
                    position: {
                        top: '',
                        left: '',
                        width: ''
                    }
                }
            },
            {
                title: "flow2step3",
                desc: "This is flow2step3",
                elem: {
                    selector: '.ppm_button',
                    iframePath: '',
                    position: {
                        top: '',
                        left: '',
                        width: ''
                    }
                }
            }
        ]
    }

];

var badges = [{
        id: 1,
        elem: '#ppm_header_product',
        hoverMessage: 'This is tooltip 1'
    },
    {
        id: 2,
        elem: '#ppm_header_user',
        hoverMessage: 'This is tooltip 2'
    }
]
var currIdx = 0;
var currentFlowId;

function playFlow(flowId) {
    currIdx = 0;
    currentFlowId = flowId;
    displayStep(currIdx);
}

function displayStep(idx) {
    var flowData = flows.find(flow => flow.id === currentFlowId);
    var stepData = flowData && flowData.steps[idx];
    var balloonElem = window.top.document.querySelector(".letznav-balloon-step");
    if (stepData) {
        var elemToAttach = window.top.document.querySelector(stepData.elem);
        if (elemToAttach) {
            var elemRect = elemToAttach.getBoundingClientRect();

            var balloonHeading = window.top.document.querySelector('.letznav-step-heading');
            balloonHeading.innerText = stepData.title;

            var balloonDesc = window.top.document.querySelector('.letznav-step-description');
            balloonDesc.innerText = stepData.desc;
            balloonElem.style.display = 'block';
            balloonElem.style.left = (elemRect.left + elemRect.width + 10) + 'px';
            balloonElem.style.top = (elemRect.top) + 'px';
            currIdx = currIdx + 1;
        }
    } else {
        balloonElem.style.display = 'none';
    }
}

function attachBadge(id, message, sourceElemLeft, sourceElemTop, sourceElemWidth) {
    var badgeNode = document.createElement('div');
    badgeNode.setAttribute('class', 'letznav-badge');
    badgeNode.setAttribute('id', `letznav-badge-added-${id}`);
    badgeNode.setAttribute('style', `left: ${sourceElemLeft+sourceElemWidth}px; top: ${sourceElemTop}px`);
    badgeNode.innerHTML = `
    <div class="letznav-badge-icon">  &nbsp; </div>
    <p class="letznav-badge-hover-message"> ${message} </p>
    `;
    window.top.document.body.appendChild(badgeNode);
}

function addAllBadges() {
    if (badges) {
        badges.forEach(badge => {
            var elemToAttach = window.top.document.querySelector(badge.elem);
            if (elemToAttach && !window.top.document.querySelector(`#letznav-badge-added-${badge.id}`)) {
                var elemRect = elemToAttach.getBoundingClientRect();
                attachBadge(badge.id, badge.hoverMessage, elemRect.left, elemRect.top, elemRect.width);
            }
        });
    }
    // for (var badge of badges) {
    // var elemToAttach = window.top.document.querySelector(badge.elem);
    // if (elemToAttach && !window.top.document.querySelector('letznav-badge-added-id')) {
    //     var elemRect = elemToAttach.getBoundingClientRect();
    //     attachBadge(badge.id, badge.hoverMessage, elemRect.left, elemRect.top, elemRect.width);
    // }
    // }
}

function addListeners() {
    var balloonNextBtn = window.top.document.querySelector('.letznav-balloon-next-btn');
    if (balloonNextBtn) {
        balloonNextBtn.addEventListener('click', () => {
            onNextClick();
        });
    }

}

function onNextClick() {
    displayStep(currIdx);
}

identifyDomChanges();
addListeners();
// setTimeout(function () {
//     addAllBadges();
// }, 1000);
// if (window.top.document.readyState === "complete") {

// }

function sendMessageToAllIFrames() {
    var iframeWindows = [];
    var iframeElems = window.top.document.getElementsByTagName('iframe');
    for (i = 0; i < iframeElems.length; i++) {
        if (iframeElems[i].contentWindow) {
            iframeWindows.push(iframeElems[i].contentWindow);
        }
    }
    toPost = {
        type: 'letznav_get_element_data',
        element: {}
    };
    if (iframeWindows.length > 0) {
        for (let i = iframeElems.length - 1; i >= 0; i--) { // tslint:disable-line:prefer-for-of
            try {
                if (iframeElems[i] && iframeElems[i].postMessage) { //to-do: restrict posting to letznav iframe
                    iframeElems[i].postMessage(toPost, '*');
                }
            } catch (err) {
                console.warn('Error posting message to iframe: ', err);
            }
        }
    }
}

function receiveForMessage() {
    //update global object if this is received
    window.addEventListener('message', request => {
        if (request.type === 'letznav_updated_element_data') {
            //update position of balloon and respective badge
        }
    });
}