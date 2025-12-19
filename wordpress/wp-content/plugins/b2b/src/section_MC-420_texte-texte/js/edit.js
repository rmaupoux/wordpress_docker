import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import '../scss/editor.scss';

import previewImg from '/assets/img/section-text-text.jpg';

export default function Edit({ attributes }) {
	const { preview } = attributes

	const TEMPLATE = [
		// Première rangée - 50% largeur avec titre et boutons
		['core/columns', {}, [
			['core/column', { }, [
				['core/heading', {
					level: 2,
					className: 'ds-heading-3',
					content: '<span class="custom-size ds-text-xsmall">Texte support</span>\n<span class="custom-size ds-heading-1">Titre</span>\nsous-titre qui peut être <span class="underline">souligné</span>',
					metadata: {
						name: 'Titre et boutons'
					},
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
			]],
			// ['core/column', { }, []]
		]],
		// Deuxième rangée - 2 colonnes avec contenu
		['core/columns', {}, [
			['core/column', { 
				metadata: {
						name: 'Colonne gauche'
					},
			}, [
				['core/paragraph', {
					placeholder: "Texte descriptif qui appuie le titre. \nCelui ci doit être assez court pour inciter à lire la suite.",
					className: 'ds-text-large',
				}],
				['core/paragraph', {
					placeholder: "Paragraphe complémentaire dans la colonne de droite. Ajoutez ici du contenu supplémentaire ou des informations contextuelles.",
					className: 'ds-text-paragraph'
				}],
				['core/buttons', { className: 'back-to-top-wrapper' }, 
					[
						['core/button', {
							variationName: 'standard',
							className: 'back-to-top-btn',
							placeholder: "Retour en haut"
						}]
					]
				]
			]],
			['core/column', { 
				metadata: {
						name: 'Colonne droite'
					},
			}, [
				['core/paragraph', {
					placeholder: "Paragraphe complémentaire dans la colonne de droite. Ajoutez ici du contenu supplémentaire ou des informations contextuelles.",
					className: 'ds-text-paragraph'
				}]
			]]
		]]
	];


	const ALLOWED_BLOCKS = ['core/columns', 'core/column', 'core/buttons','core/list','core/heading','core/paragraph'];

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
		<section {...innerBlocksProps} />
	);
}


