import { ClickableImage } from "../../htmlElements/clickableImage.js";
import { TempBackButton } from "../../htmlElements/backButton.js";
import Intersects from "../../intersects.js";
import { GalleryGrid } from "../../htmlElements/galleryGrid.js";
import { Paragraph } from "../../htmlElements/paragraph.js";
import { Video } from "../../htmlElements/video.js";
import { SectionTitle } from "../../htmlElements/sectionTitle.js";

let WARPED_REALITY_LABEL = 'warped_reality';

// create an 'html template' file, that has a top 'go back' button and a top title
// when click a 3D object, we fade in the entire html div, animate the opacity, and transform translateY from -10px to 0
// when click the back button, we fade out the entire html div, animate in reverse

export function initHTML() {
    Intersects.addClickCb(WARPED_REALITY_LABEL, createHTMLCb);
}

function createHTMLCb() {
    // todo Steve: add this when click on details
    //  note: if add this, then OrbitControl no longer receives pointer info, need to work on that
    let previewContainer = document.createElement('div');
    previewContainer.id = 'temp-container';
    document.body.appendChild(previewContainer);

    let tempBackButton = new TempBackButton(previewContainer);

    
    // title
    let title = document.createElement('div');
    previewContainer.appendChild(title);
    title.classList.add('temp-title');
    title.innerHTML = 'Warped Reality';

    // abstract
    let abstract = document.createElement('div');
    previewContainer.appendChild(abstract);
    abstract.classList.add('temp-abstract');

    let a1 = document.createElement('div');
    abstract.appendChild(a1);
    a1.innerHTML = 'Time <br> 2022-2024';
    a1.style.paddingRight = '10px';
    a1.style.paddingBottom = '10px';

    let a2 = document.createElement('div');
    abstract.appendChild(a2);
    a2.innerHTML = 'Type <br> Experiment';
    a2.style.paddingRight = '10px';
    a2.style.paddingBottom = '10px';

    let a3 = document.createElement('div');
    abstract.appendChild(a3);
    a3.innerHTML = 'Role <br> Creative Developer <br> 3D Graphics & Shader Developer';
    a3.style.paddingRight = '10px';
    a3.style.paddingBottom = '10px';

    // quote
    let quote = document.createElement('div');
    previewContainer.appendChild(quote);
    quote.classList.add('temp-quote');
    quote.innerHTML = '\"What if light doesn’t travel on a straight path? What if camera doesn’t take pictures the way it used to?\"';

    let v1 = new Video(`${import.meta.env.BASE_URL}warpedReality/final.mp4`);
    previewContainer.appendChild(v1.domElement);

    let s1 = new SectionTitle('Introduction');
    previewContainer.appendChild(s1.domElement);
    let p1 = new Paragraph();
    previewContainer.appendChild(p1.domElement);
    p1.addHTMLToNewLine('I’m always fascinated about artworks that defy the reality. This fascination peaked when I saw David Hockney and M.C. Escher’s work, where lights are distorted and reality is warped --- they look like they were captured from different perspectives and stitched together in one frame. I came across a book analyzing the ideas behind M.C. Escher’s drawing, and came to realize that David Hockney’s drawing techniques is a lot similar to the medieval artists --- they don’t follow the principals of perspectives. Their paintings often have multiple vanishing points, and they don’t converge together. I was tempted to create something like this on my computer.');

    let g1 = new GalleryGrid();
    previewContainer.appendChild(g1.domElement);
    g1.addImageSrc(`${import.meta.env.BASE_URL}warpedReality/david_hockney.png`);
    g1.addImageSrc(`${import.meta.env.BASE_URL}warpedReality/david_hockney_2.jpeg`);
    g1.addImageSrc(`${import.meta.env.BASE_URL}warpedReality/IMG_0082.jpg`);


    let s2 = new SectionTitle('Modify ray distribution');
    previewContainer.appendChild(s2.domElement);
    let p2 = new Paragraph();
    previewContainer.appendChild(p2.domElement);
    p2.addHTMLToNewLine('The warping effect has to do with the uneven distribution of generated light rays. For my first attempt, I decided to leverage ray-marching to easily control how light rays are distributed. Ray-marching is a technique, where for every pixel on the screen, a light ray is generated and shot into the screen, and we color the pixel depending on the objects the ray hits. I wanted to try something that was fast and easy to manipulate, therefore I made the center part of the screen generate sparser light rays & edge part of the screen generate denser light rays over time, and got an inflation effect similar to M.C. Escher’s Balcony, 1945.');
    p2.addHTMLToNewLine(`You can try it out in my <a href=\'https://www.shadertoy.com/view/lflGRs\' target="_blank" rel="noopener noreferrer">ShaderToy</a>.`);
    // p2.addHTMLToNewLine(`You can try it out in my ${new Link('ShaderToy', 'https://www.shadertoy.com/view/lflGRs').domElement}`);

    let g2 = new GalleryGrid();
    previewContainer.appendChild(g2.domElement);
    g2.addImageSrc(`${import.meta.env.BASE_URL}warpedReality/IMG_0079.jpg`);
    g2.addVideoSrc(`${import.meta.env.BASE_URL}warpedReality/non_uniform_ray.MP4`);

    let s3 = new SectionTitle('Modify ray travel direction');
    previewContainer.appendChild(s3.domElement);
    let p3 = new Paragraph();
    previewContainer.appendChild(p3.domElement);
    p3.addHTMLToNewLine('M.C. Escher also tried to manipulate light rays directly, which can be seen in Paint Gallery, 1956. I wanted to create a similar effect with ray-marching. For every light ray, instead of traveling through space in a straight line, I made them travel in a 3D sin wave pattern, achieving this funky effect👇.');
    p3.addHTMLToNewLine(`You can try it out in my <a href=\'https://www.shadertoy.com/view/XcBGzz\' target="_blank" rel="noopener noreferrer">ShaderToy</a>.`);

    let g3 = new GalleryGrid();
    previewContainer.appendChild(g3.domElement);
    g3.addImageSrc(`${import.meta.env.BASE_URL}warpedReality/IMG_0081.jpg`);
    g3.addVideoSrc(`${import.meta.env.BASE_URL}warpedReality/sin_wave_ray.MP4`);

    let s4 = new SectionTitle('Ray-tracing');
    previewContainer.appendChild(s4.domElement);
    let p4 = new Paragraph();
    previewContainer.appendChild(p4.domElement);
    p4.addHTMLToNewLine('To have more control over the directions of generated light rays, I modified Garrett Johnson’s three-gpu-pathtracer (https://github.com/gkjohnson/three-gpu-pathtracer). Using a procedurally generated curve controlled by the sliders, I gained more control over the light ray’s bending factor (with individual control over camera-space x & y directions), light path’s length, and the relative position of the final light ray along the light path. These factors allowed me to gain more intuition on how warping light can affect the final outcome, by controlling variables.');
    p4.addHTMLToNewLine(`Images on the left visualize how the rays travel through the space --- blue arrows indicates ray starting positions & directions, green curve indicates the entire ray travel paths, and yellow arrow indicates ray final positions & directions. In a typical ray tracer, all the rays are generated from the blue arrows. I would like to generate rays from non-traditional positions & directions, hence images on the right shows the rendering results of shooting rays from the yellow arrows.`);

    let g4 = new GalleryGrid();
    previewContainer.appendChild(g4.domElement);
    g4.addImageSrc(`${import.meta.env.BASE_URL}warpedReality/0.01_5_30_1_rays.png`);
    g4.addImageSrc(`${import.meta.env.BASE_URL}warpedReality/0.01_5_30_1_render.png`);

    let p5 = new Paragraph();
    previewContainer.appendChild(p5.domElement);
    p5.addHTMLToNewLine('👆Using the overall curve bend 0.01, x-axis curve bend 5, curve length 30, and generating rays at the end of the curve, I used the rendered image as a control group, adjust one variable at a time, and explore how different parameters affect the final rendered image.');

    let g5 = new GalleryGrid();
    previewContainer.appendChild(g5.domElement);
    g5.addImageSrc(`${import.meta.env.BASE_URL}warpedReality/0.02_5_30_1_rays.png`);
    g5.addImageSrc(`${import.meta.env.BASE_URL}warpedReality/0.02_5_30_1_render.png`);

    let p6 = new Paragraph();
    previewContainer.appendChild(p6.domElement);
    p6.addHTMLToNewLine('👆If the overall curve bend increases to 0.02, the final image looks more warped. The center of the image appears flipped in the x & y axes. because when the bending factor becomes larger, the final directions of the rays divert from their final position --- as illustrated in the ray visualization image, yellow arrows on the left point to the right, especially among rays close to the center.');
    
    let g6 = new GalleryGrid();
    previewContainer.appendChild(g6.domElement);
    g6.addImageSrc(`${import.meta.env.BASE_URL}warpedReality/0.01_100_30_1_rays.png`);
    g6.addImageSrc(`${import.meta.env.BASE_URL}warpedReality/0.01_100_30_1_render.png`);

    let p7 = new Paragraph();
    previewContainer.appendChild(p7.domElement);
    p7.addHTMLToNewLine('👆Adjusting only the x-axis bend factor to 100 yields an unexpected result --- it appears as if the domain is repeating and the rays originating from left & right sides hit the same objects. Upon closer inspection, it made sense because making the big x-axis bend factor eliminates the y-axis bending factor, making the left & right side of rays converge to the same objects.');

    let g7 = new GalleryGrid();
    previewContainer.appendChild(g7.domElement);
    g7.addImageSrc(`${import.meta.env.BASE_URL}warpedReality/0.01_5_60_1_rays.png`);
    g7.addImageSrc(`${import.meta.env.BASE_URL}warpedReality/0.01_5_60_1_render.png`);

    let p8 = new Paragraph();
    previewContainer.appendChild(p8.domElement);
    p8.addHTMLToNewLine('👆The result of larger curve lengths is easily explainable --- longer curve lengths lead to 1) generated rays closer to objects; 2) generated “more bended” rays. Therefore we got an image with larger objects and more dramatic fish-eye lenses effect. Notice that this can be an alternative way of achieving the inflation effect similar to M.C. Escher’s Balcony, 1945, other than modifying initial ray distribution mentioned earlier.');

    let g8 = new GalleryGrid();
    previewContainer.appendChild(g8.domElement);
    g8.addImageSrc(`${import.meta.env.BASE_URL}warpedReality/0.01_5_30_0_rays.png`);
    g8.addImageSrc(`${import.meta.env.BASE_URL}warpedReality/0.01_5_30_0_render.png`);

    let p9 = new Paragraph();
    previewContainer.appendChild(p9.domElement);
    p9.addHTMLToNewLine('👆Of course, in the control group, we generate the rays exactly from the blue arrows (the yellow arrows exactly overlap the blue arrows), resulting in an undistorted image, with no effects, as seen in traditional ray tracers.');
    p9.addHTMLToNewLine('<br>');
    p9.addHTMLToNewLine('👇Here’s a video where we can observe how different parameters affect the final rendered image, in a continuous way.');

    let v2 = new Video(`${import.meta.env.BASE_URL}warpedReality/ray_tracing.mp4`);
    previewContainer.appendChild(v2.domElement);

    let s5 = new SectionTitle('Final results --- build my custom slit-scan renderer');
    previewContainer.appendChild(s5.domElement);
    let p10 = new Paragraph();
    previewContainer.appendChild(p10.domElement);
    p10.addHTMLToNewLine('With these previous knowledge, I’m finally confident to build my own renderer to achieve a warped reality effect. I wanted to build something that can instantly give me the warping effect in real time, and can produce something really cool. The ray tracing method above takes too long to render. And ray marching doesn’t give me full control over the camera position. I have to build something from the ground up. I was inspired by slit-scan photography, where an image is divided into smaller grids, and each grid is captured with slightly different angle or time offsets. This results in a counter-intuitive warping effect, that is both mesmerizing to look at, and hard to make up the behind-the-scene technique.');

    let g10 = new GalleryGrid();
    previewContainer.appendChild(g10.domElement);
    g10.addImageSrc(`${import.meta.env.BASE_URL}warpedReality/slit_scan_1.gif`);
    g10.addImageSrc(`${import.meta.env.BASE_URL}warpedReality/slit_scan_2.gif`);
    g10.addImageSrc(`${import.meta.env.BASE_URL}warpedReality/IMG_0083.jpg`);
    g10.addImageSrc(`${import.meta.env.BASE_URL}warpedReality/IMG_0084.jpg`);

    let p11 = new Paragraph();
    previewContainer.appendChild(p11.domElement);
    p11.addHTMLToNewLine('Digging deeper in the M.C. Escher book, I found out that Escher used exactly this method to draw his amazing High and Low, 1947 --- my favorite work!!!');
    p11.addHTMLToNewLine('So the solution is simple --- on every frame, I need to animate the camera around a certain region, capture a portion of the image from slightly different angles, and then stitch them together to create a final image. I’ve had a lot of experiences animating the camera, so that’s no a problem at all. The left image shows how to animate the camera around an object to take pictures from different angles on every frame. The right image shows how to orbit the camera around a point.');

    let g11 = new GalleryGrid();
    previewContainer.appendChild(g11.domElement);
    g11.addImageSrc(`${import.meta.env.BASE_URL}warpedReality/interval_loop.png`);
    g11.addImageSrc(`${import.meta.env.BASE_URL}warpedReality/orbit_function.png`);

    let p12 = new Paragraph();
    previewContainer.appendChild(p12.domElement);
    p12.addHTMLToNewLine('Putting everything together, I used this technique on a car model. The bottom left screen shows the original model, and the center image shows the warping effect.');

    let v3 = new Video(`${import.meta.env.BASE_URL}warpedReality/car_warp.mp4`);
    previewContainer.appendChild(v3.domElement);

    let p13 = new Paragraph();
    previewContainer.appendChild(p13.domElement);
    p13.addHTMLToNewLine('I’d say that’s pretty darn trippy! Now let’s try something more abstract. I picked out this hollow cube.');

    let v4 = new Video(`${import.meta.env.BASE_URL}warpedReality/cube_warp.mp4`);
    previewContainer.appendChild(v4.domElement);

    let p14 = new Paragraph();
    previewContainer.appendChild(p14.domElement);
    p14.addHTMLToNewLine('It’s fascinating to see cube dynamically warping when rotating the camera --- couldn’t quite predict how it would look unless seeing the results.');
    p14.addHTMLToNewLine('<br>');
    p14.addHTMLToNewLine('Finally, I threw in some animations and produced this:');

    let v5 = new Video(`${import.meta.env.BASE_URL}warpedReality/final.mp4`);
    previewContainer.appendChild(v5.domElement);

    let p15 = new Paragraph();
    previewContainer.appendChild(p15.domElement);
    p15.addHTMLToNewLine('P.S. some behind-the-scene sketches:');

    let g12 = new GalleryGrid();
    previewContainer.appendChild(g12.domElement);
    g12.addImageSrc(`${import.meta.env.BASE_URL}warpedReality/IMG_0086.jpg`);
    g12.addImageSrc(`${import.meta.env.BASE_URL}warpedReality/IMG_0087.jpg`);
    g12.addImageSrc(`${import.meta.env.BASE_URL}warpedReality/IMG_0088.jpg`);
    g12.addImageSrc(`${import.meta.env.BASE_URL}warpedReality/IMG_0089.jpg`);
}

// setTimeout(() => {
//     createHTMLCb();
// }, 10);