import * as THREE from "three";
import { GLTFLoader } from "three/addons";
import Scene from "../scene.js";
import Intersects from "../intersects.js";
import {clamp, remapCurveEaseIn2, remapCurveEaseOut2} from "../mathUtils.js";

let scene, camera, renderer, controls;
let loader;

let group;
let duck, woodenHorse, telephone, fireExtinguisher;

let DORA_LABEL = 'dora';
let isActive = true;

function startDoraViewer() {
    loader = new GLTFLoader();
    let {scene, camera, renderer, controls} = Scene.getInternals();


    // let camPos = new THREE.Vector3(0, 0, 2);
    // let camTargetPos = new THREE.Vector3(0, 0, 0);
    // Scene.updateCameraAndControls(camPos, camTargetPos);

    let meshSize = 1;
    let geometry = new THREE.BoxGeometry(meshSize, meshSize, meshSize);
    let material = new THREE.MeshStandardMaterial({color: 0xffffff});
    let mesh = new THREE.Mesh(geometry, material);
    // scene.add(mesh);

    // scene.add(new THREE.AxesHelper());

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

    let doraModelPath = `${import.meta.env.BASE_URL}models/dora.glb`;
    loader.load(
        doraModelPath,
        function(gltf) {
            group = gltf.scene;
            traverseGroupToAddLabel(group, DORA_LABEL);
            // group.position.y = -0.4;
            // console.log(group);
            Intersects.add(DORA_LABEL, group);

            duck = group.children[0];
            woodenHorse = group.children[1];
            telephone = group.children[2];
            fireExtinguisher = group.children[3];

            let scaleFactor = 1;
            group.scale.set(scaleFactor, scaleFactor, scaleFactor);
            scene.add(group);
        }
    );

    onFrame();

    // 3D folders?
    // hover over and they pop up with background changing into corresponding images?
    // with a timeline that changes when scrolling on the page?
    // https://yuannstudio.com/
}


let tLow = 1;
let tHigh = 1.5;
let t = 0;
let tSpeed = 0.02;
function onFrame() {
    requestAnimationFrame(onFrame);
    if (!group) return;
    if (!isActive) return;
    let actualT;
    if (Intersects.intersectedLabel === DORA_LABEL) {
        t += tSpeed;
        t = clamp(t, tLow, tHigh);
        actualT = remapCurveEaseOut2(t, tLow, tHigh, tLow, tHigh, 2);
    } else {
        t -= tSpeed;
        t = clamp(t, tLow, tHigh);
        actualT = remapCurveEaseIn2(t, tLow, tHigh, tLow, tHigh, 2);
    }
    group.scale.set(actualT, actualT, actualT);
}

export default {
    startDoraViewer,
}