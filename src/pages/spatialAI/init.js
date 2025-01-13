import * as THREE from "three";
import Scene from "../../scene.js";
import Intersects from "../../intersects.js";
import {BoundingBox} from "../../3dElements/boundingBox.js";
import {VideoPlane} from "../../3dElements/videoPlane.js";

let aiGroup = null;
let CURSOR_LABEL = 'spatialAI';

function startSpatialAIViewer() {
    let scene = Scene.getInternals().scene;
    aiGroup = new THREE.Group();
    scene.add(aiGroup);

    // load video
    let videoPlane = new VideoPlane(
        `${import.meta.env.BASE_URL}spatialAI/gs_chatbot_1.mp4`,
        1.2,
        {
            onLoad: (thisPlane) => {
                aiGroup.add(thisPlane.mesh);

                Scene.traverseGroupToAddLabel(thisPlane.mesh, CURSOR_LABEL);
                Intersects.add(CURSOR_LABEL, thisPlane.mesh);

                Intersects.addClickCb(CURSOR_LABEL, () => {
                    window.location.href = `${import.meta.env.BASE_URL}spatialAI/index.html`;
                });

                // add bounding box
                let boundingBox = new BoundingBox(
                    new THREE.Vector3(1.3, 1.3 / thisPlane.aspect, 0.2),
                    new THREE.Vector3(),
                    'Spatial AI',
                    '',
                    'Engage in interactive dialogues with your digital twin',
                    ''
                );
                let boundingBoxMesh = boundingBox.boxMesh;
                let boundingBoxTextObjs = boundingBox.textObjs;
                aiGroup.add(boundingBoxMesh);
                aiGroup.add(boundingBoxTextObjs);
            },
        }
    );

    return aiGroup;
}

export default {
    startSpatialAIViewer,
}