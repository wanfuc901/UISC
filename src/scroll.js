import gsap from 'gsap';
import { CONFIG } from './utils/constants.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initCustomScroll() {
    let scrollPos = 0;
    let scrollTarget = 0;
    const smoothWrapper = document.getElementById('smooth-wrapper');
    const smoothContent = document.getElementById('smooth-content');

    window.addEventListener('wheel', (e) => {
        scrollTarget += e.deltaY;
        scrollTarget = Math.max(0, Math.min(scrollTarget, smoothContent.scrollHeight - window.innerHeight));
    }, { passive: true });

    let touchStart = 0;
    window.addEventListener('touchstart', (e) => { touchStart = e.touches[0].pageY; });
    window.addEventListener('touchmove', (e) => {
        const touchDelta = touchStart - e.touches[0].pageY;
        scrollTarget += touchDelta * 1.5;
        scrollTarget = Math.max(0, Math.min(scrollTarget, smoothContent.scrollHeight - window.innerHeight));
        touchStart = e.touches[0].pageY;
    }, { passive: true });

    function update() {
        scrollPos += (scrollTarget - scrollPos) * CONFIG.scrollLerp;
        gsap.set(smoothWrapper, { y: -scrollPos });
        ScrollTrigger.update();
    }

    return {
        update,
        getScrollPos: () => scrollPos,
        getScrollTarget: () => scrollTarget,
        setScrollTarget: (val) => scrollTarget = val
    };
}