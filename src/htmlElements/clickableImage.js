import { TempBackButton } from "./backButton.js";

export class ClickableImage {
    constructor(imgPath) {
        this.imgPath = imgPath;
        this.domElement = null;

        this.init();
        this.setupEventListeners();
    }

    // make a div with blur background, and an img element centered, and then click elsewhere on the blured div, remove this div and the img element
    setupEventListeners() {
        this.domElement.addEventListener('pointerdown', () => {
            let tempDiv = document.createElement('div');
            tempDiv.classList.add('temp-container-popup');
            document.body.appendChild(tempDiv);

            tempDiv.addEventListener('pointerup', () => {
                tempDiv.remove();
            })

            tempDiv.addEventListener('wheel', (e) => { e.stopPropagation(); }) // doesn't seem to take effect

            let tempBackButton = new TempBackButton(tempDiv);


            let tempImg = document.createElement('img');
            tempImg.classList.add('temp-img-popup');
            tempImg.src = this.imgPath;
            tempDiv.appendChild(tempImg);

            tempImg.addEventListener('pointerup', (e) => { e.stopPropagation(); });
            tempImg.addEventListener('wheel', (e) => { e.stopPropagation(); }); // doesn't seem to take effect
        })
    }

    init() {
        this.domElement = document.createElement('img');
        this.domElement.src = this.imgPath;
        this.domElement.classList.add('temp-img');
    }
}