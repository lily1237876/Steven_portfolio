import { ClickableImage } from "../htmlElements/clickableImage.js";
import { TempBackButton } from "../htmlElements/backButton.js";
import { GalleryGrid } from "../htmlElements/galleryGrid.js";
import { Paragraph } from "../htmlElements/paragraph.js";
import { Video } from "../htmlElements/video.js";
import { SectionTitle } from "../htmlElements/sectionTitle.js";
import { SubSectionTitle } from "../htmlElements/subSectionTitle.js";
import { Abstract } from "../htmlElements/abstract.js";
import { PageTitle } from "../htmlElements/pageTitle.js";
import { Quote } from "../htmlElements/quote.js";

function createHTMLCb() {

    let previewContainer = document.createElement('div');
    previewContainer.id = 'temp-container';
    document.body.appendChild(previewContainer);

    let backButton = new TempBackButton(previewContainer, true);

    // title
    let title = new PageTitle('Interactive Cloth');
    previewContainer.appendChild(title.domElement);

    // abstract
    let abstract = new Abstract();
    previewContainer.appendChild(abstract.domElement);
    abstract.addAbstractItem('Time <br> 2022-2024');
    abstract.addAbstractItem('Type <br> Experiment');
    abstract.addAbstractItem('Role <br> Creative Developer <br> 3D Graphics & Shader');

    // quote
    let quote = new Quote();
    previewContainer.appendChild(quote.domElement);
    quote.addQuote('\"A series of experiments studying & exploring cloth simulation\"');

    let v0 = new Video(`cloth_hand.mp4`);
    previewContainer.appendChild(v0.domElement);
    let p0 = new Paragraph();
    previewContainer.appendChild(p0.domElement);
    p0.addHTMLToNewLine('<a class=\'temp-link\' href=\'https://include-steve-kx.github.io/A-hand-cloth-experience/\' target="_blank" rel="noopener noreferrer">Try it yourself</a> or <a class=\'temp-link\' href=\'https://github.com/include-steve-kx/A-hand-cloth-experience\' target="_blank" rel="noopener noreferrer">take a look at the code</a>.');

    let s1 = new SectionTitle('Introduction & Challenge');
    previewContainer.appendChild(s1.domElement);
    let p1 = new Paragraph();
    previewContainer.appendChild(p1.domElement);
    p1.addHTMLToNewLine('This project started as an initial research for my <a class=\'temp-link\' href=\'https://include-steve-kx.github.io/portfolio/spatialMeasure/index.html\' target="_blank" rel="noopener noreferrer">Spatial Measurement Tool</a>, where users can measure length, area, and volume of 3D objects, based a 3D scan of the space. Measuring length and area is fairly straightforward, but volume requires a little design thinking.');

    let p1_2 = new Paragraph();
    previewContainer.appendChild(p1_2.domElement);
    p1_2.addHTMLToNewLine('To compute the volume of an object, we have 3 methods: <br>');
    p1_2.addHTMLToNewLine('1. Just compute the volume as-is: (spoiler: it doesn’t work!) A photogrammetry scan often contains holes and irregular shapes --- not compatible with any closed-shape volume calculation algorithms, as they will give out negative results. <br>');
    p1_2.addHTMLToNewLine('2. Fill out the holes and use method 1:  Still doesn’t work. Hole-filling algorithms make heavy assumptions on whether part of the mesh should be counted towards its volume. These assumptions led to problems when filling holes on objects with weird shapes (eg: a chair, a cup, a ladder). There’s no easy way to tell the algorithm “please don’t fill in the gaps between the ladder”. Maybe in the future, when AI knows the semantic meaning of 3D objects, we can revisit this method.<br>');
    p1_2.addHTMLToNewLine('3. Wrap a cloth around the object, and compute the volume of the cloth: After eliminating the first 2 methods, this is the only way left. Although cannot produce the exact volume of an object, it gives a nice estimation. It’s a good tradeoff between compatibility (works with all 3D objects, whether they have holes or not), complexity (fairly easy to implement), and speed (fairly fast) <br>');

    let s2 = new SectionTitle('Design');
    previewContainer.appendChild(s2.domElement);
    let p2 = new Paragraph();
    previewContainer.appendChild(p2.domElement);
    p2.addHTMLToNewLine('The algorithm simulates a cloth influenced by several wind forces directed towards the center, gradually wrapping around the object of interest, and computes the volume of the cloth.')
    p2.addHTMLToNewLine('See some of the initial demos below.');

    let g2 = new GalleryGrid();
    previewContainer.appendChild(g2.domElement);
    g2.addVideoSrc('cube_volume.mp4');
    g2.addVideoSrc('sphere_volume.mp4');
    let g2_2 = new GalleryGrid();
    previewContainer.appendChild(g2_2.domElement);
    g2_2.addVideoSrc('duck_volume.mp4');
    g2_2.addVideoSrc('helmet_volume.mp4');

    let p2_2 = new Paragraph();
    previewContainer.appendChild(p2_2.domElement);
    p2_2.addHTMLToNewLine('👇I later ported this project to the <a class=\'temp-link\' href=\'https://include-steve-kx.github.io/portfolio/spatialMeasure/index.html\' target="_blank" rel="noopener noreferrer">Spatial Measurement Tool</a>:');
    let g2_3 = new GalleryGrid();
    previewContainer.appendChild(g2_3.domElement);
    g2_3.addVideoSrc('../spatialMeasure/volume.mp4');
    g2_3.addVideoSrc('../spatialMeasure/volume_2.mp4');

    let p2_3 = new Paragraph();
    previewContainer.appendChild(p2_3.domElement);
    p2_3.addHTMLToNewLine('👇Some snippets of this cloth simulation algorithm is shown below. The cloth is made from particles, each having its own position, velocity, acceleration, etc.');
    let g2_4 = new GalleryGrid();
    previewContainer.appendChild(g2_4.domElement);
    g2_4.addImageSrc('cloth_simulation_particle.png');
    g2_4.addImageSrc('cloth_simulation_particle_methods.png');

    let p2_4 = new Paragraph();
    previewContainer.appendChild(p2_4.domElement);
    p2_4.addHTMLToNewLine('During one simulation pass, each particle is affected by multiple forces: wind, collision with mesh, and spring force from each other. In the end, a Verlet Integration is computed for all particles. Verlet integration produces a more stable / consistent result than Euler integration.');
    let i2 = new ClickableImage('cloth_simulation_simulate_pass.png');
    previewContainer.appendChild(i2.domElement);

    let p2_5 = new Paragraph();
    previewContainer.appendChild(p2_5.domElement);
    p2_5.addHTMLToNewLine('At the end of the simulation, I computed the volume of the entire cloth by adding up individual triangles volumes.');
    let i2_2 = new ClickableImage('cloth_simulation_compute_volume.png');
    previewContainer.appendChild(i2_2.domElement);

    let s3 = new SectionTitle('Touch the cloth');
    previewContainer.appendChild(s3.domElement);
    let p3 = new Paragraph();
    previewContainer.appendChild(p3.domElement);
    p3.addHTMLToNewLine('A few weeks later, I revisited this project. I tried out Google MediaPipe’s hand tracking as an input to \“touch\” and interact with the cloth.')
    p3.addHTMLToNewLine('Again, <a class=\'temp-link\' href=\'https://include-steve-kx.github.io/A-hand-cloth-experience/\' target="_blank" rel="noopener noreferrer">try it yourself</a> or <a class=\'temp-link\' href=\'https://github.com/include-steve-kx/A-hand-cloth-experience\' target="_blank" rel="noopener noreferrer">take a look at the code</a>.');
    let v3 = new Video(`cloth_hand.mp4`);
    previewContainer.appendChild(v3.domElement);

    let s4 = new SectionTitle('GPU Cloth Simulation');
    previewContainer.appendChild(s4.domElement);
    let p4 = new Paragraph();
    previewContainer.appendChild(p4.domElement);
    p4.addHTMLToNewLine('For this website, I wanted to create an interactive cloth in a new way. It has to be fast and interactive --- running on the GPU. I have a lot of experiences in shaders, so this wasn’t too hard for me.');
    p4.addHTMLToNewLine('If you haven’t done so, <a class=\'temp-link\' href=\'https://include-steve-kx.github.io/portfolio/\' target="_blank" rel="noopener noreferrer">try it out on the home page</a>. Scroll to the "Interactive Cloth" project, and move your mouse🖱️ or finger👆 across the cloth to make ripples🌊.');
    let v4 = new Video(`cloth_gpu.mp4`);
    previewContainer.appendChild(v4.domElement);

    let p4_2 = new Paragraph();
    previewContainer.appendChild(p4_2.domElement);
    p4_2.addHTMLToNewLine('👇The GLSL shaders for this effect is shown here.');
    let g4 = new GalleryGrid();
    previewContainer.appendChild(g4.domElement);
    g4.addImageSrc('cloth_gpu_vertex_shader.png');
    g4.addImageSrc('cloth_gpu_fragment_shader.png');
}

window.onload = () => {
    createHTMLCb();
}