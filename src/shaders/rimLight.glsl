// Rim Light Shader
// VERTEX
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// FRAGMENT
varying vec3 vNormal;
varying vec3 vPosition;
uniform vec3 rimColor;
uniform float rimPower;
uniform vec3 baseColor;
uniform float time;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float rim = pow(1.0 - clamp(dot(normal, viewDir), 0.0, 1.0), rimPower);
    
    // Subtle noise for cork texture feel
    float noise = fract(sin(dot(vPosition.xy, vec2(12.9898, 78.233))) * 43758.5453);
    vec3 finalBase = baseColor + (noise * 0.05);

    vec3 finalColor = mix(finalBase, rimColor, rim * 0.8);
    gl_FragColor = vec4(finalColor, 1.0);
}
