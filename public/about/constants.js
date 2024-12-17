import { Vector3 } from "three";

let camTargetPosStart = new Vector3(0, 0, 0);
let camTargetPosEnd = new Vector3(-0.08, 0, 0.5);
let azimuthalAngleStart = -0.7605214144197971;
let azimuthalAngleEnd = -Math.PI;
let polarAngleStart = 1.109906013934148;
let polarAngleEnd = 0.8;
let cameraTargetDistanceStart = 2.18548886703139;
let cameraTargetDistanceEnd = 0.01;

export default {
    camTargetPosStart,
    camTargetPosEnd,
    azimuthalAngleStart,
    azimuthalAngleEnd,
    polarAngleStart,
    polarAngleEnd,
    cameraTargetDistanceStart,
    cameraTargetDistanceEnd,
}