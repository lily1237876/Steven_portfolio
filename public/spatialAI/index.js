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
    abstract.addAbstractItem('Time <br> 2022-2024');
    abstract.addAbstractItem('Type <br> Professional');
    abstract.addAbstractItem('Role <br> Project Lead <br> Spatial Interaction Designer <br> 3D Graphics Engineer');

    // quote
    let quote = new Quote();
    previewContainer.appendChild(quote.domElement);
    quote.addQuote('\"Re-imagine traditional mouse cursors, in 3D space\"');

    let v1 = new Video(`gs_chatbot_1.mp4`);
    previewContainer.appendChild(v1.domElement);

    let s1 = new SectionTitle('Introduction & Challenge');
    previewContainer.appendChild(s1.domElement);
    let p1 = new Paragraph();
    previewContainer.appendChild(p1.domElement);
    p1.addHTMLToNewLine('Mouse cursor is an integral part in any interface --- it’s an extension of our physical hands and abstraction of our virtual identities. We do almost everything with a cursor --- select objects, press a button, navigate in a 3D scene, represent ourselves in a multi-user collaboration app, etc. However, it feels pretty unintuitive to use a 2D cursor in a 3D scene, because the cursor exists outside of the spatial context. There’s no easy way to “feel” the 3D space and objects with a 2D cursor. Moreover, in a multi-user session, users want to see each others’ presence. To address these questions, I built the spatial cursor --- a tool that allows intuitive spatial navigation and collaboration.');

    let s2 = new SectionTitle('Inspiration');
    previewContainer.appendChild(s2.domElement);
    let p2 = new Paragraph();
    previewContainer.appendChild(p2.domElement);
    p2.addHTMLToNewLine('In some AR apps, users need to interact with their surrounding physical space, such as placing an object on the floor or measuring the distance between 2 points. A recurring motif is a planar / circular indicator that adapts to the surface where the AR content shows up. Unlike a typical 2D cursor, where the arrow visually indicates the direction of selection, a 3D cursor directly hovers on the floor / scene, eliminating the need for an arrow-like design. Therefore, a circular design is perfect for such use case, due to its simplicity and non-directional nature.');

    let g1 = new GalleryGrid([], 3);
    previewContainer.appendChild(g1.domElement);
    g1.addImageSrc(`inspo_1.gif`);
    g1.addImageSrc(`inspo_2.gif`);
    g1.addVideoSrc(`inspo_3.mp4`);

    let s3 = new SectionTitle('Design');
    previewContainer.appendChild(s3.domElement);
    let p3 = new Paragraph();
    previewContainer.appendChild(p3.domElement);
    p3.addHTMLToNewLine('The spatial cursor is a double-layered circle object that travels in a 3D space, smoothly adjusting its orientation to align with mesh surfaces, allowing users to know the exact location and objects they’re hovering on. By reimagining the mouse cursor as a 3D element, users can <u><b>reach into the space and feel the object contours without physically touching them</u></b>. It runs on both AR and desktop platforms, and allows users in the same session to intuitively navigate and collaborate in 3D space.');
    let v3 = new Video(`final.mp4`);
    previewContainer.appendChild(v3.domElement);

    let s4 = new SectionTitle('Collaborate');
    previewContainer.appendChild(s4.domElement);

    let s5 = new SectionTitle('Easy to identify across multiple users');
    previewContainer.appendChild(s5.domElement);
    let p4 = new Paragraph();
    previewContainer.appendChild(p4.domElement);
    p4.addHTMLToNewLine('To identify different users in a 3D scene, the spatial cursor took inspiration from 2D collaboration tools, such as Figma and Miro.');

    let g2 = new GalleryGrid();
    previewContainer.appendChild(g2.domElement);
    g2.addImageSrc(`figma_reference.png`);
    g2.addImageSrc(`miro_reference.webp`);

    let p5 = new Paragraph();
    previewContainer.appendChild(p5.domElement);
    p5.addHTMLToNewLine('Each user is assigned a unique color for their cursor, same as their user profile color. The position of cursors are synced across all users in the session, making it easy to identify specific areas each user is working on.');
    let v4 = new Video(`user_colors.mp4`);
    previewContainer.appendChild(v4.domElement);

    let s6 = new SectionTitle('Call for attention');
    previewContainer.appendChild(s6.domElement);
    let p6 = new Paragraph();
    previewContainer.appendChild(p6.domElement);
    p6.addHTMLToNewLine('In a collaborative session, users might call for everyone’s attention when there is something worth taking a look. With a simple click / touch, they can trigger a laser beam, drawn from their profile to the cursor, attracting everyone’s attention to that spot. This design eliminates the need to verbally describe and instruct all users to said location. It is especially useful when navigating complex 3D environments in a factory setting.');
    let v5 = new Video(`sync_cursor.mp4`);
    previewContainer.appendChild(v5.domElement);

    let p7 = new Paragraph();
    previewContainer.appendChild(p7.domElement);
    p7.addHTMLToNewLine('👇My colleagues and I having too much fun playing with this feature...');
    let v6 = new Video(`multiple_avatar_pointers.mp4`);
    previewContainer.appendChild(v6.domElement);

    let s8 = new SectionTitle('Versatility');
    previewContainer.appendChild(s8.domElement);
    let p8 = new Paragraph();
    previewContainer.appendChild(p8.domElement);
    p8.addHTMLToNewLine('The spatial cursor is a multi-tool for spatial interactions. Inspired by various 2D cursor styles, the spatial cursor changes its looks to reflect changes in its function / environment.');
    let i1 = new ClickableImage('inspo_4.png');
    previewContainer.appendChild(i1.domElement);

    let s9 = new SectionTitle('Out of bound');
    previewContainer.appendChild(s9.domElement);
    let p9 = new Paragraph();
    previewContainer.appendChild(p9.domElement);
    p9.addHTMLToNewLine('👇When a cursor goes out of bound in the 3D environment, its bottom layer disappears. The top white circle changes to the user’s profile color, indicating this user’s status.');
    let v9 = new Video(`cursor_out_of_range.mp4`);
    previewContainer.appendChild(v9.domElement);

    let s10 = new SectionTitle('Smooth adapt to 3D surface');
    previewContainer.appendChild(s10.domElement);
    let p10 = new Paragraph();
    previewContainer.appendChild(p10.domElement);
    p10.addHTMLToNewLine('👇When traveling on 3D objects, instead of immediately changing / snapping to the surfaces, the cursor smoothly changes its direction to adapt to the normal direction of the surface / object. This provides a better visual experience for the users.');
    let v10 = new Video(`cursor_smooth.mp4`);
    previewContainer.appendChild(v10.domElement);

    let p10_2 = new Paragraph();
    previewContainer.appendChild(p10_2.domElement);
    p10_2.addHTMLToNewLine('To achieve this smoothing effect, I implemented a simple interval-based method. In the left picture, I defined an cursorDirections[] array holding two directions at max. Every 200 ms, the system deletes the old direction, checks current surface / object normal vector, and put in this new direction. In the right picture, the cursor interpolates between the two directions in the array, on every frame. This effectively makes the cursor gradually “adapt” to align with object surfaces.');
    let g10 = new GalleryGrid();
    previewContainer.appendChild(g10.domElement);
    g10.addImageSrc('smooth_code_1.png');
    g10.addImageSrc('smooth_code_2.png');

    let s11 = new SectionTitle('Change looks based on the spatial apps');
    previewContainer.appendChild(s11.domElement);
    let p11 = new Paragraph();
    previewContainer.appendChild(p11.domElement);
    p11.addHTMLToNewLine('👇There are several different spatial apps in the Vuforia Spatial Toolbox. Spatial cursor is able to change its looks based on what app is currently in use. For example, when opening the <a class=\'temp-link\' href=\'../spatialMeasure/index.html\' target="_blank" rel="noopener noreferrer">Spatial Measurement Tool</a>, the center of the cursor smoothly changes into a white cross, prompting the user to add a measure point at this location.');
    p11.addHTMLToNewLine('Morphing between center shapes is done with SDF functions. See <a class=\'temp-link\' href=\'https://www.shadertoy.com/view/DtjyzW\' target="_blank" rel="noopener noreferrer">ShaderToy link</a> for a demo.')
    let g11 = new GalleryGrid();
    previewContainer.appendChild(g11.domElement);
    g11.addVideoSrc('measure_cross.mp4');
    g11.addVideoSrc('shader_cross.mov');


    let p12 = new Paragraph();
    previewContainer.appendChild(p12.domElement);
    p12.addHTMLToNewLine('👇Similarly, when measuring an area / volume, a small circle appears near the starting point, indicating  the user to click and create a closed loop of the area / volume they want to measure.');
    p12.addHTMLToNewLine('See <a class=\'temp-link\' href=\'https://www.shadertoy.com/view/ml2cDR\' target="_blank" rel="noopener noreferrer">ShaderToy link</a> for a demo.')
    let g12 = new GalleryGrid();
    previewContainer.appendChild(g12.domElement);
    g12.addVideoSrc('measure_circle.mp4');
    g12.addVideoSrc('shader_circle.mov');

    let s13 = new SectionTitle('Click');
    previewContainer.appendChild(s13.domElement);
    let p13 = new Paragraph();
    previewContainer.appendChild(p13.domElement);
    p13.addHTMLToNewLine('👇When user clicks with the cursor, the center circle shows a “pulse” animation, providing a visual feedback to all users in the session.');
    let v13 = new Video(`pulse_click.mp4`);
    previewContainer.appendChild(v13.domElement);

    let s14 = new SectionTitle('Togetherness');
    previewContainer.appendChild(s14.domElement);
    let p14 = new Paragraph();
    previewContainer.appendChild(p14.domElement);
    p14.addHTMLToNewLine('👇My colleagues and I had fun doodling in a spatial session, on AR and desktop.');
    let i2 = new ClickableImage(`togetherness.png`);
    previewContainer.appendChild(i2.domElement);

    let s15 = new SectionTitle('Achievements');
    previewContainer.appendChild(s15.domElement);
    let p15 = new Paragraph();
    previewContainer.appendChild(p15.domElement);
    p15.addHTMLToNewLine('The spatial cursor was presented in ACM CHI 2024 as part of our research group project --- <a class=\'temp-link\' href=\'https://youtu.be/WoMku70HFiM?si=-RWTM3f_Uk-ctiVw\' target="_blank" rel="noopener noreferrer">The Popup Metaverse</a>.');
    let v15 = new Video(`ACM_CHI_2024.mp4`);
    previewContainer.appendChild(v15.domElement);
}

window.onload = () => {
    createHTMLCb();
}