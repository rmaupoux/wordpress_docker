import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import '../scss/editor.scss';
import ecojuniorCover from '../../../assets/img/ecojunior-cover.png';
import logoEcojunior from '../../../assets/img/logo-ecojunior.png';
import previewImgDis from '../../../assets/img/preview-discover-youth.png';

export default function Edit({ attributes }) {
	const { preview } = attributes
	const blockProps = useBlockProps({
		className: `discover`
	});

	const TEMPLATE = [
		['core/group', {
			metadata: {
				name: 'Conteneur decouverte'
			},
			className: 'discover-content-wrapper',
			allowedBlocks: ['core/heading', 'core/paragraph', 'core/buttons', 'core/image']
		}, [
				['core/heading', {
					level: 2,
					content: 'Découvrez le Magazine'
				}],
				['core/image', {
                    url: logoEcojunior,
                    alt: 'eco junior logo'
                }],
				['core/paragraph', {
					typo: 'Body-2'
				}],
				['core/buttons', {
					className: 'discover-button-wrapper',
					templateLock: false
				}, [
						['core/button', {
							className: 'is-style-secondary',
							suffix: 'Arrow-right',
							text: 'En savoir plus'
						}],
						['core/button', {
							suffix: 'Arrow-right',
							className: 'is-style-primary',
							text: 'Accèder aux anciens numéros'
						}],
					]
				]
			],
		],
		['core/group', {
			metadata: {
				name: 'Conteneur d\'image d\'en-tête'
			},
			className: 'discover-image-wrapper',
			allowedBlocks: ['core/image'],
		}, [
				['core/image', {
                    url: ecojuniorCover,
                    alt: 'eco junior cover',
					className: 'discover-img-cover'
                }],
				['core/paragraph', {
					typo: 'Body-2',
					className: 'discover-texte-arrow',
					content: '100% gratuit'
				}]
			],
		]
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
