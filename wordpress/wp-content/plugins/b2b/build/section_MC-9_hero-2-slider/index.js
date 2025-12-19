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

/***/ "./assets/img/section-hero-slider.jpg":
/*!********************************************!*\
  !*** ./assets/img/section-hero-slider.jpg ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "images/section-hero-slider.f7270a5f.jpg";

/***/ }),

/***/ "./src/section_MC-9_hero-2-slider/block.json":
/*!***************************************************!*\
  !*** ./src/section_MC-9_hero-2-slider/block.json ***!
  \***************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"ds-citeocom/section-hero-slider","version":"1.0.0","title":"En tête - Home & actualités","category":"b2b-page-start-block","icon":"smiley","description":"Permet d\'introduire des pages internes avec un carousel.","supports":{"html":false,"align":["full"]},"attributes":{"allowResize":{"type":"boolean","default":false},"preview":{"type":"boolean","default":false},"theme":{"type":"string","default":""},"subTheme":{"type":"string","default":"subtheme-accent1"}},"example":{"attributes":{"preview":true}},"providesContext":{"allowResize":"allowResize"},"textdomain":"citeo","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css"}');

/***/ }),

/***/ "./src/section_MC-9_hero-2-slider/deprecated.js":
/*!******************************************************!*\
  !*** ./src/section_MC-9_hero-2-slider/deprecated.js ***!
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

const v1 = {
  attributes: {
    "allowResize": {
      "type": "boolean",
      "default": false
    },
    "preview": {
      "type": "boolean",
      "default": false
    }
  },
  save({}) {
    const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save({});
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("section", {
      ...blockProps,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InnerBlocks.Content, {})
    });
  }
};

// Latest version first in the array 
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ([v1]);

/***/ }),

/***/ "./src/section_MC-9_hero-2-slider/index.js":
/*!*************************************************!*\
  !*** ./src/section_MC-9_hero-2-slider/index.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _assets_icons_icons_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../../../assets/icons/icons.js */ "./assets/icons/icons.js");
/* harmony import */ var _scss_style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scss/style.scss */ "./src/section_MC-9_hero-2-slider/scss/style.scss");
/* harmony import */ var _js_edit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./js/edit */ "./src/section_MC-9_hero-2-slider/js/edit.js");
/* harmony import */ var _js_save__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./js/save */ "./src/section_MC-9_hero-2-slider/js/save.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./src/section_MC-9_hero-2-slider/block.json");
/* harmony import */ var _deprecated_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./deprecated.js */ "./src/section_MC-9_hero-2-slider/deprecated.js");
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

/***/ "./src/section_MC-9_hero-2-slider/js/edit.js":
/*!***************************************************!*\
  !*** ./src/section_MC-9_hero-2-slider/js/edit.js ***!
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
/* harmony import */ var _scss_editor_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../scss/editor.scss */ "./src/section_MC-9_hero-2-slider/scss/editor.scss");
/* harmony import */ var _assets_env_list__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../assets/env-list */ "./assets/env-list.js");
/* harmony import */ var _assets_img_section_hero_slider_jpg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../../../../assets/img/section-hero-slider.jpg */ "./assets/img/section-hero-slider.jpg");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);







function Edit({
  attributes,
  setAttributes
}) {
  const {
    preview,
    theme,
    subTheme
  } = attributes;
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps)({
    className: `${theme} ${subTheme}`
  });
  (0,react__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
    const CURRENT_ENV = _assets_env_list__WEBPACK_IMPORTED_MODULE_3__.ENV_LIST.find(el => Array.from(document.body.classList).includes(el.value));
    if (CURRENT_ENV && !theme) {
      setAttributes({
        theme: CURRENT_ENV.value
      });
    }
  }, []);
  const TEMPLATE = [['b2b/page-title-button', {
    hasButton: false
  }], ['citeo-semantic/fade-slider-wrap', {
    metadata: {
      name: 'Carousel d\'images'
    },
    allowedBlocks: ['b2b/card'],
    hasStepper: true,
    hasControls: true,
    hasTotal: true,
    slideTimer: 8
  }, [['b2b/card', {
    className: 'is-active',
    hasImage: true,
    hasTags: true
  }], ['b2b/card', {
    hasImage: true,
    hasTags: true
  }], ['b2b/card', {
    hasImage: true,
    hasTags: true
  }]]]];
  const innerBlocksProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useInnerBlocksProps)(blockProps, {
    template: TEMPLATE,
    allowedBlocks: []
  });
  if (preview) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("img", {
        src: _assets_img_section_hero_slider_jpg__WEBPACK_IMPORTED_MODULE_4__,
        alt: "Preview"
      })
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
    children: [theme !== 'ds-subtheme-group' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InspectorControls, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {
        title: 'Choix du sous-thème',
        initialOpen: true,
        children: theme !== 'ds-subtheme-group' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
          label: 'Thème secondaire',
          value: subTheme,
          options: _assets_env_list__WEBPACK_IMPORTED_MODULE_3__.ENV_LIST.find(el => el.value === theme)?.subThemes,
          onChange: value => setAttributes({
            subTheme: value
          })
        })
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("section", {
      ...innerBlocksProps
    })]
  });
}

/***/ }),

/***/ "./src/section_MC-9_hero-2-slider/js/save.js":
/*!***************************************************!*\
  !*** ./src/section_MC-9_hero-2-slider/js/save.js ***!
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
    theme,
    subTheme
  } = attributes;
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save({
    className: `${theme} ${subTheme}`
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("section", {
    ...blockProps,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InnerBlocks.Content, {})
  });
}

/***/ }),

/***/ "./src/section_MC-9_hero-2-slider/scss/editor.scss":
/*!*********************************************************!*\
  !*** ./src/section_MC-9_hero-2-slider/scss/editor.scss ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/section_MC-9_hero-2-slider/scss/style.scss":
/*!********************************************************!*\
  !*** ./src/section_MC-9_hero-2-slider/scss/style.scss ***!
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
/******/ 			"section_MC-9_hero-2-slider/index": 0,
/******/ 			"section_MC-9_hero-2-slider/style-index": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["section_MC-9_hero-2-slider/style-index"], () => (__webpack_require__("./src/section_MC-9_hero-2-slider/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map