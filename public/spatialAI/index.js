import { ClickableImage } from "../htmlElements/clickableImage.js";
import { TempBackButton } from "../htmlElements/backButton.js";
import { GalleryGrid } from "../htmlElements/galleryGrid.js";
import { Paragraph } from "../htmlElements/paragraph.js";
import { Video } from "../htmlElements/video.js";
import { SectionTitle } from "../htmlElements/sectionTitle.js";
import { Abstract } from "../htmlElements/abstract.js";
import { PageTitle } from "../htmlElements/pageTitle.js";
import { Quote } from "../htmlElements/quote.js";

function createHTMLCb() {

    let previewContainer = document.createElement('div');
    previewContainer.id = 'temp-container';
    document.body.appendChild(previewContainer);

    let backButton = new TempBackButton(previewContainer, true);

    // title
    let title = new PageTitle('Spatial AI');
    previewContainer.appendChild(title.domElement);

    // abstract
    let abstract = new Abstract();
    previewContainer.appendChild(abstract.domElement);
    abstract.addAbstractItem('Time <br> 2023-2024');
    abstract.addAbstractItem('Type <br> Professional');
    abstract.addAbstractItem('Role <br> Project Lead <br> AI Interface Designer <br> 3D Graphics Engineer');

    // quote
    let quote = new Quote();
    previewContainer.appendChild(quote.domElement);
    quote.addQuote('\"Communicate with digital twin with Spatial AI, textually and visually.\"');

    let v1 = new Video(`gs_chatbot_1.mp4`);
    previewContainer.appendChild(v1.domElement);


    let g1 = new GalleryGrid([], 1);
    previewContainer.appendChild(g1.domElement);
    g1.addImageSrc(`A4 - 18.jpg`);
    g1.addImageSrc(`A4 - 19.jpg`);
    g1.addImageSrc(`A4 - 20.jpg`);
    g1.addImageSrc(`A4 - 21.jpg`);
    g1.addImageSrc(`A4 - 22.jpg`);
    g1.addImageSrc(`A4 - 23.jpg`);
}

window.onload = () => {
    createHTMLCb();
}