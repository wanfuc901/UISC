import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations(scrollState, threeState) {
    const { coasterMesh, camera } = threeState;
    const smoothContent = document.getElementById('smooth-content');

    // Proxy ScrollTrigger to use our custom scrollPos
    ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value) {
            return arguments.length ? scrollState.setScrollTarget(value) : scrollState.getScrollPos();
        },
        getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        }
    });

    // Three.js Scroll Effects
    ScrollTrigger.create({
        trigger: smoothContent,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
            camera.position.z = 15 + self.progress * 30;
            coasterMesh.rotation.y = self.progress * Math.PI * 4;
        }
    });

    // Section 2: Text Reveal
    const revealText = document.getElementById('reveal-text');
    const words = revealText.innerText.trim().split(/\s+/);
    revealText.innerHTML = '';
    words.forEach(word => {
        const span = document.createElement('span');
        span.innerText = word + ' ';
        revealText.appendChild(span);
    });

    gsap.to(".reveal-text span", {
        scrollTrigger: {
            trigger: ".reveal-section",
            start: "top 60%",
            end: "center center",
            scrub: 1
        },
        opacity: 1,
        stagger: 0.1
    });

    // Section 3: Feature Cards
    gsap.from(".feature-card", {
        scrollTrigger: {
            trigger: ".features",
            start: "top 70%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
    });

    // Section 4: Benchmark Bars
    ScrollTrigger.create({
        trigger: ".benchmark",
        start: "top 70%",
        onEnter: () => {
            document.querySelectorAll('.bar-fill').forEach(bar => {
                gsap.to(bar, {
                    width: bar.getAttribute('data-width'),
                    duration: 1.5,
                    ease: "power4.out",
                    delay: bar.classList.contains('industry') ? 0.2 : 0
                });
            });
        }
    });

    // Section 9: Footer Reveal
    gsap.from(".footer-reveal-text", {
        scrollTrigger: {
            trigger: ".footer",
            start: "top bottom",
            end: "center center",
            scrub: 1
        },
        scale: 0.8,
        opacity: 0,
        y: 50
    });
}