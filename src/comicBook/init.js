import * as THREE from "three";
import Scene from "../scene.js";
import {vsComicBookSource, fsComicBookSource} from "./shader.js";
import {mix, remap, remapCurveEaseIn2, remapCurveEaseOut2, smoothstep} from "../mathUtils.js";
import {BoundingBox} from "../boundingBox.js";

let geometry, material
let comicBookObjs;
let comicBookGroup;
let loader;

let pageThickness = 0.01;
let pageCount = 10;

let matrixT = 0;

let maxBendAngle = Math.PI / 2;
let angle = 0;
// let progress = 0;
let flipPercent = 27;

function changeProgress(progress) {
    for (let i = 0; i < comicBookObjs.children.length; i++) {
        let a = smoothstep(-flipPercent + 100 / pageCount * (i + 1), flipPercent + 100 / pageCount * (i + 1), remap(progress, 0, 100, -flipPercent, 100 + flipPercent)); // here need to remap b/c need to account for the flipPercent values, so that the 1st and last pages are completely closed
        let newAngle = mix(0, Math.PI, a);
        comicBookObjs.children[i].material.uniforms['rotateAngle'].value = newAngle;
        comicBookObjs.children[i].material.uniforms['bendAngle'].value = remap(Math.sin(newAngle), 0, 1, 0, maxBendAngle);
    }
}

async function startComicBook() {
    let scene = Scene.getInternals().scene;

    comicBookGroup = new THREE.Group();
    scene.add(comicBookGroup);

    // let camPos = new THREE.Vector3(0, 0, 2);
    // let camTargetPos = new THREE.Vector3(0, 0, 0);
    // Scene.updateCameraAndControls(camPos, camTargetPos);

    const texture = await loadTexture(1);

    geometry = new THREE.BoxGeometry(1, pageThickness, 1.3, 10, 2, 2);
    geometry.translate(0.5, 0, 0);
    let posAttri = geometry.getAttribute('position');
    let minX = Infinity, maxX = -Infinity;
    for (let i = 0; i < posAttri.count; i++) {
        let tmp = posAttri.getX(i);
        if (tmp < minX) minX = tmp;
        if (tmp > maxX) maxX = tmp;
    }
    material = new THREE.ShaderMaterial({
        vertexShader: vsComicBookSource,
        fragmentShader: fsComicBookSource,
        uniforms: {
            'screenRatio': {value: window.innerWidth / window.innerHeight},
            'matrixT': {value: matrixT},
            'division': {value: geometry.parameters.widthSegments},
            'segmentLength': {value: geometry.parameters.width / geometry.parameters.widthSegments}, // segment length
            'bendAngle': {value: angle}, // total page flip/bend angle
            'rotateAngle': {value: angle}, // total whole thing rotate angle
            'maxBendAngle': {value: maxBendAngle},
            'minX': {value: minX},
            'maxX': {value: maxX},
            'yOffset': {value: 0},
            'xOffset': {value: pageThickness * pageCount / 16}, // arbitrary value, adjust as I see fit
            'comicTextureFront': {value: texture},
            'comicTextureBack': {value: texture},
            'uDirection': {value: 0},
        },
    });
    comicBookObjs = new THREE.Group();
    comicBookObjs.rotation.x = Math.PI / 3;
    let scaleFactor = 0.6;
    comicBookObjs.scale.set(scaleFactor, scaleFactor, scaleFactor);

    let idx = 1;
    for (let i = -(pageCount - 1) / 2; i <= (pageCount - 1) / 2; i++) {
        let newGeometry = geometry.clone();
        let newMaterial = material.clone();
        newMaterial.uniforms['yOffset'].value = -i * pageThickness / 8; // arbitrary value, adjust as I see fit
        newMaterial.uniforms['comicTextureFront'].value = await loadTexture(idx++);
        newMaterial.uniforms['comicTextureBack'].value = await loadTexture(idx++);
        let newPage = new THREE.Mesh(newGeometry, newMaterial);
        comicBookObjs.add(newPage);
    }
    comicBookGroup.add(comicBookObjs);

    let boundingBoxSize = 1.2;
    let comicBookBoundingBox = new BoundingBox(
        new THREE.Vector3(boundingBoxSize, boundingBoxSize / 1.5, boundingBoxSize),
        new THREE.Vector3(),
        'GLSL Comic Book',
        'Fully procedural comic book shader written in GLSL',
        '👆Enjoy The Amazing Spiderman🕷️',
        'I\'ve always wanted to make a fully procedural, scrollable comic book, that captures some realistic page bending physics. So I made just the thing in a span of several nights. Some spicy stuff going on in the vertex shader to calculate accurate page bending.'
    );
    let comicBookBoundingBoxMesh = comicBookBoundingBox.boxMesh;
    let comicBookBoundingBoxTextObjs = comicBookBoundingBox.textObjs;
    comicBookGroup.add(comicBookBoundingBoxMesh);
    comicBookGroup.add(comicBookBoundingBoxTextObjs);

    onFrame();

    return comicBookGroup;
}

function changeFlipDirection(direction) {
    for (let child of comicBookObjs.children) {
        child.material.uniforms['uDirection'].value = direction;
    }
}

let progressStart = 0;
let progressEnd = 100;
let progress = progressStart + 0.01;
let progressSpeed = 0.2;
function onFrame() {
    requestAnimationFrame(onFrame);

    if (progress <= progressStart || progress >= progressEnd) {
        changeFlipDirection(progress <= progressStart ? 0 : 1);
        progressSpeed *= -1;
    }

    let actualProgress;
    if (progressSpeed > 0) {
        actualProgress = remapCurveEaseOut2(progress, progressStart, progressEnd, progressStart, progressEnd, 2);
    } else {
        actualProgress = remapCurveEaseOut2(progress, progressStart, progressEnd, progressStart, progressEnd, 2);
    }

    changeProgress(actualProgress);

    progress += progressSpeed;
    // console.log(progress)
}

function loadTexture(idx) {
    if (!loader) loader = new THREE.TextureLoader();
    let imgBasePath = `${import.meta.env.BASE_URL}imgs/comicBook`;
    return new Promise((resolve, reject) => {
        loader.load(`${imgBasePath}/${idx}.jpg`, (texture) => {
            resolve(texture);
        });
    });
}

export default {
    startComicBook,
}