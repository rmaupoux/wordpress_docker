/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/icons-citeo.js":
/*!*******************************!*\
  !*** ./assets/icons-citeo.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

const citeoIcons = {};
citeoIcons.citeo = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24.6 28",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
    d: "M23.1,22.4l1.5,1.5c-4.9,4.9-13.6,5.8-19.7.5C-1.3,19.1-1.6,10.1,4,4.4c5.8-5.9,15.2-5.7,20.6-.3l-1.5,1.5C18.1.7,10.2,1,5.5,5.8c-4.4,4.5-4.5,11.5-.2,16.2,1.5,1.6,3.4,2.8,5.5,3.4,2.2.6,4.4.7,6.6.2,2.2-.5,4.1-1.6,5.7-3.1ZM22.1,6.6l-1.9,1.9c-3.5-3.4-9.2-2.9-12.1.8-2.7,3.5-1.9,8.4,1.7,11,3.6,2.5,8.1,1.6,10.4-.8-.2-.2-.5-.5-.7-.7h0s0,0,0,0c-.3-.2-.5-.5-.7-.7-2.6,2.4-6.5,2-8.6-.4-2.1-2.5-1.7-6.1.8-8.1,2.5-2,6-1.5,7.8.4l-2,1.9h5.5v-5.3Z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (citeoIcons);

/***/ }),

/***/ "./assets/slider.js":
/*!**************************!*\
  !*** ./assets/slider.js ***!
  \**************************/
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
  if (items.length > 1) {
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
    // Checking if the last block top boundary is below the first block bottom boundary (flex-wrap active or flex-direction column)
    if (wrap.children[0].getBoundingClientRect().bottom < wrap.children[wrap.children.length - 1].getBoundingClientRect().top || wrap.children[wrap.children.length - 1].getBoundingClientRect().bottom < wrap.children[0].getBoundingClientRect().top) {
      // Kill the slider if items are positionned vertically
      return false;
    }
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
      },
      isDragging = false,
      isVerticalScroll = false;
    dragStart = e => {
      if (!allowShift) return;
      e = e || window.event;
      wrapperPos = {
        yMin: wrapper.getBoundingClientRect().top,
        yMax: wrapper.getBoundingClientRect().bottom
      };

      // Detect TOUCH vs MOUSE
      const isTouch = e.type === "touchstart";
      const clientX = isTouch ? e.touches[0].clientX : e.clientX;
      const clientY = isTouch ? e.touches[0].clientY : e.clientY;

      // Store start coordinates
      posY = clientY;
      posX1 = clientX;
      allowShift = false;

      // Reset gesture state
      isDragging = false;
      isVerticalScroll = false;

      // Auto mode reset
      if (isAuto) {
        const style = window.getComputedStyle(wrapper);
        const matrix = new WebKitCSSMatrix(style.transform);
        const curPos = parseFloat(matrix.m41);
        wrapper.style.transform = `translateX(${curPos}px)`;
      }
      wrapper.classList.remove("shifting");
      if (!isTouch) {
        // Mouse fallback
        document.onmouseup = dragEnd;
        document.onmousemove = dragAction;
      }
      if (isAuto) clearInterval(autoInterval);
    };
    dragAction = e => {
      e = e || window.event;
      const isTouch = e.type === "touchmove";
      const clientX = isTouch ? e.touches[0]?.clientX : e.clientX;
      const clientY = isTouch ? e.touches[0]?.clientY : e.clientY;

      // No touches (iOS edge-case or mouseup fired already)
      if (clientX == null || clientY == null) return;

      // Calculate delta from start coordinates
      const dx = clientX - posX1;
      const dy = clientY - posY;

      // Check whether the user is scrolling vertically or horizontally
      if (!isDragging && !isVerticalScroll) {
        // Vertical scroll passed threshold AND greater than horizontal scroll = let the page scroll
        if (Math.abs(dy) > 50 && Math.abs(dy) > Math.abs(dx)) {
          isVerticalScroll = true;
          return;
        }

        // Horizontal drag wins
        if (Math.abs(dx) > 10) {
          isDragging = true;
        }
      }
      if (isVerticalScroll) return;

      // Horizontal dragging so we block page scroll
      if (isDragging) {
        e.preventDefault();
        if (isTouch) e.stopPropagation();
      }
      posX2 = posX1 - clientX;
      posX1 = clientX;
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
      isDragging = false;
      isVerticalScroll = false;
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
        // Touch events
        wrapper.addEventListener('touchstart', dragStart, {
          passive: false
        });
        wrapper.addEventListener('touchend', dragEnd);
        wrapper.addEventListener('touchmove', dragAction, {
          passive: false
        });
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

/***/ }),

/***/ "./src/block_CC2-850_horizontal-slider/block.json":
/*!********************************************************!*\
  !*** ./src/block_CC2-850_horizontal-slider/block.json ***!
  \********************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"citeo-semantic/horizontal-slider","version":"1.0.0","title":"Carousel horizontal","category":"semantic","description":"Bloc permettant d\'ajouter un comportement de slider sur ses bloc enfants","supports":{"html":false,"inserter":false,"align":["full"]},"attributes":{"isInfinite":{"type":"boolean","default":false},"isDraggable":{"type":"boolean","default":true},"step":{"type":"integer","default":1},"hasStepper":{"type":"boolean","default":false},"stepperType":{"type":"string","default":"none"},"hasControls":{"type":"boolean","default":true},"allowedBlocks":{"type":"array"},"isAuto":{"type":"boolean","default":false},"autoDir":{"type":"string","default":"left"},"speed":{"type":"number","default":3},"isRandom":{"type":"boolean","default":false},"hasTotal":{"type":"boolean","default":false}},"textdomain":"semantic","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css","viewScript":"file:./js/view.js"}');

/***/ }),

/***/ "./src/block_CC2-850_horizontal-slider/index.js":
/*!******************************************************!*\
  !*** ./src/block_CC2-850_horizontal-slider/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _assets_icons_citeo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../assets/icons-citeo */ "./assets/icons-citeo.js");
/* harmony import */ var _scss_style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scss/style.scss */ "./src/block_CC2-850_horizontal-slider/scss/style.scss");
/* harmony import */ var _js_edit_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./js/edit.js */ "./src/block_CC2-850_horizontal-slider/js/edit.js");
/* harmony import */ var _js_save_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./js/save.js */ "./src/block_CC2-850_horizontal-slider/js/save.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./src/block_CC2-850_horizontal-slider/block.json");
/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */



/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */


/**
 * Internal dependencies
 */




/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_5__.name, {
  /**
   * @see ../assets/icons/icons.js
   */
  icon: _assets_icons_citeo__WEBPACK_IMPORTED_MODULE_1__["default"].citeo,
  /**
   * @see ./edit.js
   */
  edit: _js_edit_js__WEBPACK_IMPORTED_MODULE_3__["default"],
  /**
   * @see ./save.js
   */
  save: _js_save_js__WEBPACK_IMPORTED_MODULE_4__["default"]
});

/***/ }),

/***/ "./src/block_CC2-850_horizontal-slider/js/edit.js":
/*!********************************************************!*\
  !*** ./src/block_CC2-850_horizontal-slider/js/edit.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _scss_editor_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../scss/editor.scss */ "./src/block_CC2-850_horizontal-slider/scss/editor.scss");
/* harmony import */ var _assets_slider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../assets/slider */ "./assets/slider.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);






function Edit({
  attributes,
  setAttributes
}) {
  const [stepperDOM, setStepperDOM] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)([]);
  const ref = (0,react__WEBPACK_IMPORTED_MODULE_2__.useRef)(null);

  // Step supports integer only, stepperType can be anything but will display slide number if set to 'num'
  const {
    isInfinite,
    isDraggable,
    step,
    hasStepper,
    stepperType,
    hasControls,
    allowedBlocks,
    isRandom,
    isAuto,
    speed,
    autoDir,
    hasTotal
  } = attributes;
  const stepperClass = `step-${stepperType} step-index`;
  const toggleControls = slider => {
    if (slider) {
      const slides = slider.children;
      const controls = ref.current.querySelector('.slider-controls');
      const itemsInView = (0,_assets_slider__WEBPACK_IMPORTED_MODULE_4__.calculateItemsInView)(0, slider);
      if (hasControls) slides && slides.length > itemsInView ? controls.style.display = 'flex' : controls.style.display = 'none';
    }
  };
  const createStepper = wrap => {
    const sliderItems = wrap.children;
    if (sliderItems && sliderItems.length > 0) {
      const stepperList = [...sliderItems].map((_, i) => {
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
          className: stepperClass,
          children: stepperType === 'num' && i + 1
        });
      });
      setStepperDOM(stepperList);
    }
  };

  // Add/show non editable controls in the editor and create stepper DOM
  (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    const mutationObserver = new MutationObserver(entries => {
      for (const entry of entries) {
        if (hasControls) toggleControls(entry.target);
        if (hasStepper) {
          createStepper(entry.target);
        }
      }
    });
    if (ref.current) {
      const slideWrapper = ref.current.querySelector('.slider-wrap');
      if (slideWrapper) {
        mutationObserver.observe(slideWrapper, {
          childList: true
        });
        if (hasStepper) {
          createStepper(slideWrapper);
        }
      }
    }
  }, [ref, hasStepper]);
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps)({
    className: 'slider-wrap'
  });
  const innerBlocksProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useInnerBlocksProps)(blockProps, {
    allowedBlocks: allowedBlocks
  });

  // Block attributes are hidden so far, so they can only be contributed at the bloc creation from a TEMPLATE call but could easily be added as shown block parameters.
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InspectorControls, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {
        title: "Paramétrage carousel",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
            __nextHasNoMarginBottom: true,
            label: "Infini ?",
            help: isInfinite ? 'Carousel infini.' : 'Carousel avec butées.',
            checked: isInfinite,
            onChange: val => {
              setAttributes({
                isInfinite: val
              });
            }
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
            __nextHasNoMarginBottom: true,
            label: "Est int\xE9ractif ?",
            help: isDraggable ? 'Carousel intéractif à la main.' : 'Carousel pas intéractif.',
            checked: isDraggable,
            onChange: val => {
              setAttributes({
                isDraggable: val
              });
            }
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
            __nextHasNoMarginBottom: true,
            label: "Total de cartes",
            help: hasTotal ? 'Montre le nombre total de cartes dans le carousel.' : 'Cache le total de cartes dans le carousel.',
            checked: hasTotal,
            onChange: val => {
              setAttributes({
                hasTotal: val
              });
            }
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
            __nextHasNoMarginBottom: true,
            label: "Puces de carousel ?",
            help: hasStepper ? 'Carousel avec puces.' : 'Carousel sans puces.',
            checked: hasStepper,
            onChange: val => {
              setAttributes({
                hasStepper: val
              });
            }
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
            __nextHasNoMarginBottom: true,
            label: "Boutons de contr\xF4les ?",
            help: hasControls ? 'Avec boutons de contrôles' : 'Sans boutons de contrôles',
            checked: hasControls,
            onChange: val => {
              setAttributes({
                hasControls: val
              });
            }
          })
        }), isInfinite && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelRow, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
              label: "D\xE9filement automatique ?",
              help: isRandom ? 'Carousel automatique.' : 'Carousel manuel.',
              checked: isAuto,
              onChange: val => {
                setAttributes({
                  isAuto: val
                });
              }
            })
          }), isAuto && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
              __nextHasNoMarginBottom: true,
              label: "Vitesse de d\xE9filement",
              help: 'En seconde, par carte',
              value: speed,
              onChange: val => setAttributes({
                speed: val
              }),
              min: 2,
              max: 15,
              step: 0.5
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelRow, {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToggleGroupControl, {
                __nextHasNoMarginBottom: true,
                label: "Direction du d\xE9filement",
                value: autoDir,
                onChange: val => setAttributes({
                  autoDir: val
                }),
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToggleGroupControlOption, {
                  value: "left",
                  label: "Gauche",
                  "aria-label": 'Carousel défile vers la gauche',
                  showTooltip: true
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToggleGroupControlOption, {
                  value: "right",
                  label: "Droite",
                  "aria-label": 'Carousel défile vers la droite',
                  showTooltip: true
                })]
              })
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
            __nextHasNoMarginBottom: true,
            label: "Al\xE9atoire ?",
            help: isRandom ? 'Carousel aléatoire.' : 'Carousel fixe.',
            checked: isRandom,
            onChange: val => {
              setAttributes({
                isRandom: val
              });
            }
          })
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      className: "has-horizontal-slider",
      ref: ref,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
        ...innerBlocksProps
      }), hasStepper && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
        className: "stepper-wrap",
        children: stepperDOM
      }), hasTotal && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
        className: "total-wrap"
      }), hasControls && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        class: "wp-block-buttons slider-controls",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
          class: "wp-block-button prev-slide is-style-secondary no-text has-suffix--Chevron-right",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("a", {
            class: "wp-block-button__link wp-element-button"
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
          class: "wp-block-button next-slide is-style-primary no-text has-suffix--Chevron-right",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("a", {
            class: "wp-block-button__link wp-element-button"
          })
        })]
      })]
    })]
  });
}

/***/ }),

/***/ "./src/block_CC2-850_horizontal-slider/js/save.js":
/*!********************************************************!*\
  !*** ./src/block_CC2-850_horizontal-slider/js/save.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ save)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


function save({
  attributes
}) {
  const {
    isInfinite,
    isDraggable,
    step,
    hasStepper,
    stepperType,
    hasControls,
    isAuto,
    speed,
    autoDir,
    isRandom,
    hasTotal
  } = attributes;
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save({
    className: 'has-horizontal-slider'
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    ...blockProps,
    "data-draggable": isDraggable,
    "data-infinite": isInfinite,
    "data-step": step ? step : 1,
    "data-stepper": hasStepper,
    "data-stepper-type": hasStepper ? stepperType : null,
    "data-is-auto": isInfinite ? isAuto : null,
    "data-speed": isAuto ? speed : null,
    "data-auto-dir": isAuto ? autoDir : null,
    "data-is-random": isRandom,
    "data-total": hasTotal,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "slider-wrap",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InnerBlocks.Content, {})
    }), hasStepper && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "stepper-wrap"
    }), hasTotal && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "total-wrap"
    }), hasControls && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
      class: "wp-block-buttons slider-controls",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        class: "wp-block-button prev-slide is-style-secondary no-text has-suffix--Chevron-right",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("a", {
          class: "wp-block-button__link wp-element-button"
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        class: "wp-block-button next-slide is-style-primary no-text has-suffix--Chevron-right",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("a", {
          class: "wp-block-button__link wp-element-button"
        })
      })]
    })]
  });
}

/***/ }),

/***/ "./src/block_CC2-850_horizontal-slider/scss/editor.scss":
/*!**************************************************************!*\
  !*** ./src/block_CC2-850_horizontal-slider/scss/editor.scss ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/block_CC2-850_horizontal-slider/scss/style.scss":
/*!*************************************************************!*\
  !*** ./src/block_CC2-850_horizontal-slider/scss/style.scss ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["ReactJSXRuntime"];

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
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"block_CC2-850_horizontal-slider/index": 0,
/******/ 			"block_CC2-850_horizontal-slider/style-index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkds_citeocom"] = globalThis["webpackChunkds_citeocom"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["block_CC2-850_horizontal-slider/style-index"], () => (__webpack_require__("./src/block_CC2-850_horizontal-slider/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map