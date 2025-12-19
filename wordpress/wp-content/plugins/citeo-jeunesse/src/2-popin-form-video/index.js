import { registerBlockType } from '@wordpress/blocks'
import dsCiteocomIcon from '../icons.js';


import Edit from './edit'
import save from './save'

registerBlockType( 'citeo-jeunesse/coup-pouce-video', {
	icon: dsCiteocomIcon.logoCiteoJeunesse,
	edit: Edit,
	save,
} )
