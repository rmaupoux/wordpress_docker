const stickyIndexPage = document.querySelectorAll('.wp-block-citeo-semantic-sticky-index-page');

stickyIndexPage.forEach(page => {
    const indexList = page.querySelectorAll('.wp-block-citeo-semantic-sticky-index-item');
    const sectionList = page.querySelectorAll('.wp-block-citeo-semantic-sticky-index-linked-section');

    const activeInit = page.querySelectorAll('.wp-block-citeo-semantic-sticky-index-wrapper .is-active');
    if(activeInit.length <= 0) indexList[0].classList.add('is-active');

    indexList.forEach(index => {
        index.addEventListener('click', () => {
            if(index.classList.contains('is-active')) return;

            const previousActive = page.querySelectorAll('.wp-block-citeo-semantic-sticky-index-wrapper .is-active')
            previousActive.forEach(el => el.classList.remove('is-active'))

            index.classList.add('is-active');

            if(sectionList) {
                const linkedSection = [...sectionList].find(section => section.dataset.id === index.dataset.id);

                if(linkedSection) {
                    const linkedSectionTop = linkedSection.getBoundingClientRect().top
                    let scrollOffset = document.body.classList.contains('admin-bar') ? -120 : -88;
                    if(window.innerWidth < 950) scrollOffset = -48
                    const y = linkedSectionTop + window.scrollY + scrollOffset

                    window.scrollTo( { top: y, behavior: 'smooth' } );
                }
                else console.warn('No linked section was found, cannot scroll to the content.');
            }
        });
    });

    // // IntersectionObserver to track visible sections
    // const observer = new IntersectionObserver((entries) => {
    //     entries.forEach(entry => {
    //         if (entry.isIntersecting) {
    //             const linkedIndex = [...indexList].find(index => index.dataset.id === entry.target.dataset.id);

    //             if(linkedIndex.classList.contains('is-active')) return;

    //             const previousActive = page.querySelectorAll('.is-active')
    //             previousActive.forEach(el => el.classList.remove('is-active'));

    //             linkedIndex.classList.add('is-active');
    //         }
    //     });
    // }, {   
    //     threshold: 0.5
    // });

    // sectionList.forEach(section => {
    //     observer.observe(section);
    // });
})