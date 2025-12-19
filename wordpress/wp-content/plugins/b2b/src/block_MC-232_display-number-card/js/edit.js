import { useBlockProps, useInnerBlocksProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from "@wordpress/components";

import { ENV_LIST } from '../../../assets/env-list';

import '../scss/editor.scss';
import { useEffect } from 'react';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes, context }) {
	const { hasIcon, theme, subTheme } = attributes

	useEffect(() => {
		setAttributes({ theme: context['b2b/theme-context'] });

		if(context['b2b/theme-context'] !== theme) setAttributes({ subTheme: 'default' });
		
	}, [context['b2b/theme-context']]);
	
	const blockProps = useBlockProps({
        className: `${theme ? `${theme} ` : ''}${subTheme ? subTheme : ''}`
    });

	const TEMPLATE_STD = [
		['core/paragraph', {
			content: '<span class="ds-display-number">00M€</span>',
			placeholder: '00M€'
		}],
		['core/paragraph', {
			className: 'ds-text-paragraph',
			placeholder: 'Texte descriptif qui appuie le chiffre.'
		}]
	];

	const TEMPLATE_ICON = [
		['citeo-semantic/icon', {}],
		['core/paragraph', {
			content: '<span class="ds-display-number">00M€</span>',
			placeholder: '00M€'
		}],
		['core/paragraph', {
			className: 'ds-text-paragraph',
			placeholder: 'Texte descriptif qui appuie le chiffre.'
		}]
	]

	const ALLOWED_BLOCKS = ['core/image', 'core/heading', 'core/list', 'core/paragraph', 'citeo-semantic/icon', 'citeo-semantic/progress-bar', 'citeo-semantic/tag', 'core/buttons']

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: hasIcon ? TEMPLATE_ICON : TEMPLATE_STD,
		allowedBlocks: ALLOWED_BLOCKS
	})

	return (
		<>
			{(hasIcon && theme !== 'ds-subtheme-group') && (
				<InspectorControls>
					<PanelBody title={'Choix de la couleur d\'icône'} initialOpen={true}>
						<SelectControl
							label={'Thème secondaire'}
							value={subTheme}
							options={ENV_LIST.find(el => el.value === theme)?.subThemes}
							onChange={(value) => setAttributes({ subTheme: value })}
						/>
					</PanelBody>
				</InspectorControls>
			)}

			<div {...innerBlocksProps} />
		</>
	);
}
