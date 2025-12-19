/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../citeo-semantic/assets/slider.js":
/*!******************************************!*\
  !*** ../citeo-semantic/assets/slider.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   calculateItemsInView: () => (/* binding */ calculateItemsInView),
/* harmony export */   slide: () => (/* binding */ slide)
/* harmony export */ });
/*
*
* The 99 Slider by Thomas Guillet
*
*/
const calculateItemsInView = (index, wrapper) => {
  const items = wrapper.classList.contains('slider-wrap') ? [...wrapper.children].filter(e => !e.classList.contains('clone')) : [...wrapper.querySelector('.slider-wrap').children].filter(e => !e.classList.contains('clone'));
  if (items) {
    const itemsGap = Math.abs(items[0].getBoundingClientRect().right - items[1].getBoundingClientRect().left),
      viewPort = wrapper.offsetWidth;
    let result = 0,
      increment = 0;
    for (let i = index; i < items.length; i++) {
      const slideWidth = i === index ? items[i].offsetWidth : items[i].offsetWidth + itemsGap;
      increment += slideWidth;
      if (increment >= viewPort) {
        result += 1 - (increment - viewPort) / viewPort;
        break;
      } else {
        result++;
      }
    }
    return result;
  } else {
    return 0;
  }
};
const shuffleArr = async array => {
  const resultArr = array;
  for (let i = resultArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [resultArr[i], resultArr[j]] = [resultArr[j], resultArr[i]];
  }
  return resultArr;
};
const toggleSlider = wrap => {
  if (wrap.children && wrap.children.length > 1) {
    const itemsInView = calculateItemsInView(0, wrap);
    const childCount = [...wrap.children].filter(e => !e.classList.contains('clone')).length;
    return childCount > itemsInView;
  } else {
    return false;
  }
};
/*
* MAIN FUNCTION
*/
const iOS = ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform)
// iPad on iOS 13 detection
|| navigator.userAgent.includes("Mac") && "ontouchend" in document;
const slide = async (wrapper, controls, sliderParam) => {
  const items = wrapper.children,
    itemsLength = items?.length;

  // Kill the slider if no items found in slider (this allows the code to cleanly reexecute if items are added dynamically)
  if (itemsLength <= 0) return;
  const prev = controls?.querySelector('.prev-slide'),
    next = controls?.querySelector('.next-slide'),
    firstSlide = items[0],
    lastSlide = items[itemsLength - 1],
    originalItems = [...items].filter(e => !e.classList.contains('clone')),
    wrapViewPort = originalItems[originalItems.length - 1].getBoundingClientRect().right - originalItems[0].getBoundingClientRect().left,
    {
      isInfinite,
      isDraggable,
      step,
      stepper,
      autoParams,
      isRandom,
      hasTotal
    } = sliderParam,
    {
      hasStepper,
      controlStepper,
      stepperType
    } = stepper,
    {
      isAuto,
      speed,
      autoDir
    } = autoParams,
    totalWrap = wrapper.parentElement.querySelector('.total-wrap') || controls?.querySelector('.total-wrap');
  let gap = items.length > 1 ? Math.abs(items[0].getBoundingClientRect().right - items[1].getBoundingClientRect().left) : 0,
    index = 0,
    allowShift = true,
    itemsInView = 1,
    sliderStartLimit = 0,
    sliderEndLimit = 0,
    curItemSize = items[index].offsetWidth,
    offset = 0,
    stepIndexList = [],
    isRunning = false,
    dragStart = () => {},
    dragAction = () => {},
    dragEnd = () => {},
    cloneStartArr = new Array(itemsLength),
    cloneEndArr = new Array(itemsLength),
    resizeTimer = undefined,
    autoInterval = 1,
    windowWidth = window.innerWidth;

  // CALCULATE THE SLIDER END LIMIT FOR BOTH SLIDER STOP AND SLIDER BACK TO START TRIGGER
  const calculateSliderEnd = () => {
    // let increment = 0
    const viewPort = wrapper.getBoundingClientRect().width;
    // for(let i = originalItems.length - 1; i >= 0; i--) {
    //     const slideWidth = i === originalItems.length - 1 ? originalItems[i].getBoundingClientRect().width : originalItems[i].getBoundingClientRect().width + gap
    //     increment += slideWidth;

    //     if(increment > viewPort) {
    //         increment -= slideWidth
    //         break;
    //     }

    // }
    // const itemsTotalWidth = Math.abs(lastSlide.getBoundingClientRect().right - firstSlide.getBoundingClientRect().left - increment);
    const itemsTotalWidth = Math.abs(lastSlide.getBoundingClientRect().left - firstSlide.getBoundingClientRect().left);
    return -itemsTotalWidth;
  };
  // SNAP SLIDER TO THE CLOSEST SLIDE
  const snapToIndex = newIndex => {
    let translateX = 0;
    for (let i = 0; i < newIndex; i++) {
      const slideWidth = items[i].getBoundingClientRect().width + gap;
      translateX -= slideWidth;
    }
    // Not sure if this is still useful ? Looks like it checks if the current transform value is equal to where it has to snap.
    const style = window.getComputedStyle(wrapper),
      matrix = new WebKitCSSMatrix(style.transform);
    if (Math.round(matrix.m41) === Math.round(translateX)) {
      checkIndex();
      return;
    }
    wrapper.classList.add('shifting');
    wrapper.style.transform = `translateX(${translateX}px)`;
  };
  // CLONE ALL SLIDES AT BOTH END OF THE SLIDER
  const cloneSlides = async () => {
    // Checking if current clone exists (rerunned function on resize)
    const currentClones = wrapper.querySelectorAll('.clone');
    // Redefining firstSlide as the array may have been randomized
    const firstSlideInList = items[0];
    if (currentClones.length === 0) {
      // Cloning both the start and end of the slider
      for (let i = 0; i < itemsLength; i++) {
        cloneStartArr[i] = items[i].cloneNode(true);
        cloneEndArr[i] = items[i].cloneNode(true);
        cloneStartArr[i].classList.add('clone');
        cloneEndArr[i].classList.add('clone');
      }
      cloneStartArr.forEach(e => {
        wrapper.appendChild(e);
      });
      cloneEndArr.forEach(e => {
        wrapper.insertBefore(e, firstSlideInList);
      });
    }
  };
  // MAIN DRAG FUNCTIONS
  if (isDraggable) {
    let posX1 = 0,
      posX2 = 0,
      posY = 0,
      wrapperPos = {
        yMin: wrapper.getBoundingClientRect().top,
        yMax: wrapper.getBoundingClientRect().bottom
      };
    dragStart = e => {
      e.stopPropagation();
      if (!allowShift) return;
      e = e || window.event;
      if (iOS) {
        wrapperPos = {
          yMin: wrapper.getBoundingClientRect().top,
          yMax: wrapper.getBoundingClientRect().bottom
        };
        posY = e.touches[0].clientY;
        if (posY < wrapperPos.yMin || posY > wrapperPos.yMax) {
          return;
        }
      }
      allowShift = false;
      if (isAuto) {
        const style = window.getComputedStyle(wrapper),
          matrix = new WebKitCSSMatrix(style.transform),
          curPos = parseFloat(matrix.m41);
        wrapper.style.transform = `translateX(${curPos}px)`;
      }
      wrapper.classList.remove('shifting');
      if (e.type == 'touchstart') {
        posX1 = e.touches[0].clientX;
      } else {
        posX1 = e.clientX;
        document.onmouseup = dragEnd;
        document.onmousemove = dragAction;
      }
      if (isAuto) clearInterval(autoInterval);
    };
    dragAction = e => {
      e = e || window.event;
      e.stopPropagation();
      if (iOS) {
        if (posY < wrapperPos.yMin || posY > wrapperPos.yMax) {
          return;
        }
      }
      if (e.type == 'touchmove') {
        posX2 = posX1 - e.touches[0].clientX;
        posX1 = e.touches[0].clientX;
      } else {
        posX2 = posX1 - e.clientX;
        posX1 = e.clientX;
      }
      if (iOS && Math.abs(posY - e.touches[0].clientY) < 50) {
        e.preventDefault();
      }
      const style = window.getComputedStyle(wrapper),
        matrix = new WebKitCSSMatrix(style.transform),
        curPos = parseFloat(matrix.m41);
      if (isInfinite) {
        const lastSlideWidth = originalItems[originalItems.length - 1].getBoundingClientRect().right - originalItems[originalItems.length - 1].getBoundingClientRect().left;
        const firstSlideWidth = originalItems[0].getBoundingClientRect().right - originalItems[0].getBoundingClientRect().left;
        if (curPos - posX2 >= sliderStartLimit + lastSlideWidth + gap) {
          wrapper.style.transform = `translateX(${sliderEndLimit}px)`;
        } else if (curPos - posX2 <= sliderEndLimit - firstSlideWidth) {
          wrapper.style.transform = `translateX(${sliderStartLimit}px)`;
        } else {
          wrapper.style.transform = `translateX(${curPos - posX2}px)`;
        }
      } else {
        if (curPos - posX2 >= sliderStartLimit) {
          wrapper.style.transform = `translateX(${sliderStartLimit}px)`;
        } else if (curPos - posX2 <= sliderEndLimit) {
          wrapper.style.transform = `translateX(${sliderEndLimit}px)`;
        } else {
          wrapper.style.transform = `translateX(${curPos - posX2}px`;
        }
      }
    };
    dragEnd = () => {
      document.onmouseup = null;
      document.onmousemove = null;
      if (iOS) {
        if (posY < wrapperPos.yMin || posY > wrapperPos.yMax) {
          return;
        }
      }
      const style = window.getComputedStyle(wrapper),
        matrix = new WebKitCSSMatrix(style.transform),
        curPos = parseFloat(matrix.m41);
      const getIndexFromPos = pos => {
        const cleanedPos = Math.abs(pos);
        let result = 0,
          increment = 0;
        for (let i = 0; i < items.length; i++) {
          const slideWidth = i === 0 ? items[i].offsetWidth : items[i].offsetWidth + gap;
          increment += slideWidth;
          if (increment >= cleanedPos) {
            result += 1 - (increment - cleanedPos) / slideWidth;
            break;
          } else {
            result++;
          }
        }
        // Threshold to slide to next item
        if (result > index && result % 1 < 0.25 || result < index && result % 1 < 0.75) {
          result = Math.floor(result);
        } else {
          result = Math.ceil(result);
        }
        return result;
      };
      index = getIndexFromPos(curPos);
      itemsInView = Math.ceil(calculateItemsInView(index, wrapper));
      if (!isInfinite) {
        if (prev && curPos === 0) {
          checkIndex();
          return;
        }
      }
      if (isAuto) {
        index = autoDir === 'left' ? itemsLength + offset : offset - 1;
        wrapper.style.transform = `translateX(${curPos}px)`;
        const slideProg = autoDir === 'left' ? Math.abs(2 * ((2 * wrapViewPort - Math.abs(curPos)) / (2 * wrapViewPort))) : Math.abs(1 - 2 * ((2 * wrapViewPort - Math.abs(curPos)) / (2 * wrapViewPort)));
        // Since slider is infinite, add the offset to get the real progression of the slider
        wrapper.style.transition = `transform linear ${slideProg * originalItems.length * speed}s`;
      }
      snapToIndex(index);
      allowShift = true;
    };
  }
  // GO TO NEXT SLIDER BASED ON A GIVEN DIRECTION
  const shiftSlide = dir => {
    wrapper.classList.add('shifting');
    if (allowShift) {
      const style = window.getComputedStyle(wrapper),
        matrix = new WebKitCSSMatrix(style.transform);
      if (dir == -1) {
        curItemSize = Math.round(items[index].offsetWidth + Math.abs(gap));
        index += step;
      } else if (dir == 1) {
        index -= step;
        curItemSize = Math.round(items[index].offsetWidth + Math.abs(gap));
      }
      wrapper.style.transform = `translateX(${matrix.m41 + step * dir * curItemSize}px)`;
    }
    ;

    // Prevent double input while animating
    allowShift = false;
  };

  // SANITIZE THE INDEX TO MAKE SURE IT'S WITHIN DEFINED BOUNDARIES
  const checkIndex = () => {
    wrapper.classList.remove('shifting');
    const activeSlides = wrapper.querySelectorAll('.active-slide');
    activeSlides.forEach(e => e.classList.remove('active-slide'));
    if (isInfinite) {
      if (index < offset) {
        wrapper.style.transform = `translateX(${sliderEndLimit}px`;
        index += offset;
        if (isAuto) {
          index = offset - 1;
          wrapper.style.transition = `transform linear ${originalItems.length * speed}s`;
          snapToIndex(index);
        }
      } else if (index >= itemsLength + offset) {
        wrapper.style.transform = `translateX(${sliderStartLimit}px`;
        index = offset;
        if (isAuto) {
          index = itemsLength + offset;
          wrapper.style.transition = `transform linear ${originalItems.length * speed}s`;
          snapToIndex(index);
        }
      }
      items[index]?.classList.add('active-slide');
    } else {
      // Added a 0.01 buffer to compensate rounded value 
      itemsInView = calculateItemsInView(index, wrapper) + 0.05;
      if (index < step && prev) {
        next.classList.remove('disabled');
        prev.classList.add('disabled');
      } else if (index >= itemsLength - 1 && prev) {
        // Permet de naviguer jusqu'au dernier élément (index = itemsLength - 1)
        prev.classList.remove('disabled');
        next.classList.add('disabled');
      } else {
        prev?.classList.remove('disabled');
        next?.classList.remove('disabled');
      }
      items[index].classList.add('active-slide');
    }
    if (hasStepper) {
      controlStepper.querySelector('.active-step')?.classList.remove('active-step');
      isInfinite && originalItems.length > itemsInView ? stepIndexList[index - offset].classList.add('active-step') : stepIndexList[index].classList.add('active-step');
    }
    if (hasTotal) {
      // Calcul pour naviguer élément par élément jusqu'au dernier
      let displayIndex = isInfinite ? index - itemsLength + 1 : index + 1;
      totalWrap.innerHTML = `${displayIndex}/${itemsLength}`;
    }
    allowShift = true;
  };
  /*
  * ACTIVATE SLIDER
  */
  const activateSlider = async () => {
    itemsInView = Math.ceil(calculateItemsInView(index, wrapper));
    sliderEndLimit = calculateSliderEnd();
    // EVENT LISTENER
    if (isDraggable) {
      if ("ontouchstart" in document.documentElement) {
        // Because iOS is shit
        if (iOS) {
          // Touch events
          document.addEventListener('touchstart', dragStart);
          document.addEventListener('touchend', dragEnd);
          document.addEventListener('touchmove', dragAction, {
            passive: false
          });
        } else {
          // Touch events
          wrapper.addEventListener('touchstart', dragStart);
          wrapper.addEventListener('touchend', dragEnd);
          wrapper.addEventListener('touchmove', dragAction);
        }
      } else {
        wrapper.onmousedown = dragStart;
      }
    }
    // Adding prev and next click events if they are defined
    if (prev || next) {
      prev.style.display = 'block';
      next.style.display = 'block';
      prev?.addEventListener('click', () => shiftSlide(step));
      next?.addEventListener('click', () => shiftSlide(-step));
    }
    // STEPPER
    if (hasStepper) {
      controlStepper.innerHTML = '';
      for (let i = 1; i <= itemsLength; i++) {
        const stepIndex = document.createElement('span');
        stepIndex.classList.add('step-index');
        stepIndex.classList.add(`step-${stepperType}`);
        if (stepperType === 'num') {
          stepIndex.innerText = i;
        }
        controlStepper.appendChild(stepIndex);
      }
      stepIndexList = controlStepper.querySelectorAll('.step-index');
      const activeStepper = isInfinite && originalItems.length > itemsInView ? index - itemsInView : index;
      stepIndexList[activeStepper].classList.add('active-step');
      stepIndexList.forEach((e, id) => {
        const key = isInfinite && originalItems.length > itemsInView ? id + offset : id;
        e.addEventListener('click', () => {
          index = key;
          snapToIndex(index);
        });
      });
    }
    if (isRandom) {
      wrapper.innerHTML = '';
      await shuffleArr(originalItems);
      originalItems.forEach(slide => {
        wrapper.appendChild(slide);
      });
    }
    // INFINITE 
    if (isInfinite) {
      await cloneSlides();
      sliderStartLimit = originalItems[0].getBoundingClientRect().left - originalItems[originalItems.length - 1].getBoundingClientRect().right - gap;
      offset = itemsLength;
      // Refresh the index to the number of slides we've added before
      index = itemsLength;
      wrapper.style.transition = 'none';
      wrapper.style.transform = `translateX(${sliderStartLimit}px)`;
      sliderEndLimit = sliderStartLimit + (originalItems[0].getBoundingClientRect().left - originalItems[originalItems.length - 2].getBoundingClientRect().right - gap);
      // Making the slider automatically slide
      if (isAuto) {
        if (autoDir === 'left') index = itemsLength + offset;else if (autoDir === 'right') {
          wrapper.style.transform = `translateX(${sliderEndLimit}px)`;
          index = offset - 1;
        }
        wrapper.style.transition = `transform linear ${originalItems.length * speed}s`;

        // gives the window time to recompute its position
        setTimeout(() => {
          snapToIndex(index);
        }, 0);
      }
    } else {
      // Deactivate prev button as default index is 0
      prev?.classList.add('disabled');
    }
    if (!isAuto) {
      wrapper.style.transition = `transform ease-out ${step * 0.25}s`;
    }
    // TOTAL 
    if (hasTotal) {
      // Calcul pour naviguer élément par élément jusqu'au dernier
      let displayIndex = isInfinite ? index - itemsLength + 1 : Math.min(index + 1, itemsLength);
      totalWrap.innerHTML = `${displayIndex}/${itemsLength}`;
      totalWrap.style.display = 'block';
    }
    // Add the active-slide class to the first element of the slider
    const activeSlides = wrapper.querySelectorAll('.active-slide');
    activeSlides.forEach(e => e.classList.remove('active-slide'));
    items[index].classList.add('active-slide');

    // Initializing the wrapper
    wrapper.classList.remove('no-slide');
    isRunning = true;
  };
  /*
  * UPDATE SLIDER VARIABLES
  */
  const updateSlider = () => {
    gap = Math.abs(items[0].getBoundingClientRect().right - items[1].getBoundingClientRect().left);
    itemsInView = Math.ceil(calculateItemsInView(index, wrapper));
    sliderStartLimit = isInfinite && originalItems.length > itemsInView ? originalItems[0].getBoundingClientRect().left - originalItems[originalItems.length - 1].getBoundingClientRect().right - gap : 0;
    sliderEndLimit = isInfinite && originalItems.length > itemsInView ? sliderStartLimit + (originalItems[0].getBoundingClientRect().left - originalItems[originalItems.length - 2].getBoundingClientRect().right - gap) : calculateSliderEnd();
    if (isAuto) {
      const style = window.getComputedStyle(wrapper),
        matrix = new WebKitCSSMatrix(style.transform),
        curPos = parseFloat(matrix.m41);
      const slideProg = autoDir === 'left' ? Math.abs(2 * ((2 * wrapViewPort - Math.abs(curPos)) / (2 * wrapViewPort))) : Math.abs(1 - 2 * ((2 * wrapViewPort - Math.abs(curPos)) / (2 * wrapViewPort)));
      const sliderLength = Math.abs(sliderEndLimit - sliderStartLimit);
      wrapper.style.transition = 'none';
      wrapper.style.transform = `translateX(${sliderStartLimit - slideProg * sliderLength}px)`;
      if (autoDir === 'left') index = itemsLength + offset;else if (autoDir === 'right') {
        wrapper.style.transform = `translateX(${sliderEndLimit + slideProg * sliderLength}px)`;
        index = offset - 1;
      }
      wrapper.style.transition = `transform linear ${slideProg * originalItems.length * speed}s`;
    } else {
      checkIndex();
    }
    if (hasTotal) {
      // Calcul pour naviguer élément par élément jusqu'au dernier
      let displayIndex;
      if (isInfinite) {
        displayIndex = index - itemsLength + 1;
      } else {
        // Pour navigation normale : index+1 mais plafonné au nombre total d'éléments
        displayIndex = Math.min(index + 1, itemsLength);
      }
      totalWrap.innerHTML = `${displayIndex}/${itemsLength}`;
      totalWrap.style.display = 'block';
    }
    // gives the window time to recompute its position
    setTimeout(() => {
      snapToIndex(index);
    }, 0);
  };
  /*
  * DEACTIVATE SLIDER
  */
  const deactivateSlider = () => {
    index = isInfinite ? offset : 0;
    if (isDraggable) {
      if ("ontouchstart" in document.documentElement) {
        // Because iOS is shit
        if (iOS) {
          // Touch events
          document.removeEventListener('touchstart', dragStart);
          document.removeEventListener('touchend', dragEnd);
          document.removeEventListener('touchmove', dragAction, {
            passive: false
          });
        } else {
          // Touch events
          wrapper.removeEventListener('touchstart', dragStart);
          wrapper.removeEventListener('touchend', dragEnd);
          wrapper.removeEventListener('touchmove', dragAction);
        }
      } else {
        wrapper.removeEventListener('mousedown', dragStart);
      }
    }
    if (prev || next) {
      prev.style.display = 'none';
      next.style.display = 'none';
      prev?.removeEventListener('click', () => shiftSlide);
      next?.removeEventListener('click', () => shiftSlide);
    }
    if (hasTotal) {
      totalWrap.innerHTML = '';
      totalWrap.style.display = 'none';
    }
    if (hasStepper) {
      controlStepper.innerHTML = '';
    }
    // DEACTIVATE AUTO SLIDE
    wrapper.querySelectorAll('.clone').forEach(el => el.remove());
    wrapper.classList.remove('shifting');
    wrapper.classList.add('no-slide');
    isRunning = false;
  };
  // RESIZE
  window.addEventListener("resize", function () {
    if (window.innerWidth !== windowWidth) {
      windowWidth = window.innerWidth;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (toggleSlider(wrapper) && !isRunning) {
          activateSlider();
        } else if (!toggleSlider(wrapper) && isRunning) {
          deactivateSlider();
        } else if (isRunning && toggleSlider(wrapper)) {
          updateSlider();
        }
      }, 200);
    }
  });
  // Add the active-slide class to the first element of the slider
  const activeSlides = wrapper.querySelectorAll('.active-slide');
  activeSlides.forEach(e => e.classList.remove('active-slide'));
  items[index].classList.add('active-slide');
  // INITAL START
  toggleSlider(wrapper) ? activateSlider() : deactivateSlider();

  // Recalibrate slides in case some lazyloading changes slide width or prevent the slider from properly initializing.
  if (iOS) {
    setTimeout(() => {
      if (isRunning) updateSlider();else if (toggleSlider(wrapper)) {
        activateSlider();
      }
    }, 1000);
  }

  // Transition events to clean the index and reactivate inputs
  wrapper.addEventListener('transitionend', () => {
    checkIndex();
  });
  wrapper.classList.add('loaded');
};

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
/*!***********************************************************!*\
  !*** ./src/section_CC2-994_download-ecojunior/js/view.js ***!
  \***********************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _citeo_semantic_assets_slider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../../../citeo-semantic/assets/slider */ "../citeo-semantic/assets/slider.js");

const jeunesseYearSlider = document.querySelectorAll('.dynamic-year-slider');
jeunesseYearSlider.forEach(async slider => {
  const sliderWrap = slider.querySelector('.slider-wrap'),
    contentWrap = slider.closest('.wp-block-citeo-jeunesse-section-download'),
    controlsWrap = slider.querySelector('.slider-controls'),
    stepperWrap = slider.querySelector('.stepper-wrap'),
    next = controlsWrap.querySelector('.next-slide'),
    prev = controlsWrap.querySelector('.prev-slide');
  // Recopy slider params to be ready to restart it after elements added
  const isInfinite = slider.dataset.infinite === 'true',
    isDraggable = slider.dataset.draggable === 'true',
    step = parseInt(slider.dataset.step),
    hasStepper = slider.dataset.stepper === 'true',
    stepperType = slider.dataset.stepperType,
    isAuto = slider.dataset.isAuto === 'true',
    speed = parseInt(slider.dataset.speed),
    autoDir = slider.dataset.autoDir,
    isRandom = slider.dataset.isRandom === 'true';
  const sliderParams = {
    isInfinite: isInfinite,
    isDraggable: isDraggable,
    step: step,
    stepper: {
      hasStepper: hasStepper,
      controlStepper: stepperWrap,
      stepperType: stepperType
    },
    autoParams: {
      isAuto: isAuto,
      speed: speed,
      autoDir: autoDir
    },
    isRandom: isRandom
  };
  // Fetch all terms from the taxonomy to fill slides
  const allYears = await fetch('/wp-json/wp/v2/magazine-year').then(res => res.json()).catch(err => console.error(err));
  const orderedYear = new Array(allYears.length);
  allYears.forEach((year, i) => {
    orderedYear[i] = {
      name: year.name,
      id: year.id
    };
  });
  orderedYear.sort().reverse();
  // Main function to fetch content
  const fetchContent = async yearId => {
    const accordeonList = contentWrap.querySelector('.ecojunior-content--accordeon');

    // --- SKELETON LOADER ---
    accordeonList.innerHTML = `
            <div class="ecojunior-skeleton">
                <div class="skeleton-left">
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line"></div>
                </div>
                <div class="skeleton-right"></div>
            </div>
        `;
    // --- FIN SKELETON LOADER ---
    // Fetch magazine from the given term id
    const magazineList = await fetch(`/wp-json/wp/v2/magazine-jeunesse?magazine-year=${yearId}`).then(res => res.json()).catch(err => console.error(err));

    // Remove current content
    accordeonList.innerHTML = '';
    magazineList.sort((a, b) => {
      const dateA = new Date(a.date),
        dateB = new Date(b.date);
      if (dateA < dateB) return 1;
      if (dateA > dateB) return -1;
      return 0;
    });
    // Add new content
    if (magazineList.length > 0) {
      magazineList.forEach((magazine, i) => {
        const date = new Date(magazine.date);
        const formattedDate = new Intl.DateTimeFormat("fr-FR", {
          year: "numeric",
          month: "long"
        }).format(date);
        accordeonList.innerHTML += magazine.content.rendered;
        const dateEl = accordeonList.querySelectorAll('.mag-date')[i];
        dateEl.innerText = formattedDate;
      });
      // Remove active class potentially added from post content
      const active = accordeonList.querySelectorAll('.is-active');
      active.forEach(el => el.classList.remove('is-active'));
      // Add active class to first element 
      accordeonList.querySelectorAll('.accordeon-wrapper')[0].classList.add('is-active');
      // Manually add event listener to dynamically added accordeons
      accordeonList.querySelectorAll('.accordeon-toggle').forEach(toggle => {
        // Only one accordeon can be active at a time
        toggle.addEventListener('click', () => {
          const activeAccordeon = accordeonList.querySelectorAll('.is-active');
          activeAccordeon.forEach(el => el.classList.remove('is-active'));
          toggle.closest('.accordeon-wrapper').classList.add('is-active');
        });
      });
    } else {
      // Output a no result message
      accordeonList.innerHTML = '<p class="no-result-txt Body-2">Pas de magazines publiés sur cette période.</p>';
    }
  };
  // Reset the publication year slider content to prepare clean fetch
  sliderWrap.classList.remove('no-slide');
  sliderWrap.innerHTML = '';
  // Add terms to the slider
  orderedYear.forEach((year, i) => {
    const item = document.createElement('span');
    item.classList.add('item-year');
    // Add active class to first item in the slider
    if (i === 0) item.classList.add('active-slide');
    item.innerText = year.name;
    item.dataset.id = year.id;
    sliderWrap.appendChild(item);
  });
  // Update accordeon content on previous and next button click
  next.addEventListener('click', async () => {
    const active = sliderWrap.querySelector('.active-slide').nextElementSibling;
    const yearId = active.dataset.id;
    await fetchContent(yearId);
  });
  prev.addEventListener('click', async () => {
    const active = sliderWrap.querySelector('.active-slide').previousElementSibling;
    const yearId = active.dataset.id;
    await fetchContent(yearId);
  });
  // Initialize the block content with magazines from the first item in the publication year slider
  await fetchContent(orderedYear[0].id);
  // Restart the slider that was initially killed due to no slide in the slider
  (0,_citeo_semantic_assets_slider__WEBPACK_IMPORTED_MODULE_0__.slide)(sliderWrap, controlsWrap, sliderParams);
});
})();

/******/ })()
;
//# sourceMappingURL=view.js.map