export class Video {
    constructor(src) {
        this.src = src;
        this.domElement = null;

        this.init();
    }

    init() {
        this.domElement = document.createElement('video');
        this.domElement.classList.add('temp-video');
        this.domElement.classList.add('temp-video-full');
        this.domElement.autoplay = true;
        this.domElement.loop = true;
        this.domElement.muted = true;
        this.domElement.playsInline = true;
        this.domElement.controls = true;
        this.domElement.src = this.src;
    }
}