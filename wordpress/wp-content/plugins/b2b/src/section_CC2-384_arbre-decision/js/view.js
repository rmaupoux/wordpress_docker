import { drawLines } from './chart';

// Initializing the function call
const section = document.querySelectorAll('.chart-section')

const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
        const origin = entry.target.querySelector('.main-picto')    

        drawLines(entry.target, origin);
    }
});

function addListener () {

    section.forEach(el => {
        if(window.innerWidth >= 834) {
            const origin = el.querySelector('.main-picto')

            drawLines(el, origin);
            resizeObserver.observe(el);
        } else {
            el.querySelector('.chart-canvas')?.remove();
        }
    });
} 
addListener();

window.addEventListener('resize', () => {
    if(window.innerWidth < 834) {
        section.forEach(el => {
            resizeObserver.unobserve(el);
            el.querySelector('.chart-canvas')?.remove();
        });
    } else {
        addListener();
    }
});