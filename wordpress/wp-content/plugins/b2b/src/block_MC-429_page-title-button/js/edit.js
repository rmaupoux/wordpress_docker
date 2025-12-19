import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import '../scss/editor.scss';

import previewImg from '/assets/img/block-title-desc-btn.jpg';

export default function Edit({ attributes }) {
	const { preview, hasButton, twoCol } = attributes

	const TEMPLATE_STD = [
		['core/heading', {
			level: 1,
			className: 'ds-heading-1',
			content: '<span class="custom-size ds-text-xsmall">Texte support</span>\n<span class="custom-size ds-display-1">Titre</span>\nsous-titre qui peut être <span class="underline">souligné</span>'
		}],
		['core/paragraph', {
			className: 'ds-text-large',
			placeholder: "Texte descriptif qui appuie le titre. \nCelui ci doit être assez court pour inciter à lire la suite.",
		}],
		['core/buttons', {}, 
			[
				['core/button', {
					placeholder: "Action 1",
					className: 'is-style-primary'
				}],
				['core/button', {
					className: 'is-style-secondary',
					placeholder: "Action 2",
				}],
			]
		]
	];

	const TEMPLATE_TWO_COL = [
		['core/heading', {
			level: 1,
			className: 'ds-heading-1',
			content: '<span class="custom-size ds-text-xsmall">Texte support</span>\n<span class="custom-size ds-display-1">Titre</span>\nsous-titre qui peut être <span class="underline">souligné</span>'
		}],
		['core/group', {
			metadata: {
				name: 'Colonne de droite'
			},
			className: 'right-col',
			allowedBlocks: ['core/buttons','core/list','core/paragraph']
		}, 
			[
				['core/paragraph', {
					className: 'ds-text-large',
					placeholder: "Texte descriptif qui appuie le titre. \nCelui ci doit être assez court pour inciter à lire la suite.",
				}],
				['core/buttons', {}, 
					[
						['core/button', {
							placeholder: "Action 1",
							className: 'is-style-primary'
						}],
						['core/button', {
							className: 'is-style-secondary',
							placeholder: "Action 2",
						}],
					]
				]
			]
		]
	];

	const TEMPLATE_NO_BUTTON = [
		['core/heading', {
			level: 1,
			className: 'ds-heading-1',
			content: '<span class="custom-size ds-text-xsmall">Texte support</span>\n<span class="custom-size ds-display-1">Titre</span>\nsous-titre qui peut être <span class="underline">souligné</span>'
		}],
		['core/paragraph', {
			className: 'ds-text-large',
			placeholder: "Texte descriptif qui appuie le titre. \nCelui ci doit être assez court pour inciter à lire la suite.",
		}]
	];

	let TEMPLATE = TEMPLATE_STD

	if(!hasButton) TEMPLATE = TEMPLATE_NO_BUTTON
	else if(twoCol) TEMPLATE = TEMPLATE_TWO_COL

	const ALLOWED_BLOCKS = ['core/buttons','core/list','core/heading','core/paragraph'];

	const blockProps = useBlockProps({});

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
		allowedBlocks: ALLOWED_BLOCKS,
		templateLock: false,
	});

	if (preview) {
        return (
            <>
                <img src={previewImg} alt="Preview" />
            </>
        );
    }

	return (			
		<div {...innerBlocksProps} />
	);
}


