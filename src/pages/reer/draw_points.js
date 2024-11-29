import * as THREE from "three";
import {points, points_fat, points_thin} from "./points.js";
import {vsReerChairSource, fsReerChairSource} from "./shaders.js";
import {computeScrollPercent, params} from "./init.js";
import {
    divisionCount_init,
    divisionCount_result,
    draw_points_end_percentage,
    draw_points_start_percentage,
    globalScale,
} from "./constants.js";
import {mix, parabola, remap, remap01, remapCurveEaseOut2} from "./mathUtils.js";

let moving_points_fat_attri_arr = [];
let moving_points_thin_attri_arr = [];
let moving_points_original_attri_arr = [];
let moving_points_attri_arr = [];
let pointCloud = null;

function loadPointsOnCurve(src, dst) {
    for (let i = 0; i < src.length; i++) {
        let pointsOnThisCurveArray = src[i];
        let pointsOnThisCurve = [];
        for (let j = 0; j < pointsOnThisCurveArray.length; j++) {
            pointsOnThisCurve.push(new THREE.Vector3().fromArray(pointsOnThisCurveArray[j]));
        }
        const curve = new THREE.CatmullRomCurve3(pointsOnThisCurve);
        curve.closed = true;
        pointsOnThisCurve = curve.getSpacedPoints(divisionCount_init);
        // convert Vector3 back to array, and then flatten it into 1d array
        for (let i = 0; i < pointsOnThisCurve.length; i++) {
            pointsOnThisCurve[i] = pointsOnThisCurve[i].toArray();
        }
        pointsOnThisCurve = pointsOnThisCurve.flat();
        dst.push(...pointsOnThisCurve);
    }
}

let pointsGroup = null;
export function drawPoints(bigGroup) {
    pointsGroup = new THREE.Group();
    pointsGroup.scale.set(globalScale, globalScale, globalScale);
    bigGroup.add(pointsGroup);
    // pointsGroup.rotateX(Math.PI / 10);

    // each attri_arr holds divisionCount_result * length of vector 3 * points.length numbers
    // i.e. 101 * 3 * 50 numbers
    loadPointsOnCurve(points_fat, moving_points_fat_attri_arr);
    loadPointsOnCurve(points, moving_points_original_attri_arr);
    loadPointsOnCurve(points_thin, moving_points_thin_attri_arr);

    let index_arr = [];
    for (let i = 0; i < moving_points_original_attri_arr.length; i++) {
        index_arr.push(i);
    }

    // moving_points_original_attri_arr = shufflePointPositionAttributeArray(moving_points_original_attri_arr, 3);
    // moving_points_fat_attri_arr = shufflePointPositionAttributeArray(moving_points_fat_attri_arr, 3);
    // moving_points_thin_attri_arr = shufflePointPositionAttributeArray(moving_points_thin_attri_arr, 3);

    moving_points_attri_arr = [...moving_points_fat_attri_arr];
    // moving_points_attri_arr = [...moving_points_original_attri_arr];
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(moving_points_attri_arr), 3, false));
    geometry.setAttribute('index', new THREE.BufferAttribute(new Int8Array(index_arr), 1, false));
    geometry.computeBoundingSphere();
    geometry.computeBoundingBox();

    let material = new THREE.ShaderMaterial({
        transparent: true,
        vertexShader: vsReerChairSource,
        fragmentShader: fsReerChairSource,
        depthTest: false,
        uniforms: {
            uColor: {value: new THREE.Color(0xDAFF45)},
            uPointSizeTempScaleFactor: {value: params.pointSizeTempScaleFactor},
            uPointSize: {value: params.pointSize},
            uTime: {value: 0},
            uIntersectBool: {value: false},
            uIntersectPos: {value: new THREE.Vector3()},
            uBoundingSphereCenter: {value: geometry.boundingSphere.center},
            uBoundingSphereRadius: {value: geometry.boundingSphere.radius},
            uBoundingBoxCenter: {value: function() {
                    return new THREE.Vector3().addVectors(geometry.boundingBox.max, geometry.boundingBox.min).divideScalar(2);
                }()},
            uBoundingBoxSize: {value: function() {
                    return new THREE.Vector3().subVectors(geometry.boundingBox.max, geometry.boundingBox.min);
                }()},
            uT2: {value: 0},
            uAnimDirection: {value: 1},
            uAnimDone: {value: false},
            uAlpha: {value: 0},
        }
    })

    pointCloud = new THREE.Points(geometry, material);
    pointsGroup.add(pointCloud);

    // todo Steve: instead of morphing all the points at the same time,
    //  can I morph points layer by layer ?
    //  this way, we slow down the morphing process to only make one transition, and also add more flavor to it
    // await animatePoints(animatePointsLoop, moving_points_fat_attri_arr, moving_points_thin_attri_arr);
    // await animatePoints(animatePointsLoop, moving_points_thin_attri_arr, moving_points_original_attri_arr);
    // pointCloud.material.uniforms['uAnimDirection'].value = 0;
    // await animatePoints(animatePointsLoop, moving_points_original_attri_arr, moving_points_fat_attri_arr);
    // pointCloud.material.uniforms['uAnimDone'].value = true;

    // pointCloud.material.uniforms['uAnimDirection'].value = 0;
    pointCloud.material.uniforms['uAnimDirection'].value = 2;
    pointCloud.geometry.computeBoundingBox(); // todo Steve: need to recompute bounding box, but the bounding box we got was the last bounding box, not the bounding box that we're morphing into
    pointCloud.material.uniforms['uBoundingBoxCenter'].value = new THREE.Vector3().addVectors(pointCloud.geometry.boundingBox.max, pointCloud.geometry.boundingBox.min).divideScalar(2);
    pointCloud.material.uniforms['uBoundingBoxSize'].value = new THREE.Vector3().subVectors(pointCloud.geometry.boundingBox.max, pointCloud.geometry.boundingBox.min);
    // console.log(pointCloud.material.uniforms['uBoundingBoxCenter'].value, pointCloud.material.uniforms['uBoundingBoxSize'].value);
    pointCloud.material.uniforms['uT2'].value = 0;
    pointCloud.material.uniforms['uAlpha'].value = 0;

    return pointCloud;
}

export function scrollCb_draw_points() {
    let scrollPercent = computeScrollPercent();
    // todo Steve: remap 0 ~ 1/3 to 0 ~ 1 here
    let t = remap(scrollPercent, draw_points_start_percentage, draw_points_end_percentage, 0, 1);
    animatePoints(t, animatePointsLoop, moving_points_fat_attri_arr, moving_points_original_attri_arr);
}

function animatePoints(t, cb, src, dst) {
    let t1 = remap(t, 0, 1, 0, 1); // [0, 1]
    let t2 = remapCurveEaseOut2(t, 0, 1, 0, 1, 2); // [0, 1]
    // let attriArrayIndexCount = remapCurveEaseOut2(t, 500, renderPointsDuration - 500, 0, moving_points_attri_arr.length);
    // let layerCount = remapCurveEaseOut2(t, 0, 1 - 1 / 2, 0, points.length);
    // let layerCount = remapCurveEaseOut2(t, 0, 1 / 2, 0, points.length);
    let layerCount = remapCurveEaseOut2(t, 0, 1, 0, points.length);
    cb(t1, t2, src, dst, layerCount);
}

const loadRatio_points = 1 / 50; // 50 layers in total, this will roughly make the last layer morph right before fading out to step 2 full mesh

function animatePointsLoop(t1, t2, src, dst, count) { // t range [0, 1]
    let source_attrib_arr = pointCloud.geometry.attributes.position.array;
    for (let i = 0; i < source_attrib_arr.length; i++) {
        // if (i > count * divisionCount_result * 3) {
        //     continue;
        // }
        // source_attrib_arr[i] = mix(src[i], dst[i], t2);
        let totalAnimDuration = loadRatio_points * (points.length - 1) + 1;
        let layerCount = Math.ceil(i / (divisionCount_result * 3));
        let startTime = loadRatio_points * layerCount / totalAnimDuration;
        let endTime = (loadRatio_points * layerCount + 1) / totalAnimDuration;
        let a = remap01(t2, startTime, endTime);
        source_attrib_arr[i] = mix(src[i], dst[i], a);
    }
    pointCloud.geometry.attributes.position.needsUpdate = true;

    pointCloud.material.uniforms['uT2'].value = t2;

    pointCloud.material.uniforms['uAnimDone'].value = t1 >= 0.99;

    pointCloud.material.uniforms['uAlpha'].value = parabola(t1, 0.3);
}