import { useBlockProps, useInnerBlocksProps, RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

import previewImg from '../../assets/img/block-articles-further.jpg';

import '../scss/editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const { preview, title } = attributes

	const TEMPLATE = [
		['core/group', {
			metadata: {
				name: 'Conteneur principal articles'
			},
		}, [
			
			['citeo-semantic/horizontal-slider', {
				allowedBlocks: ['citeo-articles/bloc-encart-article'],
				isInfinite: false,
				isDraggable: true,
				step: 1,
				hasStepper: false,
				hasTotal: false,
				hasControls: false,
				isAuto: false,
				isRandom: false
        }, 
            [
				['citeo-articles/bloc-encart-article', {
					cardRow: true
				}],
				['citeo-articles/bloc-encart-article', {
					cardRow: true
				}],
				['citeo-articles/bloc-encart-article', {
					cardRow: true
				}]
			]]
		]],
		['core/buttons', {
			className: 'main-cta-wrap'
		},
			[
				['core/button', {
					text: __('Voir tous les articles', 'citeo-articles'),
					placeholder: __('Voir tous les articles', 'citeo-articles'),
					className: 'is-style-secondary has-suffix--Arrow-right',
					url: '/le-mag'
				}]
			]
		]
	];

	const ALLOWED_BLOCKS = [];

	const blockProps = useBlockProps({});
	
	const innerBlocksProps = useInnerBlocksProps({}, {
		template: TEMPLATE,
		allowedBlocks: ALLOWED_BLOCKS
	});

	if (preview) {
				return (
					<>
						<img src={previewImg} alt="Preview" />
					</>
				);
	}

	return (
		<section {...blockProps}>
			{/* Titre en RichText */}
			<RichText
				tagName="h2"
				className="ds-heading-3"
				placeholder={__('Pour aller plus loin', 'citeo')}
				value={title || 'Pour aller plus loin'}
				onChange={(value) => setAttributes({ title: value })}
				allowedFormats={['core/bold', 'core/italic']}
			/>
			
			{/* Contenu avec colonnes */}
			<div {...innerBlocksProps} />
		</section>
	);
}