/******/ (() => { // webpackBootstrap
/*!**************************************************!*\
  !*** ./src/section_CC2-337_carrousel/js/view.js ***!
  \**************************************************/
const reglementarySection = document.querySelectorAll('.wp-block-b2b-section-carrousel');
reglementarySection.forEach(section => {
  const cards = section.querySelectorAll('.wp-block-b2b-card');
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