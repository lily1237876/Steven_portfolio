import { ClickableImage } from "../htmlElements/clickableImage.js";
import { TempBackButton } from "../htmlElements/backButton.js";

// create an 'html template' file, that has a top 'go back' button and a top title
// when click a 3D object, we fade in the entire html div, animate the opacity, and transform translateY from -10px to 0
// when click the back button, we fade out the entire html div, animate in reverse

function createHTMLCb() {
    // todo Steve: add this when click on details
    //  note: if add this, then OrbitControl no longer receives pointer info, need to work on that
    let previewContainer = document.createElement('div');
    previewContainer.id = 'temp-container';
    document.body.appendChild(previewContainer);

    for (let i = 1; i <= 11; i++) {
        let img = new ClickableImage(`doras_firefly_${i}.PNG`).domElement;
        previewContainer.appendChild(img);
    }
}

window.onload = () => {
    createHTMLCb();
}