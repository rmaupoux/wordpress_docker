/**
 * Use this file for JavaScript code that you want to run in the front-end
 * on posts/pages that contain this block.
 */

import { defineCustomElements } from '@citeo/ds-citeo/loader';

// Configuration pour résoudre les problèmes d'URL
const pluginUrl = window.location.origin + '/wp-content/plugins/test-block/build/';
if (typeof window !== 'undefined' && !window.__stencilResourceUrl) {
    window.__stencilResourceUrl = pluginUrl;
}

// Initialisation
defineCustomElements(window, {
    resourcesUrl: window.__stencilResourceUrl
});