import { registerBlockType } from '@wordpress/blocks'
import dsCiteocomIcon from '../icons.js';

import './style.scss'
import './editor.scss'

import blockIcons from '../icons.js';

import Edit from './edit'
import save from './save'

registerBlockType( 'citeo-jeunesse/coup-pouce-telecharger', {
	icon: dsCiteocomIcon.logoCiteoJeunesse,
	edit: Edit,
	save,
} )
