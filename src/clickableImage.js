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
            tempDiv.classList.add('temp-container');
            document.body.appendChild(tempDiv);
            tempDiv.addEventListener('pointerdown', () => {
                tempDiv.remove();
            })

            let tempBackButton = new TempBackButton(tempDiv);


            let tempImg = document.createElement('img');
            tempImg.classList.add('temp-img');
            tempImg.src = this.imgPath;
            tempDiv.appendChild(tempImg);
            tempImg.addEventListener('pointerdown', (e) => {e.stopPropagation();});
        })
    }

    init() {
        this.domElement = document.createElement('img');
        this.domElement.src = this.imgPath;
        this.domElement.classList.add('detail-img');
    }
}