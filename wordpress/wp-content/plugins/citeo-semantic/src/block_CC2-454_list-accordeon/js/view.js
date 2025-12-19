const uniqueAccordeonWrapper = document.querySelectorAll('.unique-active-accordeon');

uniqueAccordeonWrapper.forEach((wrapper) => {
    const accordeonList = wrapper.querySelectorAll('.accordeon-toggle');
    accordeonList.forEach(item => {

        item.addEventListener('click', () => {
            
            const itemWrapper = item.parentElement;
            const isAlreadyActive = itemWrapper.classList.contains('is-active');
            const hasToggleText = item.querySelector('.toggle-btn .wp-element-button');

            const current = wrapper.querySelectorAll('.is-active');
            let closeOffset = 0;
            const scrollVal = window.scrollY, itemPosY =  item.getBoundingClientRect().top;

            current.forEach(active => {
                const activeContent = active.querySelector('.accordeon-content');
                
                closeOffset += activeContent.getBoundingClientRect().top < itemPosY ? activeContent.getBoundingClientRect().height : 0;
                active.classList.remove('is-active');

                if (hasToggleText) {
                    const toggleText = active.querySelector('.toggle-btn .wp-element-button');
                    if (active.querySelector('.toggle-btn.toggle-btn-fr')) {
                        toggleText.innerText = 'Afficher';
                    } else if (active.querySelector('.toggle-btn.toggle-btn-en')) {
                        toggleText.innerText = 'Show';
                    }
                }
            });

            if (!isAlreadyActive) {
                itemWrapper.classList.add('is-active');
                scrollTo({
                    top: scrollVal + itemPosY - closeOffset - 120,
                    left: 0,
                    behavior: "instant",
                });
            }

            if (hasToggleText) {
                const toggleText = item.querySelector('.toggle-btn .wp-element-button');
                if (item.querySelector('.toggle-btn.toggle-btn-fr')) {
                    toggleText.innerText = isAlreadyActive ? 'Afficher' : 'Masquer';
                } else if (item.querySelector('.toggle-btn.toggle-btn-en')) {
                    toggleText.innerText = isAlreadyActive ? 'Show' : 'Hide';
                }
            }
        });
    });
});

const multipleAccordeonWrapper = document.querySelectorAll('.multiple-active-accordeon');

multipleAccordeonWrapper.forEach((wrapper) => {

    const accordeonList = wrapper.querySelectorAll('.accordeon-toggle');

    accordeonList.forEach(item => {
        const itemWrapper = item.parentElement;
        item.addEventListener('click', () => itemWrapper.classList.toggle('is-active'));
    });

});