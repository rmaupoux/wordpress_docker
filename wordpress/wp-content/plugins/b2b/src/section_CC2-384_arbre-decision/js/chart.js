// Main function to draw the graph
export function drawLines(container, originEl) {
    if(!container || !originEl) {
        return;
    }

    const   canvasWrap = container.querySelector('.chart-wrap')

    if(!canvasWrap) return;
    const   canvasSize = canvasWrap.getBoundingClientRect(),
            canvas = container.querySelector('canvas') ? container.querySelector('canvas') : document.createElement('canvas')

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    if(!container.querySelector('canvas')) {
        canvas.classList.add('chart-canvas');
        canvasWrap.appendChild(canvas);
    }
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

     // Sub function to convert absolute coordinates of relevant elements to values relative to the canvas
    const getRelativeCoord = (container, canvas) => {

        const destNodes = [...container.querySelectorAll('.chart-picto')]
        
        const getCoordinate = (el, point) => {
            const absoluteCoord = el.getBoundingClientRect();
            // Number of pixel between the element border and the start of the drawing
            const gap = 0;
            let coord = {
                x: (absoluteCoord.left + absoluteCoord.width / 2) - canvas.left,
                y: (absoluteCoord.top + absoluteCoord.height / 2) - canvas.top
            }
            
            switch (point) {
                case 'right': 
                    coord.x = absoluteCoord.right - canvas.left + gap;
                    break;
                case 'left':
                    coord.x = absoluteCoord.left - canvas.left - gap;
                    break;
                case 'top': 
                    coord.y = absoluteCoord.top - canvas.top - gap;
                    break;
                case 'bottom':
                    coord.y = absoluteCoord.bottom - canvas.top + gap;
                    break;
                default:
            }
            
            return coord;
        }
    
        // get the coordinates of the origin relative to canvas
        const startCoord = getCoordinate(originEl, 'right')
        
        const destArr = destNodes.map(el => getCoordinate(el, 'left'))

        return [startCoord, destArr]
    }

    const [origin, destArr] = getRelativeCoord(container, canvasSize)

    const computedStyle = getComputedStyle(canvasWrap);
    ctx.strokeStyle = computedStyle.getPropertyValue('color');
    ctx.lineWidth = 3;
    ctx.lineCap = 'butt';

    // X taken as the distance between the origin and the destination
    const originDestGapX = Math.abs(origin.x - destArr[0].x), originDestGapY = Math.abs(origin.y - destArr[0].y)

    destArr?.forEach(dest => {
        ctx.beginPath();
        ctx.moveTo(origin.x, origin.y);

        const destInt = Math.round(dest.y), originInt = Math.round(origin.y)
        const curveWidth = 24
    
        // if the destination and origin are on the same level, draw a straight line
        if (destInt === originInt) {
            ctx.lineTo(dest.x + 2, dest.y);
        } else {
            
            // First point goes all the way to about half the canvas size
            const firstX = origin.x + (originDestGapX - (2 * curveWidth)) / 2
            const point1 = {
                x: firstX,
                y: origin.y
            }
            ctx.lineTo(point1.x, point1.y);

            let point2 = {}, 
                vector1 = {}, 
                vector2 = {}
            
            // Checking if the curver height overshoot de destination point y coordinate
            if(Math.abs(originInt - destInt) < (2 * curveWidth)) {
                
                point2.x = point1.x + curveWidth * 2;
                point2.y = dest.y;

                /* 
                * To generate bezier vectors
                * https://www.desmos.com/calculator/cahqdxeshd
                */

                vector1 = {
                    x: (point2.x - point1.x) * 0.5 + point1.x,
                    y: point1.y
                }
                vector2 = {
                    x: (point2.x - point1.x) * 0.5 + point1.x,
                    y: point2.y
                }    
                ctx.bezierCurveTo(vector1.x, vector1.y, vector2.x, vector2.y, point2.x, point2.y);           
            } else {
                /*
                * Graph to represent points logic
                *          P4   Dest
                *        P3
                * 
                * 
                *        P2
                * Og   P1
                */

                point2.x = point1.x + curveWidth;

                let point3 = { x: point2.x }, 
                    point4 = { x: point3.x + curveWidth, y: dest.y }
                
                if(originInt > destInt) {
                    // Vers le haut
                    point2.y = point1.y - curveWidth;
                    point3.y = dest.y + curveWidth;
                } else {
                    // Vers le bas
                    point2.y = point1.y + curveWidth;
                    point3.y = dest.y - curveWidth;
                } 

                vector1 = {
                    x: (point2.x - point1.x) * 0.5 + point1.x,
                    y: point1.y
                }
                vector2 = {
                    x: point2.x,
                    y: (point2.y - point1.y) * 0.5 + point1.y
                }
                ctx.bezierCurveTo(vector1.x, vector1.y, vector2.x, vector2.y, point2.x, point2.y);

                ctx.lineTo(point3.x, point3.y);

                const vector3 = {
                    x: point3.x,
                    y: (point4.y - point3.y) * 0.5 + point3.y
                }, vector4 = {
                    x: (point4.x - point3.x) * 0.5 + point3.x,
                    y: point4.y
                }
                ctx.bezierCurveTo(vector3.x, vector3.y, vector4.x, vector4.y, point4.x, point4.y);
            }

            ctx.lineTo(dest.x + 2, dest.y);
        }
            
        // Finally we draw the path
        ctx.stroke();
    });
}