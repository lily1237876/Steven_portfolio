import * as THREE from "three";
import {CSS3DRenderer} from "../lib/CSS3DRenderer.js";
import {OrbitControls} from "three/addons";
import Constants from './constants.js';
import SplatViewer from "./splatting/Splatting.js";

let camera, scene, renderer, controls;
let cssRenderer;
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

function init() {
    // renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);
    let canvasParentDiv = document.querySelector('#three-js-canvas');
    canvasParentDiv.appendChild(renderer.domElement);

    // CSS 3D Renderer
    cssRenderer = new CSS3DRenderer();
    cssRenderer.setSize(innerWidth, innerHeight);
    const css3dCanvas = cssRenderer.domElement;
    css3dCanvas.id = 'css-3d-canvas';
    document.body.appendChild(css3dCanvas);

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
    // todo Steve: temporarily commented out
    // controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableZoom = false;

    setupEventListeners();

    animate();
}

function setupEventListeners() {
    window.addEventListener('resize', () => {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( innerWidth, innerHeight );
        cssRenderer.setSize( innerWidth, innerHeight );
    })
}

function animate() {
    requestAnimationFrame(animate);

    camera.updateMatrixWorld(true);
    let m = camera.matrixWorld.clone().elements;
    SplatViewer.updateCameraMatrix(m);

    renderer.render(scene, camera);
    cssRenderer.render(scene, camera);
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

// todo Steve: this is useful when multiple objects are in the group, and we raycast onto a child object
//  but we need to identify the entire group category
function traverseGroupToAddLabel(group, label) {
    if (group.children.length === 0) {
        group.userData.label = label;
        return;
    }
    group.userData.label = label;
    for (let i = 0; i < group.children.length; i++) {
        traverseGroupToAddLabel(group.children[i], label);
    }
}

function addTestCube() {
    let geo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    let mat = new THREE.MeshStandardMaterial({color: 0x0000ff});
    return new THREE.Mesh(geo, mat);
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
    init,
    updateCameraAndControls,
    getCameraAngleAndDistance,
    traverseGroupToAddLabel,
    addTestCube,
    getInternals,
}