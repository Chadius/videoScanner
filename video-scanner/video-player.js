class VideoPlayer {
    constructor(params) {
        this.src = null;
        this.currentlyPlayingVideo = undefined;

        this.videoIsPlaying = false;
        this.videoHasEnded = false;

        this.messageHandler = params.messageHandler;
        this.messageHandler.subscribe("doubleSpeedVideoToggled", this);
        this.messageHandler.subscribe("playPauseButtonToggled", this);
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

        // Play the video
        this.currentlyPlayingVideo.show();
        this.currentlyPlayingVideo.play();
        this.videoIsPlaying = true;

        // Tell the progress bar to reset and change the duration
        this.messageHandler.publish(
            "videoPlayerChangedDuration",
            {
                duration: this.currentlyPlayingVideo.duration()
            }
        );
    }

    playButtonPressed(desiredPauseState) {
        //if the video is paused, resume
        if (desiredPauseState === "play") {
            this.currentlyPlayingVideo.play();
            this.videoIsPlaying = true;
            return;
        }

        //if the video is playing, pause
        if (desiredPauseState === "pause") {
            this.currentlyPlayingVideo.pause();
            this.videoIsPlaying = false;
        }
    }

    draw() {
        // If video is not loaded, skip
        if (this.currentlyPlayingVideo === null) {
            return;
        }

        if (this.currentlyPlayingVideo && this.videoIsPlaying) {
            this.messageHandler.publish(
                "videoPlayerUpdatedCurrentTime",
                {
                    currentTime: this.currentlyPlayingVideo.time()
                }
            );
        }
    }

    changePlaybackSpeed(desiredPlaybackSpeed) {
        this.currentlyPlayingVideo.speed(desiredPlaybackSpeed);
    }

    async receiveMessage(channel_message) {
        const { channel, message } = channel_message;
        switch (channel) {
            case "playPauseButtonToggled":
                this.playButtonPressed(message.desiredPauseState);
                break;
            case "doubleSpeedVideoToggled":
                this.changePlaybackSpeed(message.desiredPlaybackSpeed);
                break;
            default:
                console.warn("Unknown channel: " + channel);
        }
    }
}

