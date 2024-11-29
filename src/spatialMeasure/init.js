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
    let videoPlane = new VideoPlane(
        `${import.meta.env.BASE_URL}spatialMeasure/moon.mp4`,
        1.5,
        {
            onLoad: (thisPlane) => {
                moonGroup.add(thisPlane.mesh);

                // add bounding box
                let boundingBox = new BoundingBox(
                    new THREE.Vector3(1.6, 1.6 / thisPlane.aspect, 0.2),
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