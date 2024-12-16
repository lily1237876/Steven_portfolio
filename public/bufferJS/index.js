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
    let title = new PageTitle('buffer.js');
    previewContainer.appendChild(title.domElement);

    // abstract
    let abstract = new Abstract();
    previewContainer.appendChild(abstract.domElement);
    abstract.addAbstractItem('Time <br> 2023-2024');
    abstract.addAbstractItem('Type <br> Experiment');
    abstract.addAbstractItem('Role <br> Creative Developer <br> 2D / 3D Graphics');

    // quote
    let quote = new Quote();
    previewContainer.appendChild(quote.domElement);
    quote.addQuote('\"A library to generate ASCII motion graphics with a few lines of code\"');

    let v0 = new Video(`4d_cube_2.mp4`);
    previewContainer.appendChild(v0.domElement);

    let s1 = new SectionTitle('Introduction');
    previewContainer.appendChild(s1.domElement);
    let p1 = new Paragraph();
    previewContainer.appendChild(p1.domElement);
    p1.addHTMLToNewLine('I’m always fascinated by computer terminals and vintage game consoles. Driven by an urge to re-create such aesthetics, I did a series of experiments, and finally made <a class=\'temp-link\' href=\'https://github.com/include-steve-kx/buffer.js\' target="_blank" rel="noopener noreferrer">buffer.js</a> --- a tool that renders ASCII-style motion graphics with a few lines of code.');

    let s2 = new SectionTitle('Design');
    previewContainer.appendChild(s2.domElement);
    let p2 = new Paragraph();
    previewContainer.appendChild(p2.domElement);
    p2.addHTMLToNewLine('I designed a buffer-like system consisting of a 2D array of cells. By specifying the position, text, and color of the cell, one can easily create static or interactive graphics with it.');
    p2.addHTMLToNewLine('👇Here are some demos I made using this library.');

    let v2 = new Video('3d_cube.mp4');
    previewContainer.appendChild(v2.domElement);

    let s3 = new SectionTitle('Making a console-shooter game');
    previewContainer.appendChild(s3.domElement);
    let p3 = new Paragraph();
    previewContainer.appendChild(p3.domElement);
    p3.addHTMLToNewLine('Here’s a game I created using this library. Notice something cool? <b>You can even run it from the console!!!!!</b>');
    p3.addHTMLToNewLine('<a class=\'temp-link\' href=\'https://include-steve-kx.github.io/console-shooter/\' target="_blank" rel="noopener noreferrer">Try it yourself</a> or <a class=\'temp-link\' href=\'https://github.com/include-steve-kx/console-shooter\' target="_blank" rel="noopener noreferrer">take a look at the code</a>.');

    let g3 = new GalleryGrid();
    previewContainer.appendChild(g3.domElement);
    g3.addVideoSrc('console_shooter_window.mp4');
    g3.addVideoSrc('console_shooter_console.mp4');

    let p3_2 = new Paragraph();
    previewContainer.appendChild(p3_2.domElement);
    p3_2.addHTMLToNewLine('I take immense joy in creating my own tools to visualize ideas and solve problems. Simply watching pixels dance across the screen gives me the most satisfaction.');
}

window.onload = () => {
    createHTMLCb();
}