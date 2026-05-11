export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
}

export function getMousePos(e) {
    return {
        x: e.clientX,
        y: e.clientY,
        ndcX: (e.clientX / window.innerWidth) * 2 - 1,
        ndcY: -(e.clientY / window.innerHeight) * 2 + 1
    };
}
