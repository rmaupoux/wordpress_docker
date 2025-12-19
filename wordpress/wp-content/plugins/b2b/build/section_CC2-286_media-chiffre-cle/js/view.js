/******/ (() => { // webpackBootstrap
/*!**********************************************************!*\
  !*** ./src/section_CC2-286_media-chiffre-cle/js/view.js ***!
  \**********************************************************/
const mediaSection = document.querySelectorAll('.wp-block-ds-citeocom-section-box-media');
mediaSection.forEach(section => {
  const cards = section.querySelectorAll('.wp-block-b2b-number-card');
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