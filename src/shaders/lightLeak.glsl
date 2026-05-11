// Light Leak Shader
uniform float time;
uniform vec2 mouse;
varying vec2 vUv;

void main() {
    float d = distance(vUv, mouse);
    float leak = smoothstep(0.5, 0.0, d);
    vec3 color = vec3(1.0, 0.9, 0.5) * leak * 0.2;
    gl_FragColor = vec4(color, 1.0);
}
