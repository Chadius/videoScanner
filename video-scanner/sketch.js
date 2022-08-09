var videoPlayer;

/* TODO list
Add a button to load a video
Show playtime position - text
Add custom controls - Play/Pause
Add custom controls - Slow/Double speed
Show playtime position - draw a line
Show thumbnail when mouse hovers over position
 */

function preload() {
    videoPlayer = new VideoPlayer();
}

function setup() {
    // put setup code here
    createCanvas(1024, 900);
    videoPlayer.loadVideo(
        '../assets/video/watch-reimagined-cc-us-20150309_1920x1080h.mp4',
        () => { videoPlayer.positionAndPlayVideo(); }
    );
}

function draw() {
  // put drawing code here
    background(100);
}
