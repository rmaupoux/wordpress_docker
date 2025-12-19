import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import '../scss/editor.scss';
import logoEcojunior from '../../../assets/img/logo-ecojunior.png';
import previewImgDis from '../../../assets/img/preview-discover-youth.jpg';

export default function Edit({ attributes }) {
	const { preview } = attributes
	const blockProps = useBlockProps({
		className: `discover`
	});

	const TEMPLATE = [
			['core/group', {
			metadata: {
				name: 'Conteneur download Ecojunior footer'
			},
			className: 'ecojunior-content--footer',
		}, 
			[

				['core/heading', {
					level: 2,
					content: 'Découvrez le Magazine'
				}],
				['core/image', {
					url: logoEcojunior,
					alt: 'eco junior logo'
				}],
				['core/paragraph', {
					typo: 'Body-2',
					content: 'accessible à tous'
				}],
				['core/heading', {
					level: 3,
					content: 'Recevez Eco Junior <br>en version numérique PDF'
				}],
				['core/paragraph', {
					typo: 'Body-2',
					content: 'Abonnez-vous à Ecojunior pour recevoir les prochains numéros directement chez vous !'
				}],
				['core/buttons', {
					className: 'discover-button-wrapper',
					templateLock: false,
					layout: {
						justifyContent: 'center'
					}
				}, 
					[
						['core/button', {
							className: 'is-style-primary',
							text: 'S\'abonner pour 2025/2026'
						}]
					]
				]
			]
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
