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
    // load video
    let videoPlane = new VideoPlane(
        `${import.meta.env.BASE_URL}arboretum/arboretum.mp4`,
        1.5,
        {
            onLoad: (thisPlane) => {
                arboretumGroup.add(thisPlane.mesh);

                // add bounding box
                let boundingBox = new BoundingBox(
                    new THREE.Vector3(1.6, 1.6 / thisPlane.aspect, 0.2),
                    new THREE.Vector3(),
                    'Arboretum',
                    'Particle garden architectural visualization in Unreal Engine 5',
                    '',
                    'Players interact with the plants by touching them & generating a unique audio-visual map of the whole journey.'
                );
                let boundingBoxMesh = boundingBox.boxMesh;
                let boundingBoxTextObjs = boundingBox.textObjs;
                arboretumGroup.add(boundingBoxMesh);
                arboretumGroup.add(boundingBoxTextObjs);
            },
        }
    );

    return arboretumGroup;
}

export default {
    startArboretumViewer,
}