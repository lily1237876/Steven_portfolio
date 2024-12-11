
export class Link {
    constructor(html, link) {
        this.html = html;
        this.link = link;
        this.domElement = null;

        this.init();
    }

    init() {
        this.domElement = document.createElement('a');
        this.domElement.classList.add('temp-link');
        this.domElement.innerHTML = this.html;
        this.domElement.href = this.link;
        this.domElement.referrerPolicy = 'no-referrer';
        this.domElement.target = '_blank';

        console.log(this.domElement);
    }
}