#version 300 es
precision mediump float;
const float MaxIter = 1000.0;
in vec4 vColor;
out vec4 fragColor;
uniform vec2 uResolution;

vec2 squareImaginary(vec2 number){
    return vec2(pow(number.x,2.0)-pow(number.y,2.0),2.0*number.x*number.y);
}

float iterateMandelbrot(vec2 coord) {
    vec2 z = vec2(0.0);
    for(int i=0;i < int(MaxIter); i++) {
        z = squareImaginary(z) + coord;
        if(length(z)>2.0)
            return float(i) / MaxIter ;
    }
    return MaxIter;
}

void main() {
    vec2 coord = (gl_FragCoord.xy / uResolution) * 4.0 - vec2(2.0);
    vec3 color = mix(vec3(1.0), vec3(0.0), iterateMandelbrot(coord));
    fragColor = vec4(color, 1.0);
}
