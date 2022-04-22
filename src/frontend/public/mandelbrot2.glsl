#version 300 es
precision mediump float;
const float MaxIter = 3000.0;
in vec4 vColor;
out vec4 fragColor;
uniform vec2 uResolution;
uniform int uFrameCount;

vec2 squareImaginary(vec2 number){
    return vec2(pow(number.x,2.0)-pow(number.y,2.0),2.0*number.x*number.y);
}
const float offsetsD = .35;

const vec2 offsets[4] = vec2[](
    vec2(-offsetsD,-offsetsD),
    vec2(offsetsD,offsetsD),
    vec2(-offsetsD,offsetsD),
    vec2(offsetsD,-offsetsD)
);

float iterateMandelbrot(vec2 coord) {
    vec2 z = vec2(0.0);
    for(int i=0;i < int(MaxIter); i++) {
        z = squareImaginary(z) + coord;
        if(length(z)>2.0)
            return float(i) / MaxIter ;
    }
    return MaxIter;
}
vec4 mapColor(float mcol) {
    return vec4(0.5 + 0.5*cos(2.7+mcol*30.0 + vec3(0.0,.6,1.0)),1.0);
}
void main() {
    //const vec2 zoomP = vec2(-1.1553,0.545105);
    const vec2 zoomP = vec2(-.7457117,.186142);
    float zoom =  10.0 / float(uFrameCount);
    vec2 uv = (gl_FragCoord.xy/uResolution);
    vec2 aspect = vec2(1.0, uResolution.y / uResolution.x);
    //vec2 coord = (gl_FragCoord.xy / uResolution) * 4.0 - vec2(2.0) * (aspect * ( zoomP + zoom));
    vec2 coord = aspect * (zoomP + zoom * uv);
vec4 color = mapColor(iterateMandelbrot(coord));
    fragColor = color;
}
