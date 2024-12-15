import * as THREE from "three";
import Scene from "../../scene.js";
import {BoundingBox} from "../../3dElements/boundingBox.js";
import {VideoPlane} from "../../3dElements/videoPlane.js";

let asciiGroup = null;

function startAsciiViewer() {
    let scene = Scene.getInternals().scene;
    asciiGroup = new THREE.Group();
    scene.add(asciiGroup);

    // load video
    let videoPlane = new VideoPlane(
        `${import.meta.env.BASE_URL}bufferJS/4d_cube.mp4`,
        1.5,
        {
            onLoad: (thisPlane) => {
                asciiGroup.add(thisPlane.mesh);

                // add bounding box
                let boundingBox = new BoundingBox(
                    new THREE.Vector3(1, 1 / thisPlane.aspect, 0.2),
                    new THREE.Vector3(),
                    'Buffer.js',
                    'A retro-inspired ASCII render engine, in pure JavaScript.',
                    'Feeling Nostalgic......',
                    'Computer terminals and game consoles. How cool. I didn\'t know how exactly they work, but at least I made one that looks like \'em. Users can draw or use simple code to control motion graphics, as if they\'re rendered on an 80s monitor.'
                );
                let boundingBoxMesh = boundingBox.boxMesh;
                let boundingBoxTextObjs = boundingBox.textObjs;
                asciiGroup.add(boundingBoxMesh);
                asciiGroup.add(boundingBoxTextObjs);
            },
        }
    );

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
    let boundingBox = new BoundingBox(
        new THREE.Vector3(1, 1 / aspect, 0.2),
        new THREE.Vector3(),
        'Buffer.js',
        'A retro-inspired ASCII render engine, in pure JavaScript.',
        'Feeling Nostalgic......',
        'Computer terminals and game consoles. How cool. I didn\'t know how exactly they work, but at least I made one that looks like \'em. Users can draw or use simple code to control motion graphics, as if they\'re rendered on an 80s monitor.'
    );
    let boundingBoxMesh = boundingBox.boxMesh;
    let boundingBoxTextObjs = boundingBox.textObjs;
    asciiGroup.add(boundingBoxMesh);
    asciiGroup.add(boundingBoxTextObjs);
}

export default {
    startAsciiViewer,
}