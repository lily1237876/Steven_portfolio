import * as THREE from "three";
import Scene from "../scene.js";
import {BoundingBox} from "../boundingBox.js";
import {VideoPlane} from "../videoPlane.js";

let moonGroup = null;

function startMoonMeasureViewer() {
    let scene = Scene.getInternals().scene;
    moonGroup = new THREE.Group();
    scene.add(moonGroup);

    // load video
    let videoElement = document.createElement('video');
    videoElement.autoplay = true;
    videoElement.loop = true;
    videoElement.muted = true;
    videoElement.addEventListener('loadedmetadata', (e) => {
        loadVideoCb(e.target);
    });
    videoElement.src = `${import.meta.env.BASE_URL}videos/moon.mp4`;

    return moonGroup;
}

function loadVideoCb(videoElement) {
    videoElement.play();
    let videoTexture = new THREE.VideoTexture( videoElement );

    let aspect = videoElement.videoWidth / videoElement.videoHeight;
    let videoPlaneMesh = new VideoPlane(1.5, aspect).mesh;
    moonGroup.add(videoPlaneMesh);
    videoPlaneMesh.material.uniforms['uVideoTexture'].value = videoTexture;
    videoPlaneMesh.material.uniforms['uVideoAspect'].value = aspect;

    // add bounding box
    let asciiBoundingBox = new BoundingBox(
        new THREE.Vector3(1.6, 1.6 / aspect, 0.2),
        new THREE.Vector3(),
        'Spatial Measurement Tool',
        'Lunar Surface Geospatial Analysis',
        'Collaboration project between PTC Reality Lab, MIT Media Lab, and NASA. Presented at MIT Media Lab members week',
        'Developed a spatial measurement tool in Three.js and GLSL that analyzes lunar surface geospatial data. Besides measuring the length, area, volume of different surface regions, the tool allows user to find shortest path between 2 points, visualize surface height / steepness with shaders, and much more.'
    );
    let asciiBoundingBoxMesh = asciiBoundingBox.boxMesh;
    let asciiBoundingBoxTextObjs = asciiBoundingBox.textObjs;
    moonGroup.add(asciiBoundingBoxMesh);
    moonGroup.add(asciiBoundingBoxTextObjs);
}

export default {
    startMoonMeasureViewer,
}