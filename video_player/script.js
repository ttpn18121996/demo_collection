'use strict';

class VideoPlayer {
  constructor(options) {
    this.config = {
      target: '#video-player',
      ...options,
    };
    this.video = null;
    this.canvas = null;
    this.ctx = null;
    this.controls = null;
    this.isRendering = false;

    this.createVideo();
  }

  createVideo() {
    this.video = document.createElement('video');
    this.video.classList.add('video-player__video');

    if (!this.config?.src) {
      return;
    }

    this.video.src = this.config.src;
  }

  createPlayer() {
    this.canvas = document.createElement('canvas');
    this.canvas.classList.add('video-player__canvas');
    this.ctx = this.canvas.getContext('2d');

    this.video.addEventListener('loadeddata', () => {
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;
      this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    });

    this.canvas.addEventListener('click', () => this.toggle());

    const player = document.createElement('div');
    player.classList.add('video-player__wrapper');

    player.appendChild(this.canvas);
    player.appendChild(this.video);

    this.createControls();
    player.appendChild(this.controls);

    this.handleToggleControls(player);

    return player;
  }

  handleToggleControls(player) {
    let timeout;
    player.addEventListener('mousemove', () => {
      this.controls.classList.remove('hidden');
      if (timeout) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(() => {
        this.controls.classList.add('hidden');
      }, 3000)
    });
    player.addEventListener('mouseenter', () => {
      this.controls.classList.remove('hidden');
      if (timeout) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(() => {
        this.controls.classList.add('hidden');
      }, 3000)
    });
    player.addEventListener('mouseleave', () => {
      this.controls.classList.add('hidden');
      if (timeout) {
        clearTimeout(timeout)
      }
    });
  }

  createControls() {
    this.controls = document.createElement('div');
    this.controls.classList.add('video-player__controls');

    const progressbar = document.createElement('div');
    progressbar.classList.add('video-player__progressbar');

    const controlbar = document.createElement('div');
    controlbar.classList.add('video-player__controlbar');

    for (let i = 0; i < 2; i++) {
      const controlItems = document.createElement('div');
      controlItems.classList.add('video-player__controlbar-items');
      controlbar.appendChild(controlItems);
    }

    const btnPlay = document.createElement('div');
    btnPlay.classList.add('video-player__control-play');

    btnPlay.addEventListener('click', () => this.toggle());

    this.controls.appendChild(progressbar);
    this.controls.appendChild(btnPlay);
  }

  renderFrame() {
    if (!this.isRendering) {
      return;
    }

    if (!this.video.paused && !this.video.ended) {
      this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
      requestAnimationFrame(() => this.renderFrame());
    }
  }

  mount() {
    const target = document.querySelector(this.config.target);
    if (!target) {
      return;
    }

    target.appendChild(this.createPlayer());
  }

  toggle() {
    if (this.isRendering) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    if (!this.video) {
      return;
    }

    this.video.play();
    this.isRendering = true;
    this.controls.querySelector('.video-player__control-play').classList.add('paused');
    this.renderFrame();
  }

  pause() {
    if (!this.video) {
      return;
    }

    this.video.pause();
    this.isRendering = false;
    this.controls.querySelector('.video-player__control-play').classList.remove('paused');
  }
}
