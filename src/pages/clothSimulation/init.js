import * as THREE from "three";
import Scene from "../../scene.js";
import Intersects from "../../intersects.js";
import {fsClothSource, vsClothSource, RIPPLE_COUNT} from "./shader.js";
import {BoundingBox} from "../../3dElements/boundingBox.js";

let geo, mat, cloth;
let scene, camera;
let raycaster;

let CLOTH_LABEL = 'cloth';

let ripples = null;
function initRipples() {
    ripples = [];
    for (let i = 0; i < RIPPLE_COUNT; i++) {
        ripples.push({ center: new THREE.Vector2(), time: 0, isActive: false });
    }
}

function setupEventListeners() {
    raycaster = new THREE.Raycaster();

    let lastTime = null;
    let interval = 50;
    let rippleIdx = 0;

    function handleScrollRipple(e) {
        e.stopPropagation();
        if (lastTime !== null && performance.now() - lastTime < interval) return; // limit triggering of subsequent functions
        if (Intersects.intersectedLabel !== CLOTH_LABEL) return;
        lastTime = performance.now();

        cloth.material.uniforms['ripples'].value[rippleIdx].isActive = true;
        cloth.material.uniforms['ripples'].value[rippleIdx].center = Intersects.intersects[0].uv;
        cloth.material.uniforms['ripples'].value[rippleIdx].time = performance.now() / 1000;
        rippleIdx = (rippleIdx + 1) % RIPPLE_COUNT;
    }

    document.addEventListener('wheel', (e) => {
        handleScrollRipple(e);
    });

    document.addEventListener('pointermove', (e) => {
        handleScrollRipple(e);
    });
}

function startCloth() {
    let internals = Scene.getInternals();
    scene = internals.scene;
    camera = internals.camera;

    let clothGroup = new THREE.Group();
    scene.add(clothGroup);

    geo = new THREE.PlaneGeometry(0.9, 0.9, 100, 100);
    // mat = new THREE.MeshBasicMaterial({
    //     color: 0xffffff,
    //     wireframe: true,
    //     side: THREE.DoubleSide,
    // });
    initRipples();
    mat = new THREE.ShaderMaterial({
        vertexShader: vsClothSource,
        fragmentShader: fsClothSource,
        side: THREE.DoubleSide,
        transparent: true,
        uniforms: {
            uBigGrid: {value: 15},
            uLineThickness: {value: 0.05},
            uPointRadius: {value: 0.2},
            uTime: {value: 0},
            ripples: {
                value: ripples
            }
        }
    });
    cloth = new THREE.Mesh(geo, mat);
    clothGroup.add(cloth);
    Scene.traverseGroupToAddLabel(cloth, CLOTH_LABEL);
    Intersects.add(CLOTH_LABEL, cloth);

    let clothBoundingBox = new BoundingBox(
        new THREE.Vector3(1, 1, 0.2),
        new THREE.Vector3(),
        'Interactive Cloth ?!?!',
        'Various cloth simulation experiments, on CPU and GPU',
        'Move mouse🖱️/finger👆 across the cloth to see the effect👀',
        'Cloth simulation on CPU is easy. But can you do it on GPU? Guess what? Now you\'re looking at one! I\'ve done several experiments / variations of it: combining it with AI hand detection, shrink-wrapping it around different objects, and computing the volume enclosed.'
    );
    let clothBoundingBoxMesh = clothBoundingBox.boxMesh;
    let clothBoundingBoxTextObjs = clothBoundingBox.textObjs;
    clothGroup.add(clothBoundingBoxMesh);
    clothGroup.add(clothBoundingBoxTextObjs);

    setupEventListeners();

    onFrame();

    return clothGroup;
}

function onFrame() {
    requestAnimationFrame(onFrame);

    cloth.material.uniforms['uTime'].value = performance.now() / 1000;
}

export default {
    startCloth
}