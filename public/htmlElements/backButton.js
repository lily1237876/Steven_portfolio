export class TempBackButton {
    constructor(parent, isHomeButton = false) {
        this.parent = parent;
        this.isHomeButton = isHomeButton;
        this.domElement = null;

        this.init();
    }

    init() {
        this.domElement = document.createElement('div');
        this.domElement.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
        </svg>
        `;
        this.domElement.classList.add('temp-back-button');
        this.parent.appendChild(this.domElement);
        this.domElement.addEventListener('pointerdown', () => {
            if (this.isHomeButton) {
                let carouselCategories = window.localStorage.getItem('carouselCategories');
                let hashString = `#category=${carouselCategories}`;
                window.location.href = `../${hashString}`;
                return;
            }
            this.parent.remove();
        })
    }
}