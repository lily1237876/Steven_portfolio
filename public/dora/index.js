import { TempBackButton } from "../htmlElements/backButton.js";
import { GalleryGrid } from "../htmlElements/galleryGrid.js";
import { Paragraph } from "../htmlElements/paragraph.js";
import { Video } from "../htmlElements/video.js";
import { Abstract } from "../htmlElements/abstract.js";
import { PageTitle } from "../htmlElements/pageTitle.js";
import { Quote } from "../htmlElements/quote.js";

function createHTMLCb() {

    let previewContainer = document.createElement('div');
    previewContainer.id = 'temp-container';
    document.body.appendChild(previewContainer);

    let backButton = new TempBackButton(previewContainer, true);

    // title
    let title = new PageTitle('Dora\'s Firefly');
    previewContainer.appendChild(title.domElement);

    // abstract
    let abstract = new Abstract();
    previewContainer.appendChild(abstract.domElement);
    abstract.addAbstractItem('Time <br> 2021-2022');
    abstract.addAbstractItem('Type <br> Game');
    abstract.addAbstractItem('Role <br> Game Developer (Unreal Engine 5) <br> Interactive Designer');

    // quote
    let quote = new Quote();
    previewContainer.appendChild(quote.domElement);
    quote.addQuote('\"How do we deal with past trauma?\"');

    let v0 = new Video(`dora.mp4`);
    previewContainer.appendChild(v0.domElement);

    let p1 = new Paragraph();
    previewContainer.appendChild(p1.domElement);
    p1.addHTMLToNewLine('Dora\'s Firefly is a story about loss & found of inner peace after trauma. Made in Unreal Engine 5 with Niagara particle system, animation system, and blueprints. All 3D objects modeled in Blender.');
    p1.addHTMLToNewLine('<a class=\'temp-link\' href=\'https://youtu.be/BdNWF7vcaNc\' target="_blank" rel="noopener noreferrer">Check out the full gameplay here.</a>');

    let g1 = new GalleryGrid();
    previewContainer.appendChild(g1.domElement);
    g1.addImageSrc(`doras_firefly_1.PNG`);
    g1.addImageSrc(`doras_firefly_2.PNG`);
    g1.addImageSrc(`doras_firefly_3.PNG`);
    g1.addImageSrc(`doras_firefly_4.PNG`);
    g1.addImageSrc(`doras_firefly_5.PNG`);
    g1.addImageSrc(`doras_firefly_6.PNG`);
    g1.addImageSrc(`doras_firefly_7.PNG`);
    g1.addImageSrc(`doras_firefly_8.PNG`);
    g1.addImageSrc(`doras_firefly_9.PNG`);
    g1.addImageSrc(`doras_firefly_10.PNG`);
    g1.addImageSrc(`doras_firefly_11.PNG`);
}

window.onload = () => {
    createHTMLCb();
}