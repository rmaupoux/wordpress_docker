import { useBlockProps, useInnerBlocksProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from "@wordpress/components";

import '../scss/editor.scss';
import previewImg from '../../assets/img/block-rail-actu.jpg';

export default function Edit({ attributes, setAttributes }) {
	const { preview, cardSize } = attributes

	const TEMPLATE = [
		['core/heading', {
			level: 2,
			textAlign: 'has-text-align-left',
			placeholder: 'Titre de la section',
			className: 'ds-heading-1',
		}],
		
		['core/query', {
			metadata: {
				name: 'Derniers articles'
			},
			className: 'latest-news-slider',
			query: {
				perPage: 3,
				pages: 1,
				offset: 0,
				postType: 'post',
				order: 'desc',
				orderBy: 'date',
				sticky: 'only',
				inherit: false,
			}
		},
			[
				['core/post-template', {
					className: 'slider-wrap'
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
									['core/post-excerpt',{
										excerptLength: 100
									}],
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
					text: 'Voir tous les articles Rail Actu',
					placeholder: 'Texte du bouton',
					className: 'is-style-secondary'
				}]
			]
		]
	];

	const ALLOWED_BLOCKS = [];

	const blockProps = useBlockProps({
		className: `${cardSize}`
	});
	
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
		allowedBlocks: ALLOWED_BLOCKS
	});
	 if (preview) {
					return (
						<>
							<img src={previewImg} alt="Preview" />
						</>
					);
		}

	return (
		<>
			<InspectorControls>
				<PanelBody title={'Paramètres du rail'} initialOpen={true}>
					<PanelRow>
						<ToggleGroupControl
							label="Taille des cartes"
							value={ cardSize }
							onChange={ (size) => setAttributes({cardSize: size})}
						>
							<ToggleGroupControlOption 
								value="small-card" 
								label="Petite" 
								aria-label = {'Taille petite | 4 cartes par rangée'}
								showTooltip = { true }
							/>
							<ToggleGroupControlOption 
								value="medium-card" 
								label="Standard" 
								aria-label = {'Taille standard | 3 cartes par rangée'}
								showTooltip = { true }
							/>
							<ToggleGroupControlOption 
								value="big-card" 
								label="Grande" 
								aria-label = {'Taille grande | 2 cartes par rangée'}
								showTooltip = { true }
							/>
						</ToggleGroupControl>
					</PanelRow>					
				</PanelBody>            
			</InspectorControls>
			
			<section {...innerBlocksProps} />
		</>
	);
}