import * as THREE from "three";
import Scene from "../scene.js";
import {BoundingBox} from "../boundingBox.js";
import {VideoPlane} from "../videoPlane.js";

let arboretumGroup = null;

function startArboretumViewer() {
    let scene = Scene.getInternals().scene;
    arboretumGroup = new THREE.Group();
    scene.add(arboretumGroup);

    // load video
    let videoElement = document.createElement('video');
    videoElement.autoplay = true;
    videoElement.loop = true;
    videoElement.muted = true;
    videoElement.addEventListener('loadedmetadata', (e) => {
        loadVideoCb(e.target);
    });
    videoElement.src = `${import.meta.env.BASE_URL}videos/arboretum.mp4`;

    return arboretumGroup;
}

function loadVideoCb(videoElement) {
    videoElement.play();
    let videoTexture = new THREE.VideoTexture( videoElement );

    let aspect = videoElement.videoWidth / videoElement.videoHeight;
    let videoPlaneMesh = new VideoPlane(1.5, aspect).mesh;
    arboretumGroup.add(videoPlaneMesh);
    videoPlaneMesh.material.uniforms['uVideoTexture'].value = videoTexture;
    videoPlaneMesh.material.uniforms['uVideoAspect'].value = aspect;

    // add bounding box
    let asciiBoundingBox = new BoundingBox(
        new THREE.Vector3(1.6, 1.6 / aspect, 0.2),
        new THREE.Vector3(),
        'Arboretum',
        'Particle garden architectural visualization in Unreal Engine 5',
        '',
        'Players interact with the plants by touching them & generating a unique audio-visual map of the whole journey.'
    );
    let asciiBoundingBoxMesh = asciiBoundingBox.boxMesh;
    let asciiBoundingBoxTextObjs = asciiBoundingBox.textObjs;
    arboretumGroup.add(asciiBoundingBoxMesh);
    arboretumGroup.add(asciiBoundingBoxTextObjs);
}

export default {
    startArboretumViewer,
}