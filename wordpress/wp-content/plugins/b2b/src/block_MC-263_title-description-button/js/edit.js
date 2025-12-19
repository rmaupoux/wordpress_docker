import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import '../scss/editor.scss';

import previewImg from '/assets/img/block-title-desc-btn.jpg';

export default function Edit({ attributes }) {
	const { preview, textSize, hasTags, noDesc } = attributes

	const TEMPLATE_DEFAULT = [
		['core/heading', {
			level: 2,
			className: 'ds-heading-3',
			content: '<span class="custom-size ds-heading-1">Titre</span>\nsous-titre qui peut être <span class="underline">souligné</span>'
		}],
		['core/paragraph', {
			className: textSize,
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

	const TEMPLATE_NO_DESC = [
		['core/heading', {
			level: 2,
			className: 'ds-heading-3',
			content: '<span class="custom-size ds-text-xsmall">Texte support</span><span class="custom-size ds-heading-1">Titre</span>\nsous-titre qui peut être <span class="underline">souligné</span>'
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

	const TEMPLATE_TAGS = [
		['core/group', {
			className: 'tag-wrapper',
			metadata: {
				name: 'Liste de tags'
			},
			layout: {
				type: 'flex',
				flexWrap: 'wrap'
			},
			allowedBlocks: ['citeo-semantic/tag']
		}, 
			[
				['citeo-semantic/tag']
			]
		],
		['core/heading', {
			level: 2,
			className: 'ds-heading-3',
			content: '<span class="custom-size ds-heading-1">Titre</span>\nsous-titre qui peut être <span class="underline">souligné</span>'
		}],
		['core/paragraph', {
			className: textSize,
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

	const TEMPLATE_TAGS_NO_DESC = [
		['core/group', {
			className: 'tag-wrapper',
			metadata: {
				name: 'Liste de tags'
			},
			layout: {
				type: 'flex',
				flexWrap: 'wrap'
			},
			allowedBlocks: ['citeo-semantic/tag']
		}, 
			[
				['citeo-semantic/tag']
			]
		],
		['core/heading', {
			level: 2,
			className: 'ds-heading-3',
			content: '<span class="custom-size ds-heading-1">Titre</span>\nsous-titre qui peut être <span class="underline">souligné</span>'
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
	
	let TEMPLATE = TEMPLATE_DEFAULT

	if(hasTags && noDesc) TEMPLATE = TEMPLATE_TAGS_NO_DESC
	else if(hasTags) TEMPLATE = TEMPLATE_TAGS
	else if(noDesc) TEMPLATE = TEMPLATE_NO_DESC

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


