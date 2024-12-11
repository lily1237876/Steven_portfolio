export class SectionTitle {
    constructor(html) {
        this.html = html ? html : '';
        this.domElement = null;

        this.init();
    }

    init() {
        this.domElement = document.createElement('div');
        this.domElement.classList.add('temp-section-title');
        this.domElement.innerHTML = this.html;
    }

    addTitle(html) {
        this.html += html;
        this.domElement.innerHTML = this.html;
    }
}