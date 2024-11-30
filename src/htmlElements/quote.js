export class Quote {
    constructor(quote) {
        this.quote = quote ? quote : '';
        this.domElement = null;

        this.init();
    }

    init() {
        this.domElement = document.createElement('div');
        this.domElement.classList.add('temp-quote');
        this.domElement.innerHTML = this.quote;
    }

    addQuote(quote) {
        this.quote = quote;
        this.domElement.innerHTML = this.quote;
    }
}