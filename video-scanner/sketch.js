let videoPlayer
let videoFileInput;
/* TODO list
Show playtime position - text
Add custom controls - Play/Pause
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

    videoFileInput = createFileInput(loadVideo);
    videoFileInput.position(0,0);
    videoFileInput.show();
}

function loadVideo(file) {
    console.log(file);
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

function draw() {
    background(100);
    fill(192);
    videoPlayer.draw();
}
