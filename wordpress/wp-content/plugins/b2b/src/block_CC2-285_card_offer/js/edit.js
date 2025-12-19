import { useBlockProps, InnerBlocks, BlockControls, LinkControl, RichText } from '@wordpress/block-editor';
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
	const { cardLink, hasIllustration, label } = attributes
	const [isLinkPopoverVisible, setIsLinkPopoverVisible] = useState(false);

	const blockProps = useBlockProps({});

	const TEMPLATE_NO_ILLUSTRATION = [
		['core/heading', {
			level: 2,
			className: 'ds-heading-2',
			placeholder: 'Titre de la carte'
		}],
		['core/paragraph', {
			className: 'ds-text-paragraph',
			placeholder: 'Description de la carte.'
		}]
	];

	const TEMPLATE_DEFAULT = [
		['citeo-semantic/illustration', {}],
		['core/heading', {
			level: 2,
			className: 'ds-heading-2',
			placeholder: 'Titre de la carte'
		}],
		['core/paragraph', {
			className: 'ds-text-paragraph',
			placeholder: 'Description de la carte.'
		}],
	]

	let TEMPLATE = []

	if (hasIllustration) TEMPLATE = TEMPLATE_DEFAULT
	else TEMPLATE = TEMPLATE_NO_ILLUSTRATION

	const ALLOWED_BLOCKS = ['core/list', 'core/paragraph', 'citeo-semantic/illustration']

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon="admin-links"
						label="Modifier le lien"
						onClick={() => setIsLinkPopoverVisible((prev) => !prev)}
						isPressed={isLinkPopoverVisible}
					/>
				</ToolbarGroup>

				{isLinkPopoverVisible && (
					<Popover
						className="button-edit-popover"
						position="bottom center"
						onClose={() => setIsLinkPopoverVisible(false)}
					>
						<LinkControl
							value={cardLink}
							onChange={(newUrl) => setAttributes({ cardLink: newUrl })}
						/>

						<ToolbarButton
							icon="editor-unlink"
							label="Enlever le lien"
							onClick={() => {
								setAttributes({ cardLink: undefined });
								setIsLinkPopoverVisible(false);
							}}
						/>
					</Popover>
				)}
			</BlockControls>
			<div {...blockProps}>
				<InnerBlocks 
					template={TEMPLATE}
					allowedBlocks={ALLOWED_BLOCKS}
				/>

				<div className='link-label'>
					<RichText
						tagName="span"
						className="ds-text-base"
						value={ label }
						allowedFormats={[]}
						onChange={ ( val ) => setAttributes( { label: val } ) }
						placeholder='Label du lien'
					/>

					{cardLink.url && <arrow-right-icon-component size="16" color="var(--ds-semantic-color-neutral-content-medium)" />}
				</div>
			</div>
		</>
	);
}
