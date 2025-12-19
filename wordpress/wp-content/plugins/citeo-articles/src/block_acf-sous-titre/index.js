import { registerBlockType } from '@wordpress/blocks';
import Edit from './js/edit';
import metadata from './block.json';

registerBlockType(metadata.name, {
	edit: Edit,
});
