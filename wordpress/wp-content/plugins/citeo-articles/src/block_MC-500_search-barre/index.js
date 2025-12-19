import { registerBlockType } from '@wordpress/blocks';
import dsCiteocomIcon from '../assets/icons/icons.js';

import './scss/style.scss';

/**
 * Internal dependencies
 */
import Edit from './js/edit.js';  
import save from './js/save.js';
import metadata from './block.json';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType(metadata.name, {
	/**
 * @see ../assets/icons/icons.js
 */
	icon: dsCiteocomIcon.logoCiteoBlog,
/**
 * @see ./edit.js
 */
edit: Edit,

/**
 * @see ./save.js
 */
save,

});