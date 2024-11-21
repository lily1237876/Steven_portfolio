import * as THREE from "three";
import Scene from "../scene.js";
import {BoundingBox} from "../boundingBox.js";

const vsAsciiVideoSource = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    }
`;

const fsAsciiVideoSource = `
    varying vec2 vUv;
    
    uniform float uVideoAspect;
    uniform sampler2D uVideoTexture;
    
    void main() {
        vec2 uv = vUv;
        uv.x = (uv.x - 0.5) / uVideoAspect + 0.5;
        vec4 color = texture(uVideoTexture, uv);
        float a = 1.;
        if ((color.r + color.g + color.b) / 3. < 0.01) a = 0.;
        gl_FragColor = vec4(color.rgb, a);
    }
`;

function startAsciiViewer() {
    let scene = Scene.getInternals().scene;
    let asciiGroup = new THREE.Group();
    scene.add(asciiGroup);

    let geoSize = 1.5;
    let geo = new THREE.PlaneGeometry(geoSize, geoSize, 1, 1);
    let mat = new THREE.ShaderMaterial({
        vertexShader: vsAsciiVideoSource,
        fragmentShader: fsAsciiVideoSource,
        transparent: true,
        depthWrite: false,
        uniforms: {
            uVideoTexture: {value: null},
            uVideoAspect: {value: 1},
        }
    })
    let videoPlane = new THREE.Mesh(geo, mat);
    asciiGroup.add(videoPlane);

    // add bounding box
    let asciiBoundingBox = new BoundingBox(
        new THREE.Vector3(1, 1, 0.2),
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

    // load video
    let videoElement = document.createElement('video');
    videoElement.autoplay = true;
    videoElement.loop = true;
    videoElement.muted = true;
    videoElement.addEventListener('loadedmetadata', () => {
        let videoTexture = new THREE.VideoTexture( videoElement );
        videoPlane.material.uniforms['uVideoTexture'].value = videoTexture;
        videoPlane.material.uniforms['uVideoAspect'].value = videoElement.videoWidth / videoElement.videoHeight;
        videoElement.play();
    });
    videoElement.src = `${import.meta.env.BASE_URL}videos/ascii.mp4`;

    return asciiGroup;
}

export default {
    startAsciiViewer,
}