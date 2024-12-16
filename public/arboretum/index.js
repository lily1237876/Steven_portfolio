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
    let title = new PageTitle('Arboretum');
    previewContainer.appendChild(title.domElement);

    // abstract
    let abstract = new Abstract();
    previewContainer.appendChild(abstract.domElement);
    abstract.addAbstractItem('Time <br> 2021-2022');
    abstract.addAbstractItem('Type <br> Game');
    abstract.addAbstractItem('Role <br> Game Developer (Unreal Engine 5) <br> 3D Graphics & Shader Developer');

    // quote
    let quote = new Quote();
    previewContainer.appendChild(quote.domElement);
    quote.addQuote('\"A particle garden architectural visualization game made in Unreal Engine 5\"');

    let p1 = new Paragraph();
    previewContainer.appendChild(p1.domElement);
    p1.addHTMLToNewLine(`Players interact with the plants by touching them & generating a unique audio-visual map of the whole journey.`);

    let v1 = new Video(`arboretum.mp4`);
    previewContainer.appendChild(v1.domElement);

    let g1 = new GalleryGrid();
    previewContainer.appendChild(g1.domElement);
    g1.addImageSrc(`arboretum_6.png`);
    g1.addImageSrc(`arboretum_2.png`);
    g1.addImageSrc(`arboretum_3.png`);
    g1.addImageSrc(`arboretum_4.png`);
    g1.addImageSrc(`arboretum_5.png`);
    g1.addImageSrc(`arboretum_1.png`);

    let v2 = new Video(`trailer.mp4`);
    previewContainer.appendChild(v2.domElement);
}

window.onload = () => {
    createHTMLCb();
}