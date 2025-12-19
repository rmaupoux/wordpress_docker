const sectionList = document.querySelectorAll('.wp-block-ds-citeocom-section-secteur-liste');

const onClickTab = (e, wrapper) => {
    if(e.currentTarget.classList.contains('tab-active')) return;
    
    const activePrev = wrapper.querySelectorAll('.tab-active')
    
    activePrev.forEach(el => el.classList.remove('tab-active'));

    const id = e.currentTarget.dataset.id
    const activeNew = wrapper.querySelectorAll(`div[data-id='${id}']`);

    activeNew.forEach(el => el.classList.add('tab-active'));
}

sectionList.forEach(section => {
    const tabList = section.querySelectorAll('.wp-block-ds-citeocom-block-tab');
    const activeInit = section.querySelector('.tab-active');

    tabList.forEach((el) => {
        if(!el.getAttribute('listener')) {
            el.addEventListener('click', (e) => onClickTab(e, section));
            el.setAttribute('listener', true);
        }    
    });
    
    if(!activeInit && tabList.length > 0) {
        tabList[0].click();
    }
})

