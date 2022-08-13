class VideoPlayer {
    constructor() {
        this.src = null;
        this.currentlyPlayingVideo = undefined;
        this.progressBar = undefined;
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

        this.progressBar = new ProgressBar(this.currentlyPlayingVideo.duration());
    }

    draw() {
        // If video is not loaded, skip
        if (this.currentlyPlayingVideo === null) {
            return;
        }

        if (this.progressBar) {
            this.progressBar.updateCurrentTime(
                this.currentlyPlayingVideo.time()
            );
            this.progressBar.draw();
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
 */

class ProgressBar {
  constructor(duration) {
      this.duration = duration;
      this.currentTime = 0;
  }

  updateCurrentTime(time) {
      this.currentTime = time;
  }

  draw() {
      this.drawTimeElapseBar();
      this.drawTimeElapseText();
  }

  drawTimeElapseBar() {
      push();
      fill(0, 0, 80);
      stroke(0, 0, 70);
      rect(80, 710, 902, 20);

      const barWidth = map(this.currentTime, 0, this.duration, 0, 900)
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
};
