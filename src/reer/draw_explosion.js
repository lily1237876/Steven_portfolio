// todo Steve: use cylinder as explode center
//  step 3:
//  make it more random, need to stop and occupy the space evenly
//  less cylinders
//  each cylinder more rotation
import * as THREE from 'three';
import {allVector3Points, computeScrollPercent} from "./init.js";
import {countTotalLineNumber, instanceIndexToPointArrayIndex} from "./utils.js";
import {mix, remap, remapCurveEaseIn1} from "./mathUtils.js";
import {draw_explosion_end_percentage, draw_explosion_start_percentage, globalScale} from "./constants.js";

let fractures = []; // each fracture has [line, position, direction, rotation, speed, a random value, fade function] these fields
let instancedMesh = null;
export function drawExplosion(bigGroup) {
    // 2. construct small line segments
    let group = new THREE.Group();
    group.scale.set(globalScale, globalScale, globalScale);
    bigGroup.add(group);

    // use InstancedMesh instead of regular mesh, to save computing power
    let geo = new THREE.CylinderGeometry( 0.1, 0.1, 0.4, 8, 1 );
    let mat = new THREE.MeshStandardMaterial({
        color: 0xDAFF45,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1,
    });
    instancedMesh = new THREE.InstancedMesh(geo, mat, countTotalLineNumber());
    instancedMesh.visible = false;

    let yDir = new THREE.Vector3(0, 1, 0);
    for (let k = 0; k < instancedMesh.count; k++) {
        let {i, j} = instanceIndexToPointArrayIndex(k);
        let start = allVector3Points[i][j];
        let end = allVector3Points[i].length - 1 === j ? allVector3Points[i][0] : allVector3Points[i][j + 1];

        let p = new THREE.Vector3().addVectors(start, end).divideScalar(2); // midPos
        let d = p.length(); // distance
        let dir = p.clone().normalize(); // direction
        let dirOffsetFactor = 0.4;
        dir.add(new THREE.Vector3().randomDirection().multiplyScalar(dirOffsetFactor));
        let tangent = end.clone().sub(start).normalize();
        let qInitial = new THREE.Quaternion().setFromUnitVectors(yDir, tangent);
        qInitial = new THREE.Euler().setFromQuaternion(qInitial);
        let rotationAngleMultiplier = 10;
        let qFinal = new THREE.Euler(Math.random() * rotationAngleMultiplier, Math.random() * rotationAngleMultiplier, Math.random() * rotationAngleMultiplier);
        // let speedInitial = remap(Math.random(), 0, 1, 0.6, 1.2) / d; // speed: speedInitial ---> 0 // the smaller the distance to origin, the larger the speed
        // let speedInitial = remap(Math.random(), 0, 1, 0.6, 1.2) * d / 10; // speed: speedInitial ---> 0 // the smaller the distance to origin, the larger the speed
        let speedInitial = remap(Math.random(), 0, 1, 6, 12); // speed: speedInitial ---> 0 // the smaller the distance to origin, the larger the speed
        let scaleX = remap(Math.random(), 0, 1, 0.7, 1);
        let scaleY = remap(Math.random(), 0, 1, 0.7, 1);
        let scaleZ = remap(Math.random(), 0, 1, 0.7, 1);
        let scale = new THREE.Vector3(scaleX, scaleY, scaleZ);

        fractures.push({
            position: p,
            direction: dir,
            q: qInitial.clone(),
            qInitial: qInitial,
            qFinal: qFinal,
            speed: speedInitial,
            speedInitial: speedInitial,
            scale: scale,
        })

        let q = new THREE.Quaternion().setFromEuler(qInitial);
        let m = new THREE.Matrix4().compose(p, q, scale);

        instancedMesh.setMatrixAt(k, m);
    }
    instancedMesh.instanceMatrix.needsUpdate = true;
    group.add(instancedMesh);

    return group;
}

export function scrollCb_draw_explosion() {
    let scrollPercent = computeScrollPercent();
    if (scrollPercent < draw_explosion_start_percentage) {
        instancedMesh.visible = false;
        return;
    } else {
        instancedMesh.visible = true;
    }
    // todo Steve: remap 2/3 ~ 1 to 0 ~ 1 here
    let t = remap(scrollPercent, draw_explosion_start_percentage, draw_explosion_end_percentage, 0, 1);
    animateExplode(t);
}

function animateExplode(t) {
    let t2 = remapCurveEaseIn1(t, 0, 1, 0, 1, 2);
    animateExplodeLoop(t2);
}

function animateExplodeLoop(t) {
    for (let i = 0; i < instancedMesh.count; i++) {
        let info = fractures[i];

        let v0 = info.direction.clone().multiplyScalar(info.speedInitial);
        let a = v0.clone().negate();
        let p = info.position.clone().add(v0.multiplyScalar(t)).add(a.multiplyScalar(0.5 * t * t));

        info.q.x = mix(info.qInitial.x, info.qFinal.x, t);
        info.q.y = mix(info.qInitial.y, info.qFinal.y, t);
        info.q.z = mix(info.qInitial.z, info.qFinal.z, t);
        let q = new THREE.Quaternion().setFromEuler(info.q);

        let m = new THREE.Matrix4().compose(p, q, info.scale);
        instancedMesh.setMatrixAt(i, m);
    }
    instancedMesh.instanceMatrix.needsUpdate = true;
    instancedMesh.material.opacity = mix(1, 0, t);
    instancedMesh.material.needsUpdate = true;
}