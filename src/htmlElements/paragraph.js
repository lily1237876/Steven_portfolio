export class Paragraph {
    constructor(html) {
        this.html = html ? html : '';
        this.domElement = null;

        this.init();
    }

    init() {
        this.domElement = document.createElement('div');
        this.domElement.classList.add('temp-text');
        this.domElement.innerHTML = this.html;
    }

    addHTMLToNewLine(html) {
        if (this.html.length !== 0) {
            this.html += '<br>';
        }
        this.html += html;
        this.domElement.innerHTML = this.html;
    }
}