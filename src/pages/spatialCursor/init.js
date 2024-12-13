import * as THREE from "three";
import Scene from "../../scene.js";
import Intersects from "../../intersects.js";
import {BoundingBox} from "../../3dElements/boundingBox.js";
import {VideoPlane} from "../../3dElements/videoPlane.js";

let cursorGroup = null;
let CURSOR_LABEL = 'spatialCursor';

function startSpatialCursorViewer() {
    let scene = Scene.getInternals().scene;
    cursorGroup = new THREE.Group();
    scene.add(cursorGroup);

    // load video
    let videoPlane = new VideoPlane(
        `${import.meta.env.BASE_URL}spatialCursor/spatial_cursor_design.mp4`,
        1.5,
        {
            onLoad: (thisPlane) => {
                cursorGroup.add(thisPlane.mesh);

                Scene.traverseGroupToAddLabel(thisPlane.mesh, CURSOR_LABEL);
                Intersects.add(CURSOR_LABEL, thisPlane.mesh);

                Intersects.addClickCb(CURSOR_LABEL, () => {
                    window.location.href = `${import.meta.env.BASE_URL}spatialCursor/index.html`;
                });

                // add bounding box
                let boundingBox = new BoundingBox(
                    new THREE.Vector3(1.6, 1.6 / thisPlane.aspect, 0.2),
                    new THREE.Vector3(),
                    'Spatial Cursor',
                    '',
                    'Re-imagine traditional mouse cursors, in 3D space',
                    ''
                );
                let boundingBoxMesh = boundingBox.boxMesh;
                let boundingBoxTextObjs = boundingBox.textObjs;
                cursorGroup.add(boundingBoxMesh);
                cursorGroup.add(boundingBoxTextObjs);
            },
        }
    );

    return cursorGroup;
}

export default {
    startSpatialCursorViewer,
}