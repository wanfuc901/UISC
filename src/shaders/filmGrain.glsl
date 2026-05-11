// Film Grain Shader
uniform float time;
uniform float amount;
varying vec2 vUv;

float random(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    float noise = random(vUv + time);
    vec4 color = texture2D(tDiffuse, vUv);
    color.rgb += (noise - 0.5) * amount;
    gl_FragColor = color;
}
