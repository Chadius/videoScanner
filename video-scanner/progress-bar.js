/*
TODO for progress bar
- Lay start & stop for bar's duration below
- Scale bar to 10 minutes, cut off bar when remaining duration is under 10 minutes
- Add Scale button to change from 10 minutes to entire video
- When mouse hovers over the bar, show the current time at the mouse (.1 second accuracy)
- Show thumbnail when mouse hovers over (.1 second accuracy)
- Add +- 10 minute buttons
- Click on the bar to move the video to that point
-- Clicking on this pauses the video
- Add 10th of a second minibar when the user clicks on a point
-- Should be +- 5 seconds?
- Playback speed buttons: Double speed, put next to Pause?
 */

const fullTimeElapseBarLength = 900;

class ProgressBar {
    constructor(params) {
        this.duration = undefined;
        this.currentTime = 0;

        this.messageHandler = params.messageHandler;
        this.messageHandler.subscribe("videoPlayerChangedDuration", this);
        this.messageHandler.subscribe("videoPlayerUnpaused", this);
        this.messageHandler.subscribe("videoPlayerPaused", this);
        this.messageHandler.subscribe("videoPlayerUpdatedCurrentTime", this);
        this.messageHandler.subscribe("doubleSpeedVideoToggled", this);
    }

    setDurationAndReset(duration) {
        this.duration = duration;
        this.currentTime = 0;
        this.playbackSpeed = 1;

        this.playPauseButton = createButton('Pause');
        this.playPauseButton.position(0, 790);
        // TODO make object level function instead of global
        this.playPauseButton.mousePressed(playButtonPressed);

        this.doubleSpeedToggle = createButton('x2');
        this.doubleSpeedToggle.position(100, 790);
        this.doubleSpeedToggle.mousePressed(() => {this.userClickedDoubleSpeedVideoToggle(this.playbackSpeed)});
    }

    updateCurrentTime(time) {
        this.currentTime = time;
    }

    draw() {
        if (this.duration === undefined) {
            return;
        }

        this.drawTimeElapseBar();
        this.drawTimeElapseText();
    }

    getTimeElapseBarWidth() {
        const durationOfInterval = 600;
        const currentInterval = int(this.currentTime / durationOfInterval);
        const startOfInterval = currentInterval * durationOfInterval;
        const timeRemaining = this.duration - startOfInterval;

        if (timeRemaining >= durationOfInterval) {
            return fullTimeElapseBarLength;
        }
        return map(timeRemaining, 0, durationOfInterval, 0, fullTimeElapseBarLength);
    }

    getCurrentTimeBarWidth() {
        const durationOfInterval = 600;
        const currentInterval = int(this.currentTime / durationOfInterval);
        const startOfInterval = currentInterval * durationOfInterval;
        const timeRemaining = this.currentTime - startOfInterval;

        return map(timeRemaining, 0, durationOfInterval, 0, fullTimeElapseBarLength);
    }

    drawTimeElapseBar() {
        push();
        fill(0, 0, 80);
        stroke(0, 0, 70);
        rect(80, 710, this.getTimeElapseBarWidth() + 2, 20);
        const barWidth = this.getCurrentTimeBarWidth();
        fill(0, 0, 50);
        noStroke();
        rect(81, 711, barWidth, 18);

        pop();
    }

    drawTimeElapseText() {
        push();
        fill(180, 5, 5);
        const durationIsOverOneHour = this.duration > 3600;

        let currentTimeElapsed = this.formatTime(this.currentTime, !durationIsOverOneHour);
        text(currentTimeElapsed, 80, 750);
        let playDuration = this.formatTime(this.duration, !durationIsOverOneHour);
        text(playDuration, 150, 770);
        pop();
    }

    formatTime(secondsElapsed, omitHourIfLessThanOneHour) {
        const hours = (Math.trunc(secondsElapsed  / 3600) + "").padStart(2, "0");
        const minutes = (Math.trunc((secondsElapsed / 60) % 60) + "").padStart(2, "0");
        const seconds = (Math.trunc(secondsElapsed % 60) + "").padStart(2, "0");
        const tenths = ((secondsElapsed % 1 ).toFixed(1) + "").substring(2);

        if (omitHourIfLessThanOneHour && (secondsElapsed < 3600)) {
            return minutes + ":" + seconds + "." + tenths;
        }

        return hours + ":" + minutes + ":" + seconds + "." + tenths;
    }

    pausedVideo(isPaused) {
        if (isPaused) {
            this.playPauseButton.html("Play");
            return;
        }
        this.playPauseButton.html("Pause");
    }

    userClickedDoubleSpeedVideoToggle() {
        if (this.playbackSpeed === 1) {
            this.playbackSpeed = 2;
        } else {
            this.playbackSpeed = 1;
        }
        this.messageHandler.publish("doubleSpeedVideoToggled", {
            desiredPlaybackSpeed: this.playbackSpeed,
        });
    }

    toggleDoubleSpeedButton(desiredPlaybackSpeed) {
        if (desiredPlaybackSpeed === 1) {
            this.doubleSpeedToggle.html("x2");
        } else {
            this.doubleSpeedToggle.html("x1");
        }
    }

    async receiveMessage(channel_message) {
        const { channel, message } = channel_message;
        switch (channel) {
            case "videoPlayerChangedDuration":
                this.setDurationAndReset(message.duration);
                break;
            case "videoPlayerUnpaused":
                this.pausedVideo(false);
                break;
            case "videoPlayerPaused":
                this.updateCurrentTime(message.currentTime);
                this.pausedVideo(true);
                break;
            case "videoPlayerUpdatedCurrentTime":
                this.updateCurrentTime(message.currentTime);
                break;
            case "doubleSpeedVideoToggled":
                this.toggleDoubleSpeedButton(message.desiredPlaybackSpeed);
                break;
            default:
                console.warn("Unknown channel: " + channel);
        }
    }
}
