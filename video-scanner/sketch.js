let videoPlayer
let videoFileInput;
/* TODO list
Add custom controls - Slow/Double speed
Show playtime position - draw a line
Show thumbnail when mouse hovers over position

Hide/Show Video Button
 */

function preload() {
    videoPlayer = new VideoPlayer();
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

function playButtonPressed() {
    videoPlayer.playButtonPressed();
}

function draw() {
    background(100, 10, 90);
    videoPlayer.draw();
}
