import * as THREE from 'three';
import Constants from './src/constants.js';
import { remapCurveEaseOut2, mix, clamp, remap, fract } from './src/mathUtils.js';
import { Popup } from './public/htmlElements/popup.js';
import Scene from './src/scene.js';
import Intersects from "./src/intersects.js";
import VideoBackground from "./src/3dElements/videoBackground.js";
import DoraViewer from "./src/pages/dora/init.js";
import ComicBookViewer from "./src/pages/comicBook/init.js";
import ClothViewer from "./src/pages/clothSimulation/init.js";
import AsciiViewer from './src/pages/bufferJS/init.js';
import ChairViewer from './src/pages/reer/init.js';
import MoonMeasureViewer from './src/pages/spatialMeasure/init.js';
import ArboretumViewer from './src/pages/arboretum/init.js';
import WarpedReality from './src/pages/warpedReality/init.js';
import SpatialCursorViewer from './src/pages/spatialCursor/init.js';
import GSViewerProject from './src/pages/gsViewer/init.js';


let camera, scene, renderer, controls;
let pointer, raycaster;
let t = 0;
let isCarouselMoving = false;

function setupEventListeners() {

    // add pop up
    if (!window.localStorage.getItem('isProjectIntroDone')) {
        let popUp = new Popup('Mouse wheel🖱️ / scroll finger👆 up&uarr; and down&darr; to scroll through projects', 6000);
        popUp.domElement.style.backgroundColor = '#cccccc';
        popUp.domElement.style.color = '#232323';
        window.localStorage.setItem('isProjectIntroDone', true);
    }

    // add about button listener
    let aboutMeButton = document.querySelector('#page-about-button-container');
    aboutMeButton.addEventListener('pointerup', () => {
        // when navigating from root folder files to /public folder files, use import.meta.env.BASE_URL
        // otherwise, use import.meta.url, just like in the about page
        window.location.href = `${import.meta.env.BASE_URL}about/index.html`;
    })

    let canvasParentDiv = document.querySelector('#three-js-canvas');

    document.addEventListener('keydown', (e) => {
        // if (e.key === 'f') {
        //     let position = camera.position;
        //     let target = controls.target;
        //     console.log(position, target);
        //     console.log(Scene.getCameraAngleAndDistance(position, target));
        // }

        // if (e.key === 'Escape') {
        //     let camPos = new THREE.Vector3(0, 0, 2);
        //     let camTargetPos = new THREE.Vector3(0, 0, 0);
        //     Scene.updateCameraAndControls(camPos, camTargetPos);
        // }
    })

    // ---------- handle mouse scroll ---------- //

    let wheelId = 0;
    let MIN_DELTA = 1e-7;
    let MIN_DELTA_MOVING = 1e-3;
    canvasParentDiv.addEventListener('wheel', (e) => {

        let delta = clamp(-e.deltaY, -5, 5) / 100;
        t += delta;

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
                t += delta;
                makeCarousel();
            }, 1000 / 60);
        }


        // todo Steve: to understand the relationship between which 3D object is at center and t2,
        //  we just log out t2 and find the pattern !!!!!
        //  and use this to 反推 how to compute centerIndex

        // if (centerIndex === 0) {
        //     VideoBackground.changeVideo(0);
        // } else if (centerIndex === 2) {
        //     VideoBackground.changeVideo(1);
        // }
    })

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
        isCarouselMoving = true;

        event.stopPropagation();
        const touch = event.touches[0];
        const currentY = touch.clientY;
        const currentTime = event.timeStamp;

        const deltaY = lastY - currentY; // Difference in Y position
        const deltaTime = currentTime - lastTime; // Difference in time

        if (deltaTime > 0) {
            const speed = deltaY / deltaTime; // Speed in pixels/ms
            // You can simulate a scroll or wheel event here
            delta = clamp(-speed, -5, 5) / 15;
            t += delta;
            makeCarousel();
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
            if (Math.abs(delta) < MIN_DELTA_MOVING) {
                isCarouselMoving = false;
            }
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


    // ---------- handle hash changes ---------- //
    setInterval(() => {
        applyFilters();
    }, 1000);
    window.addEventListener("hashchange", applyFilters);

    // update hash filters on page load
    updateFilters();

    let categoryButtons = Array.from(document.querySelectorAll('.page-overview-categories'));
    categoryButtons.forEach((button) => {
        // update button initial status based on window location hash
        if (carouselCategories.includes(button.dataset.category)) {
            button.classList.add('page-overview-categories-on');
        }

        // add event listeners
        button.addEventListener('pointerup', (e) => {
            e.stopPropagation();

            let newCategory = button.dataset.category;

            if (button.classList.contains('page-overview-categories-on')) {
                // turn off that category
                button.classList.remove('page-overview-categories-on');

                if (!carouselCategories.includes(newCategory)) return;
                carouselCategories.splice(carouselCategories.indexOf(newCategory), 1);
                let hashString = `category=${carouselCategories.join(',')}`;
                window.location.hash = hashString;
            } else {
                // turn on that category
                button.classList.add('page-overview-categories-on');
                
                if (carouselCategories.includes(newCategory)) return;
                carouselCategories.push(newCategory);
                let hashString = `category=${carouselCategories.join(',')}`;
                window.location.hash = hashString;
            }
        })
    })
}

function updateFilters() {
    let currentHash = window.location.hash.slice(1);
    let params = new URLSearchParams(currentHash);
    carouselCategory = params.get("category");
    if (!carouselCategory) {
        carouselCategories = [];
        window.localStorage.setItem('carouselCategories', '');
        return;
    }
    
    carouselCategories = carouselCategory.split(',');
    window.localStorage.setItem('carouselCategories', carouselCategories);
}

function applyFilters() {
    updateFilters();

    if (!carouselCategory) { // show everything
        if (carouselArrRest.length === 0) return;
        carouselArr = [...carouselArr, ...carouselArrRest];
        carouselArrRest = [];
        return;
    }

    for (let i = 0; i < carouselArr.length; i++) {
        let info = carouselArr[i];
        if (carouselCategories.includes(info[1])) continue;
        carouselArrRest.push(info);
        carouselArr.splice(i, 1);
    }
    for (let i = 0; i < carouselArrRest.length; i++) {
        let info = carouselArrRest[i];
        if (!carouselCategories.includes(info[1])) continue;
        carouselArr.push(info);
        carouselArrRest.splice(i, 1);
    }
    // console.log(carouselArr, carouselArrRest);
    makeCarousel();
}

let carouselArr = null; // store all the projects that match the filter
let carouselArrRest = null; // store all the projects that don't match the filter
let carouselCategory = null; // an object of hash category, used to get carouselCategories[] array
let carouselCategories = []; // an array of categories, used to filter out the matched projects

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

    // prepare to get into the 2nd phase ---> showcase a list of scrollable 3d projects
    let camPos = new THREE.Vector3(0, 0, 2);
    let camTargetPos = new THREE.Vector3(0, 0, 0);
    Scene.updateCameraAndControls(camPos, camTargetPos);

    // test out the next interaction
    // first bring the camera back to where it was
    carouselArrRest = [];
    carouselArr = [];

    carouselArr.push([WarpedReality.startWarpedRealityViewer(), 'computational-art']);
    DoraViewer.startDoraViewer().then(dora => {
        carouselArr.push([dora, 'game']);
        makeCarousel();
    });
    ComicBookViewer.startComicBook().then(comicBook => {
        carouselArr.push([comicBook, 'computational-art']);
        makeCarousel();
    });
    carouselArr.push([ClothViewer.startCloth(), 'computational-art']);
    carouselArr.push([ArboretumViewer.startArboretumViewer(), 'game']);
    carouselArr.push([AsciiViewer.startAsciiViewer(), 'computational-art']);
    carouselArr.push([SpatialCursorViewer.startSpatialCursorViewer(), 'spatial-interface']);
    carouselArr.push([MoonMeasureViewer.startMoonMeasureViewer(), 'spatial-interface']);
    carouselArr.push([GSViewerProject.startGSViewerProject(), 'spatial-interface']);
    carouselArr.push([ChairViewer.startChairViewer(), 'client']);

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
    let carouselOffset = carouselArr.length / 2;
    let wholeCarousel = carouselGap * carouselArr.length;
    for (let i = 0; i < carouselArr.length; i++) {
        let obj = carouselArr[i][0];
        let xOffset = (carouselGap * (i + carouselOffset) + t + a_big_number * wholeCarousel) % wholeCarousel - carouselOffset * carouselGap;
        obj.position.x = xOffset;

        obj.scale.set(1, 1, 1);
    }
    for (let i = 0; i < carouselArrRest.length; i++) {
        let obj = carouselArrRest[i][0];
        obj.scale.set(0, 0, 0);
    }
    // centerIndex = Math.round((t + a_big_number * wholeCarousel) % wholeCarousel);
}

window.onload = function() {
    init();
};

// FPS counter
// (function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()

export function getCarouselMovingState() {
    return isCarouselMoving;
}