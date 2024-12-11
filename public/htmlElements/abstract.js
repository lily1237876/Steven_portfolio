export class Abstract {
    constructor(absArr) {
        this.absArr = absArr ? absArr : [];
        this.domElement = null;

        this.init();
    }

    init() {
        this.domElement = document.createElement('div');
        this.domElement.classList.add('temp-abstract');
        if (this.absArr.length === 0) return;
        
        for (let abs of this.absArr) {
            let absElement = document.createElement('div');
            this.domElement.appendChild(absElement);
            absElement.innerHTML = abs;
            absElement.style.paddingRight = '10px';
            absElement.style.paddingBottom = '10px';
        }
    }

    addAbstractItem(abs) {
        this.absArr.push(abs);
        
        let absElement = document.createElement('div');
        this.domElement.appendChild(absElement);
        absElement.innerHTML = abs;
        absElement.style.paddingRight = '10px';
        absElement.style.paddingBottom = '10px';
    }
}