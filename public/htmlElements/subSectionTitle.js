export class SubSectionTitle {
    constructor(html) {
        this.html = html ? html : '';
        this.domElement = null;

        this.init();
    }

    init() {
        this.domElement = document.createElement('div');
        this.domElement.classList.add('temp-sub-section-title');
        this.domElement.innerHTML = this.html;
    }

    addTitle(html) {
        this.html += html;
        this.domElement.innerHTML = this.html;
    }
}