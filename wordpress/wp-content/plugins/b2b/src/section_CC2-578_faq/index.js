import { registerBlockType } from '@wordpress/blocks';
import dsCiteocomIcon from '/assets/icons/icons.js';

import './scss/style.scss';

/**
 * Internal dependencies
*/
import Edit from './js/edit';  
import save from './js/save';
import metadata from './block.json';
import deprecated from './deprecated';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType(metadata.name, {
	/**
	 * @see /assets/icons/icons.js
	 */
	icon: dsCiteocomIcon.logoCiteo,

	/**
	 * @see ./edit.js
	 */
	edit: Edit,

	/**
	 * @see ./save.js
	 */
	save,

	/**
	 * Anciennes versions du bloc pour la compatibilité
	 */
	deprecated: deprecated,
});
