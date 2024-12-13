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
    let title = new PageTitle('Customized 3D Gaussian Splatting viewer');
    previewContainer.appendChild(title.domElement);

    // abstract
    let abstract = new Abstract();
    previewContainer.appendChild(abstract.domElement);
    abstract.addAbstractItem('Time <br> 2023-2024');
    abstract.addAbstractItem('Type <br> Professional');
    abstract.addAbstractItem('Role <br> Project Lead <br> 3D Graphics Engineer <br> WebGL and GLSL shader');

    // quote
    let quote = new Quote();
    previewContainer.appendChild(quote.domElement);
    quote.addQuote('\"Customized splat viewer with raycasting, segmentation labels, and multi-scene editing support\"');

    let v1 = new Video(`gs_viewer_final.mp4`);
    previewContainer.appendChild(v1.domElement);

    let s1 = new SectionTitle('Introduction & Challenge');
    previewContainer.appendChild(s1.domElement);
    let p1 = new Paragraph();
    previewContainer.appendChild(p1.domElement);
    p1.addHTMLToNewLine('Our spatial collaboration platform generates a 3D model of the space using photogrammetry. However, the visual fidelity is sometimes quite low --- holes, blurry edges, artifacts due to reflective surfaces, etc. Remote users on a desktop doesn’t get an accurate sense of the space they’re working in. To improve the reconstruction quality, 3D Gaussian Splatting is the best choice. Not only does it capture high visual fidelity of the original scene, but it also renders in real-time --- perfect for our platform!');
    p1.addHTMLToNewLine('We took the pictures taken during photogrammetry, trained the GS models, and adopted <a class=\'temp-link\' href=\'https://github.com/antimatter15/splat/tree/b2cf38cf4f29f705a55d8684cb18bc252c36b74b\' target="_blank" rel="noopener noreferrer">Kevin Kwok’s splat viewer</a> as our web viewer. However, one question remains: there’s no way to raycast against the splats in Kevin’s GS viewer (add bold type). This is a big deal because our entire spatial collaboration platform relies on the spatial cursor (add link), which NEEDS raycasting to navigate the scene, measure objects, and collaborate with other users.');
    p1.addHTMLToNewLine('So basically I spent the next 6 months, indulging in WebGL & shaders, and figured out how to raycast against the splats. Here’s my process:');

    let s2 = new SectionTitle('Adding raycast to Kevin’s splat viewer');
    previewContainer.appendChild(s2.domElement);
    
    let ss3 = new SubSectionTitle('Attempt 1: Transform Feedback');
    previewContainer.appendChild(ss3.domElement);
    let p3 = new Paragraph();
    previewContainer.appendChild(p3.domElement);
    p3.addHTMLToNewLine('My first idea was pretty simple. To make raycasting work, I just need the position of each splat. Transform feedback is a convenient way to directly get splat information from vertex shader. After getting all splat positions, I can sort them out and pick the closest one to the mouse cursor.');
    let i1 = new ClickableImage(`transform_feedback_2.png`);
    previewContainer.appendChild(i1.domElement);
    let p3_2 = new Paragraph();
    previewContainer.appendChild(p3_2.domElement);
    p3_2.addHTMLToNewLine('However, this is super slow --- running at ~15 FPS on my Macbook Pro (M1 Pro, 32 GB of Ram). The original splat viewer can easily run at ~120 FPS. I need better solutions.');

    let ss4 = new SubSectionTitle('Attempt 2: write splat positions to a FrameBuffer');
    previewContainer.appendChild(ss4.domElement);
    let p4 = new Paragraph();
    previewContainer.appendChild(p4.domElement);
    p4.addHTMLToNewLine('Transform Feedback failed because of 2 reasons:');
    p4.addHTMLToNewLine('1. hit bottleneck when sending information from GPU to CPU');
    p4.addHTMLToNewLine('2. too much post-processing (sorting a large array) on the CPU, to determine which splat is selected');
    p4.addHTMLToNewLine('I figured I should offload all the intensive calculations to GPU --- rendering all splat positions to an off-screen FrameBuffer texture. On every frame, I can just read the pixel (4 bytes) that’s closest to the mouse cursor. And voila --- we know the position of the splat that our mouse cursor intersects with!');
    p4.addHTMLToNewLine('The solution boosts the FPS to the 40-50 range. Still a long way to go, but huge improvements!');
    let v4 = new Video(`gs_shader_info.mp4`);
    previewContainer.appendChild(v4.domElement);
    let p4_2 = new Paragraph();
    previewContainer.appendChild(p4_2.domElement);
    p4_2.addHTMLToNewLine('Notice the spatial cursor raycasts against the splats and draw little red cubes. To really prove the point, I turned off the splat viewer, revealing a hole in the original scan. I enabled raycasting on the splats, while maintaining an acceptable frame rate.');
    let v4_2 = new Video(`gs_shader_info_drawing.mp4`);
    previewContainer.appendChild(v4_2.domElement);
    let p4_3 = new Paragraph();
    previewContainer.appendChild(p4_3.domElement);
    p4_3.addHTMLToNewLine('To calculate accurate mouse collision position with a splat, some simple but interesting math is involved. I came up with a method to figure out the collision position along both x and y axes of a splat. Here’s my diagram and the final shader.');
    let g4 = new GalleryGrid();
    previewContainer.appendChild(g4.domElement);
    g4.addImageSrc(`gs_shader_info_shader.png`);
    g4.addImageSrc(`gs_accurate_collision_note.jpg`);
    let p4_4 = new Paragraph();
    previewContainer.appendChild(p4_4.domElement);
    p4_4.addHTMLToNewLine('During the render loop, we first render all the splat position to an off-screen FrameBuffer. We can then read the pixel that is closest to the mouse cursor, and get the splat position we desire.');
    let i4 = new ClickableImage(`gs_shader_info_render.png`);
    previewContainer.appendChild(i4.domElement);

    let ss5 = new SubSectionTitle('Attempt 3: skipping frames');
    previewContainer.appendChild(ss5.domElement);
    let p5 = new Paragraph();
    previewContainer.appendChild(p5.domElement);
    p5.addHTMLToNewLine('While Attempt 2 results in a huge performance leap compared to the Attempt 1, accessing texture information on every frame is still pretty heavy on the CPU. To further increase the frame rate, I tried alternating renders --- instead of rendering to both the FrameBuffer and the screen on every frame, only render to one of them, and render to the other texture on the next frame.');
    p5.addHTMLToNewLine('The result is....well less than optimal. Although it has a much higher frame rate (80 ~ 90 FPS), I observed a choppy render, because it only renders to the screen once every 2 frames. Visually it’s almost the same as Attempt 2.');
    let v5 = new Video(`gs_skip_frames.mp4`);
    previewContainer.appendChild(v5.domElement);

    let ss6 = new SubSectionTitle('Attempt 4: compute splat position based on camera depth');
    previewContainer.appendChild(ss6.domElement);
    let p6 = new Paragraph();
    previewContainer.appendChild(p6.domElement);
    p6.addHTMLToNewLine('My previous methods have a subtle bug: when computing the position where mouse and splats intersect, the 2 code blocks below is inaccurate and will result in slight jitters of the cursor when moving across the scene. This is because offset1 & offset2 is inverse-proportional to the square of viewport --- a non-linear relationship. When the screen aspect ratio is extreme (far from 1:1), the jittering effect becomes pretty obvious and the raycasting is unusable.');
    let i6 = new ClickableImage(`gs_shader_bug_1.png`);
    previewContainer.appendChild(i6.domElement);
    let i6_2 = new ClickableImage(`gs_shader_bug_2.png`);
    previewContainer.appendChild(i6_2.domElement);
    let p6_2 = new Paragraph();
    previewContainer.appendChild(p6_2.domElement);
    p6_2.addHTMLToNewLine('I need to find a new way to compute raycast splat positions. One method I came up with is based on the camera. In the FrameBuffer pass, I render the camera space z position of all splats. In the render loop, I read the FrameBuffer on cursor position and get the z depth of the closest splat to the camera (I also changed the render order from back to front --- so that whichever splat I get is guaranteed to be the closest to the camera). Based on the current camera world position and the camera-space z depth of the splat, I can do some math and compute the world position of desired splat.');
    p6_2.addHTMLToNewLine('Below is my diagram and notes for computing splat raycast position, based on camera position & splat depth.');
    let g6 = new GalleryGrid([], 3);
    previewContainer.appendChild(g6.domElement);
    g6.addImageSrc(`gs_accurate_camera_note_1.jpg`);
    g6.addImageSrc(`gs_accurate_camera_note_2.jpg`);
    g6.addImageSrc(`gs_accurate_camera_note_3.jpg`);

    let p6_3 = new Paragraph();
    previewContainer.appendChild(p6_3.domElement);
    p6_3.addHTMLToNewLine('As shown in the video below, now the spatial cursor travels smoothly across the splat scene, free of jitters, regardless of the screen aspect ratio!');
    let v6 = new Video(`gs_accurate_raycast.mp4`);
    previewContainer.appendChild(v6.domElement);

    let ss7 = new SubSectionTitle('Final Attempt: taking advantage of user logic');
    previewContainer.appendChild(ss7.domElement);
    let p7 = new Paragraph();
    previewContainer.appendChild(p7.domElement);
    p7.addHTMLToNewLine('Did I mention subway is one of the best places to think about work? One day on the way home, this idea suddenly came to my mind: I don’t have to raycast all the time!!! (add bold) The spatial cursor needs to raycast only when the user is moving it. When the user is idle or orbiting around an object, their pivot point doesn’t change, nor does the spatial cursor.');
    p7.addHTMLToNewLine('This is quite a pleasant finding. It doesn’t involve any specific WebGL or shader optimization. Just taking advantage of the user logic. Very simple but effective.');
    p7.addHTMLToNewLine('Now when the user is idle or navigating in the space, they got a 80~90 FPS, pretty close to the original splat viewer! And when they move the mouse, it occasionally drops to ~50 FPS. Still acceptable. Notice we can still raycast against the scene --- drawing on the splats works pretty smooth.');
    let v7 = new Video(`gs_user_logic.mp4`);
    previewContainer.appendChild(v7.domElement);


    let s3 = new SectionTitle('Adding more features to the GS viewer');
    previewContainer.appendChild(s3.domElement);
    let p8 = new Paragraph();
    previewContainer.appendChild(p8.domElement);
    p8.addHTMLToNewLine('Now that I have a GS viewer that supports real-time raycasting, what more features can be added to it? One research I looked into was <a class=\'temp-link\' href=\'https://github.com/Jumpat/SegAnyGAussians\' target="_blank" rel="noopener noreferrer">Seg Any Gaussians</a>. After training a Gaussian Splatting model, it uses Meta’s <a class=\'temp-link\' href=\'https://segment-anything.com/\' target="_blank" rel="noopener noreferrer">Segment Anything Model</a> to generate object masks on all input images. The 2D masks are then re-projected onto 3D splats, essentially segmenting the splats based on their categories.');
    p8.addHTMLToNewLine('This is a pretty interesting research because it “bakes” category / segmentation information into the splats. After a small change in the splat viewer’s data structure, I can visualize clusters of splats that belong to the same object category.');
    let v8 = new Video(`gs_saga.mp4`);
    previewContainer.appendChild(v8.domElement);
    
    let p9 = new Paragraph();
    previewContainer.appendChild(p9.domElement);
    p9.addHTMLToNewLine('To add more spatial context / information to the system, I added a custom label feature --- users can select an object / cluster and input their own information.');
    let v9 = new Video(`gs_custom_labels.mp4`);
    previewContainer.appendChild(v9.domElement);

    let p10 = new Paragraph();
    previewContainer.appendChild(p10.domElement);
    p10.addHTMLToNewLine('I’ve also added support for:');
    p10.addHTMLToNewLine('1. Loading multiple GS regions trained from different pipelines (the system is compatible with both vanilla and segmented GS scenes)');
    p10.addHTMLToNewLine('2. Editing GS regions with an interactive bounding box, adjusting their position / rotation / scale');
    p10.addHTMLToNewLine('3. Selecting & removing individual splats');
    p10.addHTMLToNewLine('See the demo video below for details.');
    let v10 = new Video(`gs_viewer_editing.mp4`);
    previewContainer.appendChild(v10.domElement);
}

window.onload = () => {
    createHTMLCb();
}