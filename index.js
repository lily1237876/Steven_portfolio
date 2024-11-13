import * as THREE from 'three';
import Constants from './src/constants.js';
import { remapCurveEaseOut2, mix, clamp } from './src/mathUtils.js';
import Scene from './src/scene.js';
import Intersects from "./src/intersects.js";
import SplatViewer from "./src/splatting/Splatting.js";
import DoraViewer from "./src/dora/init.js";
import ComicBookViewer from "./src/comicBook/init.js";


let camera, scene, renderer, controls;
let pointer, raycaster;

function setupEventListeners() {
    // window.addEventListener('resize', () => {
    //     camera.aspect = window.innerWidth / window.innerHeight;
    //     camera.updateProjectionMatrix();
    //
    //     renderer.setSize( window.innerWidth, window.innerHeight );
    // })
    //
    // document.addEventListener('keydown', (e) => {
    //     if (e.key === 'f') {
    //         let position = camera.position;
    //         let target = controls.target;
    //         console.log(position, target);
    //         console.log(Scene.getCameraAngleAndDistance(position, target));
    //     }
    // })

    document.addEventListener('pointermove', (e) => {
        pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

        raycaster.setFromCamera( pointer, camera );
        let intersects = raycaster.intersectObjects( Intersects.getObjs() );
        if (intersects.length === 0) {
            Intersects.intersectedLabel = '';
            return;
        }
        Intersects.intersectedLabel = intersects[0].object.userData.label;

    })

    let tStart = 0;
    let tEnd = 1;
    let t = tStart;
    document.addEventListener('wheel', (e) => {
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
    })
}

function init() {

    Scene.initScene();
    // console.log(Scene.getInternals());

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
    // let camPos = new THREE.Vector3(0, 0, 2);
    // let camTargetPos = new THREE.Vector3(0, 0, 0);
    // Scene.updateCameraAndControls(camPos, camTargetPos);

    // test out the next interaction
    // first bring the camera back to where it was
    // DoraViewer.startDoraViewer();

    // ComicBookViewer.startComicBook();



    setupEventListeners();
}

window.onload = function() {
    init();
}