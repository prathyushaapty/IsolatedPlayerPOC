function identifyDomChanges() {
    var observer = new MutationObserver(function (mutations) {
        console.info("**dom change occured");
    });
    var config = {
        subtree: true,
        attributes: true,
        childList: true,
        characterData: true
    };
    observer.observe(window.top.document, config);
}

const flows = [{
        id: 1,
        steps: [{
                title: "flow1step1",
                desc: "This is flow1step1",
                elem: "#ppm_header_product"
            },
            {
                title: "flow1step2",
                desc: "This is flow1step2",
                elem: "#ppm_header_user"
            },
            {
                title: "flow1step3",
                desc: "This is flow1step3",
                elem: "#ppm_nav_app"
            }
        ]
    },
    {
        id: 2,
        steps: [{
                title: "flow2step1",
                desc: "This is flow2step1",
                elem: 'input[name="name"]'
            },
            {
                title: "flow2step2",
                desc: "This is flow2step2",
                elem: 'textarea[name="description"]'
            },
            {
                title: "flow2step3",
                desc: "This is flow2step3",
                elem: ".ppm_button"
            }
        ]
    }

];

const badges = [{
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
    const flowData = flows.find(flow => flow.id === currentFlowId);
    var stepData = flowData && flowData.steps[idx];
    var balloonElem = window.top.document.querySelector(".letznav-balloon-step");
    if (stepData) {
        const elemToAttach = window.top.document.querySelector(stepData.elem);
        if (elemToAttach) {
            const elemRect = elemToAttach.getBoundingClientRect();

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