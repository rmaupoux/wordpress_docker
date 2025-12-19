/******/ (() => { // webpackBootstrap
/*!*****************************************************!*\
  !*** ./src/section_CRR-724_step-by-step/js/view.js ***!
  \*****************************************************/
const reglementarySection = document.querySelectorAll('.wp-block-b2b-section-step-by-step');
reglementarySection.forEach(section => {
  const cards = section.querySelectorAll('.wp-block-b2b-block-step');
  cards.forEach(card => {
    card.addEventListener('mouseenter', e => {
      e.stopPropagation();
      section.classList.add('has-active-hover');
    });
    card.addEventListener('mouseleave', e => {
      section.classList.remove('has-active-hover');
    });
  });
});
/******/ })()
;
//# sourceMappingURL=view.js.map