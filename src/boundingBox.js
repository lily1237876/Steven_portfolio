import * as THREE from "three";
import {CSS3DObject} from "../lib/CSS3DRenderer.js";

const vsBoundingBoxSource = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    }
`;

const fsBoundingBoxSource = `
    varying vec2 vUv;
    
    uniform float uThicknessMultiplier;
    uniform float uSize; // [0., 1.]
    
    void main() {
        vec2 uv = vUv;
        vec3 color = vec3(0.);
        
        float uThickness = fwidth(uv.x + uv.y) * uThicknessMultiplier;
        float h = smoothstep(0.5, 0.5 - uThickness, abs(vUv.x - 0.5));
        float v = smoothstep(0.5, 0.5 - uThickness, abs(vUv.y - 0.5));
        float vignette = 1. - h * v;
        
        float alpha = vignette;
        
        if ( (uv.x > uSize && uv.x < 1. - uSize) || (uv.y > uSize && uv.y < 1. - uSize) ) {
            vignette *= 0.;
            alpha = 0.;
        }
        
        color = mix(vec3(0.), vec3(1.), vignette);
        
        gl_FragColor = vec4(color, alpha);
    }
`;

export class BoundingBox {
    constructor(size, center = new THREE.Vector3(), h1 = '', h2 = '', d1 = '', d2 = '') {
        this.size = size;
        this.center = center;
        this.h1 = h1; // big title
        this.h2 = h2; // small title
        this.d1 = d1; // big description
        this.d2 = d2; // small description

        this.boxMesh = null;
        this.textObjs = new THREE.Group();

        this.init();
    }

    init() {
        this.addBoxMesh();
        this.add3DTitle();
        this.add3DDescription();
    }

    add3DTitle() {
        let titleDiv = document.createElement('div');

        let titleSmallDiv = document.createElement('div');
        titleSmallDiv.style.display = 'flex';
        titleSmallDiv.style.flexDirection = 'column';
        titleSmallDiv.style.gap = '5px';
        titleSmallDiv.style.transform = 'translate(50%, -50%)';
        titleSmallDiv.style.width = '30vw';
        titleSmallDiv.style.maxWidth = '330px';
        titleSmallDiv.style.paddingBottom = '10px';
        titleDiv.appendChild(titleSmallDiv);

        let e1 = document.createElement('div');
        e1.innerHTML = this.h1;
        e1.style.fontSize = '1.5rem';
        titleSmallDiv.appendChild(e1);

        let e2 = document.createElement('div');
        e2.innerHTML = this.h2;
        e2.style.wordBreak = 'break-word';
        e2.style.fontSize = '0.8rem';
        titleSmallDiv.appendChild(e2);

        titleDiv.style.color = 'white';
        let titleObj = new CSS3DObject(titleDiv);
        titleObj.element.style.pointerEvents = 'none';

        let scaleFactor = 0.003;
        titleObj.scale.set(scaleFactor, scaleFactor, scaleFactor);
        let p = new THREE.Vector3(this.center.x - this.size.x / 2, this.center.y + this.size.y / 2, this.center.z + this.size.z / 4);
        // let p = new THREE.Vector3(this.center.x - this.size.x / 2, this.center.y + this.size.y / 2, this.center.z + this.size.z / 2);
        titleObj.position.copy(p);

        this.textObjs.add(titleObj);
    }

    add3DDescription() {
        let titleDiv = document.createElement('div');

        let titleSmallDiv = document.createElement('div');
        titleSmallDiv.style.display = 'flex';
        titleSmallDiv.style.flexDirection = 'column';
        titleSmallDiv.style.gap = '5px';
        titleSmallDiv.style.transform = 'translate(50%, 50%)';
        titleSmallDiv.style.width = '30vw';
        titleSmallDiv.style.maxWidth = '330px';
        titleSmallDiv.style.paddingTop = '10px';
        titleDiv.appendChild(titleSmallDiv);

        let e1 = document.createElement('div');
        e1.innerHTML = this.d1;
        e1.style.fontSize = '1.1rem';
        titleSmallDiv.appendChild(e1);

        let e2 = document.createElement('div');
        e2.innerHTML = this.d2;
        e2.style.wordBreak = 'break-word';
        e2.style.fontSize = '0.6rem';
        titleSmallDiv.appendChild(e2);

        titleDiv.style.color = 'white';
        let titleObj = new CSS3DObject(titleDiv);
        titleObj.element.style.pointerEvents = 'none';
        titleObj.element.style.display = 'flex';

        let scaleFactor = 0.003;
        titleObj.scale.set(scaleFactor, scaleFactor, scaleFactor);
        let p = new THREE.Vector3(this.center.x - this.size.x / 2, this.center.y - this.size.y / 2, this.center.z + this.size.z / 4);
        // let p = new THREE.Vector3(this.center.x - this.size.x / 2, this.center.y - this.size.y / 2, this.center.z + this.size.z / 2);
        titleObj.position.copy(p);

        this.textObjs.add(titleObj);
    }


    addBoxMesh() {
        let box3 = new THREE.Box3().setFromCenterAndSize(this.center, this.size);
        let dim = new THREE.Vector3().subVectors(box3.max, box3.min);
        let geo = new THREE.BoxGeometry(dim.x, dim.y, dim.z);
        let mat = new THREE.ShaderMaterial({
            vertexShader: vsBoundingBoxSource,
            fragmentShader: fsBoundingBoxSource,
            transparent: true,
            uniforms: {
                uThicknessMultiplier: {value: 3},
                uSize: {value: 0.075},
            }
        });
        this.boxMesh = new THREE.Mesh(geo, mat);
    }
}