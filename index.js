import * as THREE from 'three';
import Constants from './src/constants.js';
import { remapCurveEaseOut2, mix, clamp, remap, fract } from './src/mathUtils.js';
import Scene from './src/scene.js';
import Intersects from "./src/intersects.js";
import VideoBackground from "./src/videoBackground.js";
import SplatViewer from "./src/splatting/Splatting.js";
import DoraViewer from "./src/dora/init.js";
import ComicBookViewer from "./src/comicBook/init.js";
import ClothViewer from "./src/cloth/init.js";
import AsciiViewer from './src/ascii/init.js';


let camera, scene, renderer, controls;
let pointer, raycaster;

function setupEventListeners() {

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

    let t1 = 0;
    let t2 = 0; // [0, 1]
    // let carouselArr = [1, 2, 3, 4, 5];
    document.addEventListener('wheel', (e) => {
        // moveCameraInSplatViewer();

        let delta = clamp(-e.deltaY, -5, 5) / 100;
        t2 = (t2 + delta + 1) % 1;
        t1 += delta;

        centerIndex = Math.round(t2 * carouselArr.length) % carouselArr.length;
        centerOffset = fract(carouselArr.length * t2 + 0.5);
        centerOffset = remap(centerOffset, 0, 1, -1, 1);

        // console.log(t2.toFixed(2), centerIndex, centerOffset.toFixed(2));

        makeCarousel(t1);
    })
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
    let dora = await DoraViewer.startDoraViewer();
    let comicBook = await ComicBookViewer.startComicBook();
    let cloth = ClothViewer.startCloth();
    let videoPlane = AsciiViewer.startAsciiViewer();

    // vr game

    // arboretum

    // sketcher 3D

    // reer website animated model

    // gaussian splatting

    // spatial measurement
    //  Valentin's linkedin
    //  poster for MIT Media Lab member's week
    //  Dava's ACM Siggraph screenshot

    let testCube1 = Scene.addTestCube();
    // scene.add(testCube1);
    let testCube2 = Scene.addTestCube();
    // scene.add(testCube2);
    carouselArr = [dora, comicBook, cloth, videoPlane];
    makeCarousel(0);

    setupEventListeners();
}

let centerIndex = 0;
let centerOffset = 0;
let carouselOffset = 1.8;


function makeCarousel(t) {
    let wholeCarousel = carouselOffset * carouselArr.length;
    for (let i = 0; i < carouselArr.length; i++) {
        let obj = carouselArr[i];
        let xOffset = (carouselOffset * i + t + 420 * wholeCarousel) % wholeCarousel - 2 * carouselOffset;
        obj.position.x = xOffset;
    }
}

window.onload = function() {
    init();
};

// FPS counter
(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()
