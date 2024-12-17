export class Popup {
    constructor(text, duration) {
        this.text = text;
        this.duration = duration;
        this.domElement = null;

        this.init();
    }

    init() {
        this.domElement = document.createElement('div');
        document.body.appendChild(this.domElement);
        this.domElement.innerHTML = this.text;
        this.domElement.classList.add('temp-pop-up');
        this.domElement.classList.add('temp-pop-up-end');

        setTimeout(() => {
            this.domElement.classList.remove('temp-pop-up-end');
        }, 0);

        setTimeout(() => {
            this.domElement.classList.add('temp-pop-up-end');
        }, this.duration);
    }
}