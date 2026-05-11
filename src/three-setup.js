import * as THREE from 'three';
import { COLORS, CONFIG } from './utils/constants.js';
import rimLightShader from './shaders/rimLight.glsl';

export function initThreeScene() {
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(COLORS.bg, 0.02);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = CONFIG.cameraInitialZ;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Robust shader splitting
    let vertexShader = '';
    let fragmentShader = '';
    
    if (rimLightShader && rimLightShader.includes('// FRAGMENT')) {
        const parts = rimLightShader.split('// FRAGMENT');
        vertexShader = parts[0].replace('// VERTEX', '').trim();
        fragmentShader = parts[1].trim();
    } else {
        console.error("Shader split failed: // FRAGMENT marker not found. Using fallback shaders.");
        // Fallback simple shaders to prevent crash
        vertexShader = `varying vec3 vNormal; void main() { vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
        fragmentShader = `varying vec3 vNormal; void main() { gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0); }`;
    }

    const geometry = new THREE.CylinderGeometry(4, 4, 0.4, 64);
    const material = new THREE.ShaderMaterial({
        uniforms: {
            rimColor: { value: new THREE.Color(COLORS.accent) },
            rimPower: { value: 3.0 },
            baseColor: { value: new THREE.Color(COLORS.cork) },
            time: { value: 0 }
        },
        vertexShader,
        fragmentShader
    });

    const coasterMesh = new THREE.Mesh(geometry, material);
    coasterMesh.rotation.x = Math.PI / 2;
    scene.add(coasterMesh);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 0.3);
    frontLight.position.set(0, 0, 10);
    scene.add(frontLight);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return { scene, camera, renderer, coasterMesh, material };
}