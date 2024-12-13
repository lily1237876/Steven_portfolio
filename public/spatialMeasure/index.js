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
    let title = new PageTitle('Spatial Measurement Tool');
    previewContainer.appendChild(title.domElement);

    // abstract
    let abstract = new Abstract();
    previewContainer.appendChild(abstract.domElement);
    abstract.addAbstractItem('Time <br> 2022-2024');
    abstract.addAbstractItem('Type <br> Professional');
    abstract.addAbstractItem('Role <br> Project Lead <br> Interaction Designer <br> 3D Graphics & Shader');

    // quote
    let quote = new Quote();
    previewContainer.appendChild(quote.domElement);
    quote.addQuote('\"How do we measure a space? How can we visualize spatial properties?\"');

    let v1 = new Video(`final.mp4`);
    previewContainer.appendChild(v1.domElement);

    let s1 = new SectionTitle('Introduction');
    previewContainer.appendChild(s1.domElement);
    let p1 = new Paragraph();
    previewContainer.appendChild(p1.domElement);
    p1.addHTMLToNewLine('<a class=\'temp-link\' href=\'https://spatialtoolbox.vuforia.com/\' target="_blank" rel="noopener noreferrer">Vuforia Spatial Toolbox</a> is a research platform I worked on at PTC Reality Lab. It allows users to scan an environment with LiDAR-enabled iPhone / iPad and perform spatial computing tasks on the generated meshes. I developed a spatial measurement app, aiming to make measuring objects around us (in everyday / research / factory settings) easily.');
    p1.addHTMLToNewLine('Throughout the development process, I added in more features on geospatial analysis. This app allows users to: <br><br> 1. make measurements: measure length, area, cloth-simulated volume of objects; <br><br> 2. calculate optimal path from point A to point B; <br><br> 3. visualize height / steepness map of the 3D environment using GLSL shaders; <br><br> All features can be used on AR & desktop platforms.');

    let i1 = new ClickableImage(`measure.png`);
    previewContainer.appendChild(i1.domElement);

    let s2 = new SectionTitle('Measure length & area');
    previewContainer.appendChild(s2.domElement);
    let p2 = new Paragraph();
    previewContainer.appendChild(p2.domElement);
    p2.addHTMLToNewLine('Of course it can measure length and area of 3D space --- just like the Apple Measure app. One extra thing it can do is syncing the measure results across all devices in the session.');
    p2.addHTMLToNewLine('The iPad (AR app, video on the left, green cursor) and desktop (desktop app, video on the right, purple cursor) is using the spatial measure app in the same session. Notice all the measures are synced across the two devices.');

    let g1 = new GalleryGrid();
    previewContainer.appendChild(g1.domElement);
    g1.addVideoSrc(`fully_synced_ipad.mp4`);
    g1.addVideoSrc(`fully_synced_computer.mp4`);

    let s3 = new SectionTitle('Measure volume --- cloth simulation');
    previewContainer.appendChild(s3.domElement);
    let p3 = new Paragraph();
    previewContainer.appendChild(p3.domElement);
    p3.addHTMLToNewLine('The app measures volume based on a 3D scan of the space. Rough scans often contains holes and irregular shapes. Neither direct volume computation nor hole-filling algorithms give accurate volume results, because these methods make assumptions on whether part of the mesh should be counted towards its volume.');
    p3.addHTMLToNewLine('On the contrary, cloth simulation is a good way to estimate the volume of an irregular shape, such as a chair or a robot arm.');

    let g2 = new GalleryGrid();
    previewContainer.appendChild(g2.domElement);
    g2.addVideoSrc(`volume.mp4`);
    g2.addVideoSrc(`volume_2.mp4`);

    let p4 = new Paragraph();
    previewContainer.appendChild(p4.domElement);
    p4.addHTMLToNewLine('I reused my interactive cloth project (上链接). The algorithm simulates a cloth influenced by several wind forces directed towards the center, gradually wrapping around the object of interest, and computes the volume of the cloth.');

    let v2 = new Video(`volume_prototype.mp4`);
    previewContainer.appendChild(v2.domElement);

    let s4 = new SectionTitle('Path Planning');
    previewContainer.appendChild(s4.domElement);
    let p5 = new Paragraph();
    previewContainer.appendChild(p5.domElement);
    p5.addHTMLToNewLine('Given the navmesh of the space, I used the A* algorithm to find the shortest path between 2 points.');
    let v3 = new Video(`path_finding_demo.mp4`);
    previewContainer.appendChild(v3.domElement);

    let p6 = new Paragraph();
    previewContainer.appendChild(p6.domElement);
    p6.addHTMLToNewLine('Something to look into in the future will be: 1. use Web Workers to put this calculation to another thread; 2. use WebGL / WebGPU shaders to compute the path on GPUs; 3. not only calculate path length on a 2D plane & add height information to compute 3D path length.');
    let v4 = new Video(`path_finding.mp4`);
    previewContainer.appendChild(v4.domElement);

    let s5 = new SectionTitle('Geospatial Visualization');
    previewContainer.appendChild(s5.domElement);
    let p7 = new Paragraph();
    previewContainer.appendChild(p7.domElement);
    p7.addHTMLToNewLine('Several GLSL shaders were implemented to visualize the height & steepness maps of 3D environment. In an agriculture / land planning / moon mission planning session, users can visualize features of the 3D environment they just scanned / imported.');
    let v5 = new Video(`map_visualization.mp4`);
    previewContainer.appendChild(v5.domElement);

    let s6 = new SectionTitle('Color mode');
    previewContainer.appendChild(s6.domElement);
    let p8 = new Paragraph();
    previewContainer.appendChild(p8.domElement);
    p8.addHTMLToNewLine('👇Visualize the actual colored rendering');
    let v6 = new Video(`map_visualization_color.mp4`);
    previewContainer.appendChild(v6.domElement);

    let s7 = new SectionTitle('Height mode');
    previewContainer.appendChild(s7.domElement);
    let p9 = new Paragraph();
    previewContainer.appendChild(p9.domElement);
    p9.addHTMLToNewLine('👇Visualize the height map of the 3D environment. Color ranges from purple (lowest) to red (highest). GLSL shader for this effect is shown below.');
    let v7 = new Video(`map_visualization_height.mp4`);
    previewContainer.appendChild(v7.domElement);
    let i2 = new ClickableImage('map_height_shader.png');
    previewContainer.appendChild(i2.domElement);

    let s8 = new SectionTitle('Steepness mode');
    previewContainer.appendChild(s8.domElement);
    let p10 = new Paragraph();
    previewContainer.appendChild(p10.domElement);
    p10.addHTMLToNewLine('👇Visualize the steepness distribution of the 3D space. Color ranges from purple (completely flat, 0 degrees to the ground) to red (completely vertical, 90 degrees to the ground).<br> One cool thing is that users can adjust the slider to control how they want to display the steepness color. GLSL shader for this effect is shown below.');
    let v8 = new Video(`map_visualization_steepness.mp4`);
    previewContainer.appendChild(v8.domElement);
    let i3 = new ClickableImage('map_gradient_shader.png');
    previewContainer.appendChild(i3.domElement);

    let p11 = new Paragraph();
    previewContainer.appendChild(p11.domElement);
    p11.addHTMLToNewLine('In a geo-analysis / planning scenario, users might be interested in certain regions. For example, regions with steepness <= 45 degrees is walkable. They can toggle on “highlight regions” to have a glimpse of which part satisfies this requirement.');
    let v9 = new Video(`map_visualization_walkable.mp4`);
    previewContainer.appendChild(v9.domElement);

    let s9 = new SectionTitle('Collaboration with MIT Media Lab and NASA');
    previewContainer.appendChild(s9.domElement);
    let p12 = new Paragraph();
    previewContainer.appendChild(p12.domElement);
    p12.addHTMLToNewLine('During a collaboration between PTC Reality Lab, MIT Media Lab Space Exploration Initiative, and NASA, this app was used to perform measurements and geospatial analysis of a moon surface. Before a moon landing mission, geologists and astronauts can use this tool to measure the length, area, and volume of craters, visualize the height and steepness distribution of the moon\'s surface, and plan the optimal routes for astronauts and rovers, taking into account the steepness range the vehicle is able to operate within.');

    let v10 = new Video(`moon.mp4`);
    previewContainer.appendChild(v10.domElement);
    let g3 = new GalleryGrid();
    previewContainer.appendChild(g3.domElement);
    g3.addImageSrc(`moon_height_map.png`);
    g3.addImageSrc(`moon_steepness_map.png`);

    let p13 = new Paragraph();
    previewContainer.appendChild(p13.domElement);
    p13.addHTMLToNewLine('Me presenting this project during the MIT Media Lab Members Week😄');
    let g4 = new GalleryGrid();
    previewContainer.appendChild(g4.domElement);
    g4.addImageSrc(`poster.png`);
    g4.addImageSrc(`me.jpg`);

    let s10 = new SectionTitle('Achievements');
    previewContainer.appendChild(s10.domElement);
    let p14 = new Paragraph();
    previewContainer.appendChild(p14.domElement);
    p14.addHTMLToNewLine('The spatial measurement app was presented at <a class=\'temp-link\' href=\'https://youtu.be/iJ6mjTuNPnA?t=658\' target="_blank" rel="noopener noreferrer">Augmented World Expo 2024</a>.')
    p14.addHTMLToNewLine('It was also featured in MIT Media Lab Dava Newman’s Siggraph 2024 keynotes!');
    let i4 = new ClickableImage('dava_siggraph.jpg');
    previewContainer.appendChild(i4.domElement);
}

window.onload = () => {
    createHTMLCb();
}