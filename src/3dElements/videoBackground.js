import * as THREE from 'three';
import Scene from "../scene.js";
import {remap} from "../mathUtils.js";

const vsVideoPlaneSource = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.);
    }
`;

const fsVideoPlaneSource = `
    varying vec2 vUv;
    
    uniform float uScreenAspect;
    uniform float uVideoAspect;
    uniform sampler2D uVideoTexture;
    
    uniform sampler2D uRGBTexture;
    uniform float uPixelRepeat;
    uniform vec2 uPixelOffset;
    
    uniform float uVignetteThickness;
    
    void main() {
        vec2 uv = vUv;
        
        float h = smoothstep(0.5, 0.5 - uVignetteThickness, abs(vUv.x - 0.5));
        float v = smoothstep(0.5, 0.5 - uVignetteThickness, abs(vUv.y - 0.5));
        float vignette = h * v;
        
        uv.x = (uv.x - 0.5) * uScreenAspect / uVideoAspect + 0.5;
        
        vec4 videoColor = texture(uVideoTexture, uv);
        vec4 pixelColor = texture(uRGBTexture, uv * uPixelRepeat) + 1.;
        // pixelColor += texture(uRGBTexture, uv * uPixelRepeat + uPixelOffset);
        vec4 color = videoColor * pixelColor;
        color *= 0.1;
        
        color *= vignette;
        
        gl_FragColor = vec4(color.rgb, 1.);
    }
`;

let rgbTexture = null;
let videoPlane = null;

function setupEventListeners() {
    window.addEventListener('resize', () => {
        videoPlane.material.uniforms['uScreenAspect'].value = innerWidth / innerHeight;
    })
}

let videoSources = [
    `${import.meta.env.BASE_URL}dora/dora.mp4`,
    `${import.meta.env.BASE_URL}arboretum/arboretum.mp4`,
    `${import.meta.env.BASE_URL}clothSimulation/cloth.mp4`,
    `${import.meta.env.BASE_URL}bufferJS/4d_cube.mp4`,
    `${import.meta.env.BASE_URL}spatialMeasure/moon.mp4`,
];
let videoTexture = null;
let videoIndex = 0;
let lastVideoIndex = 0;

function initVideo() {
    videoIndex = Math.floor(Math.random() * videoSources.length);

    let videoElement = document.querySelector('#video-background');
    videoElement.autoplay = true;
    videoElement.muted = true;
    videoElement.playsInline = true;
    videoElement.controls = true;

    videoElement.addEventListener('loadedmetadata', () => {
        // console.log('loaded meta data', videoSources[videoIndex]);
        videoTexture = new THREE.VideoTexture( videoElement );
        videoPlane.material.uniforms['uVideoTexture'].value = videoTexture;
        videoPlane.material.uniforms['uVideoAspect'].value = videoElement.videoWidth / videoElement.videoHeight;
    });

    videoElement.addEventListener('ended', () => {
        // console.log('video ended', videoSources[videoIndex]);
        while (lastVideoIndex === videoIndex) {
            videoIndex = Math.floor(Math.random() * videoSources.length);
        }
        changeVideo();
    });

    videoElement.src = videoSources[videoIndex];
}

function changeVideo() {
    if (videoTexture !== null) {
        videoTexture.dispose();
    }
    let videoElement = document.querySelector('#video-background');
    videoElement.src = videoSources[videoIndex];
    lastVideoIndex = videoIndex;
}

function loadRGBTexture() {
    let rgbTextureLoc = `${import.meta.env.BASE_URL}imgs/rgb.jpg`;
    rgbTexture = new THREE.TextureLoader().load(
        rgbTextureLoc,
        (texture) => {
            videoPlane.material.uniforms['uRGBTexture'].value = texture;
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
        }
    );
}

function init() {
    let scene = Scene.getInternals().scene;

    let geo = new THREE.PlaneGeometry(2, 2, 1, 1);
    let mat = new THREE.ShaderMaterial({
        vertexShader: vsVideoPlaneSource,
        fragmentShader: fsVideoPlaneSource,
        depthWrite: false,
        uniforms: {
            uScreenAspect: {value: innerWidth / innerHeight},
            uVideoAspect: {value: innerWidth / innerHeight},
            uVideoTexture: {value: null},
            uRGBTexture: {value: null},
            uPixelRepeat: {value: 24},
            uPixelOffset: {value: new THREE.Vector2(0, 0)},
            uVignetteThickness: {value: 0.2},
        }
    });
    videoPlane = new THREE.Mesh(geo, mat);
    scene.add(videoPlane);

    loadRGBTexture();
    initVideo();

    setupEventListeners();
}

function getVideoPlane() {
    return videoPlane;
}

export default {
    init,
    getVideoPlane,
    changeVideo,
}