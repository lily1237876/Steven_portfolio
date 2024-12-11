import * as THREE from 'three';
import Constants from './src/constants.js';
import { remapCurveEaseOut2, mix, clamp, remap, fract } from './src/mathUtils.js';
import Scene from './src/scene.js';
import Intersects from "./src/intersects.js";
import VideoBackground from "./src/3dElements/videoBackground.js";
import SplatViewer from "./src/splatting/Splatting.js";
import DoraViewer from "./src/pages/dora/init.js";
import ComicBookViewer from "./src/pages/comicBook/init.js";
import ClothViewer from "./src/pages/clothSimulation/init.js";
import AsciiViewer from './src/pages/bufferJS/init.js';
import ChairViewer from './src/pages/reer/init.js';
import MoonMeasureViewer from './src/pages/spatialMeasure/init.js';
import ArboretumViewer from './src/pages/arboretum/init.js';
import WarpedReality from './src/pages/warpedReality/init.js';


let camera, scene, renderer, controls;
let pointer, raycaster;
let t1 = 0;

function setupEventListeners() {

    let canvasParentDiv = document.querySelector('#three-js-canvas');

    document.addEventListener('keydown', (e) => {
        // if (e.key === 'f') {
        //     let position = camera.position;
        //     let target = controls.target;
        //     console.log(position, target);
        //     console.log(Scene.getCameraAngleAndDistance(position, target));
        // }
        if (e.key === 'Escape') {
            let camPos = new THREE.Vector3(0, 0, 2);
            let camTargetPos = new THREE.Vector3(0, 0, 0);
            Scene.updateCameraAndControls(camPos, camTargetPos);
        }
    })

    let tStart = 0;
    let tEnd = 1;
    let t = tStart;
    function moveCameraInSplatViewer(e) {
        return;
        // todo Steve: temporarily commented out
        // console.log(e.deltaY);
        let actualT = remapCurveEaseOut2(t, tStart, tEnd, 0, 1, 2);
        let azimuthalAngle = mix(Constants.azimuthalAngleStart, Constants.azimuthalAngleEnd, actualT);
        let polarAngle = mix(Constants.polarAngleStart, Constants.polarAngleEnd, actualT);
        let cameraTargetDistance = mix(Constants.cameraTargetDistanceStart, Constants.cameraTargetDistanceEnd, actualT);
        let camTargetPos = new THREE.Vector3().lerpVectors(Constants.camTargetPosStart, Constants.camTargetPosEnd, actualT);
        let camPos = Scene.getCameraPosition(azimuthalAngle, polarAngle, cameraTargetDistance, camTargetPos);

        // update camera position
        Scene.updateCameraAndControls(camPos, camTargetPos);
        // update gl uAnimateTime
        let {gl, program} = SplatViewer.getContext();
        if (gl !== null && program !== null) {
            // console.log(t)
            gl.uniform1f(gl.getUniformLocation(program, "uAnimateTime"), t);
        }

        t += clamp(e.deltaY, -5, 5) / 1000;
        t = clamp(t, tStart, tEnd);
    }

    let wheelId = 0;
    let MIN_DELTA = 1e-7;
    canvasParentDiv.addEventListener('wheel', (e) => {
        // moveCameraInSplatViewer();

        let delta = clamp(-e.deltaY, -5, 5) / 100;
        t1 += delta;

        // centerIndex = Math.round(t2 * carouselArr.length) % carouselArr.length;
        // centerOffset = fract(carouselArr.length * t2 + 0.5);
        // centerOffset = remap(centerOffset, 0, 1, -1, 1);

        makeCarousel();

        if (wheelId !== null) {
            clearInterval(wheelId);
            wheelId = setInterval(() => {
                delta *= 0.9;
                // console.log(delta)
                if (Math.abs(delta) < MIN_DELTA) {
                    delta = 0;
                    clearInterval(wheelId);
                }
                t1 += delta;
                makeCarousel();
            }, 1000 / 60);
        }

        // todo Steve: have some bugs here, need to fix
        let wholeCarousel = carouselGap * carouselArr.length;
        let a_big_number = 420;
        let t2 = (t1 + a_big_number * wholeCarousel) % wholeCarousel;
        t2 /= carouselArr.length;
        centerIndex = Math.round(t1 * carouselArr.length) % carouselArr.length;
        // console.log(centerIndex);


        // todo Steve: to understand the relationship between which 3D object is at center and t2,
        //  we just log out t2 and find the pattern !!!!!
        //  and use this to 反推 how to compute centerIndex

        // if (centerIndex === 0) {
        //     VideoBackground.changeVideo(0);
        // } else if (centerIndex === 2) {
        //     VideoBackground.changeVideo(1);
        // }
    })

    let startY = 0; // Initial touch Y position
    let startTime = 0; // Time when touch starts
    let lastY = 0; // Last known Y position
    let lastTime = 0; // Last known timestamp

    let delta = 0;
    let touchEndId = null;

    function handleTouchStart(event) {
        const touch = event.touches[0];
        startY = touch.clientY;
        lastY = touch.clientY;
        startTime = event.timeStamp;
        lastTime = event.timeStamp;

        clearInterval(touchEndId);
        delta = 0;
    }

    function handleTouchMove(event) {
        const touch = event.touches[0];
        const currentY = touch.clientY;
        const currentTime = event.timeStamp;

        const deltaY = lastY - currentY; // Difference in Y position
        const deltaTime = currentTime - lastTime; // Difference in time

        if (deltaTime > 0) {
            const speed = deltaY / deltaTime; // Speed in pixels/ms
            // console.log(`Scroll-like speed: ${speed}`);

            // You can simulate a scroll or wheel event here
            delta = clamp(-speed, -5, 5) / 15;
            t1 += delta;
            makeCarousel();
        }

        // Update last positions
        lastY = currentY;
        lastTime = currentTime;
    }

    function handleTouchEnd(event) {
        const touchDuration = event.timeStamp - startTime;
        const totalDistance = startY - lastY;
        const averageSpeed = totalDistance / touchDuration; // Average speed
        // console.log(`Average speed: ${averageSpeed}`);
        // Perform actions based on the final touch gesture

        touchEndId = setInterval(() => {
            delta *= 0.95;
            t1 += delta;
            if (Math.abs(delta) < MIN_DELTA) {
                delta = 0;
                clearInterval(touchEndId);
            }
            makeCarousel();
        }, 1000 / 60);
    }

    // Attach event listeners
    canvasParentDiv.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvasParentDiv.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvasParentDiv.addEventListener('touchend', handleTouchEnd);

}

let carouselArr = [];

async function init() {

    Scene.init();
    Intersects.init();

    VideoBackground.init();

    let internals = Scene.getInternals();
    camera = internals.camera;
    scene = internals.scene;
    renderer = internals.renderer;
    controls = internals.controls;
    pointer = internals.pointer;
    raycaster = internals.raycaster;

    // start splat viewer
    // todo Steve: temporarily commented out
    // SplatViewer.startSplatViewer().catch((err) => {
    //     document.getElementById("spinner").style.display = "none";
    //     console.log(err);
    // });

    // prepare to get into the 2nd phase ---> showcase a list of scrollable 3d projects
    let camPos = new THREE.Vector3(0, 0, 2);
    let camTargetPos = new THREE.Vector3(0, 0, 0);
    Scene.updateCameraAndControls(camPos, camTargetPos);

    // test out the next interaction
    // first bring the camera back to where it was
    carouselArr = [];
    carouselArr.push(WarpedReality.startWarpedRealityViewer());
    DoraViewer.startDoraViewer().then(dora => {
        carouselArr.push(dora);
        makeCarousel();
    });
    ComicBookViewer.startComicBook().then(comicBook => {
        carouselArr.push(comicBook);
        makeCarousel();
    });
    carouselArr.push(ClothViewer.startCloth());
    carouselArr.push(ArboretumViewer.startArboretumViewer());
    carouselArr.push(AsciiViewer.startAsciiViewer());
    carouselArr.push(ChairViewer.startChairViewer());
    carouselArr.push(MoonMeasureViewer.startMoonMeasureViewer());

    // currently the projects might be too close to each other
    // what if it's designed like Mac's dock --- only center project gets zoomed in, otherwise it's smaller

    // add micro-interactions --- move mouse camera pan around
    // add random graphics design portfolio
    //  the zip file I sent to Valentin when first applying for this job

    // vr game

    // sketcher 3D

    // gaussian splatting

    // spatial measurement
    //  Valentin's linkedin
    //  poster for MIT Media Lab member's week
    //  Dava's ACM Siggraph screenshot


    // carouselArr = [dora, comicBook, arboretum, cloth, asciiViewer, reerChair, moonMeasure];
    makeCarousel();

    setupEventListeners();
}

let centerIndex = 0;
let centerOffset = 0;
let carouselGap = 1.6;

let a_big_number = 420;
function makeCarousel() {
    let carouselOffset = 2;
    let wholeCarousel = carouselGap * carouselArr.length;
    for (let i = 0; i < carouselArr.length; i++) {
        let obj = carouselArr[i];
        let xOffset = (carouselGap * (i + carouselOffset) + t1 + a_big_number * wholeCarousel) % wholeCarousel - carouselOffset * carouselGap;
        obj.position.x = xOffset;
    }
    // centerIndex = Math.round((t + a_big_number * wholeCarousel) % wholeCarousel);
}

window.onload = function() {
    init();
};

// FPS counter
// (function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()
