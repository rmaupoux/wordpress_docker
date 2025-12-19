/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/rich-text":
/*!**********************************!*\
  !*** external ["wp","richText"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["richText"];

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
/************************************************************************/
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
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*************************************!*\
  !*** ./src/core_underline/index.js ***!
  \*************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_rich_text__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/rich-text */ "@wordpress/rich-text");
/* harmony import */ var _wordpress_rich_text__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * Add custom btn for RichText component
 */






const titleZoro = ({
  isActive,
  onChange,
  value
}) => {
  const selectedBlock = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => {
    return select('core/block-editor').getSelectedBlock();
  }, []);
  if (selectedBlock && selectedBlock.name !== 'core/heading' && selectedBlock.name !== 'core/paragraph') {
    return;
  }

  // List of template class names where the zoro color option is activated
  const activeColorTemplate = ['onlr'];
  const bodyClassList = [...document.body.classList];
  const hasColorOpt = activeColorTemplate.some(className => bodyClassList.includes(className));
  if (!hasColorOpt) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichTextToolbarButton, {
      icon: "editor-underline",
      title: "Texte soulign\xE9",
      onClick: () => {
        onChange((0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_0__.toggleFormat)(value, {
          type: 'ds-com-citeo/title-zoro'
        }));
      },
      isActive: isActive
    });
  }

  // Color list of the color picker
  const colors = [{
    name: 'Noir',
    color: '#000000'
  }, {
    name: 'Blanc',
    color: '#FFFFFF'
  }, {
    name: 'Gris',
    color: '#D1D5DB'
  }, {
    name: 'Bleu-clair',
    color: '#DBEAFE'
  }, {
    name: 'Bleu',
    color: '#2563EB'
  }, {
    name: 'Bleu-foncé',
    color: '#1E3A8A'
  }, {
    name: 'Vert-clair',
    color: '#DCFCE7'
  }, {
    name: 'Vert',
    color: '#16A34A'
  }, {
    name: 'Vert-foncé',
    color: '#14532D'
  }, {
    name: 'Rouge-clair',
    color: '#FEE2E2'
  }, {
    name: 'Rouge',
    color: '#DC2626'
  }, {
    name: 'Rouge-foncé',
    color: '#7F1D1D'
  }, {
    name: 'Jaune-clair',
    color: '#FEF08A'
  }, {
    name: 'Jaune',
    color: '#FACC15'
  }, {
    name: 'Jaune-foncé',
    color: '#A16207'
  }, {
    name: 'Ambre-clair',
    color: '#FEF3C7'
  }, {
    name: 'Ambre',
    color: '#F59E0B'
  }, {
    name: 'Ambre-foncé',
    color: '#B45309'
  }, {
    name: 'Violet-clair',
    color: '#DDD6FE'
  }, {
    name: 'Violet',
    color: '#8B5CF6'
  }, {
    name: 'Violet-foncé',
    color: '#4C1D95'
  }, {
    name: 'Cyan-clair',
    color: '#B7ECFF'
  }, {
    name: 'Cyan',
    color: '#30CFFF'
  }, {
    name: 'Cyan-foncé',
    color: '#02658A'
  }];
  const [showPicker, setShowPicker] = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)(false);
  const [color, setColor] = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)('#000000');
  const optionRef = (0,react__WEBPACK_IMPORTED_MODULE_4__.useRef)();
  (0,react__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    setShowPicker(false);
  }, [color]);
  const applyColor = val => {
    const colorMatch = colors.find(el => el.color === val);
    if (colorMatch) {
      onChange((0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_0__.applyFormat)(value, {
        attributes: {
          class: `zoro-color--${colorMatch.name}`
        },
        type: 'ds-com-citeo/title-zoro'
      }));
      setColor(val);
    } else {
      console.log('Remove zoro');
      onChange((0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_0__.removeFormat)(value, 'ds-com-citeo/title-zoro'));
      setColor('');
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichTextToolbarButton, {
      icon: "editor-underline",
      title: "Texte avec soulignement color\xE9",
      onClick: () => {
        setShowPicker(!showPicker);
      },
      isActive: isActive,
      ref: optionRef
    }), showPicker && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Popover, {
      placement: "top right",
      anchor: optionRef.current,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
        style: {
          padding: '1rem'
        },
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
          label: "Couleur du zoro",
          value: color,
          colors: colors,
          onChange: val => applyColor(val)
        })
      })
    })]
  });
};
(0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_0__.registerFormatType)('ds-com-citeo/title-zoro', {
  title: 'Texte souligné',
  tagName: 'span',
  className: 'underline',
  edit: titleZoro
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map