const dropdownTriggers = document.querySelectorAll('.wp-block-menu-dropdown-trigger');
const dropdownBackground = document.querySelector('.dropdown-background');

dropdownTriggers.forEach(trigger => {

    const ID = trigger.dataset.id, dropdown = document.querySelector(`.wp-block-menu-dropdown[data-id="${ID}"]`), fixedNav = trigger.parentElement

    trigger.addEventListener('click', () => {
        const alreadyOpen = trigger.classList.contains('is-active');

        const activeElements = fixedNav.querySelectorAll('.is-active');
        activeElements.forEach((el) => el.classList.remove('is-active')); 

        // Do not readd active class if the clicked element was already opened
        if(alreadyOpen) {
            document.body.classList.remove('menu-open')
            return;
        }

        trigger.classList.add('is-active');
        dropdown.classList.add('is-active');
        document.body.classList.add('menu-open');
    })
});

// Burger nav dropdown toggle
const dropdownTtl = document.querySelectorAll('.dropdown-ttl')
dropdownTtl.forEach(el => {
    el.addEventListener('click', () => {
        const isOpen = el.closest('.burger-open');
        if (!isOpen) return;

        el.parentElement.classList.toggle('is-active');
    })
})

// Close all menu on background click
dropdownBackground.addEventListener('click', () => {
    document.body.classList.remove('menu-open');
    const activeElements = document.querySelectorAll('header .is-active');

    activeElements.forEach((el) => el.classList.remove('is-active'));
})