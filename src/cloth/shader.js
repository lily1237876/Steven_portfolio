import {mathUtilShader} from "../mathUtils.js";

const commonShader = `
    ${mathUtilShader}
    
    
`;

export const RIPPLE_COUNT = 20;
export const vsClothSource = `
    varying vec2 vUv;
    
    uniform vec2 uMouse;
    uniform float uTime;
    
    ${commonShader}
    
    struct Ripple {
        bool isActive;
        vec2 center;
        float time;
    };
    uniform Ripple ripples[${RIPPLE_COUNT}];
    
    void main() {
        vUv = uv;
        vec3 pos = position;
        
        float zOffset = 0.;
        
        float uMaxZOffset = 0.5;
        float uThickness = 0.05;
        float uRippleSpeed = .75;
        
        for (int i = 0; i < ${RIPPLE_COUNT}; i++) {
            // continue;
            Ripple ripple = ripples[i];
            if (!ripple.isActive) continue;
            float r = uRippleSpeed * (uTime - ripple.time);
            if (r * r > 2.) { // if ripple radius > entire uv square's diagonal length sq (1^2 + 1^2), then we can say that this ripple is of no use
                // zOffset += 0.5 * uMaxZOffset;
                continue;
            }
            
            float d = length(uv - ripple.center);
            float l = remap01(d, max(r - uThickness, 0.), r + uThickness);
            // zOffset += remap(parabolaReverse(l, 2.), 0., 1., -0.5, 0.5) * uMaxZOffset;
            zOffset += remap(parabola(l, 2.), 0., 1., 0., 1.) * uMaxZOffset / float(${RIPPLE_COUNT});
        }
        
        // zOffset = clamp(zOffset, -0.5 * uMaxZOffset, 0.5 * uMaxZOffset);
        zOffset = clamp(zOffset, 0., uMaxZOffset);
        
        pos.z -= zOffset;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
    }
`;

export const fsClothSource = `
    
    varying vec2 vUv;
    
    uniform float uBigGrid;
    uniform float uLineThickness;
    uniform float uPointRadius;
    
    void main() {
        vec2 uv = fract(vUv * uBigGrid);
        vec3 color = vec3(0.);
        float alpha = 0.;
        
        uv = abs(abs(uv - 0.5) - 0.5); // center --> (0.5, 0.5); edge --> (0., 0.)
        float vLine = smoothstep(0., uLineThickness + fwidth(vUv.x) * 2., uv.x);
        float hLine = smoothstep(0., uLineThickness + fwidth(vUv.y) * 2., uv.y);
        float line = 1. - vLine * hLine;
        
        float vPoint = 1. - smoothstep(0., uPointRadius + fwidth(uv.x) * 1., uv.x);
        float hPoint = 1. - smoothstep(0., uPointRadius + fwidth(uv.y) * 1., uv.y);
        float point = vPoint * hPoint;
        
        float result = max(line, point);
        alpha = mix(0., 1., result);
        
        // add grid lines first
        color = mix(vec3(0.), vec3(1.), line);
        // then add grid points
        // color = mix(color, vec3(1., 0., 0.), point);
        
        gl_FragColor = vec4(color, alpha);
    }
`;