import { useBlockProps, useInnerBlocksProps, BlockControls, LinkControl } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton, Popover } from "@wordpress/components";

import { useState } from 'react';

import '../scss/editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const { cardLink, hasImage, hasTags } = attributes
	const [ isLinkPopoverVisible, setIsLinkPopoverVisible ] = useState( false );

	const blockProps = useBlockProps({});

	const TEMPLATE_TAGS = [
		['core/group', {
			metadata: {
				name: 'Liste de bulles'
			},
			layout: {
				type: 'flex'
			},
			allowedBlocks: ['citeo-semantic/tag']
		}, 
			[
				['citeo-semantic/tag'],
				['citeo-semantic/tag']
			]
		],
		['core/paragraph', {
			className: 'ds-text-large',
			placeholder: 'Texte descriptif qui appuie le titre.\nCelui ci doit être assez court pour inciter à lire la suite.'
		}]
	];

	const TEMPLATE_IMAGE_TAGS = [
		['core/image', {}],
		['core/group', {
			metadata: {
				name: 'Liste de bulles'
			},
			layout: {
				type: 'flex'
			},
			allowedBlocks: ['citeo-semantic/tag'],
			className: 'ds-text-small'
		}, 
			[
				['citeo-semantic/tag']
			]
		],
		['core/paragraph', {
			className: 'ds-text-large',
			placeholder: 'Titre de la carte'
		}],
	]

	const TEMPLATE_IMAGE = [
		['core/image', {}],
		['core/paragraph', {
			className: 'ds-heading-2 top-titre',
			placeholder: 'Top titre'
		}],
		['core/heading', {
			level: 4,
			className: 'ds-heading-4',
			placeholder: 'Titre de la carte sur 1 ligne'
		}],
		['core/paragraph', {
			className: 'ds-text-base',
			placeholder: 'Description de la carte. Maximum 2 lignes'
		}]
	]

	let TEMPLATE = []

	if(hasImage && hasTags) TEMPLATE = TEMPLATE_IMAGE_TAGS
	else if(hasImage) TEMPLATE = TEMPLATE_IMAGE
	else TEMPLATE = TEMPLATE_TAGS

	const ALLOWED_BLOCKS = ['core/group', 'core/image', 'core/heading', 'core/list', 'core/paragraph', 'citeo-semantic/progress-bar', 'citeo-semantic/tag', 'citeo-semantic/icon', 'core/buttons']

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
		allowedBlocks: ALLOWED_BLOCKS
	})
	
	return (
		<>
			{hasImage && (
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							icon="admin-links"
							label="Modifier le lien"
							onClick={ () => setIsLinkPopoverVisible( ( prev ) => !prev ) }
							isPressed={ isLinkPopoverVisible }
						/>
					</ToolbarGroup>

					{ isLinkPopoverVisible && (
						<Popover
							className="button-edit-popover"
							position="bottom center"
							onClose={ () => setIsLinkPopoverVisible( false ) }
						>
							<LinkControl
								value={ cardLink }
								onChange={ ( newUrl ) => setAttributes( {cardLink: newUrl } ) }
							/>

							<ToolbarButton
								icon="editor-unlink"
								label="Enlever le lien"
								onClick={ () => {
									setAttributes({ cardLink: undefined });
									setIsLinkPopoverVisible(false);
								} }
							/>
						</Popover>
					) }
				</BlockControls>
			)}
			<div {...innerBlocksProps}>
			</div>
		</>
	);
}
