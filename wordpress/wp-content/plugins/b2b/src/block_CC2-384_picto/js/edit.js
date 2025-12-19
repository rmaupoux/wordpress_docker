import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import '../scss/editor.scss';

export default function Edit({ attributes }) {

	const blockProps = useBlockProps({
		className: `picto-block-wrap`
	});

	const TEMPLATE = [
		['core/paragraph', {
			className: 'picto-num ds-text-base',
			placeholder: '01.'
		}],
		['citeo-semantic/icon', {
			className: 'chart-picto',
			icon: 'Globe'
		}],
		['core/group', {
			metadata: {
				name: 'Conteneur de texte'
			},
			className: 'txt-wrap',
			allowedBlock: ['core/heading', 'core/paragraph'],
			templateLock: false
		}, 
			[
				['core/paragraph', {
					className: 'picto-ttl ds-heading-3',
				}],
				['core/paragraph', {
					className: 'picto-desc ds-text-paragraph'
				}]
			]
		]
	];

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
		allowedBlock: []
	});

	return (
		<div {...innerBlocksProps} />
	);
}
