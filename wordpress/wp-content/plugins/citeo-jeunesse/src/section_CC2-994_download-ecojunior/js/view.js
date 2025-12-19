import { slide } from '/../citeo-semantic/assets/slider'
const jeunesseYearSlider = document.querySelectorAll('.dynamic-year-slider')
jeunesseYearSlider.forEach(async slider => {
    const   sliderWrap = slider.querySelector('.slider-wrap'),
            contentWrap = slider.closest('.wp-block-citeo-jeunesse-section-download'),
            controlsWrap = slider.querySelector('.slider-controls'),
            stepperWrap = slider.querySelector('.stepper-wrap'),
            next = controlsWrap.querySelector('.next-slide'), 
            prev = controlsWrap.querySelector('.prev-slide')
    // Recopy slider params to be ready to restart it after elements added
    const   isInfinite = slider.dataset.infinite === 'true',
            isDraggable = slider.dataset.draggable === 'true',
            step = parseInt(slider.dataset.step),
            hasStepper = slider.dataset.stepper === 'true',
            stepperType = slider.dataset.stepperType,
            isAuto = slider.dataset.isAuto === 'true',
            speed = parseInt(slider.dataset.speed),
            autoDir = slider.dataset.autoDir,
            isRandom = slider.dataset.isRandom === 'true'
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
    }
    // Fetch all terms from the taxonomy to fill slides
    const allYears = await fetch('/wp-json/wp/v2/magazine-year')
        .then(res => res.json())
        .catch(err => console.error(err));
    const orderedYear = new Array(allYears.length)
    allYears.forEach((year, i) => {
        orderedYear[i] = {
            name: year.name,
            id: year.id
        }
    });
    orderedYear.sort().reverse();
    // Main function to fetch content
    const fetchContent = async (yearId) => {
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
        const magazineList = await fetch(`/wp-json/wp/v2/magazine-jeunesse?magazine-year=${yearId}`)
            .then(res => res.json())
            .catch(err => console.error(err));
        
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
        if(magazineList.length > 0) {
            magazineList.forEach((magazine, i) => {
                const date = new Date(magazine.date)
                const formattedDate = new Intl.DateTimeFormat("fr-FR", {
                    year: "numeric",
                    month: "long"
                }).format(date)
                accordeonList.innerHTML += magazine.content.rendered;
                const dateEl = accordeonList.querySelectorAll('.mag-date')[i]
                dateEl.innerText = formattedDate;
            });
            // Remove active class potentially added from post content
            const active = accordeonList.querySelectorAll('.is-active');
            active.forEach(el => el.classList.remove('is-active'))
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
            accordeonList.innerHTML = '<p class="no-result-txt Body-2">Pas de magazines publiés sur cette période.</p>'
        }
    }
    // Reset the publication year slider content to prepare clean fetch
    sliderWrap.classList.remove('no-slide');
    sliderWrap.innerHTML = '';
    // Add terms to the slider
    orderedYear.forEach((year, i) => {
        const item = document.createElement('span')
        item.classList.add('item-year')
        // Add active class to first item in the slider
        if(i === 0) item.classList.add('active-slide');
        item.innerText = year.name;
        item.dataset.id = year.id;
        sliderWrap.appendChild(item);
    });
    // Update accordeon content on previous and next button click
    next.addEventListener('click', async () => {
        const active = sliderWrap.querySelector('.active-slide').nextElementSibling
        const yearId = active.dataset.id
        
        await fetchContent(yearId);
    });
    prev.addEventListener('click', async () => {
        const active = sliderWrap.querySelector('.active-slide').previousElementSibling
        const yearId = active.dataset.id
        
        await fetchContent(yearId);
    });
    // Initialize the block content with magazines from the first item in the publication year slider
    await fetchContent(orderedYear[0].id);
    // Restart the slider that was initially killed due to no slide in the slider
    slide(sliderWrap, controlsWrap, sliderParams);
    
});
