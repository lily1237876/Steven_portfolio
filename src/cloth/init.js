import * as THREE from "three";
import Scene from "../scene.js";
import {fsClothSource, vsClothSource, RIPPLE_COUNT} from "./shader.js";

let geo, mat, cloth;
let scene, camera;
let raycaster;

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

    document.addEventListener('pointermove', (e) => {
        e.stopPropagation();
        if (lastTime !== null && performance.now() - lastTime < interval) return; // limit triggering of subsequent functions

        let pointer = new THREE.Vector2((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
        raycaster.setFromCamera(pointer, camera);
        let intersects = raycaster.intersectObject(cloth);
        if (intersects.length === 0) return;
        if (!cloth) return;

        lastTime = performance.now();

        cloth.material.uniforms['ripples'].value[rippleIdx].isActive = true;
        cloth.material.uniforms['ripples'].value[rippleIdx].center = intersects[0].uv;
        cloth.material.uniforms['ripples'].value[rippleIdx].time = performance.now() / 1000;
        rippleIdx = (rippleIdx + 1) % RIPPLE_COUNT;
    })
}

function startCloth() {
    let internals = Scene.getInternals();
    scene = internals.scene;
    camera = internals.camera;

    geo = new THREE.PlaneGeometry(1.2, 1.2, 200, 200);
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
    scene.add(cloth);

    let geo2 = new THREE.BoxGeometry(1, 1, 1);
    let mat2 = new THREE.MeshBasicMaterial({color: 0x0000ff});
    let mesh2 = new THREE.Mesh(geo2, mat2);
    mesh2.position.z = -2;
    // scene.add(mesh2);

    setupEventListeners();

    onFrame();
}

let startTime = null;
function onFrame(now) {
    requestAnimationFrame(onFrame);

    if (startTime === null && now !== undefined) {
        startTime = now;
    }

    cloth.material.uniforms['uTime'].value = (now - startTime) / 1000;
}

export default {
    startCloth
}