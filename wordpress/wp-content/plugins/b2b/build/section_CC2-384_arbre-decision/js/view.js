/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/section_CC2-384_arbre-decision/js/chart.js":
/*!********************************************************!*\
  !*** ./src/section_CC2-384_arbre-decision/js/chart.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   drawLines: () => (/* binding */ drawLines)
/* harmony export */ });
// Main function to draw the graph
function drawLines(container, originEl) {
  if (!container || !originEl) {
    return;
  }
  const canvasWrap = container.querySelector('.chart-wrap');
  if (!canvasWrap) return;
  const canvasSize = canvasWrap.getBoundingClientRect(),
    canvas = container.querySelector('canvas') ? container.querySelector('canvas') : document.createElement('canvas');
  canvas.width = canvasSize.width;
  canvas.height = canvasSize.height;
  if (!container.querySelector('canvas')) {
    canvas.classList.add('chart-canvas');
    canvasWrap.appendChild(canvas);
  }
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Sub function to convert absolute coordinates of relevant elements to values relative to the canvas
  const getRelativeCoord = (container, canvas) => {
    const destNodes = [...container.querySelectorAll('.chart-picto')];
    const getCoordinate = (el, point) => {
      const absoluteCoord = el.getBoundingClientRect();
      // Number of pixel between the element border and the start of the drawing
      const gap = 0;
      let coord = {
        x: absoluteCoord.left + absoluteCoord.width / 2 - canvas.left,
        y: absoluteCoord.top + absoluteCoord.height / 2 - canvas.top
      };
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
    };

    // get the coordinates of the origin relative to canvas
    const startCoord = getCoordinate(originEl, 'right');
    const destArr = destNodes.map(el => getCoordinate(el, 'left'));
    return [startCoord, destArr];
  };
  const [origin, destArr] = getRelativeCoord(container, canvasSize);
  const computedStyle = getComputedStyle(canvasWrap);
  ctx.strokeStyle = computedStyle.getPropertyValue('color');
  ctx.lineWidth = 3;
  ctx.lineCap = 'butt';

  // X taken as the distance between the origin and the destination
  const originDestGapX = Math.abs(origin.x - destArr[0].x),
    originDestGapY = Math.abs(origin.y - destArr[0].y);
  destArr?.forEach(dest => {
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    const destInt = Math.round(dest.y),
      originInt = Math.round(origin.y);
    const curveWidth = 24;

    // if the destination and origin are on the same level, draw a straight line
    if (destInt === originInt) {
      ctx.lineTo(dest.x + 2, dest.y);
    } else {
      // First point goes all the way to about half the canvas size
      const firstX = origin.x + (originDestGapX - 2 * curveWidth) / 2;
      const point1 = {
        x: firstX,
        y: origin.y
      };
      ctx.lineTo(point1.x, point1.y);
      let point2 = {},
        vector1 = {},
        vector2 = {};

      // Checking if the curver height overshoot de destination point y coordinate
      if (Math.abs(originInt - destInt) < 2 * curveWidth) {
        point2.x = point1.x + curveWidth * 2;
        point2.y = dest.y;

        /* 
        * To generate bezier vectors
        * https://www.desmos.com/calculator/cahqdxeshd
        */

        vector1 = {
          x: (point2.x - point1.x) * 0.5 + point1.x,
          y: point1.y
        };
        vector2 = {
          x: (point2.x - point1.x) * 0.5 + point1.x,
          y: point2.y
        };
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
        let point3 = {
            x: point2.x
          },
          point4 = {
            x: point3.x + curveWidth,
            y: dest.y
          };
        if (originInt > destInt) {
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
        };
        vector2 = {
          x: point2.x,
          y: (point2.y - point1.y) * 0.5 + point1.y
        };
        ctx.bezierCurveTo(vector1.x, vector1.y, vector2.x, vector2.y, point2.x, point2.y);
        ctx.lineTo(point3.x, point3.y);
        const vector3 = {
            x: point3.x,
            y: (point4.y - point3.y) * 0.5 + point3.y
          },
          vector4 = {
            x: (point4.x - point3.x) * 0.5 + point3.x,
            y: point4.y
          };
        ctx.bezierCurveTo(vector3.x, vector3.y, vector4.x, vector4.y, point4.x, point4.y);
      }
      ctx.lineTo(dest.x + 2, dest.y);
    }

    // Finally we draw the path
    ctx.stroke();
  });
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*******************************************************!*\
  !*** ./src/section_CC2-384_arbre-decision/js/view.js ***!
  \*******************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _chart__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chart */ "./src/section_CC2-384_arbre-decision/js/chart.js");


// Initializing the function call
const section = document.querySelectorAll('.chart-section');
const resizeObserver = new ResizeObserver(entries => {
  for (const entry of entries) {
    const origin = entry.target.querySelector('.main-picto');
    (0,_chart__WEBPACK_IMPORTED_MODULE_0__.drawLines)(entry.target, origin);
  }
});
function addListener() {
  section.forEach(el => {
    if (window.innerWidth >= 834) {
      const origin = el.querySelector('.main-picto');
      (0,_chart__WEBPACK_IMPORTED_MODULE_0__.drawLines)(el, origin);
      resizeObserver.observe(el);
    } else {
      el.querySelector('.chart-canvas')?.remove();
    }
  });
}
addListener();
window.addEventListener('resize', () => {
  if (window.innerWidth < 834) {
    section.forEach(el => {
      resizeObserver.unobserve(el);
      el.querySelector('.chart-canvas')?.remove();
    });
  } else {
    addListener();
  }
});
})();

/******/ })()
;
//# sourceMappingURL=view.js.map