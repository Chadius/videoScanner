class VideoPlayer {
    constructor(params) {
        this.src = null;
        this.currentlyPlayingVideo = undefined;

        this.videoIsPlaying = false;
        this.videoHasEnded = false;

        this.messageHandler = params.messageHandler;
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
        this.videoIsPlaying = true;

        // Tell the progress bar to reset and change the duration
        this.messageHandler.publish(
            "videoPlayerChangedDuration",
            {
                duration: this.currentlyPlayingVideo.duration()
            }
        );
    }

    playButtonPressed() {
        //if the video is paused, resume
        if (!this.videoIsPlaying) {
            this.currentlyPlayingVideo.play();
            this.videoIsPlaying = true;

            // Tell the progress bar to unpause
            this.messageHandler.publish(
                "videoPlayerUnpaused",
            );
            return;
        }

        //if the video is playing, pause
        if (this.videoIsPlaying) {
            this.currentlyPlayingVideo.pause();
            this.videoIsPlaying = false;

            // Tell the progress bar to pause
            this.messageHandler.publish(
                "videoPlayerPaused",
                {
                    currentTime: this.currentlyPlayingVideo.time()
                }
            );
            return;
        }
    }

    draw() {
        // If video is not loaded, skip
        if (this.currentlyPlayingVideo === null) {
            return;
        }

        if (this.currentlyPlayingVideo) {
            this.messageHandler.publish(
                "videoPlayerUpdatedCurrentTime",
                {
                    currentTime: this.currentlyPlayingVideo.time()
                }
            );
        }
    }
};

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
  }

  setDurationAndReset(duration) {
      this.duration = duration;
      this.currentTime = 0;

      this.playPauseButton = createButton('Pause');
      this.playPauseButton.position(0, 790);
      this.playPauseButton.mousePressed(playButtonPressed);
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
          default:
              console.warn("Unknown channel: " + channel);
      }
  }
};
