import * as THREE from "three";
import {chairColor, draw_full_mesh_start_percentage, draw_full_mesh_end_percentage, globalScale} from "./constants.js";
import {curves, computeScrollPercent} from "./init.js";
import {remap, remap01, remapCurveEaseOut2} from "./mathUtils.js";

const fullMeshMaterial = new THREE.MeshStandardMaterial({
    color: chairColor,
    roughness: 0.1,
    transparent: true,
})
const fullMeshInitScale = 1.3;
const fullMeshInitOpacity = 0.1;

const shadowPlaneInitOpacity = 0.2;

let fullMeshGroup = null;
let fullMeshes = [];
let shadowPlane = null;
export function drawFullMesh(bigGroup) {
    fullMeshGroup = new THREE.Group();
    fullMeshGroup.scale.set(globalScale, globalScale, globalScale);
    bigGroup.add(fullMeshGroup);
    // fullMeshGroup.rotateX(Math.PI / 10);

    // make curves_local[] array, to move each curve to (0, 0, 0), and transform back to current position, to make scaling from its center instead of (0, 0, 0)
    let curves_local = [];
    let curves_centers = [];
    curves.forEach(curve => {curves_local.push(curve.clone())});
    curves_local.forEach(curve => {
        let center = new THREE.Vector3();
        curve.points.forEach(point => {
            center.add(point);
        })
        center.divideScalar(curve.points.length);
        curves_centers.push(center);
    });
    curves_local.forEach((curve, index) => {
        curve.points.forEach(point => {
            point.sub(curves_centers[index]);
        })
    });

    for (let i = 0; i < curves_local.length; i++) {
        const geometry = new THREE.TubeGeometry(curves_local[i], 200, 0.089, 16, false);
        let fullMesh = new THREE.Mesh(geometry, fullMeshMaterial.clone());
        fullMesh.position.copy(curves_centers[i]);
        fullMesh.castShadow = true;
        fullMesh.receiveShadow = true;
        fullMesh.scale.set(fullMeshInitScale, fullMeshInitScale, fullMeshInitScale);
        fullMesh.material.opacity = fullMeshInitOpacity;
        fullMesh.visible = false;
        fullMeshGroup.add(fullMesh);
        fullMeshes.push(fullMesh);
    }

    // add shader receiver plane
    let shadowPlaneGeo = new THREE.PlaneGeometry(100, 100);
    shadowPlaneGeo.rotateX(-Math.PI / 2);
    let shadowPlaneMat = new THREE.ShadowMaterial({
        opacity: shadowPlaneInitOpacity,
    });
    shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.position.y = -4.5;
    shadowPlane.receiveShadow = true;
    bigGroup.add(shadowPlane);

    return fullMeshGroup;
}

// originally, we await(20), and then animate single layer for 1000 ms
const loadRatio_full_mesh = 1 / 50; // (gap duration between 2 consecutive layers' animations) / (the entire animation duration of a single layer)

export function scrollCb_draw_full_mesh() {
    let scrollPercent = computeScrollPercent();
    if (scrollPercent < draw_full_mesh_start_percentage || scrollPercent > draw_full_mesh_end_percentage) {
        fullMeshGroup.visible = false;
        return;
    } else {
        fullMeshGroup.visible = true;
    }
    // remap 1/3 ~ 2/3 to 0 ~ total animation duration here
    let totalAnimDuration = loadRatio_full_mesh * (fullMeshes.length - 1) + 1;
    // let t = remap(scrollPercent, 0, 1, 0, totalAnimDuration);
    let t = remap(scrollPercent, draw_full_mesh_start_percentage, draw_full_mesh_end_percentage, 0, totalAnimDuration);
    drawFullMeshAnimate(t);
}

function drawFullMeshAnimate(t) {
    for (let i = 0; i < fullMeshes.length; i++) {
        drawFullMeshAnimateLoop(t, i);
    }

    let totalAnimDuration = loadRatio_full_mesh * (fullMeshes.length - 1) + 1;
    let re_t = remap01(t, 0, totalAnimDuration);
    shadowPlane.material.opacity = remap(Math.pow(re_t, 8), 0, 1, shadowPlaneInitOpacity, 0);
}

function drawFullMeshAnimateLoop(t, i) {

    let startTime = loadRatio_full_mesh * i;
    let endTime = loadRatio_full_mesh * i + 1;

    fullMeshes[i].visible = startTime < t;

    let scaleFactor = 1;
    let opacityFactor = 0;

    if (startTime > t) return; // not yet here

    if (endTime <= t) { // already done
        scaleFactor = 1;
        fullMeshes[i].scale.set(scaleFactor, scaleFactor, scaleFactor);
        opacityFactor = 1;
        fullMeshes[i].material.opacity = opacityFactor;
        return;
    }

    scaleFactor = remapCurveEaseOut2(t, startTime, endTime, fullMeshInitScale, 1, 2);
    fullMeshes[i].scale.set(scaleFactor, scaleFactor, scaleFactor);
    opacityFactor = remapCurveEaseOut2(t, startTime, endTime, fullMeshInitOpacity, 1, 2);
    fullMeshes[i].material.opacity = opacityFactor;

}