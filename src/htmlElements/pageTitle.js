export class PageTitle {
    constructor(title) {
        this.title = title ? title : '';
        this.domElement = null;

        this.init();
    }

    init() {
        this.domElement = document.createElement('div');
        this.domElement.classList.add('temp-title');
        this.domElement.innerHTML = this.title;
    }

    addTitle(title) {
        this.title = title;
        this.domElement.innerHTML = this.title;
    }
}