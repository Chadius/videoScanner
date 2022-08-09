class VideoPlayer {
    constructor() {
        this.src = null;
        this.currentlyPlayingVideo = null;
    }

    loadVideo(src, callbackFcn) {
        // Call this to load a video.
        this.src = src;
        this.currentlyPlayingVideo = createVideo(this.src, callbackFcn);
    }

    positionAndPlayVideo () {
        var videoDimensions = this.currentlyPlayingVideo.size();

        this.currentlyPlayingVideo.hide();
        this.currentlyPlayingVideo.volume(0);

        // Resize video so it maxes out at 720p
        this.currentlyPlayingVideo.size(AUTO, 720);

        // Unless it's wider than the display, then shrink to fit
        if (videoDimensions.width > width) {
            this.currentlyPlayingVideo.size(width, AUTO);
        }

        // Center video
        this.currentlyPlayingVideo.position(0, 0);
        var videoPosition = this.currentlyPlayingVideo.position();

        // Play the video
        this.currentlyPlayingVideo.show();
        this.currentlyPlayingVideo.play();
    }
};
