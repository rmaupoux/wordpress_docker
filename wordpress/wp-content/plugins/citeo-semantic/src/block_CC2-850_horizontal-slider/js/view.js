import { slide } from '/assets/slider'

document.addEventListener("DOMContentLoaded", () => {

    /*
    * INITIALIZATION FUNCTION
    */
    const initialize = () => {
        // Class name activating the slider code, needs to be a parent of the actual slider
        const sliderTrigger = document.querySelectorAll('.has-horizontal-slider')

        sliderTrigger.forEach(slider => {

            const sliderWrap = slider.querySelector('.slider-wrap')

            if( sliderWrap ) {

                const controlsWrap = slider.querySelector('.slider-controls')
                const stepperWrap = slider.querySelector('.stepper-wrap')

                // Convert dataset value into slider parameters
                const   isInfinite = slider.dataset.infinite === 'true',
                        isDraggable = slider.dataset.draggable === 'true',
                        step = parseInt(slider.dataset.step),
                        hasStepper = slider.dataset.stepper === 'true',
                        stepperType = slider.dataset.stepperType,
                        isAuto = slider.dataset.isAuto === 'true',
                        speed = parseInt(slider.dataset.speed),
                        autoDir = slider.dataset.autoDir,
                        isRandom = slider.dataset.isRandom === 'true',
                        hasTotal = slider.dataset.total === 'true'

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
                    isRandom: isRandom,
                    hasTotal: hasTotal
                }

                slide(sliderWrap, controlsWrap, sliderParams);

            } else { 
                
                console.warn('No slider found in this page.');

            }
        
        });
    };

    initialize();
});

