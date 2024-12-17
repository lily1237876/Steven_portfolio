import * as THREE from 'three';
import SplatViewer from './Splatting.js';
import Constants from './constants.js';
import { remapCurveEaseOut2, mix, clamp } from './mathUtils.js';
import { Popup } from '../htmlElements/popup.js';

function getCameraPosition(azimuthalAngle, polarAngle, distance, target) {
    const x = distance * Math.sin(polarAngle) * Math.sin(azimuthalAngle);
    const y = distance * Math.cos(polarAngle);
    const z = distance * Math.sin(polarAngle) * Math.cos(azimuthalAngle);

    return new THREE.Vector3(
        target.x + x,
        target.y + y,
        target.z + z
    );
}
let camPosStart = getCameraPosition(Constants.azimuthalAngleStart, Constants.polarAngleStart, Constants.cameraTargetDistanceStart, Constants.camTargetPosStart);
let camera = null;

function init() {
    // add pop up
    if (!window.localStorage.getItem('isAboutIntroDone')) {
        let popUp = new Popup('Mouse wheel🖱️ / scroll finger👆 up&uarr; and down&darr; to move the camera', 6000);
        window.localStorage.setItem('isAboutIntroDone', true);
    }

    // init camera
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.copy(camPosStart);
    camera.lookAt(Constants.camTargetPosStart);
    camera.updateMatrixWorld(true);

    animate();

    // start splat viewer
    SplatViewer.startSplatViewer().catch((err) => {
        console.log(err);
    });
}

function animate() {
    requestAnimationFrame(animate);

    camera.updateMatrixWorld(true);
    let m = camera.matrixWorld.clone().elements;
    SplatViewer.updateCameraMatrix(m);
}

function updateCameraAndControls(position, targetPosition) {
    camera.position.copy(position);
    camera.lookAt(targetPosition);
}

function setupEventListeners() {
    // about drawer button
    let aboutMeContainer = document.querySelector('#page-about-me-drawer');
    let drawerHeight = aboutMeContainer.getBoundingClientRect().height;

    let aboutDrawerButton = document.querySelector('#page-about-me-drawer-button');
    aboutDrawerButton.style.height = `${drawerHeight}px`;

    aboutDrawerButton.addEventListener('pointerup', (e) => {
        e.stopPropagation();
        if (aboutMeContainer.style.display === '') { // normal ---> hidden
            aboutMeContainer.style.display = 'none';
            aboutDrawerButton.innerHTML = '>';
        } else { // hidden ---> normal
            aboutMeContainer.style.display = '';
            aboutDrawerButton.innerHTML = '<';
        }
    })


    // back to projects button
    let backToProjectsButton = document.querySelector('#page-projects-button-container');
    backToProjectsButton.addEventListener('pointerup', (e) => {
        e.stopPropagation();
        window.location.href = `${import.meta.url}/../../`;
    })


    // init other event listeners

    let canvasParentDiv = document.querySelector('#gs-canvas');

    let t1 = 0;

    let tStart = 0;
    let tEnd = 1;
    let t = tStart;
    function moveCameraInSplatViewer(e) {
        // todo Steve: temporarily commented out
        // console.log(e.deltaY);
        let actualT = remapCurveEaseOut2(t, tStart, tEnd, 0, 1, 2);
        let azimuthalAngle = mix(Constants.azimuthalAngleStart, Constants.azimuthalAngleEnd, actualT);
        let polarAngle = mix(Constants.polarAngleStart, Constants.polarAngleEnd, actualT);
        let cameraTargetDistance = mix(Constants.cameraTargetDistanceStart, Constants.cameraTargetDistanceEnd, actualT);
        let camTargetPos = new THREE.Vector3().lerpVectors(Constants.camTargetPosStart, Constants.camTargetPosEnd, actualT);
        let camPos = getCameraPosition(azimuthalAngle, polarAngle, cameraTargetDistance, camTargetPos);

        // update camera position
        updateCameraAndControls(camPos, camTargetPos);
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
        moveCameraInSplatViewer(e);

        let delta = clamp(-e.deltaY, -5, 5) / 100;
        t1 += delta;

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
            }, 1000 / 60);
        }
    });
}

window.onload = () => {
    
    init();
    setupEventListeners();

    return;
}