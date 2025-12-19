/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/env-list.js":
/*!****************************!*\
  !*** ./assets/env-list.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ENV_LIST: () => (/* binding */ ENV_LIST)
/* harmony export */ });
const ENV_LIST = [{
  label: 'Citeo Groupe',
  value: 'ds-subtheme-group'
}, {
  label: 'Citeo EMPG',
  value: 'ds-subtheme-emp',
  subThemes: [{
    label: 'Bleu',
    value: 'subtheme-accent1'
  }, {
    label: 'Jaune',
    value: 'subtheme-accent2'
  }, {
    label: 'Vert',
    value: 'subtheme-accent3'
  }]
}, {
  label: 'Citeo Pro',
  value: 'ds-subtheme-pro',
  subThemes: [{
    label: 'Bleu',
    value: 'subtheme-accent1'
  }, {
    label: 'Rouge',
    value: 'subtheme-accent2'
  }, {
    label: 'Gris',
    value: 'subtheme-accent3'
  }]
}, {
  label: 'Citeo S&H',
  value: 'ds-subtheme-sh',
  subThemes: [{
    label: 'Teal',
    value: 'subtheme-accent1'
  }, {
    label: 'Orange',
    value: 'subtheme-accent2'
  }, {
    label: 'Gris',
    value: 'subtheme-accent3'
  }]
}, {
  label: 'Adelphe',
  value: 'ds-theme-adelphe',
  subThemes: [{
    label: 'Bleu',
    value: 'subtheme-accent1'
  }, {
    label: 'Jaune',
    value: 'subtheme-accent2'
  }, {
    label: 'Vert',
    value: 'subtheme-accent3'
  }]
}];

/***/ }),

/***/ "./assets/icons/icons.js":
/*!*******************************!*\
  !*** ./assets/icons/icons.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

const dsCiteocomIcon = {};

/*
*   If you want to add icons
*   assure it's SVG and convert for JSX her :
*   https://svg2jsx.com/
*   and past the result has new item
*/
/*
* --------------------
* -------------------- LOGO CITEO--------------------
* --------------------
*/
dsCiteocomIcon.logoCiteo = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24.6 28",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
    d: "M23.1,22.4l1.5,1.5c-4.9,4.9-13.6,5.8-19.7.5C-1.3,19.1-1.6,10.1,4,4.4c5.8-5.9,15.2-5.7,20.6-.3l-1.5,1.5C18.1.7,10.2,1,5.5,5.8c-4.4,4.5-4.5,11.5-.2,16.2,1.5,1.6,3.4,2.8,5.5,3.4,2.2.6,4.4.7,6.6.2,2.2-.5,4.1-1.6,5.7-3.1ZM22.1,6.6l-1.9,1.9c-3.5-3.4-9.2-2.9-12.1.8-2.7,3.5-1.9,8.4,1.7,11,3.6,2.5,8.1,1.6,10.4-.8-.2-.2-.5-.5-.7-.7h0s0,0,0,0c-.3-.2-.5-.5-.7-.7-2.6,2.4-6.5,2-8.6-.4-2.1-2.5-1.7-6.1.8-8.1,2.5-2,6-1.5,7.8.4l-2,1.9h5.5v-5.3Z"
  })
});
dsCiteocomIcon.logoCiteoBlog = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "-3 -3 30.6 34",
  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("rect", {
    x: "-3",
    y: "-3",
    width: "30.6",
    height: "34",
    fill: "black"
  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
    d: "M23.1,22.4l1.5,1.5c-4.9,4.9-13.6,5.8-19.7.5C-1.3,19.1-1.6,10.1,4,4.4c5.8-5.9,15.2-5.7,20.6-.3l-1.5,1.5C18.1.7,10.2,1,5.5,5.8c-4.4,4.5-4.5,11.5-.2,16.2,1.5,1.6,3.4,2.8,5.5,3.4,2.2.6,4.4.7,6.6.2,2.2-.5,4.1-1.6,5.7-3.1ZM22.1,6.6l-1.9,1.9c-3.5-3.4-9.2-2.9-12.1.8-2.7,3.5-1.9,8.4,1.7,11,3.6,2.5,8.1,1.6,10.4-.8-.2-.2-.5-.5-.7-.7h0s0,0,0,0c-.3-.2-.5-.5-.7-.7-2.6,2.4-6.5,2-8.6-.4-2.1-2.5-1.7-6.1.8-8.1,2.5-2,6-1.5,7.8.4l-2,1.9h5.5v-5.3Z",
    fill: "white"
  })]
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (dsCiteocomIcon);

/***/ }),

/***/ "./assets/img/newsletter.png":
/*!***********************************!*\
  !*** ./assets/img/newsletter.png ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "images/newsletter.dac969bf.png";

/***/ }),

/***/ "./src/section_CC2-279_newsletter/block.json":
/*!***************************************************!*\
  !*** ./src/section_CC2-279_newsletter/block.json ***!
  \***************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"ds-citeocom/section-newsletter","version":"2.0.0","title":"Newsletter","category":"b2b-funnel-block","icon":"smiley","description":"Section encadré couleur comportant un titre, description, un champs email et bouton d\'inscription.","supports":{"html":false},"attributes":{"checkboxLabel":{"type":"string","default":""},"submitLabel":{"type":"string","default":"S\'inscrire"},"preview":{"type":"boolean","default":false},"isEnglish":{"type":"boolean","default":false},"captchaSiteKey":{"type":"string","default":"default-key"},"formDestination":{"type":"string"},"theme":{"type":"string","default":""},"subTheme":{"type":"string","default":"subtheme-accent1"},"themeSwapConfirm":{"type":"boolean","default":false},"emailLabel":{"type":"string","default":"Adresse e-mail"}},"example":{"attributes":{"preview":true}},"textdomain":"b2b","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css"}');

/***/ }),

/***/ "./src/section_CC2-279_newsletter/deprecated.js":
/*!******************************************************!*\
  !*** ./src/section_CC2-279_newsletter/deprecated.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


/*
* Copy and paste what you had in your previous save.js here
*/

const v8 = {
  attributes: {
    "checkboxLabel": {
      "type": "string",
      "default": ""
    },
    "submitLabel": {
      "type": "string",
      "default": "S'inscrire"
    },
    "preview": {
      "type": "boolean",
      "default": false
    },
    "isEnglish": {
      "type": "boolean",
      "default": false
    },
    "captchaSiteKey": {
      "type": "string",
      "default": "default-key"
    },
    "formDestination": {
      "type": "string"
    },
    "theme": {
      "type": "string",
      "default": ""
    },
    "subTheme": {
      "type": "string",
      "default": "default"
    },
    "themeSwapConfirm": {
      "type": "boolean",
      "default": false
    },
    "emailLabel": {
      "type": "string",
      "default": "Adresse e-mail"
    }
  },
  supports: {
    "html": false
  },
  migrate(attributes) {
    const legacyToNewMap = {
      'ds-subtheme-pro': 'citeo-pro'
    };
    return {
      ...attributes,
      formDestination: legacyToNewMap[attributes.formDestination] || attributes.formDestination
    };
  },
  save({
    attributes
  }) {
    const {
      checkboxLabel,
      submitLabel,
      emailLabel,
      isEnglish,
      captchaSiteKey,
      formDestination,
      theme,
      subTheme
    } = attributes;
    const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save({
      className: `${theme} ${subTheme}`
    });
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("section", {
      ...blockProps,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        className: "newsletter-ttl-col",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InnerBlocks.Content, {})
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("form", {
        className: "newsletter-input-col",
        method: "post",
        action: "/wp-admin/admin-ajax.php",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
          type: "hidden",
          name: "type_newsletter",
          className: "citeo-newsletter-type-newsletter",
          value: formDestination
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "input-group",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText.Content, {
            tagName: "label",
            value: emailLabel || "Adresse e-mail",
            className: "ds-text-base",
            htmlFor: "citeo-newsletter-email"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
            type: "email",
            name: "email",
            className: "ds-text-base citeo-newsletter-email",
            placeholder: ""
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "checkbox-wrap",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
            type: "checkbox",
            name: "agreement",
            className: "citeo-newsletter-optin"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText.Content, {
            tagName: "label",
            value: checkboxLabel,
            className: "ds-text-xsmall"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          className: "frc-captcha",
          "data-lang": isEnglish ? 'en' : 'fr',
          "data-sitekey": captchaSiteKey
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          className: "wp-block-button",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText.Content, {
            tagName: "button",
            value: submitLabel,
            className: "wp-block-button__link wp-element-button newsletter",
            type: "submit"
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          className: "form-message ds-text-small citeo-newsletter-message"
        })]
      })]
    });
  }
};
const v7 = {
  attributes: {
    "checkboxLabel": {
      "type": "string",
      "default": ""
    },
    "submitLabel": {
      "type": "string",
      "default": "S'inscrire"
    },
    "preview": {
      "type": "boolean",
      "default": false
    },
    "isEnglish": {
      "type": "boolean",
      "default": false
    },
    "captchaSiteKey": {
      "type": "string",
      "default": "default-key"
    },
    "formDestination": {
      "type": "string"
    },
    "theme": {
      "type": "string",
      "default": ""
    },
    "subTheme": {
      "type": "string",
      "default": "default"
    },
    "themeSwapConfirm": {
      "type": "boolean",
      "default": false
    },
    "emailLabel": {
      "type": "string",
      "default": "Adresse e-mail"
    }
  },
  supports: {
    "html": false
  },
  migrate(attributes) {
    const legacyToNewMap = {
      'groupe-citeo': 'ds-subtheme-group',
      'citeo-pro': 'ds-subtheme-pro',
      'citeo-emp': 'ds-subtheme-emp',
      'citeo-sh': 'ds-subtheme-sh'
    };
    return {
      ...attributes,
      theme: legacyToNewMap[attributes.theme] || attributes.theme
    };
  },
  save({
    attributes
  }) {
    const {
      checkboxLabel,
      submitLabel,
      emailLabel,
      isEnglish,
      captchaSiteKey,
      formDestination,
      theme,
      subTheme
    } = attributes;
    const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save({
      className: `${theme} ${subTheme}`
    });
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("section", {
      ...blockProps,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        className: "newsletter-ttl-col",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InnerBlocks.Content, {})
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("form", {
        className: "newsletter-input-col",
        method: "post",
        action: "/wp-admin/admin-ajax.php",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
          type: "hidden",
          name: "type_newsletter",
          className: "citeo-newsletter-type-newsletter",
          value: formDestination
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "input-group",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText.Content, {
            tagName: "label",
            value: emailLabel || "Adresse e-mail",
            className: "ds-text-base",
            htmlFor: "citeo-newsletter-email"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
            type: "email",
            name: "email",
            className: "ds-text-base citeo-newsletter-email",
            placeholder: ""
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "checkbox-wrap",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
            type: "checkbox",
            name: "agreement",
            className: "citeo-newsletter-optin"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText.Content, {
            tagName: "label",
            value: checkboxLabel,
            className: "ds-text-xsmall"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          className: "frc-captcha",
          "data-lang": isEnglish ? 'en' : 'fr',
          "data-sitekey": captchaSiteKey
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          className: "wp-block-button",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText.Content, {
            tagName: "button",
            value: submitLabel,
            className: "wp-block-button__link wp-element-button newsletter",
            type: "submit"
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          className: "form-message ds-text-small citeo-newsletter-message"
        })]
      })]
    });
  }
};
const v6 = {
  attributes: {
    "checkboxLabel": {
      "type": "string",
      "default": ""
    },
    "submitLabel": {
      "type": "string",
      "default": "S'inscrire"
    },
    "preview": {
      "type": "boolean",
      "default": false
    },
    "isEnglish": {
      "type": "boolean",
      "default": false
    },
    "captchaSiteKey": {
      "type": "string",
      "default": "default-key"
    },
    "formDestination": {
      "type": "string"
    },
    "theme": {
      "type": "string",
      "default": ""
    },
    "themeSwapConfirm": {
      "type": "boolean",
      "default": false
    },
    "privacyLink": {
      "type": "string",
      "default": ""
    }
  },
  supports: {
    "html": false,
    "multiple": false,
    "align": ["full"]
  },
  save({
    attributes
  }) {
    const {
      checkboxLabel,
      submitLabel,
      isEnglish,
      captchaSiteKey,
      formDestination,
      theme,
      privacyLink
    } = attributes;
    const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save({
      className: `${theme}`
    });
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
      ...blockProps,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        className: "newsletter-ttl-col",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InnerBlocks.Content, {})
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("form", {
        className: "newsletter-input-col",
        id: "citeo-newsletter-form",
        method: "post",
        action: "/wp-admin/admin-ajax.php",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
          type: "hidden",
          name: "type_newsletter",
          id: "citeo-newsletter-type-newsletter",
          value: formDestination
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
          type: "text",
          name: "email",
          id: "citeo-newsletter-email",
          className: "ds-text-base",
          placeholder: "Entrer mon email"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "checkbox-wrap",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
            type: "checkbox",
            name: "agreement",
            id: "citeo-newsletter-optin"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText.Content, {
            tagName: "label",
            value: checkboxLabel,
            className: "ds-text-xsmall"
          }), privacyLink && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("a", {
            href: privacyLink,
            className: "privacy-link",
            target: "_blank",
            rel: "noopener noreferrer",
            children: "Politique de confidentialit\xE9"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          className: "frc-captcha",
          "data-lang": isEnglish ? 'en' : 'fr',
          "data-sitekey": captchaSiteKey
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          className: "wp-block-button",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText.Content, {
            tagName: "button",
            value: submitLabel,
            id: "submit-newsletter",
            className: "wp-block-button__link wp-element-button",
            type: "submit"
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          id: "citeo-newsletter-message",
          className: "form-message ds-text-small"
        })]
      })]
    });
  }
};
const v5 = {
  attributes: {
    "checkboxLabel": {
      "type": "string",
      "default": ""
    },
    "submitLabel": {
      "type": "string",
      "default": "S'inscrire"
    },
    "preview": {
      "type": "boolean",
      "default": false
    },
    "isEnglish": {
      "type": "boolean",
      "default": false
    },
    "captchaSiteKey": {
      "type": "string",
      "default": "default-key"
    },
    "formDestination": {
      "type": "string"
    },
    "theme": {
      "type": "string",
      "default": ""
    },
    "themeSwapConfirm": {
      "type": "boolean",
      "default": false
    }
  },
  supports: {
    "html": false,
    "multiple": false,
    "align": ["full"]
  },
  save({
    attributes
  }) {
    const {
      checkboxLabel,
      submitLabel,
      isEnglish,
      captchaSiteKey,
      formDestination,
      theme
    } = attributes;
    const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save({
      className: `${theme}`
    });
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
      ...blockProps,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        className: "newsletter-ttl-col",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InnerBlocks.Content, {})
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("form", {
        className: "newsletter-input-col",
        id: "citeo-newsletter-form",
        method: "post",
        action: "/wp-admin/admin-ajax.php",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
          type: "hidden",
          name: "type_newsletter",
          id: "citeo-newsletter-type-newsletter",
          value: formDestination
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
          type: "text",
          name: "email",
          id: "citeo-newsletter-email",
          className: "ds-text-base",
          placeholder: "Entrer mon email"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "checkbox-wrap",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
            type: "checkbox",
            name: "agreement",
            id: "citeo-newsletter-optin"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText.Content, {
            tagName: "label",
            value: checkboxLabel,
            className: "ds-text-xsmall"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          className: "frc-captcha",
          "data-lang": isEnglish ? 'en' : 'fr',
          "data-sitekey": captchaSiteKey
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          className: "wp-block-button",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText.Content, {
            tagName: "button",
            value: submitLabel,
            id: "submit-newsletter",
            className: "wp-block-button__link wp-element-button",
            type: "submit"
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          id: "citeo-newsletter-message",
          className: "form-message ds-text-small"
        })]
      })]
    });
  }
};
const v4 = {
  attributes: {
    "checkboxLabel": {
      "type": "string",
      "default": "Vos données seront traitées par Citeo conformément à notre politique de confidentialité. J'accepte de recevoir la newsletter \"Ecoconception\" de Citeo."
    },
    "submitLabel": {
      "type": "string",
      "default": "S'inscrire"
    },
    "preview": {
      "type": "boolean",
      "default": false
    },
    "isEnglish": {
      "type": "boolean",
      "default": false
    },
    "captchaSiteKey": {
      "type": "string",
      "default": "default-key"
    }
  },
  supports: {
    "html": false,
    "multiple": true
  },
  save(attributes) {
    const {
      checkboxLabel,
      submitLabel,
      isEnglish,
      captchaSiteKey,
      formDestination
    } = attributes;
    const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save({
      className: `newsletter-section`
    });
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("section", {
      ...blockProps,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        className: "newsletter-ttl-col",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InnerBlocks.Content, {})
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("form", {
        className: "newsletter-input-col",
        id: "citeo-newsletter-form",
        method: "post",
        action: "/wp-admin/admin-ajax.php",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
          type: "hidden",
          name: "type_newsletter",
          id: "citeo-newsletter-type-newsletter",
          value: formDestination
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "checkbox-wrap",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
            type: "checkbox",
            name: "agreement",
            id: "citeo-newsletter-optin"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText.Content, {
            tagName: "label",
            value: checkboxLabel,
            className: "Body-4"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          className: "frc-captcha",
          "data-lang": isEnglish ? 'en' : 'fr',
          "data-sitekey": captchaSiteKey
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "input-wrap",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
            type: "text",
            name: "email",
            id: "citeo-newsletter-email",
            className: "Body-2",
            placeholder: "Entrer mon email"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
            className: "wp-block-button",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText.Content, {
              tagName: "button",
              value: submitLabel,
              id: "submit-newsletter",
              className: "wp-block-button__link wp-element-button",
              type: "submit"
            })
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          id: "citeo-newsletter-message",
          className: "form-message Body-3"
        })]
      })]
    });
  }
};
const v3 = {
  attributes: {
    "checkboxLabel": {
      "type": "string",
      "default": "Vos données seront traitées par Citeo conformément à notre politique de confidentialité. J'accepte de recevoir la newsletter \"Ecoconception\" de Citeo."
    },
    "submitLabel": {
      "type": "string",
      "default": "S'inscrire"
    },
    "preview": {
      "type": "boolean",
      "default": false
    },
    "isEnglish": {
      "type": "boolean",
      "default": false
    },
    "captchaSiteKey": {
      "type": "string",
      "default": "default-key"
    }
  },
  supports: {
    "html": false,
    "multiple": true
  },
  save(attributes) {
    const {
      checkboxLabel,
      submitLabel,
      isEnglish,
      captchaSiteKey
    } = attributes;
    const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save({
      className: `newsletter-section`
    });
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("section", {
      ...blockProps,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        className: "newsletter-ttl-col",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InnerBlocks.Content, {})
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("form", {
        className: "newsletter-input-col",
        id: "citeo-newsletter-form",
        method: "post",
        action: "/wp-admin/admin-ajax.php",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "checkbox-wrap",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
            type: "checkbox",
            name: "agreement",
            id: "citeo-newsletter-optin"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText.Content, {
            tagName: "label",
            value: checkboxLabel,
            className: "Body-4"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          className: "frc-captcha",
          "data-lang": isEnglish ? 'en' : 'fr',
          "data-sitekey": captchaSiteKey
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "input-wrap",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
            type: "text",
            name: "email",
            id: "citeo-newsletter-email",
            className: "Body-2",
            placeholder: "Entrer mon email"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
            className: "wp-block-button",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText.Content, {
              tagName: "button",
              value: submitLabel,
              id: "submit-newsletter",
              className: "wp-block-button__link wp-element-button",
              type: "submit"
            })
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          id: "citeo-newsletter-message",
          className: "form-message Body-3"
        })]
      })]
    });
  }
};
const v2 = {
  attributes: {
    "checkboxLabel": {
      "type": "string"
    },
    "submitLabel": {
      "type": "string"
    },
    "preview": {
      "type": "boolean"
    }
  },
  supports: {
    "html": false,
    "multiple": true
  },
  save(attributes) {
    const {
      checkboxLabel,
      submitLabel
    } = attributes;
    const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save({
      className: `newsletter-section`
    });
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("section", {
      ...blockProps,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        className: "newsletter-ttl-col",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InnerBlocks.Content, {})
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("form", {
        className: "newsletter-input-col",
        id: "citeo-newsletter-form",
        method: "post",
        action: "/wp-admin/admin-ajax.php",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "checkbox-wrap",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
            type: "checkbox",
            name: "agreement",
            id: "citeo-newsletter-optin"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText.Content, {
            tagName: "label",
            value: checkboxLabel,
            className: "Body-4"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          className: "frc-captcha",
          "data-sitekey": "FCMITMCHB1FLUKKG"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "input-wrap",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
            type: "text",
            name: "email",
            id: "citeo-newsletter-email",
            className: "Body-2",
            placeholder: "Entrer mon email"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
            className: "wp-block-button",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText.Content, {
              tagName: "button",
              value: submitLabel,
              id: "submit-newsletter",
              className: "wp-block-button__link wp-element-button",
              type: "submit"
            })
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          id: "citeo-newsletter-message",
          className: "form-message Body-3"
        })]
      })]
    });
  }
};
const v1 = {
  attributes: {
    "checkboxLabel": {
      "type": "string"
    },
    "submitLabel": {
      "type": "string"
    },
    "preview": {
      "type": "boolean"
    }
  },
  supports: {
    "html": false,
    "className": false
  },
  save(attributes) {
    const {
      checkboxLabel,
      submitLabel
    } = attributes;
    const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save({
      className: `newsletter-ttl-col`
    });
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("section", {
      className: "newsletter-section",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        ...blockProps,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InnerBlocks.Content, {})
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("form", {
        className: "newsletter-input-col",
        id: "citeo-newsletter-form",
        method: "post",
        action: "/wp-admin/admin-ajax.php",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "checkbox-wrap",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
            type: "checkbox",
            name: "agreement",
            id: "citeo-newsletter-optin"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText.Content, {
            tagName: "label",
            value: checkboxLabel,
            className: "Body-4"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          className: "frc-captcha",
          "data-sitekey": "FCMITMCHB1FLUKKG"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "input-wrap",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
            type: "text",
            name: "email",
            id: "citeo-newsletter-email",
            className: "Body-2",
            placeholder: "Entrer mon email"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
            className: "wp-block-button",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText.Content, {
              tagName: "button",
              value: submitLabel,
              id: "submit-newsletter",
              className: "wp-block-button__link wp-element-button",
              type: "submit"
            })
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          id: "citeo-newsletter-message",
          className: "form-message Body-3"
        })]
      })]
    });
  }
};

// Latest version first in the array
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ([v8, v7, v6, v5, v4, v3, v2, v1]);

/***/ }),

/***/ "./src/section_CC2-279_newsletter/index.js":
/*!*************************************************!*\
  !*** ./src/section_CC2-279_newsletter/index.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _assets_icons_icons_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../../../assets/icons/icons.js */ "./assets/icons/icons.js");
/* harmony import */ var _scss_style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scss/style.scss */ "./src/section_CC2-279_newsletter/scss/style.scss");
/* harmony import */ var _js_edit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./js/edit */ "./src/section_CC2-279_newsletter/js/edit.js");
/* harmony import */ var _js_save__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./js/save */ "./src/section_CC2-279_newsletter/js/save.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./src/section_CC2-279_newsletter/block.json");
/* harmony import */ var _deprecated_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./deprecated.js */ "./src/section_CC2-279_newsletter/deprecated.js");
/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */



/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */


/**
 * Internal dependencies
 */





/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_5__.name, {
  /**
   * @see /assets/icons/icons.js
   */
  icon: _assets_icons_icons_js__WEBPACK_IMPORTED_MODULE_1__["default"].logoCiteo,
  /**
   * @see ./edit.js
   */
  edit: _js_edit__WEBPACK_IMPORTED_MODULE_3__["default"],
  /**
   * @see ./save.js
   */
  save: _js_save__WEBPACK_IMPORTED_MODULE_4__["default"],
  deprecated: _deprecated_js__WEBPACK_IMPORTED_MODULE_6__["default"]
});

/***/ }),

/***/ "./src/section_CC2-279_newsletter/js/edit.js":
/*!***************************************************!*\
  !*** ./src/section_CC2-279_newsletter/js/edit.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _assets_env_list__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../assets/env-list */ "./assets/env-list.js");
/* harmony import */ var _scss_editor_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../scss/editor.scss */ "./src/section_CC2-279_newsletter/scss/editor.scss");
/* harmony import */ var _assets_img_newsletter_png__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../../../../assets/img/newsletter.png */ "./assets/img/newsletter.png");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);







function Edit({
  attributes,
  setAttributes
}) {
  const {
    checkboxLabel,
    submitLabel,
    emailLabel,
    formDestination,
    preview,
    isEnglish,
    theme,
    themeSwapConfirm,
    subTheme
  } = attributes;
  let detectedSiteName = '';
  let destination = '';
  const CURRENT_ENV = _assets_env_list__WEBPACK_IMPORTED_MODULE_3__.ENV_LIST.find(el => Array.from(document.body.classList).includes(el.value));
  if (CURRENT_ENV) {
    switch (CURRENT_ENV.value) {
      case "ds-subtheme-group":
        destination = 'onlr';
        detectedSiteName = 'Citeo';
        break;
      case "ds-subtheme-emp":
        destination = 'empg';
        detectedSiteName = 'Citeo';
        break;
      case "ds-subtheme-pro":
        destination = 'citeo-pro';
        detectedSiteName = 'Citeo Pro';
        break;
      case "ds-subtheme-sh":
        destination = 's&h';
        detectedSiteName = 'Citeo Soin & Hygiène';
        break;
      case "adelphe":
        destination = 'adelphe';
        detectedSiteName = 'Adelphe';
        break;
      default:
        detectedSiteName = 'XXX';
        break;
    }
  }
  const isEnglishLanguage = document.body.classList.contains('pll-lang-en');
  if (!checkboxLabel) {
    const defaultCheckboxText = `Vos données seront traitées par ${detectedSiteName} conformément à notre politique de confidentialité. J'accepte de recevoir la newsletter de ${detectedSiteName}.`;
    setAttributes({
      checkboxLabel: defaultCheckboxText,
      isEnglish: isEnglishLanguage,
      captchaSiteKey: typeof acfDataCaptcha !== 'undefined' ? acfDataCaptcha.captchaSiteKey : 'default-key'
    });
  }
  if (!formDestination) {
    setAttributes({
      formDestination: destination,
      isEnglish: isEnglishLanguage,
      captchaSiteKey: typeof acfDataCaptcha !== 'undefined' ? acfDataCaptcha.captchaSiteKey : 'default-key'
    });
  }
  const TEMPLATE = [['core/heading', {
    level: 3,
    content: '<span class="ds-heading-1">CONTACT</span>\n<span class="ds-heading-3">Inscrivez vous dès maintenant</span>'
  }], ['core/paragraph', {
    className: 'ds-text-large',
    content: `Au rythme d\'une fois par mois maximum sur l\'actualité de ${detectedSiteName}. Abonnez-vous, c\'est gratuit.`
  }]];
  const ALLOWED_BLOCKS = ['core/heading', 'core/paragraph'];
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps)({
    className: `${theme} ${subTheme}`
  });
  (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    const CURRENT_ENV = _assets_env_list__WEBPACK_IMPORTED_MODULE_3__.ENV_LIST.find(el => Array.from(document.body.classList).includes(el.value));
    if (CURRENT_ENV && !theme) {
      setAttributes({
        theme: CURRENT_ENV.value
      });
    }
  }, []);
  const newsletterOpt = [{
    label: "EMPG",
    value: "empg"
  }, {
    label: "Soin & Hygiène",
    value: "s&h"
  }, {
    label: "Citeo pro",
    value: "citeo-pro"
  }, {
    label: "ONLR",
    value: "onlr"
  }, {
    label: "Jeunesse",
    value: "jeunesse"
  }, {
    label: "Adelphe",
    value: "adelphe"
  }];
  if (preview) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("img", {
        src: _assets_img_newsletter_png__WEBPACK_IMPORTED_MODULE_5__,
        alt: "Preview"
      })
    });
  }
  const innerBlocksProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useInnerBlocksProps)(blockProps, {
    template: TEMPLATE,
    allowedBlocks: ALLOWED_BLOCKS,
    templateLock: false
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InspectorControls, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {
        title: "Embasement utilisateur",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
            label: 'Destination de l\'embasement',
            value: formDestination,
            options: newsletterOpt,
            onChange: val => {
              setAttributes({
                formDestination: val
              });
            }
          })
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {
        title: 'Choix du thème',
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
            label: "Activer/d\xE9sactiver les th\xE8mes couleurs d'autres filiales Citeo",
            help: themeSwapConfirm ? 'Ces thèmes couleurs appartiennent à d\'autres filiales de Citeo. Activez-les seulement si vous devez illustrer ou mentionner ces marques dans votre page.' : 'Je ne souhaite pas activer les thèmes couleurs non natif au site web actuel.',
            checked: themeSwapConfirm,
            onChange: val => {
              const CURRENT_ENV = _assets_env_list__WEBPACK_IMPORTED_MODULE_3__.ENV_LIST.find(el => Array.from(document.body.classList).includes(el.value));
              if (!val && CURRENT_ENV) setAttributes({
                theme: CURRENT_ENV.value
              });
              setAttributes({
                themeSwapConfirm: val
              });
            }
          })
        }), themeSwapConfirm && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
          label: 'Thème actif',
          value: theme,
          options: _assets_env_list__WEBPACK_IMPORTED_MODULE_3__.ENV_LIST,
          onChange: value => {
            setAttributes({
              theme: value
            });
            setAttributes({
              subTheme: 'default'
            });
          }
        }), theme !== 'ds-subtheme-group' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
          label: 'Thème secondaire',
          value: subTheme,
          options: _assets_env_list__WEBPACK_IMPORTED_MODULE_3__.ENV_LIST.find(el => el.value === theme)?.subThemes,
          onChange: value => setAttributes({
            subTheme: value
          })
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("section", {
      ...innerBlocksProps,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
        className: "newsletter-ttl-col",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InnerBlocks, {
          template: TEMPLATE,
          allowedBlocks: ALLOWED_BLOCKS,
          templateLock: false
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("form", {
        className: "newsletter-input-col",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
          className: "input-group",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText, {
            tagName: "label",
            value: emailLabel,
            onChange: val => setAttributes({
              emailLabel: val
            }),
            placeholder: "",
            className: "ds-text-base",
            htmlFor: "citeo-newsletter-email"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("input", {
            type: "email",
            name: "email",
            className: "ds-text-base citeo-newsletter-email",
            placeholder: ""
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
          className: "checkbox-wrap",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("input", {
            type: "checkbox",
            name: "agreement",
            className: "citeo-newsletter-optin"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText, {
            tagName: "label",
            value: checkboxLabel,
            allowedFormats: ['core/italic', 'core/link'],
            onChange: val => setAttributes({
              checkboxLabel: val
            }),
            placeholder: 'Texte de la checkbox...',
            className: "ds-text-xsmall"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "frc-captcha",
          "data-sitekey": "FCMITMCHB1FLUKKG",
          "data-lang": isEnglish ? 'en' : 'fr'
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "wp-block-button",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText, {
            tagName: "a",
            value: submitLabel,
            allowedFormats: [],
            onChange: val => setAttributes({
              submitLabel: val
            }),
            placeholder: 'Texte du bouton',
            className: "wp-block-button__link wp-element-button"
          })
        })]
      })]
    })]
  });
}

/***/ }),

/***/ "./src/section_CC2-279_newsletter/js/save.js":
/*!***************************************************!*\
  !*** ./src/section_CC2-279_newsletter/js/save.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ save)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


function save({
  attributes
}) {
  const {
    checkboxLabel,
    submitLabel,
    emailLabel,
    isEnglish,
    captchaSiteKey,
    formDestination,
    theme,
    subTheme
  } = attributes;
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save({
    className: `${theme} ${subTheme}`
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("section", {
    ...blockProps,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "newsletter-ttl-col",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InnerBlocks.Content, {})
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("form", {
      className: "newsletter-input-col",
      method: "post",
      action: "/wp-admin/admin-ajax.php",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
        type: "hidden",
        name: "type_newsletter",
        className: "citeo-newsletter-type-newsletter",
        value: formDestination
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "input-group",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText.Content, {
          tagName: "label",
          value: emailLabel || "Adresse e-mail",
          className: "ds-text-base",
          htmlFor: "citeo-newsletter-email"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
          type: "email",
          name: "email",
          className: "ds-text-base citeo-newsletter-email",
          placeholder: ""
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "checkbox-wrap",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
          type: "checkbox",
          name: "agreement",
          className: "citeo-newsletter-optin"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText.Content, {
          tagName: "label",
          value: checkboxLabel,
          className: "ds-text-xsmall"
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        className: "frc-captcha",
        "data-lang": isEnglish ? 'en' : 'fr',
        "data-sitekey": captchaSiteKey
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        className: "wp-block-button",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText.Content, {
          tagName: "button",
          value: submitLabel,
          className: "wp-block-button__link wp-element-button newsletter",
          type: "submit"
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        className: "form-message ds-text-small citeo-newsletter-message"
      })]
    })]
  });
}

/***/ }),

/***/ "./src/section_CC2-279_newsletter/scss/editor.scss":
/*!*********************************************************!*\
  !*** ./src/section_CC2-279_newsletter/scss/editor.scss ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/section_CC2-279_newsletter/scss/style.scss":
/*!********************************************************!*\
  !*** ./src/section_CC2-279_newsletter/scss/style.scss ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["ReactJSXRuntime"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/^blob:/, "").replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl + "../";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"section_CC2-279_newsletter/index": 0,
/******/ 			"section_CC2-279_newsletter/style-index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkds_citeocom"] = globalThis["webpackChunkds_citeocom"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["section_CC2-279_newsletter/style-index"], () => (__webpack_require__("./src/section_CC2-279_newsletter/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map