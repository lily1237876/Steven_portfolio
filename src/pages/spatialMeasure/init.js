import * as THREE from "three";
import Scene from "../../scene.js";
import Intersects from "../../intersects.js";
import {BoundingBox} from "../../3dElements/boundingBox.js";
import {VideoPlane} from "../../3dElements/videoPlane.js";

let moonGroup = null;
let MEASURE_LABEL = 'spatialMeasure';

function startMoonMeasureViewer() {
    let scene = Scene.getInternals().scene;
    moonGroup = new THREE.Group();
    scene.add(moonGroup);

    // load video
    let videoPlane = new VideoPlane(
        `${import.meta.env.BASE_URL}spatialMeasure/moon.mp4`,
        1.2,
        {
            onLoad: (thisPlane) => {
                moonGroup.add(thisPlane.mesh);

                Scene.traverseGroupToAddLabel(thisPlane.mesh, MEASURE_LABEL);
                Intersects.add(MEASURE_LABEL, thisPlane.mesh);

                Intersects.addClickCb(MEASURE_LABEL, () => {
                    window.location.href = `${import.meta.env.BASE_URL}spatialMeasure/index.html`;
                });

                // add bounding box
                let boundingBox = new BoundingBox(
                    new THREE.Vector3(1.3, 1.3 / thisPlane.aspect, 0.2),
                    new THREE.Vector3(),
                    'Spatial Measurement Tool',
                    'Lunar Surface Geospatial Analysis',
                    'Collaboration project between PTC Reality Lab, MIT Media Lab, and NASA. Presented at MIT Media Lab members week',
                    'Developed a spatial measurement tool in Three.js and GLSL that analyzes lunar surface geospatial data. Besides measuring the length, area, volume of different surface regions, the tool allows user to find shortest path between 2 points, visualize surface height / steepness with shaders, and much more.'
                );
                let boundingBoxMesh = boundingBox.boxMesh;
                let boundingBoxTextObjs = boundingBox.textObjs;
                moonGroup.add(boundingBoxMesh);
                moonGroup.add(boundingBoxTextObjs);
            },
        }
    );

    return moonGroup;
}

export default {
    startMoonMeasureViewer,
}