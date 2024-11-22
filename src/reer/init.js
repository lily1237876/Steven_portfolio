import * as THREE from 'three';
import Scene from "../scene.js";
import {drawPoints, scrollCb_draw_points} from "./draw_points.js";
import {drawFullMesh, scrollCb_draw_full_mesh} from "./draw_full_mesh.js";
import {drawExplosion, scrollCb_draw_explosion} from "./draw_explosion.js";
import {points} from "./points.js";
import {divisionCount_init, divisionCount_result} from "./constants.js";
import {BoundingBox} from "../boundingBox";

let bigGroup = null; // everything, including chairGroup and bounding box
let chairGroup = null; // only includes 3 chair visualization groups
let pointCloud = null;
let fullMeshGroup = null;
let explosionGroup = null;

export const params = {
    focusDistance: 5,
    pointSizeTempScaleFactor: 0.6,
    pointSize: 5.3,
};

function startChairViewer() {
    let scene = Scene.getInternals().scene;
    bigGroup = new THREE.Group();
    scene.add(bigGroup);

    loadCurvesForFullAndInstancedMesh(scene);

    chairGroup = new THREE.Group();
    chairGroup.rotation.y = Math.PI / 4;
    chairGroup.rotation.x = Math.PI / 8;
    chairGroup.position.x = -0.1;
    chairGroup.position.y = -0.1;

    bigGroup.add(chairGroup);
    pointCloud = drawPoints(chairGroup);
    fullMeshGroup = drawFullMesh(chairGroup);
    explosionGroup = drawExplosion(chairGroup);

    // add bounding box
    let chairBoundingBox = new BoundingBox(
        new THREE.Vector3(1, 1, 1),
        new THREE.Vector3(),
        'Reer (client work)',
        'Point-cloud shader, scroll animation, explosion effect in three.js',
        '',
        'Built an interactive 3D chair that morphs through different phases, to illustrate the 3D printing process and recyclable mindset behind Reer\'s product design.');
    let chairBoundingBoxMesh = chairBoundingBox.boxMesh;
    let chairBoundingBoxTextObjs = chairBoundingBox.textObjs;
    bigGroup.add(chairBoundingBoxMesh);
    bigGroup.add(chairBoundingBoxTextObjs);

    onFrame();

    setInterval(() => {
        if (scrollPercent <= 0 || scrollPercent >= 1) {
            scrollSpeed *= -1;
        }
        scrollPercent += scrollSpeed;
    }, 10);

    return bigGroup;
}

let scrollPercent = 0.00001;
let scrollSpeed = 0.002;
export function computeScrollPercent() { // [0, 1]
    return scrollPercent;
}

export let drawRanges = []; // a 1d array of all the draw ranges of each curve in each layer of chair
export let curves = []; // a 1d array of original THREE.CatmullRomCurve3() curves for each layer of chair, used when constructing TubeGeometry mesh
export let allVector3Points = []; // a 2d array of THREE.Vector3() points in points.js

function loadCurvesForFullAndInstancedMesh() {
    for (let i = 0; i < points.length; i++) {
        let pointsOnThisCurveArray = points[i];
        let pointsOnThisCurve = [];
        for (let j = 0; j < pointsOnThisCurveArray.length; j++) {
            pointsOnThisCurve.push(new THREE.Vector3().fromArray(pointsOnThisCurveArray[j]));
        }

        const curve = new THREE.CatmullRomCurve3(pointsOnThisCurve);
        curve.closed = true;

        curves.push(curve);

        pointsOnThisCurve = curve.getSpacedPoints(divisionCount_init);
        drawRanges.push(divisionCount_result);

        allVector3Points.push(pointsOnThisCurve);
    }
}

let startTime = null;
function onFrame(timestamp) {
    requestAnimationFrame(onFrame);

    if (startTime === null && timestamp !== undefined) {
        startTime = timestamp;
    }
    let uTime = (timestamp - startTime) / 1000;
    if (pointCloud !== null) {
        pointCloud.material.uniforms['uTime'].value = uTime;
        pointCloud.material.needsUpdate = true;
        scrollCb_draw_points();
    }

    if (fullMeshGroup !== null) {
        fullMeshGroup.position.y = Math.sin(uTime * 3) * 0.03;
        scrollCb_draw_full_mesh();
    }

    if (fullMeshGroup !== null) {
        scrollCb_draw_explosion();
    }

    // renderer.render(scene, camera);
}

export default {
    startChairViewer,
}