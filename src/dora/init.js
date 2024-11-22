import * as THREE from "three";
import { GLTFLoader } from "three/addons";
import Scene from "../scene.js";
import Intersects from "../intersects.js";
import {clamp, remapCurveEaseIn2, remapCurveEaseOut2} from "../mathUtils.js";
import {BoundingBox} from "../boundingBox.js";

let scene;
let loader;

let doraGroup; // for the entire group, including the bounding box
let doraObjs; // only for the dora object meshes
let duck, woodenHorse, telephone, fireExtinguisher;

let DORA_LABEL = 'dora';
let isActive = true;

async function startDoraViewer() {
    loader = new GLTFLoader();
    scene = Scene.getInternals().scene;


    // let camPos = new THREE.Vector3(0, 0, 2);
    // let camTargetPos = new THREE.Vector3(0, 0, 0);
    // Scene.updateCameraAndControls(camPos, camTargetPos);

    await loadModels();

    onFrame();

    return doraGroup;

    // 3D folders?
    // hover over and they pop up with background changing into corresponding images?
    // with a timeline that changes when scrolling on the page?
    // https://yuannstudio.com/
}

async function loadModels() {
    let doraModelPath = `${import.meta.env.BASE_URL}models/dora.glb`;
    return new Promise(resolve => {
        loader.load(
            doraModelPath,
            function(gltf) {
                doraObjs = gltf.scene;
                // todo Steve: to enable raycasting onto any object / entire doraGroup, and get the intersect information from index.js, add below 2 lines
                Scene.traverseGroupToAddLabel(doraObjs, DORA_LABEL);
                Intersects.add(DORA_LABEL, doraObjs);

                duck = doraObjs.children[0];
                woodenHorse = doraObjs.children[1];
                telephone = doraObjs.children[2];
                fireExtinguisher = doraObjs.children[3];

                let scaleFactor = 1;
                doraObjs.scale.set(scaleFactor, scaleFactor, scaleFactor);

                doraGroup = new THREE.Group();
                doraGroup.add(doraObjs);
                scene.add(doraGroup);

                let boundingBoxSize = 0.95;
                let doraBoundingBox = new BoundingBox(
                    new THREE.Vector3(boundingBoxSize, boundingBoxSize, boundingBoxSize),
                    new THREE.Vector3(),
                    'Dora\'s Firefly',
                    'Interactive Storytelling in Unreal Engine 5',
                    '“How do we deal with past trauma?”',
                    'A story about loss & found of inner peace after trauma. Made in UE5 with Niagara particle system, animation system, and blueprints. All 3D objects modeled in Blender.');
                let doraBoundingBoxMesh = doraBoundingBox.boxMesh;
                let doraBoundingBoxTextObjs = doraBoundingBox.textObjs;
                doraGroup.add(doraBoundingBoxMesh);
                doraGroup.add(doraBoundingBoxTextObjs);

                resolve();
            }
        );
    })
}


let tLow = 1;
let tHigh = 1.3;
let t = 0;
let tSpeed = 0.02;
function onFrame() {
    requestAnimationFrame(onFrame);
    if (!doraObjs) return;
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
    doraObjs.scale.set(actualT, actualT, actualT);
}

export default {
    startDoraViewer,
}