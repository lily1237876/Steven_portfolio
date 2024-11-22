import * as THREE from "three";
import Scene from "../scene.js";
import {BoundingBox} from "../boundingBox.js";
import {VideoPlane} from "../videoPlane.js";

let asciiGroup = null;

function startAsciiViewer() {
    let scene = Scene.getInternals().scene;
    asciiGroup = new THREE.Group();
    scene.add(asciiGroup);

    // load video
    let videoElement = document.createElement('video');
    videoElement.autoplay = true;
    videoElement.loop = true;
    videoElement.muted = true;
    videoElement.addEventListener('loadedmetadata', (e) => {
        loadVideoCb(e.target);
    });
    videoElement.src = `${import.meta.env.BASE_URL}videos/ascii.mp4`;

    return asciiGroup;
}

function loadVideoCb(videoElement) {
    videoElement.play();
    let videoTexture = new THREE.VideoTexture( videoElement );

    let aspect = videoElement.videoWidth / videoElement.videoHeight;
    let videoPlaneMesh = new VideoPlane(1.5, aspect).mesh;
    asciiGroup.add(videoPlaneMesh);
    videoPlaneMesh.material.uniforms['uVideoTexture'].value = videoTexture;
    videoPlaneMesh.material.uniforms['uVideoAspect'].value = aspect;

    // add bounding box
    let asciiBoundingBox = new BoundingBox(
        new THREE.Vector3(1, 1 / aspect, 0.2),
        new THREE.Vector3(),
        'Buffer.js',
        'A retro-inspired ASCII render engine, in pure JavaScript.',
        'Feeling Nostalgic......',
        'Computer terminals and game consoles. How cool. I didn\'t know how exactly they work, but at least I made one that looks like \'em. Users can draw or use simple code to control motion graphics, as if they\'re rendered on an 80s monitor.'
    );
    let asciiBoundingBoxMesh = asciiBoundingBox.boxMesh;
    let asciiBoundingBoxTextObjs = asciiBoundingBox.textObjs;
    asciiGroup.add(asciiBoundingBoxMesh);
    asciiGroup.add(asciiBoundingBoxTextObjs);
}

export default {
    startAsciiViewer,
}