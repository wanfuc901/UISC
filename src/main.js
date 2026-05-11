import './styles/main.css';
import * as THREE from 'three';
import gsap from 'gsap';
import { initThreeScene } from './three-setup.js';
import { initCustomScroll } from './scroll.js';
import { initAnimations } from './animations.js';
import { getMousePos } from './utils/helpers.js';

// --- INITIALIZATION ---
const threeState = initThreeScene();
const scrollState = initCustomScroll();
initAnimations(scrollState, threeState);

// --- GRAIN ANIMATION (Canvas 2D) ---
const grainCanvas = document.getElementById('grain-canvas');
const gctx = grainCanvas.getContext('2d');
function resizeGrain() {
    grainCanvas.width = window.innerWidth / 4;
    grainCanvas.height = window.innerHeight / 4;
}
resizeGrain();
window.addEventListener('resize', resizeGrain);

function renderGrain() {
    const idata = gctx.createImageData(grainCanvas.width, grainCanvas.height);
    const buffer32 = new Uint32Array(idata.data.buffer);
    for (let i = 0; i < buffer32.length; i++) {
        if (Math.random() < 0.5) buffer32[i] = 0xffffffff;
    }
    gctx.putImageData(idata, 0, 0);
    requestAnimationFrame(renderGrain);
}
renderGrain();

// --- LIGHT LEAKS (DOM-based) ---
const leak1 = document.getElementById('light-leak-1');
const leak2 = document.getElementById('light-leak-2');
let mouse = { x: 0, y: 0, ndcX: 0, ndcY: 0 };
let leak1Pos = { x: 0, y: 0 };
let leak2Pos = { x: 0, y: 0 };

document.addEventListener('mousemove', (e) => {
    mouse = getMousePos(e);
    
    // Move 3D object slightly
    gsap.to(threeState.coasterMesh.rotation, {
        y: mouse.ndcX * 0.2,
        duration: 2,
        ease: "power2.out",
        overwrite: "auto"
    });
});

function animateLeaks() {
    leak1Pos.x += (mouse.x - leak1Pos.x) * 0.1;
    leak1Pos.y += (mouse.y - leak1Pos.y) * 0.1;
    leak2Pos.x += (mouse.x - leak2Pos.x) * 0.05;
    leak2Pos.y += (mouse.y - leak2Pos.y) * 0.05;

    leak1.style.transform = `translate(${leak1Pos.x - window.innerWidth*0.3}px, ${leak1Pos.y - window.innerWidth*0.3}px)`;
    leak2.style.transform = `translate(${leak2Pos.x - window.innerWidth*0.2}px, ${leak2Pos.y - window.innerWidth*0.4}px)`;

    requestAnimationFrame(animateLeaks);
}
animateLeaks();

// --- INTERACTIVE LOGIC ---
const btnEncode = document.getElementById('btn-encode');
const btnDecode = document.getElementById('btn-decode');
const statusMsg = document.getElementById('status-msg');
let isEncoded = false;
let flipTarget = { angle: 0 };
let currentFlipAngle = 0;

btnEncode.addEventListener('click', () => {
    if (isEncoded) return;
    isEncoded = true;
    statusMsg.innerText = "Writing message...";
    gsap.to(flipTarget, { 
        angle: Math.PI, 
        duration: 1.2, 
        ease: "power4.inOut", 
        onUpdate: () => currentFlipAngle = flipTarget.angle 
    });
    setTimeout(() => { statusMsg.innerText = "Message secured. Coaster flipped."; }, 1000);
});

btnDecode.addEventListener('click', () => {
    if (!isEncoded) return;
    isEncoded = false;
    statusMsg.innerText = "Flipping back...";
    gsap.to(flipTarget, { 
        angle: 0, 
        duration: 1.2, 
        ease: "power4.inOut", 
        onUpdate: () => currentFlipAngle = flipTarget.angle 
    });
    setTimeout(() => { statusMsg.innerText = "Message revealed. Genius."; }, 1000);
});

// --- MAIN LOOP ---
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();
    
    // Update scroll
    scrollState.update();
    
    // Update materials
    threeState.material.uniforms.time.value = time;
    
    // Idle rotation
    threeState.coasterMesh.rotation.x = Math.PI/2 + currentFlipAngle + Math.sin(time * 0.5) * 0.1;
    threeState.coasterMesh.rotation.z += 0.003;

    threeState.renderer.render(threeState.scene, threeState.camera);
}
animate();