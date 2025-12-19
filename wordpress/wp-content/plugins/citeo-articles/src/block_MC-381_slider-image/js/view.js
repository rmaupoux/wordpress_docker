import { slide } from '../../../../citeo-semantic/assets/slider.js'
/*
* INITIALIZATION FUNCTION
*/

const initialize = () => {
    // Class name activating the slider code, needs to be a parent of the actual slider
    const sliderTrigger = document.querySelectorAll('.article-slider-content')
    // console.log('HELLO',sliderTrigger);
    sliderTrigger.forEach(slider => {

        const sliderWrap = slider.querySelector('.slider-wrap')
            
        if( sliderWrap ) {

            const controlsWrap = slider.parentElement.querySelector('.slider-controls')
            const stepperWrap = slider.parentElement.querySelector('.stepper-wrap')

            const   isInfinite = false,
                    isDraggable = true,
                    step = 1,
                    hasStepper = false,
                    hasTotal = true,
                    hasControls = true,
                    stepperType = null,
                    isAuto = false,
                    isRandom = false


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
                    isAuto: isAuto
                },
                isRandom: isRandom,
                hasTotal: hasTotal,         
                hasControls: hasControls   
            }

            slide(sliderWrap, controlsWrap, sliderParams);

        } else { 
            console.warn('No slider found in this page.');
        }
    
    });
};
initialize();