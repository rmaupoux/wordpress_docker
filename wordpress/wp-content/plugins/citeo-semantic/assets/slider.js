
/*
*
* The 99 Slider by Thomas Guillet
*
*/
export const calculateItemsInView = (index, wrapper) => {
    const items = wrapper.classList.contains('slider-wrap') ? [...wrapper.children].filter(e => !e.classList.contains('clone')) : [... wrapper.querySelector('.slider-wrap').children].filter(e => !e.classList.contains('clone'))
    if(items.length > 1) {
        const   itemsGap = Math.abs( items[0].getBoundingClientRect().right - items[1].getBoundingClientRect().left ),
                viewPort = wrapper.offsetWidth

        let result = 0, increment = 0
        for(let i = index; i < items.length; i++) {
            const slideWidth = i === index ? items[i].offsetWidth : items[i].offsetWidth + itemsGap
            increment += slideWidth;
            if(increment >= viewPort) {
                result += 1 - ( increment - viewPort ) / viewPort;
                break;
            } else {
                result++;
            }            
        }
        return result;
    } else {
        return 0;
        
    }
}

const shuffleArr = async (array) => {
    const resultArr = array;
    for (let i = resultArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [resultArr[i], resultArr[j]] = [resultArr[j], resultArr[i]];
    }
    return resultArr;
}

const toggleSlider = (wrap) => {
    if(wrap.children && wrap.children.length > 1) {

        // Checking if the last block top boundary is below the first block bottom boundary (flex-wrap active or flex-direction column)
        if( (wrap.children[0].getBoundingClientRect().bottom < wrap.children[wrap.children.length - 1].getBoundingClientRect().top) || (wrap.children[wrap.children.length - 1].getBoundingClientRect().bottom < wrap.children[0].getBoundingClientRect().top) ) {
            // Kill the slider if items are positionned vertically
            return false
        }

        const itemsInView = calculateItemsInView(0, wrap)
        const childCount = [... wrap.children].filter(e => !e.classList.contains('clone')).length
        return childCount > itemsInView;
    } else {
        return false;
    }
}
/*
* MAIN FUNCTION
*/
const iOS = [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  // iPad on iOS 13 detection
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document)

export const slide = async (wrapper, controls, sliderParam) => {
    const   items = wrapper.children, 
            itemsLength = items?.length

    // Kill the slider if no items found in slider (this allows the code to cleanly reexecute if items are added dynamically)
    if(itemsLength <= 0) return;
    const   prev = controls?.querySelector('.prev-slide'),
            next = controls?.querySelector('.next-slide'),
            firstSlide = items[0],
            lastSlide = items[itemsLength - 1],
            originalItems = [...items].filter(e => !e.classList.contains('clone')),
            wrapViewPort = originalItems[originalItems.length - 1].getBoundingClientRect().right - originalItems[0].getBoundingClientRect().left,
            { isInfinite, isDraggable, step, stepper, autoParams, isRandom, hasTotal } = sliderParam,
            { hasStepper, controlStepper, stepperType } = stepper,
            { isAuto, speed, autoDir } = autoParams,
            totalWrap = wrapper.parentElement.querySelector('.total-wrap') || controls?.querySelector('.total-wrap')
    
    let gap = items.length > 1 ? Math.abs( items[0].getBoundingClientRect().right - items[1].getBoundingClientRect().left ) : 0,       
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
        windowWidth= window.innerWidth

    // CALCULATE THE SLIDER END LIMIT FOR BOTH SLIDER STOP AND SLIDER BACK TO START TRIGGER
    const calculateSliderEnd = () => {
        // let increment = 0
        const viewPort = wrapper.getBoundingClientRect().width
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
    }

    // SNAP SLIDER TO THE CLOSEST SLIDE
    const snapToIndex = (newIndex)=> {
        let translateX = 0

        for(let i = 0; i < newIndex; i++) {
            const slideWidth = items[i].getBoundingClientRect().width + gap
            translateX -= slideWidth;
        }

        // Not sure if this is still useful ? Looks like it checks if the current transform value is equal to where it has to snap.
        const style = window.getComputedStyle(wrapper), matrix = new WebKitCSSMatrix(style.transform);
        if(Math.round(matrix.m41) === Math.round(translateX)) {
            checkIndex();
            return;
        }

        wrapper.classList.add('shifting');
        wrapper.style.transform = `translateX(${translateX}px)`;     
    }

    // CLONE ALL SLIDES AT BOTH END OF THE SLIDER
    const cloneSlides = async () => {

        // Checking if current clone exists (rerunned function on resize)
        const currentClones = wrapper.querySelectorAll('.clone');

        // Redefining firstSlide as the array may have been randomized
        const firstSlideInList = items[0]

        if(currentClones.length === 0) {
            // Cloning both the start and end of the slider
            for(let i = 0; i < itemsLength; i++) {
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
    }


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
            isVerticalScroll = false

        dragStart = (e) => {

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
        }
        
        dragAction = (e) => {
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
        
            const style = window.getComputedStyle(wrapper), matrix = new WebKitCSSMatrix(style.transform), curPos = parseFloat(matrix.m41);
            
            if(isInfinite) {
                
                const lastSlideWidth = originalItems[originalItems.length - 1].getBoundingClientRect().right - originalItems[originalItems.length - 1].getBoundingClientRect().left
                const firstSlideWidth = originalItems[0].getBoundingClientRect().right - originalItems[0].getBoundingClientRect().left
                if (curPos - posX2 >= sliderStartLimit + lastSlideWidth + gap) {
                    wrapper.style.transform = `translateX(${sliderEndLimit}px)`;
                } else if (curPos - posX2 <= (sliderEndLimit - firstSlideWidth)) {
                    wrapper.style.transform = `translateX(${sliderStartLimit}px)`;
                } else {
                    wrapper.style.transform = `translateX(${(curPos - posX2)}px)`;
                }
        
            } else {
                if (curPos - posX2 >= sliderStartLimit) {
                    wrapper.style.transform = `translateX(${sliderStartLimit}px)`;
                } else if (curPos - posX2 <= (sliderEndLimit)) {
                    wrapper.style.transform = `translateX(${sliderEndLimit}px)`;
                } else {
                    wrapper.style.transform = `translateX(${curPos - posX2}px`;
                }
        
            }
        }
        
        dragEnd = () => {
            document.onmouseup = null;
            document.onmousemove = null;

            isDragging = false;
            isVerticalScroll = false;
        
            const style = window.getComputedStyle(wrapper), matrix = new WebKitCSSMatrix(style.transform), curPos = parseFloat(matrix.m41);
            const getIndexFromPos = (pos) => {
                const cleanedPos = Math.abs(pos);
                let result = 0, increment = 0
                for(let i = 0; i < items.length; i++) {
                    const slideWidth = i === 0 ? items[i].offsetWidth : items[i].offsetWidth + gap
                    increment += slideWidth;
        
                    if(increment >= cleanedPos) {
                        result += 1 - ( increment - cleanedPos ) / slideWidth;
                        break;
                    } else {
                        result++;
                    }            
        
                }
                // Threshold to slide to next item
                if(result > index && result % 1 < 0.25 || result < index && result % 1 < 0.75) {
                    result = Math.floor(result)
                } else {
                    result = Math.ceil(result);
                }
                return result;
            }
            
            index = getIndexFromPos(curPos);
            itemsInView = Math.ceil(calculateItemsInView(index, wrapper));
        
            if(!isInfinite) {
                if(prev && (curPos === 0)) {
                    checkIndex();
                    return;
                }
            }
            if(isAuto) {
                index = autoDir === 'left' ? itemsLength + offset : offset - 1;
                wrapper.style.transform = `translateX(${curPos}px)`;
                const slideProg = autoDir === 'left' ? Math.abs(2 * ( ( 2 * wrapViewPort - Math.abs(curPos) )  / ( 2 * wrapViewPort ) ) ) : Math.abs( 1 - 2 * ( ( 2 * wrapViewPort - Math.abs(curPos) )  / ( 2 * wrapViewPort ) ) )
                // Since slider is infinite, add the offset to get the real progression of the slider
                wrapper.style.transition = `transform linear ${slideProg * originalItems.length * speed}s`;
            }
            snapToIndex(index);
            
            allowShift = true;
        }
    }
    // GO TO NEXT SLIDER BASED ON A GIVEN DIRECTION
    const shiftSlide = (dir) => {
        wrapper.classList.add('shifting');
        if (allowShift) {
            const style = window.getComputedStyle(wrapper), matrix = new WebKitCSSMatrix(style.transform);
            if (dir == -1) {
                curItemSize = Math.round( items[index].offsetWidth + Math.abs(gap) );
                index += step;
            } else if (dir == 1) {
                index -= step;
                curItemSize = Math.round( items[index].offsetWidth + Math.abs(gap) );
            } 
            wrapper.style.transform = `translateX(${matrix.m41 + step * dir * (curItemSize)}px)`;
        };
        
        // Prevent double input while animating
        allowShift = false;
    }
        
    // SANITIZE THE INDEX TO MAKE SURE IT'S WITHIN DEFINED BOUNDARIES
    const checkIndex = () => {
        wrapper.classList.remove('shifting');
        const activeSlides = wrapper.querySelectorAll('.active-slide')
        activeSlides.forEach(e => e.classList.remove('active-slide'));
        if(isInfinite) {
            if (index < offset) {
                wrapper.style.transform = `translateX(${sliderEndLimit}px`;
                index += offset;
                if(isAuto) {
                    index = offset - 1;
                    wrapper.style.transition = `transform linear ${originalItems.length * speed}s`;
                    snapToIndex(index);
                }
            } else if (index >= (itemsLength + offset)) {
                wrapper.style.transform = `translateX(${sliderStartLimit}px`;
                index = offset;
                if(isAuto) {
                    index = itemsLength + offset;
                    wrapper.style.transition = `transform linear ${originalItems.length * speed}s`;
                    snapToIndex(index);
                }
            }
            items[index]?.classList.add('active-slide');
        } else {
            // Added a 0.01 buffer to compensate rounded value 
            itemsInView = calculateItemsInView(index, wrapper) + 0.05;
            if(index < step && prev) {
                next.classList.remove('disabled');
                prev.classList.add('disabled')
            }
            else if (index >= (itemsLength - 1) && prev) {
                // Permet de naviguer jusqu'au dernier élément (index = itemsLength - 1)
                prev.classList.remove('disabled');
                next.classList.add('disabled')
            }
            else {
                prev?.classList.remove('disabled');
                next?.classList.remove('disabled');
            }
            items[index].classList.add('active-slide');
            
        }
        if(hasStepper) {
            controlStepper.querySelector('.active-step')?.classList.remove('active-step');
            
            isInfinite && originalItems.length > itemsInView ? stepIndexList[index - offset].classList.add('active-step') : stepIndexList[index].classList.add('active-step')
        }
        if(hasTotal) {
            // Calcul pour naviguer élément par élément jusqu'au dernier
            let displayIndex = isInfinite ? index - itemsLength + 1 : index + 1
            totalWrap.innerHTML = `${displayIndex}/${itemsLength}`
        }
        allowShift = true;
    }
    /*
    * ACTIVATE SLIDER
    */ 
    const activateSlider = async () => {
        itemsInView = Math.ceil(calculateItemsInView(index, wrapper));
        sliderEndLimit = calculateSliderEnd();

        // EVENT LISTENER
        if(isDraggable) {
            if ("ontouchstart" in document.documentElement){

                // Touch events
                wrapper.addEventListener('touchstart', dragStart, { passive: false });
                wrapper.addEventListener('touchend', dragEnd);
                wrapper.addEventListener('touchmove', dragAction, { passive: false });
            
            } else {
                wrapper.onmousedown = dragStart;
            }
        }

        // Adding prev and next click events if they are defined
        if(prev || next) {
            prev.style.display = 'block';
            next.style.display = 'block';
            prev?.addEventListener('click', () => shiftSlide(step));
            next?.addEventListener('click', () => shiftSlide(-step));
        }

        // STEPPER
        if(hasStepper) {
            controlStepper.innerHTML = '';
            for(let i = 1; i <= itemsLength; i++) {
                const stepIndex = document.createElement('span')
                stepIndex.classList.add('step-index');
                stepIndex.classList.add(`step-${stepperType}`);
                if (stepperType === 'num') {
                    stepIndex.innerText = i
                }
                
                controlStepper.appendChild(stepIndex);
            }
            stepIndexList = controlStepper.querySelectorAll('.step-index');
            const activeStepper = isInfinite && originalItems.length > itemsInView ? index - itemsInView : index
            stepIndexList[activeStepper].classList.add('active-step');
            stepIndexList.forEach((e, id) => {
                const key = isInfinite && originalItems.length > itemsInView ? id + offset : id
                e.addEventListener('click', () => {
                    index = key;
                    snapToIndex(index);                
                }); 
            });
        }

        if(isRandom) {
            wrapper.innerHTML = '';
            await shuffleArr(originalItems);
            originalItems.forEach(slide => {
                wrapper.appendChild(slide)
            })
        }

        // INFINITE 
        if(isInfinite) {
            await cloneSlides();
            sliderStartLimit = originalItems[0].getBoundingClientRect().left - originalItems[originalItems.length - 1].getBoundingClientRect().right - gap
            offset = itemsLength
            // Refresh the index to the number of slides we've added before
            index = itemsLength;
            wrapper.style.transition = 'none';
            wrapper.style.transform = `translateX(${sliderStartLimit}px)`;
            sliderEndLimit = sliderStartLimit + (originalItems[0].getBoundingClientRect().left - originalItems[originalItems.length - 2].getBoundingClientRect().right - gap);
            // Making the slider automatically slide
            if(isAuto) {
                if(autoDir === 'left') index = itemsLength + offset;
                else if(autoDir === 'right') {
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

        if(!isAuto) {
            wrapper.style.transition = `transform ease-out ${step * 0.25}s`;
        }

        // TOTAL 
        if(hasTotal) {
            // Calcul pour naviguer élément par élément jusqu'au dernier
            let displayIndex = isInfinite ? index - itemsLength + 1 : Math.min(index + 1, itemsLength);

            totalWrap.innerHTML = `${displayIndex}/${itemsLength}`;
            totalWrap.style.display = 'block';
        }

        // Add the active-slide class to the first element of the slider
        const activeSlides = wrapper.querySelectorAll('.active-slide')
        activeSlides.forEach(e => e.classList.remove('active-slide'));
        items[index].classList.add('active-slide');
            
        // Initializing the wrapper
        wrapper.classList.remove('no-slide');
        isRunning = true
    }
    /*
    * UPDATE SLIDER VARIABLES
    */ 
    const updateSlider = () => {
        gap = Math.abs( items[0].getBoundingClientRect().right - items[1].getBoundingClientRect().left )
        itemsInView = Math.ceil(calculateItemsInView(index, wrapper));
        sliderStartLimit = isInfinite && originalItems.length > itemsInView ? 
            originalItems[0].getBoundingClientRect().left - originalItems[originalItems.length - 1].getBoundingClientRect().right - gap :
            0
        sliderEndLimit = isInfinite && originalItems.length > itemsInView ? 
            sliderStartLimit + (originalItems[0].getBoundingClientRect().left - originalItems[originalItems.length - 2].getBoundingClientRect().right - gap) : 
            calculateSliderEnd();
        if(isAuto) {
            const style = window.getComputedStyle(wrapper), matrix = new WebKitCSSMatrix(style.transform), curPos = parseFloat(matrix.m41);
            const slideProg = autoDir === 'left' ? Math.abs(2 * ( ( 2 * wrapViewPort - Math.abs(curPos) )  / ( 2 * wrapViewPort ) ) ) : Math.abs( 1 - 2 * ( ( 2 * wrapViewPort - Math.abs(curPos) )  / ( 2 * wrapViewPort ) ) )
            const sliderLength = Math.abs(sliderEndLimit - sliderStartLimit);
            wrapper.style.transition = 'none';
            wrapper.style.transform = `translateX(${sliderStartLimit - (slideProg * sliderLength)}px)`;
            if(autoDir === 'left') index = itemsLength + offset;
            else if(autoDir === 'right') {
                wrapper.style.transform = `translateX(${sliderEndLimit + (slideProg * sliderLength)}px)`;
                index = offset - 1;
            } 
            wrapper.style.transition = `transform linear ${slideProg * originalItems.length * speed}s`;            
            
        } else {
            checkIndex(); 
        }
        
        if(hasTotal) {
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
    }
    /*
    * DEACTIVATE SLIDER
    */ 
    const deactivateSlider = () => {
        index = isInfinite ? offset : 0;
        if(isDraggable) {
            if ("ontouchstart" in document.documentElement){
                // Because iOS is shit
                if(iOS) {
                    // Touch events
                    document.removeEventListener('touchstart', dragStart);
                    document.removeEventListener('touchend', dragEnd);
                    document.removeEventListener('touchmove', dragAction, {passive: false});
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
        if(prev || next) {
            prev.style.display = 'none';
            next.style.display = 'none';
            prev?.removeEventListener('click', () => shiftSlide);
            next?.removeEventListener('click', () => shiftSlide);
        }
        if(hasTotal) {
            totalWrap.innerHTML = '';
            totalWrap.style.display = 'none'
        }
        if(hasStepper) {
            controlStepper.innerHTML = '';
        }
        // DEACTIVATE AUTO SLIDE
        wrapper.querySelectorAll('.clone').forEach(el => el.remove());
        wrapper.classList.remove('shifting');
        wrapper.classList.add('no-slide');
        isRunning = false;
    }
    // RESIZE
    window.addEventListener("resize", function(){
        if(window.innerWidth !== windowWidth){
            windowWidth = window.innerWidth;
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {            
                if(toggleSlider(wrapper) && !isRunning) {
                    activateSlider();
                } else if(!toggleSlider(wrapper) && isRunning) {
                    deactivateSlider();
                } else if (isRunning && toggleSlider(wrapper)) {
                    updateSlider();
                }
            }, 200);   
        }
        
    });
    // Add the active-slide class to the first element of the slider
    const activeSlides = wrapper.querySelectorAll('.active-slide')
    activeSlides.forEach(e => e.classList.remove('active-slide'));
    items[index].classList.add('active-slide');
    // INITAL START
    toggleSlider(wrapper) ? activateSlider() : deactivateSlider(); 
    
    // Recalibrate slides in case some lazyloading changes slide width or prevent the slider from properly initializing.
    if(iOS) {
        setTimeout(() => {
            if(isRunning) updateSlider();
            else if(toggleSlider(wrapper)){
                activateSlider();
            }
        }, 1000);
    }
    
    
    // Transition events to clean the index and reactivate inputs
    wrapper.addEventListener('transitionend', () => {
        checkIndex()
    });
    wrapper.classList.add('loaded');
}
