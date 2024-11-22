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
    constructor(width = 1, aspect = 1, height) {
        this.width = width;
        this.aspect = aspect;
        this.height = height ? height : this.width / this.aspect;

        this.mesh = null;

        this.init();
    }

    init() {
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