import * as THREE from "three";

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
    uniform float uGeometryAspect;
    uniform sampler2D uVideoTexture;
    
    void main() {
        vec2 uv = vUv;
        uv.x = (uv.x - 0.5) * uGeometryAspect / uVideoAspect + 0.5;
        vec4 color = texture(uVideoTexture, uv);
        float a = 1.;
        if ((color.r + color.g + color.b) / 3. < 0.01) a = 0.;
        gl_FragColor = vec4(color.rgb, a);
    }
`;

export class VideoPlane {
    constructor(src = '', width = 1, options) {
        this.src = src;
        this.width = width;
        this.keepAspect = options.aspect ? true : false;
        this.aspect = options.aspect ? options.aspect : 1;
        this.height = options.height ? options.height : this.width / this.aspect;
        this.onLoad = options.onLoad ? options.onLoad : () => {};

        this.videoElement = null;
        this.videoTexture = null;
        this.mesh = null;

        this.init();
    }

    init() {
        this.initVideoElement();
    }

    initVideoElement() {
        this.videoElement = document.createElement('video');
        this.videoElement.autoplay = true;
        this.videoElement.loop = true;
        this.videoElement.muted = true;
        this.videoElement.playsInline = true;
        this.videoElement.addEventListener('loadedmetadata', () => {
            this.videoElement.play();
            this.videoTexture = new THREE.VideoTexture( this.videoElement );
        
            this.aspect = this.keepAspect ? this.aspect : this.videoElement.videoWidth / this.videoElement.videoHeight;
            this.height = this.width / this.aspect;
            this.init3DPlane();
            this.mesh.material.uniforms['uVideoTexture'].value = this.videoTexture;
            this.mesh.material.uniforms['uVideoAspect'].value = this.aspect;

            this.onLoad(this);
        });
        this.videoElement.src = this.src;
    }

    init3DPlane() {
        let geo = new THREE.PlaneGeometry(this.width, this.height, 1, 1);
        let mat = new THREE.ShaderMaterial({
            vertexShader: vsAsciiVideoSource,
            fragmentShader: fsAsciiVideoSource,
            transparent: true,
            depthWrite: false,
            uniforms: {
                uVideoTexture: {value: null},
                uGeometryAspect: {value: this.width / this.height},
                uVideoAspect: {value: this.width / this.height},
            }
        })
        this.mesh = new THREE.Mesh(geo, mat);
    }
}