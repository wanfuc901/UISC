# 🔥 PHÂN TÍCH CHI TIẾT: Oryzo Landing Page
## Cái gì ĐẠNG được, THIẾU cái gì, và CÁCH nâng cấp lên Lusion level

---

## 📊 BẢNG SO SÁNH: Current vs Oryzo.ai Real

| Aspect | Current Code | Oryzo.ai (Real) | Status |
|--------|--------------|-----------------|--------|
| **3D Engine** | Three.js basic cube | Three.js + custom shaders | ⚠️ Thiếu shaders |
| **Scroll Control** | GSAP ScrollTrigger standard | GSAP + custom lerp (scroll-jacking) | ⚠️ Scroll quá cứng |
| **Film Grain** | Static SVG overlay | Animated noise shader | ⚠️ Grain không động |
| **Light Leak** | Fixed radial gradient | Mouse-reactive, multi-layer | ⚠️ Tĩnh, không tương tác |
| **Text Animations** | Word-by-word reveal | Word reveal + character stagger | ⚠️ Cơ bản |
| **Object Rendering** | Simple cube mesh | Detailed cork coaster geometry | ⚠️ Model quá đơn giản |
| **Parallax Depth** | Basic camera Z movement | Multi-layer parallax + depth fog | ⚠️ Không có depth cảm giác |
| **Smooth Scroll** | GSAP scrub standard | Custom scroll lerp + momentum | ⚠️ Scroll không mượt |
| **Interactive 3D** | Flip animation (Y axis) | Full 3D interaction (X, Y, Z) | ⚠️ Tương tác hạn chế |
| **Shader Effects** | None | GLSL custom (rim light, fog, noise) | ❌ HOÀN TOÀN THIẾU |
| **Performance** | OK | Optimized (LOD, instancing) | ⚠️ Có thể lag trên mobile |
| **Copy Tone** | Satirical ✓ | Satirical ✓ | ✅ Tốt |
| **Color Scheme** | Correct (#080808, #C8FF00) | Correct | ✅ Tốt |
| **Typography** | Bebas Neue + DM Mono ✓ | Bebas Neue + DM Mono ✓ | ✅ Tốt |

---

## 🔴 TOP 5 THIẾU CHÍNH - Ranking by Impact

### 1️⃣ **GLSL CUSTOM SHADERS** ⭐⭐⭐⭐⭐
**Impact Level:** CRITICAL — Đây là DNA của Oryzo style

**Current:** Không có shader → object trông bình thường, flat, vô hồn
**Needed:** 
- Rim light shader (viền sáng quanh object)
- Animated film grain shader (noise động)
- Depth fog shader (mù xa tạo depth)
- Light leak shader (phản ứng mouse)

**Cách thực hiện:**
```javascript
// Ví dụ rim light shader
const rimLightShader = {
  uniforms: {
    rimColor: { value: new THREE.Color(0xC8FF00) },
    rimPower: { value: 2.0 }
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform vec3 rimColor;
    uniform float rimPower;
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(cameraPosition - vPosition);
      float rimFactor = pow(1.0 - abs(dot(normal, viewDir)), rimPower);
      
      vec3 color = mix(vec3(0.05), rimColor, rimFactor);
      gl_FragColor = vec4(color, 1.0);
    }
  `
};
```

**File bạn có:** Không có → 0%
**Nên là:** Phải có tối thiểu 3-4 shaders
**Độ khó:** Medium-Hard

---

### 2️⃣ **CUSTOM SCROLL LERP (Scroll Jacking)** ⭐⭐⭐⭐⭐
**Impact Level:** CRITICAL — Tạo cảm giác "smooth" kiểu Lusion

**Current:** 
```javascript
scrub: 1  // GSAP ScrollTrigger standard
```
→ Scroll cứng, không mượt, cảm giác generic

**Needed:** 
- Custom scroll position lerp (0.05-0.1 intensity)
- Scroll momentum (inertia)
- Controlled scroll speed per section
- Overscroll bounce effect

**Cách thực hiện:**
```javascript
// Custom smooth scroll
let scrollPos = 0;
let scrollTarget = 0;
const scrollLerp = 0.08; // Adjustment factor

window.addEventListener('wheel', (e) => {
  scrollTarget += e.deltaY;
  scrollTarget = Math.max(0, Math.min(scrollTarget, document.body.scrollHeight - window.innerHeight));
}, { passive: false });

function updateScroll() {
  scrollPos += (scrollTarget - scrollPos) * scrollLerp;
  gsap.set('#smooth-wrapper', { y: -scrollPos });
  requestAnimationFrame(updateScroll);
}
updateScroll();

// Scroll-jacking: Slow down/speed up per section
ScrollTrigger.create({
  trigger: ".hero",
  onEnter: () => { gsap.to({}, { duration: 0.3, onUpdate: () => scrollLerp = 0.05 }) }
});
```

**File bạn có:** Không có → 0%
**Nên là:** 100% (hoàn toàn tùy chỉnh)
**Độ khó:** Medium

---

### 3️⃣ **DETAILED 3D GEOMETRY** ⭐⭐⭐⭐
**Impact Level:** HIGH — Object trông phải chất, phải có độ sâu

**Current:**
```javascript
const geometry = new THREE.BoxGeometry(3, 3, 0.5);  // Simple cube
```
→ Cork coaster nhìn như hộp, không thực tế

**Needed:**
- Actual coaster shape (torus / cylinder with beveled edges)
- Normal map (depth detail on surface)
- Texture (cork pattern, wood grain simulation)
- PBR material (metallic, roughness)

**Cách thực hiện:**
```javascript
// Cork coaster geometry
const geometry = new THREE.CylinderGeometry(3, 3, 0.3, 64, 8);

// Load texture & normal map
const textureLoader = new THREE.TextureLoader();
const corkTexture = textureLoader.load('cork-texture.jpg');
const corkNormal = textureLoader.load('cork-normal.jpg');

const material = new THREE.MeshStandardMaterial({
  map: corkTexture,
  normalMap: corkNormal,
  metalness: 0.1,
  roughness: 0.8,
  color: 0x2a2420
});

const coaster = new THREE.Mesh(geometry, material);
```

**File bạn có:** Cube đơn giản → 20%
**Nên là:** Detailed geometry + PBR materials → 100%
**Độ khó:** Medium

---

### 4️⃣ **MOUSE-REACTIVE LIGHT LEAK** ⭐⭐⭐⭐
**Impact Level:** HIGH — Interactivity = premium feel

**Current:**
```javascript
#light-leak {
  position: fixed;
  background: radial-gradient(...);
  transform: translate(-50%, -50%);
  // STATIC, không response mouse
}
```

**Needed:**
- Light leak follows mouse position smoothly
- Multi-layer light leak (2-3 layers khác nhau)
- Color reactive to mouse velocity
- Glow effect bằng shader

**Cách thực hiện:**
```javascript
// Mouse-reactive light leak
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function updateLightLeak() {
  gsap.to('#light-leak', {
    left: mouseX + 'px',
    top: mouseY + 'px',
    duration: 0.3,
    ease: "power2.out"
  });
  requestAnimationFrame(updateLightLeak);
}
updateLightLeak();

// Secondary light leak with delay
gsap.to('#light-leak-2', {
  left: mouseX - 100 + 'px',
  top: mouseY - 100 + 'px',
  duration: 0.8,
  ease: "sine.out"
});
```

**File bạn có:** Static → 10%
**Nên là:** Full mouse tracking + layers → 100%
**Độ khó:** Easy-Medium

---

### 5️⃣ **ANIMATED FILM GRAIN** ⭐⭐⭐
**Impact Level:** HIGH — Polish detail, cinematic vibe

**Current:**
```javascript
#grain {
  background-image: url("data:image/svg+xml,%3Csvg...");
  opacity: 0.04;
  // STATIC SVG
}
```

**Needed:**
- Canvas-based animated noise (não dùng SVG tĩnh)
- Perlin noise generator
- Speed control
- Color-mapped noise

**Cách thực hiện:**
```javascript
// Canvas animated grain
const canvas = document.createElement('canvas');
canvas.width = 200;
canvas.height = 200;
const ctx = canvas.getContext('2d');

let noiseOffset = 0;

function animateGrain() {
  noiseOffset += 0.01;
  
  // Generate Perlin-like noise
  for (let i = 0; i < canvas.width * canvas.height; i++) {
    const grain = Math.sin(i + noiseOffset) * 0.5 + 0.5;
    const pixelData = (grain * 255) | 0;
    
    ctx.fillStyle = `rgba(255, 255, 255, ${grain * 0.15})`;
    ctx.fillRect(i % canvas.width, (i / canvas.width) | 0, 1, 1);
  }
  
  document.getElementById('grain').style.backgroundImage = 
    `url('${canvas.toDataURL()}')`;
  
  requestAnimationFrame(animateGrain);
}
animateGrain();
```

**File bạn có:** Static SVG → 20%
**Nên là:** Animated noise → 100%
**Độ khó:** Medium

---

## ✅ CÁC PHẦN ĐÃ TỐT

| Feature | Assessment | Score |
|---------|------------|-------|
| **Copy & Tone** | Deadpan serious, satirical ✓ | 95/100 |
| **Color Scheme** | #080808 + #C8FF00 + #F0EDE6 perfect | 95/100 |
| **Typography** | Bebas Neue + DM Mono, correct kerning | 90/100 |
| **Layout Structure** | Section flow logical, readable | 85/100 |
| **Button Design** | Minimalist, interactive states ✓ | 80/100 |
| **Testimonials** | Funny, Oryzo-style | 85/100 |
| **Pricing Tiers** | Satirical copy on point | 90/100 |
| **GSAP Basics** | ScrollTrigger, stagger animations | 75/100 |

---

## 🎯 MASTER PROMPT - Nâng cấp lên Lusion Level

### System Prompt
```
You are a senior 3D web engineer at Lusion — 
world's top digital production studio.

Your task: Upgrade an existing Oryzo-style landing page 
to LUSION QUALITY.

Requirements:
1. Add THREE.JS CUSTOM SHADERS (rim light, film grain, fog)
2. Implement CUSTOM SCROLL LERP (not GSAP standard)
3. Enhance 3D geometry with PBR materials
4. Add MOUSE-REACTIVE effects (light leak, glow)
5. Animate film grain via canvas/shader
6. Optimize performance (LOD, instancing)
7. Mobile responsive, 60fps target
8. Maintain existing copy & design (don't change that)

Tech Stack:
- THREE.js r128+ with ShaderMaterial
- GSAP 3.12+ (only for text/UI, not scroll)
- Vanilla JS for custom scroll
- Canvas API for grain animation
- No external libraries except above

Execution standard: Every detail screams premium.
Animation curves should feel heavy, intentional.
Shader effects must look photographic, not plasticky.
Mobile must perform at 60fps.
```

### User Prompt
```
Upgrade this Oryzo landing page (existing code below) 
to LUSION PRODUCTION QUALITY.

IMPROVEMENTS REQUIRED:

[1] GLSL CUSTOM SHADERS
Add 4 shader effects to the cork coaster 3D object:
  a) Rim light shader (glowing edge effect, #C8FF00)
  b) Film grain shader (perlin noise, animated)
  c) Depth fog shader (atmospheric distance)
  d) Light leak shader (reactive to mouse X/Y)
  
Use ShaderMaterial with proper uniforms for:
- rimColor, rimPower, fogColor, fogDensity
- noiseScale, noiseSpeed, mouseInfluence
- All should be tweakable in real-time

[2] CUSTOM SCROLL LERP (Scroll Jacking)
Replace GSAP ScrollTrigger's standard scrub with:
  a) Custom scroll position lerp (smooth factor 0.08)
  b) Scroll momentum/inertia on wheel end
  c) Per-section scroll speed override
  d) Overscroll bounce (Mac Safari style)
  
Example: .hero section scrolls slower (lerp 0.05)
         .features section scrolls faster (lerp 0.12)

[3] DETAILED 3D GEOMETRY
Replace BoxGeometry cube with:
  a) CylinderGeometry for cork coaster (radius 3, height 0.3, segments 64)
  b) Beveled edges using THREE.RoundedBoxGeometry
  c) Cork texture map (use Perlin noise procedurally generated)
  d) Normal map for surface detail (bumps, cracks)
  e) PBR material: metalness 0.05, roughness 0.85
  f) Displacement map for depth (optional, if perf allows)

[4] MOUSE-REACTIVE LIGHT LEAK
Current: static radial-gradient
Upgrade to:
  a) Primary light leak follows mouseX/mouseY (0.2s easing)
  b) Secondary light leak (delayed by 0.6s) creates trail
  c) Tertiary micro-leak (small pulse on mousemove)
  d) Color shifts based on mouse velocity (HSL hue rotation)
  e) Intensity increases when mouse moves fast

[5] ANIMATED FILM GRAIN
Current: static SVG overlay
Upgrade to:
  a) Canvas-based Perlin noise generator (or simplex)
  b) Grain animates at 0.02 speed offset per frame
  c) Opacity varies 0.02-0.06 based on time
  d) Grain intensity increases in dark areas (adaptive)
  e) Use mix-blend-mode: screen or overlay for seamless blend

[6] ADDITIONAL POLISH
  a) Add depth-of-field effect (blur background, sharpen center)
  b) Chromatic aberration on text during scroll (RGB shift, 1-2px)
  c) Add particle system behind coaster (small floating elements)
  d) Glow effect on accent color (#C8FF00) using postprocessing
  e) Add subtle parallax to text layers (different scroll speeds)

[7] PERFORMANCE OPTIMIZATION
  a) LOD (Level of Detail) for geometry on mobile
  b) Throttle mouse events (50ms update frequency)
  c) Lazy load textures
  d) Use THREE.InstancedMesh for repeated elements
  e) Target 60fps on desktop, 30fps minimum on mobile

[8] MAINTAIN EXISTING CONTENT
  Keep all copy, layout, sections, testimonials unchanged.
  Only upgrade the TECHNICAL EXECUTION.

OUTPUT: 
Single HTML file (no external assets except Google Fonts).
Inline all shaders in <script> tags.
Include performance monitoring (FPS counter optional).
Test on mobile (iOS Safari, Android Chrome).

EXECUTION STANDARD:
Every shader effect must look INTENTIONAL.
Every animation must feel HEAVY & CINEMATIC.
Motion should feel like a $500k production.
No lazy defaults. No generic three.js aesthetics.
This is LUSION-GRADE work.
```

---

## 🛠️ CODE TEMPLATE - Starting Point

Here's the minimal Three.js + Shader foundation you need:

```javascript
// === RIM LIGHT SHADER ===
const rimLightMaterial = new THREE.ShaderMaterial({
  uniforms: {
    rimColor: { value: new THREE.Color(0xC8FF00) },
    rimPower: { value: 2.5 },
    baseColor: { value: new THREE.Color(0x2a2420) }
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform vec3 rimColor;
    uniform float rimPower;
    uniform vec3 baseColor;
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(cameraPosition - vPosition);
      float rim = pow(1.0 - clamp(dot(normal, viewDir), 0.0, 1.0), rimPower);
      
      vec3 finalColor = mix(baseColor, rimColor, rim * 0.6);
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
});

// === FILM GRAIN SHADER ===
const filmGrainShader = {
  uniforms: {
    tDiffuse: { value: null },
    grainAmount: { value: 0.04 },
    noiseScale: { value: 1.0 },
    noiseSpeed: { value: 0.05 },
    time: { value: 0 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform sampler2D tDiffuse;
    uniform float grainAmount;
    uniform float noiseScale;
    uniform float noiseSpeed;
    uniform float time;
    
    float rand(vec2 co) {
      return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      float noise = rand(vUv * noiseScale + time * noiseSpeed);
      color.rgb += (noise - 0.5) * grainAmount;
      gl_FragColor = color;
    }
  `
};

// === USAGE ===
const coasterMesh = new THREE.Mesh(geometry, rimLightMaterial);
scene.add(coasterMesh);

// Update uniforms each frame
material.uniforms.rimColor.value.set(0xC8FF00);
material.uniforms.rimPower.value = 2.5;
```

---

## 📋 IMPLEMENTATION CHECKLIST

- [ ] Add THREE.ShaderMaterial with rim light
- [ ] Implement film grain shader with animation
- [ ] Add fog shader for depth
- [ ] Create custom scroll lerp system (not GSAP scrub)
- [ ] Upgrade coaster geometry to CylinderGeometry + bevels
- [ ] Add PBR material (metalness, roughness, normal map)
- [ ] Implement mouse-reactive light leak (3 layers)
- [ ] Add canvas-based animated grain overlay
- [ ] Optimize for mobile (LOD, throttled events)
- [ ] Test 60fps on desktop, 30fps on mobile
- [ ] Verify all animations feel cinematic
- [ ] Check mobile responsiveness
- [ ] Final polish pass (blur, chromatic aberration, particles)

---

## 🎬 FINAL OUTPUT SPEC

**File:** `index-upgraded.html`
**Size:** Keep < 200KB (including inline shader)
**Load Time:** < 2s on 4G
**FPS Desktop:** 55-60fps
**FPS Mobile:** 28-30fps
**Browsers:** Chrome 90+, Firefox 88+, Safari 15+
**Mobile:** iOS Safari 15+, Android Chrome 90+

---

## 🔗 REFERENCES

- Oryzo.ai (Lusion) - Real example
- Three.js Docs: https://threejs.org/docs/
- GLSL Shader: https://thebookofshaders.com/
- GSAP Docs: https://gsap.com/docs/
- Perlin Noise: https://gist.github.com/Kasuken/3f0887b4510c3254b0bce3f3a5047934

---

**Status:** Ready to implement  
**Difficulty:** Medium-Hard  
**Estimated Time:** 8-12 hours  
**Result Quality:** LUSION-GRADE ⭐⭐⭐⭐⭐