/******/ (() => { // webpackBootstrap
/*!************************************************!*\
  !*** ./src/section_CC2-366_contact/js/view.js ***!
  \************************************************/
const wrapper = document.querySelector('.wp-block-ds-citeocom-section-contact');
const phones = wrapper.querySelectorAll(".has-prefix--Phone");
if (phones.length > 0) {
  let phone_number;
  phones.forEach((phone, key) => {
    phone_number = phone.querySelector('a').innerText.replaceAll(' ', '');
    phone.querySelector('a').href = 'tel:' + phone_number;
  });
}
const paragraphContent = wrapper.querySelector("p.p-content");
if (paragraphContent) {
  let paraText = extractEmailFromString(paragraphContent.innerText);
  paragraphContent.innerHTML = paraText;
}
function extractEmailFromString(str) {
  const email = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  str.replaceAll('\n', '<br />');
  if (str.match(email)) {
    str = str.replace(str.match(email)[0], "<a class='is-email' href='mailto:" + str.match(email)[0] + "'>" + str.match(email)[0] + "</a>");
  }
  return str.replaceAll('\n', '<br />');
}
/******/ })()
;
//# sourceMappingURL=view.js.map