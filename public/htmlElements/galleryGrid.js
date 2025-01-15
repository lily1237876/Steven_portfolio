import { ClickableImage } from "./clickableImage.js";
import { Video } from "./video.js";

export class GalleryGrid {
    constructor(srcArr, columnCount = 2) {
        this.srcArr = srcArr ? srcArr : [];
        this.columnCount = columnCount;
        this.domElement = null;

        this.init();
    }

    init() {
        this.domElement = document.createElement('div');
        this.domElement.classList.add('temp-grid-gallery');

        let gridTemplateColumnsStr = '';
        for (let i = 0; i < this.columnCount; i++) {
            gridTemplateColumnsStr += 'auto ';
        }
        this.domElement.style.gridTemplateColumns = gridTemplateColumnsStr;

        if (!this.srcArr || this.srcArr.length === 0) return;
        for (let src of this.srcArr) {
            this.addImageElement(src);
        }
    }

    #addImageElement(src) {
        let imageElement = new ClickableImage(src).domElement;
        // imageElement.style.width = `max(min(100%, ${100 / this.columnCount}vw), 100px)`;
        imageElement.style.width = `min(100%, ${100 / this.columnCount}vw)`;
        imageElement.style.maxHeight = `min(100%, ${100 / this.columnCount}vh)`;
        this.domElement.appendChild(imageElement);
    }

    addImageSrc(src) {
        this.srcArr.push(src);
        this.#addImageElement(src);
    }

    #addVideoElement(src) {
        let videoElement = new Video(src).domElement;
        // videoElement.style.width = `max(min(100%, ${100 / this.columnCount}vw), 100px)`;
        videoElement.style.width = `min(100%, ${100 / this.columnCount}vw)`;
        videoElement.style.maxHeight = `min(100%, ${100 / this.columnCount}vh)`;
        this.domElement.appendChild(videoElement);
    }

    addVideoSrc(src) {
        this.srcArr.push(src);
        this.#addVideoElement(src);
    }
}