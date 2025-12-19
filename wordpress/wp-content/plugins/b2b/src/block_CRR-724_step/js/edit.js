import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

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
	const { stepIndex, hasImage } = attributes

	const blockProps = useBlockProps({});

	const TEMPLATE_TEXT = [
		['core/paragraph', {
			className: 'step-ttl ds-heading-2',
			placeholder: 'Titre de l\'étape. 2 lignes maximum.',
			lock: {
				remove: true,
				move: true
			}
		}],
		['core/paragraph', {
			className: 'step-desc ds-text-paragraph',
			placeholder: 'Courte description. 5 lignes maximum',
			lock: {
				move: true
			}
		}]
	];

	const TEMPLATE_IMAGE = [
		['core/paragraph', {
			className: 'step-ttl ds-heading-2',
			placeholder: 'Titre de l\'étape. 2 lignes maximum.',
			lock: {
				remove: true,
				move: true
			}
		}],
		['core/paragraph', {
			className: 'step-desc ds-text-paragraph',
			placeholder: 'Courte description. 5 lignes maximum.',
			lock: {
				move: true,
			}
		}],
		['core/image', {
			className: 'step-img'
		}]
	]

	const TEMPLATE = hasImage ? TEMPLATE_IMAGE : TEMPLATE_TEXT

	const ALLOWED_BLOCKS = ['core/paragraph', 'core/image']

	return (
		<div {...blockProps}>
			<span className='step-num ds-display-number'>{stepIndex}</span>

			<InnerBlocks 
				template={TEMPLATE}
				allowedBlocks={ALLOWED_BLOCKS}
			/>
		</div>
	);
}
