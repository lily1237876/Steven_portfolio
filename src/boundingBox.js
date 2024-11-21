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
    constructor(size, center = new THREE.Vector3(), title = 'Empty Title', description = 'Empty Description') {
        this.size = size;
        this.center = center;
        this.title = title;
        this.description = description;

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
        titleDiv.style.display = 'flex';
        titleDiv.style.flexDirection = 'row';

        let d1 = document.createElement('div');
        d1.innerHTML = this.title;
        d1.style.transform = 'translate(50%, -150%)';
        d1.style.fontSize = '1.5rem';
        titleDiv.appendChild(d1);

        titleDiv.style.color = 'white';
        titleDiv.style.fontFamily = 'monospace';
        let titleObj = new CSS3DObject(titleDiv);
        titleObj.element.style.pointerEvents = 'none';

        let scaleFactor = 0.003;
        titleObj.scale.set(scaleFactor, scaleFactor, scaleFactor);

        let p = new THREE.Vector3(this.center.x - this.size.x / 2, this.center.y + this.size.y / 2, this.center.z + this.size.z / 2);
        titleObj.position.copy(p);

        this.textObjs.add(titleObj);
    }

    add3DDescription() {
        let titleDiv = document.createElement('div');
        titleDiv.style.display = 'flex';
        titleDiv.style.flexDirection = 'column';

        let titleSmallDiv = document.createElement('div');
        titleSmallDiv.style.display = 'flex';
        titleSmallDiv.style.flexDirection = 'column';
        titleSmallDiv.style.gap = '5px';
        titleSmallDiv.style.transform = 'translate(50%, 50%)';
        titleSmallDiv.style.width = '30vw';
        titleSmallDiv.style.paddingTop = '10px';
        titleDiv.appendChild(titleSmallDiv);

        let d1 = document.createElement('div');
        d1.innerHTML = this.description;
        d1.style.fontSize = '1.2rem';
        titleSmallDiv.appendChild(d1);

        let d2 = document.createElement('div');
        d2.innerHTML = 'ewaifjaweiofja ewoifjaweoifjaweofiwa jefoiawejfoawief jaiowefjawo eifjaweoifjaweof';
        d2.style.wordBreak = 'break-word';
        d2.style.fontSize = '0.8rem';
        titleSmallDiv.appendChild(d2);


        titleDiv.style.color = 'white';
        titleDiv.style.fontFamily = 'monospace';
        let titleObj = new CSS3DObject(titleDiv);
        titleObj.element.style.pointerEvents = 'none';
        titleObj.element.style.display = 'flex';

        let scaleFactor = 0.003;
        titleObj.scale.set(scaleFactor, scaleFactor, scaleFactor);

        let p = new THREE.Vector3(this.center.x - this.size.x / 2, this.center.y - this.size.y / 2, this.center.z + this.size.z / 2);
        titleObj.position.copy(p);

        this.textObjs.add(titleObj);
        console.log(titleObj.element);
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
                uSize: {value: 0.1},
            }
        });
        this.boxMesh = new THREE.Mesh(geo, mat);
    }
}