// var window.top = window.top;

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

const dummyFlow = [{
        title: "step1",
        desc: "This is step1",
        elem: "#ppm_header_product"
    },
    {
        title: "step2",
        desc: "This is step2",
        elem: "#ppm_header_user"
    },
    {
        title: "step3",
        desc: "This is step3",
        elem: "#ppm_nav_app"
    }
];

var currIdx = 0;

function playFlow() {
    console.info("Playing flow");
    displayStep(currIdx);
}

function displayStep(idx) {
    console.info('displaying step', idx);
    var stepData = dummyFlow[idx];
    const elemToAttach = window.top.document.querySelector(stepData.elem);
    const elemRect = elemToAttach.getBoundingClientRect();
    var balloonElem = window.top.document.querySelector(".letznav-balloon-step");

    var balloonHeading = window.top.document.querySelector('.letznav-step-heading');
    balloonHeading.innerText = stepData.title;

    var balloonDesc = window.top.document.querySelector('.letznav-step-description');
    balloonDesc.innerText = stepData.desc;

    // var playerFrame = window.top.document.querySelector('#letznav-frame-player');
    // var playerFrameTop = playerFrame.getBoundingClientRect().top;
    balloonElem.style.left = (elemRect.left + 10) + 'px';
    balloonElem.style.top = (elemRect.top + 10) + 'px';
    currIdx = currIdx + 1;
}

function addListeners() {
    // var playFlowBtn = window.top.document.querySelector('.letznav-play-flow');
    // if (playFlowBtn) {
    //     console.info('In play flow add event ')
    //     playFlowBtn.addEventListener('click', () => {
    //         playFlow();
    //     });
    // }

    var balloonNextBtn = window.top.document.querySelector('.letznav-balloon-next-btn');
    if (balloonNextBtn) {
        console.info('**in bballon next btn evt lis');
        balloonNextBtn.addEventListener('click', () => {
            onNextClick();
        });
    }

}

function onNextClick() {
    displayStep(currIdx);
    console.info("clicked on next");
}

console.info('registering mut obs in main frame');
identifyDomChanges();
addListeners();