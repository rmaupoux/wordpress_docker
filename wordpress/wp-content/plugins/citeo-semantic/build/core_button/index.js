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

/***/ "@wordpress/compose":
/*!*********************************!*\
  !*** external ["wp","compose"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["compose"];

/***/ }),

/***/ "@wordpress/hooks":
/*!*******************************!*\
  !*** external ["wp","hooks"] ***!
  \*******************************/
/***/ ((module) => {

module.exports = window["wp"]["hooks"];

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
/*!**********************************!*\
  !*** ./src/core_button/index.js ***!
  \**********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);






// icons_list is a variable generated in PHP

const allowedBlocks = ['core/button'];
wp.domReady(() => {
  setTimeout(() => {
    wp.blocks.unregisterBlockStyle('core/button', 'link');
    wp.blocks.unregisterBlockStyle('core/button', 'tag');
    wp.blocks.unregisterBlockStyle('core/button', 'fill');
    wp.blocks.unregisterBlockStyle('core/button', 'outline');
  }, 1);
});
function addAttributes(settings, name) {
  if (!allowedBlocks.includes(name) || !settings.attributes) {
    return settings;
  }
  settings.attributes.prefix = {
    type: "string",
    default: ""
  };
  settings.attributes.suffix = {
    type: "string",
    default: ""
  };
  settings.attributes.variationName = {
    type: "string",
    default: "standard"
  };
  return settings;
}
const addAdvancedControls = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_2__.createHigherOrderComponent)(Block => {
  return props => {
    const {
      name,
      attributes,
      setAttributes,
      isSelected
    } = props;
    const {
      prefix,
      suffix,
      variationName,
      isPostButton
    } = attributes;

    // Si ce n'est pas le bon bloc, on quitte et on retourne le bloc original, inchangé
    if (!allowedBlocks.includes(name)) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(Block, {
        ...props
      });
    }

    // Ajout de l'élément dans l'inspecteur
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(Block, {
        ...props
      }), variationName === 'download' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.BlockControls, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.MediaUpload, {
          onSelect: media => {
            setAttributes({
              url: media.url
            });
          },
          multiple: false,
          title: 'Téléversez votre fichier à lier ou sélectionnez le depuis la médiathèque',
          render: ({
            open
          }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
              onClick: open,
              className: "dashicons dashicons-upload",
              "aria-label": 'Uploadez votre fichier',
              style: {
                width: '3rem',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '1.75em',
                cursor: 'pointer',
                border: '0',
                borderRight: 'solid 1px #000',
                background: '#fff'
              }
            })
          })
        })
      }), isSelected && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InspectorControls, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
          title: "Type de bouton",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelRow, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalToggleGroupControl, {
              label: "Type de bouton",
              value: variationName,
              onChange: name => setAttributes({
                variationName: name
              }),
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalToggleGroupControlOption, {
                value: "standard",
                label: "Standard",
                "aria-label": 'Bouton standard avec ou sans icônes',
                showTooltip: true
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalToggleGroupControlOption, {
                value: "download",
                label: "T\xE9l\xE9charger",
                "aria-label": 'Bouton de téléchargement automatique au click avec icône de téléchargement',
                showTooltip: true
              })]
            })
          })
        }), (variationName === 'standard' || variationName === 'icon') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
          title: "Gestionnaire d'icônes",
          children: [variationName !== 'icon' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelRow, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
              label: 'Icône préfixe',
              value: prefix,
              options: icons_list,
              onChange: prefix => {
                setAttributes({
                  prefix
                });
              }
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelRow, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
              label: variationName === 'standard' ? 'Icône suffixe' : 'Icône',
              value: suffix,
              options: icons_list,
              onChange: suffix => {
                setAttributes({
                  suffix
                });
              }
            })
          })]
        })]
      })]
    });
  };
}, 'addAdvancedControls');
const addCustomClassToBlock = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_2__.createHigherOrderComponent)(Block => {
  return props => {
    const {
      name,
      setAttributes
    } = props;
    const {
      variationName
    } = props.attributes;

    // Si ce n'est pas le bon bloc, on quitte
    if (!allowedBlocks.includes(name)) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(Block, {
        ...props
      });
    }
    const usePrevious = value => {
      const ref = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();
      (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        ref.current = value;
      });
      return ref.current;
    };
    const prevName = usePrevious(variationName);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
      // Setting icon text to white space otherwise it doesn't display
      if (variationName === 'icon') setAttributes({
        text: ' '
      });
      // If we are coming from the icon mode we reset the text to trigger the default placeholder (otherwise the single white space creates accessability issue)
      else if (prevName === 'icon') setAttributes({
        text: ''
      });
    }, [variationName]);
    const extraClass = swapClass(props.attributes);

    // Ajout de l'élément dans l'inspecteur
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(Block, {
      ...props,
      className: extraClass
    });
  };
}, 'addAdvancedControls');
function applyExtraClass(extraProps, blockType, attributes) {
  if (!allowedBlocks.includes(blockType.name)) {
    return extraProps;
  }
  const extraClass = swapClass(attributes);
  // Ajout de la classe
  if (extraClass) extraProps.className += extraClass;
  return extraProps;
}
const swapClass = attributes => {
  const {
    variationName,
    prefix,
    suffix
  } = attributes;
  let classList = '';
  switch (variationName) {
    case 'icon':
      classList = ` no-text has-suffix--${suffix}`;
      break;
    case 'download':
      classList = ` add-download has-prefix--Download`;
      break;
    case 'standard':
      classList = prefix ? ` has-prefix--${prefix}` : '';
      classList += suffix ? ` has-suffix--${suffix}` : '';
  }
  return classList;
};

// Ajout d’un nouvel attribut dans le bloc
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__.addFilter)('blocks.registerBlockType', 'ds-citeocom/button-custom-attributes', addAttributes);
// Ajout des champs dans l’inspecteur du bloc
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__.addFilter)('editor.BlockEdit', 'ds-citeocom/button-custom-advanced-control', addAdvancedControls);
// Ajout de la classe dans le bloc dans l’éditeur
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__.addFilter)('editor.BlockListBlock', 'ds-citeocom/button-custom-block-class', addCustomClassToBlock);
// Ajout de la classe dans le HTML sauvegardé
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__.addFilter)('blocks.getSaveContent.extraProps', 'ds-citeocom/button-applyExtraClass', applyExtraClass);
wp.domReady(() => {
  /*
  * Others settings removed on theme.json (racine theme file)
  */

  // Register custom style
  wp.blocks.registerBlockStyle('core/button', {
    label: 'Primaire',
    name: 'primary',
    isDefault: true
  });
  wp.blocks.registerBlockStyle('core/button', {
    label: 'Secondaire',
    name: 'secondary'
  });
  wp.blocks.registerBlockStyle('core/button', {
    label: 'Tertiaire',
    name: 'tertiary'
  });
  wp.blocks.registerBlockStyle('core/button', {
    label: 'Liens',
    name: 'link'
  });
  wp.blocks.registerBlockStyle('core/button', {
    label: 'Tag',
    name: 'tag'
  });
  // Unregister custom style
  wp.blocks.unregisterBlockStyle('core/button', 'fill');
  wp.blocks.unregisterBlockStyle('core/button', 'outline');
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map