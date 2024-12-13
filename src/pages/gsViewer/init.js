import * as THREE from "three";
import Scene from "../../scene.js";
import Intersects from "../../intersects.js";
import {BoundingBox} from "../../3dElements/boundingBox.js";
import {VideoPlane} from "../../3dElements/videoPlane.js";

let gsGroup = null;
let GS_LABEL = 'gaussianSplattingViewer';

function startGSViewerProject() {
    let scene = Scene.getInternals().scene;
    gsGroup = new THREE.Group();
    scene.add(gsGroup);

    // load video
    let videoPlane = new VideoPlane(
        `${import.meta.env.BASE_URL}gsViewer/gs_viewer_final.mp4`,
        1.5,
        {
            onLoad: (thisPlane) => {
                gsGroup.add(thisPlane.mesh);

                Scene.traverseGroupToAddLabel(thisPlane.mesh, GS_LABEL);
                Intersects.add(GS_LABEL, thisPlane.mesh);

                Intersects.addClickCb(GS_LABEL, () => {
                    window.location.href = `${import.meta.env.BASE_URL}gsViewer/index.html`;
                });

                // add bounding box
                let boundingBox = new BoundingBox(
                    new THREE.Vector3(1.6, 1.6 / thisPlane.aspect, 0.2),
                    new THREE.Vector3(),
                    'Customized 3D Gaussian Splatting viewer',
                    '',
                    'Customized splat viewer with raycasting, segmentation labels, and multi-scene editing support',
                    ''
                );
                let boundingBoxMesh = boundingBox.boxMesh;
                let boundingBoxTextObjs = boundingBox.textObjs;
                gsGroup.add(boundingBoxMesh);
                gsGroup.add(boundingBoxTextObjs);
            },
        }
    );

    return gsGroup;
}

export default {
    startGSViewerProject,
}