import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import previewImg from '../../assets/img/block-rail-hot.jpg';

import '../scss/editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const { 
		preview, 
		queryPerPage1 = 1, 
		queryPerPage2 = 6, 
		queryOrder = 'desc', 
		queryOrderBy = 'date', 
		queryPostType = 'post' 
	} = attributes

	const TEMPLATE = [
		['core/group', {
			className: 'hot-topic-wrapper',
			metadata: {
						name: 'Dernier article à la une Deux colonnes',
					},
		}, [
			['core/group', {
				className: 'hot-topic-wrapper--left',
				lock: {
					move: true,
					remove: true,
				},
				metadata: {
						name: 'Article à la une gauche',
					},
			}, [
				['core/query', {
					metadata: {
						name: 'Dernier article à la une'
					},
					className: 'query-featured',
					queryId: 1,
					query: {
						perPage: queryPerPage1,
						pages: 1,
						offset: 0,
						postType: queryPostType,
						order: queryOrder,
						orderBy: queryOrderBy,
						sticky: 'only',
						inherit: false,
					}
				}, [
					['core/post-template', {}, [
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
							}, [
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
								}],
								['core/group', {
									className: 'wp-block-button is-style-link has-suffix--Arrow-right'
								}, [
									['core/read-more', {
										content: 'Lire l\'article',
										className: 'is-style-primary wp-block-button__link wp-element-button'
									}]
								]]
							]]
						]]
					]]
				]]
			]],

			['core/group', {
				className: 'hot-topic-wrapper--right',
				lock: {
					move: true,
					remove: true,
				},
				metadata: {
						name: 'Six articles à la une droite',
					},
			}, [['core/paragraph', {
				content: 'Articles à la une',
				className: 'title-section ds-heading-5',
				lock: {
					move: true,
					remove: true,
				},
			}],
				['core/query', {
					metadata: {
						name: '6 Derniers articles suivant à la une'
					},
					className: 'hot-topic-slider',
					queryId: 2,
					query: {
						perPage: queryPerPage2,
						pages: 1,
						offset: 1,
						postType: queryPostType,
						order: queryOrder,
						orderBy: queryOrderBy,
						sticky: 'only',
						inherit: false,
					}
				}, [
					['core/post-template', {
						className: 'slider-wrap'
					}, [
						['citeo-semantic/post-link-wrapper', {}, [
							
							['core/group', {
								metadata: {
									name: 'Titre et excerpt d\'article'
								},
								className: 'article-wrapper',
								allowedBlocks: ['core/post-title', 'core/post-excerpt']
							}, [
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
							]]
						]]
					]]
				]]
			]]
		]]
	];

	const ALLOWED_BLOCKS = [];

	const blockProps = useBlockProps({});
	
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
		allowedBlocks: ALLOWED_BLOCKS,
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