import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import '../scss/editor.scss';
import previewImgDis from '../../../assets/img/preview-discover-youth.png';

export default function Edit({ attributes }) {
	const { preview } = attributes
	const blockProps = useBlockProps({
		className: `ecojunior-content`,
	});

	const TEMPLATE = [
		['core/group', {
			metadata: {
				name: 'Conteneur Ecojunior heading'
			},
			className: 'ecojunior-content--heading'
		},
			[
				['core/heading', {
					level: 2,
					content: 'Télécharger les anciens numéros'
				}],
				['citeo-semantic/horizontal-slider', {
					metadata: {
						name: 'Carousel d\'années de publication'
					},
					className: 'dynamic-year-slider',
					isDraggable: false,
					allowedBlocks: []
				},
					[]
				]
			]
		],
		['citeo-semantic/list-accordeon', {
			metadata: {
				name: "Accordéons de magazines"
			},
			className: 'ecojunior-content--accordeon',
			multipleActive: false,
			allowedBlocks: []
		},
			[]
		],
		
	];

	const ALLOWED_BLOCKS = [];

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
		allowedBlocks: ALLOWED_BLOCKS
	});
	
	if (preview) {
			return (
				<>
					<img src={previewImgDis} alt="Preview" />
				</>
			);
		}

	return (
		<section {...innerBlocksProps} />
	);
}
