import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import '../scss/editor.scss';

import previewImg from '/assets/img/section-faq.jpg';

export default function Edit({ attributes, setAttributes }) {
	const { preview } = attributes
	
	const TEMPLATE = [
		['core/heading', {
			lock: {
				move: true,
				remove: true
			},
			className: 'ds-heading-1',
			level: 2,
			placeholder: 'Titre sur deux lignes maximum.',
			content: 'Trouvez la réponse \nà vos questions'
		}],
		['citeo-semantic/list-accordeon', {
			lock: {
				move: true,
				remove: true
			},
			allowedBlocks: ['citeo-semantic/block-accordeon'],
			multipleActive: true,
			metadata: {
				name: 'Toutes les questions'
			}
		}, 
			[
				['citeo-semantic/block-accordeon', {
					isActive: true
				}],
				['citeo-semantic/block-accordeon'],
				['citeo-semantic/block-accordeon']
			]
		],
		['core/buttons', {
			lock: {
				move: true,
				remove: true
			},
		}, 
			[
				['core/button', {
					text: 'Afficher plus de questions',
					suffix: 'Arrow-right',
					className: 'is-style-secondary'
				}]
			]
		]		
	];

	const ALLOWED_BLOCKS = [];

    const blockProps = useBlockProps({});
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
		allowedBlocks: ALLOWED_BLOCKS
	})

	if (preview) {
        return (
            <>
                <img src={previewImg} alt="Preview" />
            </>
        );
    }
	return (
		<section {...innerBlocksProps} >
		</section>
	);
}
