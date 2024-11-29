import * as THREE from "three";
import Scene from "../../scene.js";
import Intersects from "../../intersects.js";
import {BoundingBox} from "../../3dElements/boundingBox.js";
import {VideoPlane} from "../../3dElements/videoPlane.js";
import { initHTML } from "./html.js";

let warpedRealityGroup = null;

let WARPED_REALITY_LABEL = 'warped_reality';

function startWarpedRealityViewer() {
    let scene = Scene.getInternals().scene;
    warpedRealityGroup = new THREE.Group();
    scene.add(warpedRealityGroup);

    // load video
    let videoPlane = new VideoPlane(
        `${import.meta.env.BASE_URL}warpedReality/final.mp4`,
        1.5,
        {
            onLoad: (thisPlane) => {
                warpedRealityGroup.add(thisPlane.mesh);

                // add intersect
                Scene.traverseGroupToAddLabel(thisPlane.mesh, WARPED_REALITY_LABEL);
                Intersects.add(WARPED_REALITY_LABEL, thisPlane.mesh);

                initHTML();

                // add bounding box
                let boundingBox = new BoundingBox(
                    new THREE.Vector3(1.3, 1.3 / thisPlane.aspect, 0.2),
                    new THREE.Vector3(),
                    'Warped Reality',
                    'A series of experiments on non-euclidian lights & cameras',
                    'What if light doesn’t travel on a straight path? What if camera doesn’t take pictures the way it used to?',
                    ''
                );
                let boundingBoxMesh = boundingBox.boxMesh;
                let boundingBoxTextObjs = boundingBox.textObjs;
                warpedRealityGroup.add(boundingBoxMesh);
                warpedRealityGroup.add(boundingBoxTextObjs);
            },
        }
    );

    return warpedRealityGroup;
}

export default {
    startWarpedRealityViewer,
}