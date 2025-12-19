const fadeSlider = document.querySelectorAll('.has-fade-slider');

// Initialize slider with first item active and set parent height to its highest children height
const resizeSlideItems = () => {
    fadeSlider.forEach(slider => {
        const wrap = slider.querySelector('.slider-wrap')
        const sliderChildren = [...wrap.children]
    
        let maxHeight = sliderChildren[0].getBoundingClientRect().height
    
        // Default to first slide active
        if(!wrap.querySelector('is-active')) sliderChildren[0].classList.add('is-active');
    
        sliderChildren.forEach(child => {
            const height = child.getBoundingClientRect().height
            maxHeight = Math.max(height, maxHeight);
        });
    
        wrap.style.height = `${maxHeight}px`;
    });
}
window.addEventListener('resize', () => resizeSlideItems())
resizeSlideItems();

// Update slider active slide every {X}ms
const changeActiveSlide = (wrap, newIndex) => {
    const slide = wrap.querySelector('.slider-wrap'), totalWrap = wrap.querySelector('.total-wrap')
    const hasStepper = slide.dataset.stepper === 'true', hasTotal = slide.dataset.total === 'true'

    const isActive = slide.querySelector('.is-active');
    isActive.classList.remove('is-active');

    let index = 0;
    const itemArr = [...slide.children]

    if(newIndex === undefined) {
        index = itemArr.indexOf(isActive)
        
        if(index + 1 >= itemArr.length) index = 0
        else index++;

    } else {
        index = newIndex;
    }

    itemArr[index].classList.add('is-active');

    if(hasStepper) {
        const activeStep = wrap.querySelector('.active-step');
        activeStep?.classList.remove('active-step');

        const stepIndexList = wrap.querySelectorAll('.step-index');
        stepIndexList[index].classList.add('active-step');
    }   

    
    if(hasTotal) {
        totalWrap.innerHTML = `${index + 1}/${slide.children.length}`
    }
}

fadeSlider.forEach(slider => {
    const wrap = slider.querySelector('.slider-wrap');
    const totalWrap = slider.querySelector('.total-wrap')
    let interval = parseInt(wrap.dataset.timer) * 1000

    if(!interval) interval = 5000

    let fadeInterval = setInterval(() => changeActiveSlide(slider), interval);
    
    const hasStepper = wrap.dataset.stepper === 'true'

    if(hasStepper) {
        const controlStepper = slider.querySelector('.stepper-wrap')
        controlStepper.innerHTML = '';

        for(let i = 0; i < wrap.children.length; i++) {

            const stepIndex = document.createElement('span')
            stepIndex.classList.add('step-index');
            
            controlStepper.appendChild(stepIndex);
            
            stepIndex.addEventListener('click', () => {

                clearInterval(fadeInterval);
                changeActiveSlide(slider, i)

                fadeInterval = setInterval(() => changeActiveSlide(slider), interval);
            });
        }

        const stepIndexList = controlStepper.querySelectorAll('.step-index');

        stepIndexList[0].classList.add('active-step');
    }

    const slides = [...wrap.children]   

    // TOTAL 
    const hasTotal = wrap.dataset.total === 'true'
    if(hasTotal) {  
        const active = wrap.querySelector('.is-active')

        const index = slides.indexOf(active)      
        totalWrap.innerHTML = `${index + 1}/${wrap.children.length}`
    }

    const next = slider.querySelector('.next-slide'), prev = slider.querySelector('.prev-slide')
    if(next && prev) {
        next.addEventListener('click', () => {
            clearInterval(fadeInterval);
            changeActiveSlide(slider);  

            fadeInterval = setInterval(() => changeActiveSlide(slider), interval);
        });

        prev.addEventListener('click', () => {
            clearInterval(fadeInterval);
            const active = wrap.querySelector('.is-active')

            let index = slides.indexOf(active)
            if(index - 1 < 0) index = wrap.children.length - 1
            else index--;

            changeActiveSlide(slider, index);

            fadeInterval = setInterval(() => changeActiveSlide(slider), interval);
        });
    }
});