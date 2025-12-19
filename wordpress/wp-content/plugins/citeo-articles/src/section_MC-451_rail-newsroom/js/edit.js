import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import '../scss/editor.scss';
import previewImg from '../../assets/img/block-rail-newsroom.jpg';

export default function Edit({ attributes, setAttributes }) {
	const { 
		preview, 
		queryPerPage = 8, 
		queryOrder = 'desc', 
		queryOrderBy = 'date', 
		queryPostType = 'post' 
	} = attributes

	const TEMPLATE = [
		['core/heading', {
			level: 2,
			textAlign: 'center',
			placeholder: 'Titre de la section',
			content: '<span class="ds-heading-1">Newsroom</span>\n<span class="ds-heading-2">Dernière publication CITEO</span>',
		}],
		
		['core/query', {
			metadata: {
				name: 'Derniers articles'
			},
			className: 'query-slider',
			query: {
				perPage: queryPerPage,
				pages: 1,
				offset: 0,
				postType: queryPostType,
				order: queryOrder,
				orderBy: queryOrderBy,
				sticky: 'ignore',
				inherit: false,
			}
		},
			[
				['core/post-template', {
								},
					[
						['citeo-semantic/post-link-wrapper', {}, [
							['core/post-featured-image', {
								useFirstImageFromPost: true,

							}],
							['core/group', {
								metadata: {
									name: 'Titre et excerpt d\'article'
								},
								className: 'article-wrapper',
								allowedBlocks: ['core/post-title', 'core/post-excerpt']
							},
								[
									['citeo-articles/acf-sous-titre', {
                                        className: 'ds-display-2'
                                    }],
									['core/post-title', {
										level: 2,
										className: 'ds-heading-4',
									}],
									['core/post-date', {
										format: 'j F Y',
									}],
									['core/post-excerpt'],
									['core/post-terms', {
										term: 'post_tag',
										separator: '',
										className: 'ds-text-small',
										hideEmpty: true
									}]

								]
							]
						]
						]
					]
				]
			]
		],
		['core/buttons', {
			className: 'main-cta-wrap'
		},
			[
				['core/button', {
					placeholder: 'Texte du bouton',
					text: 'Voir tous',
					url: '/le-mag',
					className: 'is-style-secondary'
				}]
			]
		]
	];

	const ALLOWED_BLOCKS = [];

	const blockProps = useBlockProps({});
	
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
		allowedBlocks: ALLOWED_BLOCKS,
		templateLock: 'all' // Empêche la modification des blocs enfants
	});
	 if (preview) {
				return (
					<>
						<img src={previewImg} alt="Preview" />
					</>
				);
	}

	return (
		<section {...innerBlocksProps}>
		</section>
	);
}