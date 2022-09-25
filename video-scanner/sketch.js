let videoPlayer
let videoFileInput;
let progressBar;
let messageHandler;
/* TODO list
Hide/Show Video Button
 */

function preload() {
    messageHandler = new MessageHandler();
    videoPlayer = new VideoPlayer({
        messageHandler: messageHandler
    });
    progressBar = new ProgressBar({
        messageHandler: messageHandler
    });
}

function setup() {
    createCanvas(1024, 900);
    colorMode(HSB, 360, 100, 100);

    videoFileInput = createFileInput(loadVideo);
    videoFileInput.position(0,0);
    videoFileInput.show();
}

function loadVideo(file) {
    if (file.type === "video") {
        videoPlayer.loadVideo(
            file.data,
            () => {
                videoPlayer.positionAndPlayVideo();
                videoFileInput.position(0, 1000);
            }
        );
    }
}

// TODO Move function into Progress Bar
function playButtonPressed() {
    videoPlayer.playButtonPressed();
}

function draw() {
    background(100, 10, 90);
    videoPlayer.draw();
    progressBar.draw();
}
