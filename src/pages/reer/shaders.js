const commonShader = `
    float remap01(float x, float low, float high) {
        return clamp((x - low) / (high - low), 0., 1.);
    }
    
    float remap(float x, float lowIn, float highIn, float lowOut, float highOut) {
        return mix(lowOut, highOut, remap01(x, lowIn, highIn));
    }
    
    float nRoot(float x, float n) {
        return pow(x, 1. / n);
    }
    
    float even2(float a) {
        return ceil(max(a, 2.) / 2.) * 2.;
    }
    
    float remap01CurveEaseIn(float x, float low, float high, float a) {
        float r = remap01(x, low, high);
        a = even2(a);
        return -nRoot(1. - r, a) + 1.;
    }
    
    float remapCurveEaseIn(float x, float lowIn, float highIn, float lowOut, float highOut, float a) {
        return mix(lowOut, highOut, remap01CurveEaseIn(x, lowIn, highIn, a));
    }
    
    float remap01CurveEaseOut1(float x, float low, float high, float a) {
        float r = remap01(x, low, high);
        a = even2(a);
        return -pow(r - 1., a) + 1.;
    }
    
    float remapCurveEaseOut1(float x, float lowIn, float highIn, float lowOut, float highOut, float a) {
        return mix(lowOut, highOut, remap01CurveEaseOut1(x, lowIn, highIn, a));
    }
    
    float remap01CurveEaseOut2(float x, float low, float high, float a) {
        float r = remap01(x, low, high);
        a = even2(a);
        return -pow(r - 1., a) + 1.;
    }
    
    float remapCurveEaseOut2(float x, float lowIn, float highIn, float lowOut, float highOut, float a) {
        return mix(lowOut, highOut, remap01CurveEaseOut2(x, lowIn, highIn, a));
    }
    
    float expSustainedImpulse( float x, float f, float k )
    {
        float s = max(x-f,0.0);
        return min( x*x/(f*f), 1.0+(2.0/f)*s*exp(-k*s));
    }
`;

// todo Steve:
//  background color 0x272727
//  when in process page: background color warm white --> dark grey, font black --> white, "turn off the light, we got a story to tell" mode
//  step 1:
//  have size attenuation based on distance
//  fixed camera perspective
//  as scrolling, quickly rotate 360, at the same time morph to a new shape
//  smaller points "simple design"

export const vsReerChairSource = `
    ${commonShader}
    attribute float index;
    
    uniform float uTime;
    
    uniform vec3 uBoundingSphereCenter;
    uniform float uBoundingSphereRadius;
    
    uniform vec3 uBoundingBoxCenter;
    uniform vec3 uBoundingBoxSize;
    
    uniform vec3 uColor;
    uniform float uT2;
    uniform float uAnimDirection;
    
    uniform bool uAnimDone;
    
    varying vec3 vColor;
    varying float vAlpha;
    
    vec3 randomNoiseVec3(float index) {
        float x = fract(sin(index * 34.678) * 41.89);
        float y = fract(cos(sin(index + index * index) * 56.743 + 18.794) * 93.37);
        float z = fract(sin(cos(index * 89.32) * 23.167 + 28.842) * 84.273);
        return vec3(x, y, z);
    }
    
    vec3 randomPosition(float index, float t) {
        vec3 v = randomNoiseVec3(index);
        
        float xp = 0.3 * sin(t * 0.6 + index) * v.x;
        float yp = 0.2 * cos(t * 0.8 + index) * v.y;
        float zp = 0.4 * sin(t * 0.4 + index) * cos(t * 0.06) * v.z;
        return vec3(xp, yp, zp);
    }
    
    void main() {
        vec3 p = position + randomPosition(index, uTime) * 1.5;
        
        float dist = length(cameraPosition - p);
        float distMin = length(cameraPosition - uBoundingSphereCenter) - uBoundingSphereRadius;
        float distMax = length(cameraPosition - uBoundingSphereCenter) + uBoundingSphereRadius;
        
        // float pointSize = remap(dist, distMin, distMax, 0., 5.);
        // float pointSize = remapCurveEaseIn(dist, distMin, distMax, 0.5, 10., 2.);
        float pointSize = remapCurveEaseOut1(dist, distMin, distMax, 10., 1., 2.);
        
        float b = 0.;
        if (uAnimDirection == 0.) { // from center expand to left / right
            float halfBoxX = uBoundingBoxSize.x / 2.;
            float thresholdX = halfBoxX * uT2;
            float absPX = abs(p.x - uBoundingBoxCenter.x); // world position p to local bounding box position (p.x - uBoundingBoxCenter.x)
            b = thresholdX / absPX;
        } else if (uAnimDirection == 1.) { // from center expand to top / bottom
            float halfBoxY = uBoundingBoxSize.y / 2.;
            float thresholdY = halfBoxY * uT2;
            float absPY = abs(p.y - uBoundingBoxCenter.y);
            b = thresholdY / absPY;
        } else if (uAnimDirection == 2.) { // from left to right
            // float offset = 1.;
            float offset = 0.7204; // this is to account for chair mesh bounding box difference: (original chair bounding box x: 8.549387454986572) / (fat chair bounding box x: 11.867174625396729)
            float halfBoxX = uBoundingBoxSize.x * offset / 2.;
            float PX = p.x + halfBoxX;
            float thresholdX = uBoundingBoxSize.x * offset * uT2;
            b = thresholdX / PX;
        }
        
        // float a = expSustainedImpulse(uT2, 0.5, 10.);
        float a = expSustainedImpulse(b * 0.7, 0.5, 10.); // b * 0.7 ==> b/c expSustainedImpulse() curve --> 1. when original b --> 1.4, so need to * 0.7 to stretch out the curve
        float offset = 0.11;
        float blur = 0.001;
        a = smoothstep(1. + offset - blur, 1. + offset + blur, a);
        
        vColor = uAnimDone? uColor : mix(uColor, vec3(1.), a);
        
        // vColor = uColor;
        
        // vec3 randomGreen = randomNoiseVec3(index);
        // randomGreen = normalize(vec3(randomGreen.x, randomGreen.y * 4., randomGreen.z));
        // vColor = mix(uColor, randomGreen, a);
        
        vAlpha = uAnimDone ? 1. : mix(1., 0.7, a);
        
        float sizeAttenuation = uAnimDone ? 1. : mix(1., 2.5, a);
        
        gl_PointSize = pointSize * sizeAttenuation;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
    }
`;

export const fsReerChairSource = `
    uniform vec3 uColor;
    uniform float uAlpha;
    
    varying vec3 vColor;
    varying float vAlpha;
    
    void main() {
        if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
        
        // gl_FragColor = vec4( uColor, 1. );
        gl_FragColor = vec4( vColor, vAlpha * uAlpha );
    }
`;