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

    let tStart = 0;
    let tEnd = 1;
    let t = tStart;
    function moveCameraInSplatViewer() {
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

        // t += clamp(e.deltaY, -5, 5) / 1000;
        t = clamp(t, tStart, tEnd);
        console.log(t);
    }

    // ---------- handle mouse scroll ---------- //

    let wheelId = 0;
    let MIN_DELTA = 1e-7;
    canvasParentDiv.addEventListener('wheel', (e) => {

        let delta = clamp(e.deltaY, -5, 5) / 1000;
        t += delta;

        moveCameraInSplatViewer();

        if (wheelId !== null) {
            clearInterval(wheelId);
            wheelId = setInterval(() => {
                delta *= 0.9;
                // console.log(delta)
                if (Math.abs(delta) < MIN_DELTA) {
                    delta = 0;
                    clearInterval(wheelId);
                }
                t += delta;
                moveCameraInSplatViewer();
            }, 1000 / 60);
        }
    });


    // ---------- handle touch scroll ---------- //

    let startY = 0; // Initial touch Y position
    let startTime = 0; // Time when touch starts
    let lastY = 0; // Last known Y position
    let lastTime = 0; // Last known timestamp

    let delta = 0;
    let touchEndId = null;

    function handleTouchStart(event) {
        event.stopPropagation();
        const touch = event.touches[0];
        startY = touch.clientY;
        lastY = touch.clientY;
        startTime = event.timeStamp;
        lastTime = event.timeStamp;

        clearInterval(touchEndId);
        delta = 0;
    }

    function handleTouchMove(event) {
        event.stopPropagation();
        const touch = event.touches[0];
        const currentY = touch.clientY;
        const currentTime = event.timeStamp;

        const deltaY = lastY - currentY; // Difference in Y position
        const deltaTime = currentTime - lastTime; // Difference in time

        if (deltaTime > 0) {
            const speed = deltaY / deltaTime; // Speed in pixels/ms
            // You can simulate a scroll or wheel event here
            delta = clamp(speed, -5, 5) / 150;
            t += delta;
            moveCameraInSplatViewer();
        }

        // Update last positions
        lastY = currentY;
        lastTime = currentTime;
    }

    function handleTouchEnd(event) {
        event.stopPropagation();
        const touchDuration = event.timeStamp - startTime;
        const totalDistance = startY - lastY;
        const averageSpeed = totalDistance / touchDuration; // Average speed
        // console.log(`Average speed: ${averageSpeed}`);
        // Perform actions based on the final touch gesture
        touchEndId = setInterval(() => {
            delta *= 0.95;
            t += delta;
            if (Math.abs(delta) < MIN_DELTA) {
                delta = 0;
                clearInterval(touchEndId);
            }
            moveCameraInSplatViewer();
        }, 1000 / 60);
    }

    // Attach event listeners
    canvasParentDiv.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvasParentDiv.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvasParentDiv.addEventListener('touchend', handleTouchEnd);
}

window.onload = () => {
    
    init();
    setupEventListeners();

    return;
}