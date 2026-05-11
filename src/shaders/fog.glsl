// Fog Shader (Exponential Squared)
uniform vec3 fogColor;
uniform float fogDensity;

float getFogFactor(float distance) {
    return 1.0 - exp(-pow(distance * fogDensity, 2.0));
}

void main() {
    float depth = gl_FragCoord.z / gl_FragCoord.w;
    float fogFactor = getFogFactor(depth);
    gl_FragColor = mix(gl_FragColor, vec4(fogColor, gl_FragColor.a), fogFactor);
}
