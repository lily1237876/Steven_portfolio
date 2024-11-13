import * as THREE from "three";
import {OrbitControls} from "three/addons";
import Constants from './constants.js';
import SplatViewer from "./splatting/Splatting.js";

let camera, scene, renderer, controls;
let pointer, raycaster;

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

function initScene() {
    // renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);
    let canvas_parent_div = document.querySelector('#canvas-container');
    canvas_parent_div.style.position = 'absolute';
    canvas_parent_div.style.zIndex = '2';
    canvas_parent_div.appendChild(renderer.domElement);

    // scene
    scene = new THREE.Scene();

    // camera
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.copy(camPosStart);
    camera.lookAt(Constants.camTargetPosStart);
    // camera.position.set(2, 2, 2);
    // camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld(true);

    // lighting
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    // const light2 = new THREE.PointLight(0xffffff, 20, 100);
    // light2.position.set(5, 5, 5);
    // scene.add(light2);

    const light2 = new THREE.DirectionalLight( 0xffffff, 2 );
    scene.add(light2);
    light2.position.set( 4, 4, 4 );
    light2.castShadow = true;
    light2.shadow.camera.near = 0.01;
    light2.shadow.camera.far = 500;
    light2.shadow.bias = - 0.000222;
    light2.shadow.mapSize.width = 2048;
    light2.shadow.mapSize.height = 2048;

    // mesh
    let meshSize = 0.1;
    let geometry = new THREE.BoxGeometry(meshSize, meshSize, meshSize);
    let material = new THREE.MeshStandardMaterial({color: 0x0000ff});
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(Constants.camTargetPosEnd);
    // scene.add(mesh);

    // scene.add(new THREE.AxesHelper());

    // set up mouse and raycaster
    pointer = new THREE.Vector2();
    raycaster = new THREE.Raycaster();

    // orbit control
    controls = new OrbitControls(camera, renderer.domElement);
    // todo Steve: temporarily commented out
    // controls.enableZoom = false;

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    camera.updateMatrixWorld(true);
    let m = camera.matrixWorld.clone().elements;
    SplatViewer.updateCameraMatrix(m);

    renderer.render(scene, camera);

}

function updateCameraAndControls(position, targetPosition) {
    camera.position.copy(position);
    camera.lookAt(targetPosition);
}

function getCameraAngleAndDistance(position, target) { // return azimuthal & polar angles, and distance
    let v = new THREE.Vector3().subVectors(position, target);
    let distance = v.length();
    let polarAngle = Math.acos(v.y / distance);
    let azimuthalAngle = Math.acos(v.z / (distance * Math.sin(polarAngle)));
    return {
        distance,
        polarAngle,
        azimuthalAngle
    };
}

function getInternals() {
    return {
        scene,
        camera,
        renderer,
        controls,
        pointer,
        raycaster,
    };
}

export default {
    getCameraPosition,
    initScene,
    updateCameraAndControls,
    getCameraAngleAndDistance,
    getInternals,
}