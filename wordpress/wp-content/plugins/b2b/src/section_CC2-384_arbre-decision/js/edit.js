import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, ToggleControl, Button } from "@wordpress/components";
import { useEffect, useRef } from 'react';

import { illustrations_list } from '../../../../citeo-semantic/assets/utils';
import { ENV_LIST } from '../../../assets/env-list';
import { drawLines } from './chart';

import '../scss/editor.scss';

import previewImg from '/assets/img/encart-arbre-decision.jpg';

export default function Edit({ attributes, setAttributes }) {
	const { preview, backgroundPictoUrl, theme, subTheme, isWhite, themeSwapConfirm } = attributes

	// Add a reset entry to the option list
	illustrations_list.Aucun = '';
	const sortedKeys = Object.keys(illustrations_list).sort((a, b) => {
		if (a === "Aucun") return -1;
		if (b === "Aucun") return 1;
		return a.localeCompare(b)
	});

    const blockProps = useBlockProps({
        className: `${isWhite ? 'is-white' : subTheme} ${theme}`
    });

	useEffect(() => {
		const CURRENT_ENV = ENV_LIST.find(el => Array.from(document.body.classList).includes(el.value))
		
		if(CURRENT_ENV && !theme) {
			setAttributes( {theme: CURRENT_ENV.value} );
		}

		if(!backgroundPictoUrl) {
			setAttributes({ backgroundPictoUrl: illustrations_list.Boite });
		}
	}, []);

	const section = useRef(null)

	// Initializing the function call
	const resizeObserver = new ResizeObserver((entries) => {
		for (const entry of entries) {
			const origin = entry.target.querySelector('.main-picto');
			const sectionNode = entry.target.querySelector('.chart-section');

			drawLines(sectionNode, origin);
		}
	})

	if(section.current && window.innerWidth > 834) {
		const origin = section.current.querySelector('.main-picto');
		const sectionNode = section.current.querySelector('.chart-section');

		drawLines(sectionNode, origin);
		resizeObserver.observe(section.current);
	}

	const TEMPLATE = [
		['b2b/title-description-button'],
		['core/group', {
			metadata: {
				name: 'Arbre de décision'
			},
			className: 'chart-section',
			allowedBlocks: ['core/group', 'core/buttons'] 
		}, 
			[
				['core/group', {
					metadata: {
						name: 'Canvas du graphique'
					},
					className: 'chart-wrap',
					layout: { type: 'flex', flexWrap: 'nowrap' },
					templateLock: 'all',
					allowedBlocks: []
				}, 
					[]
				],
				['citeo-semantic/icon', {
					className: 'main-picto',
					icon: 'Globe'
				}],
				['core/group', {
					metadata: {
						name: 'Liste d\'icônes et description'
					},
					className: 'picto-right-col',
					templateLock: false,
					allowedBlocks: ["ds-citeocom/block-picto"]
				}, 
					[
						['ds-citeocom/block-picto']
					]
				]
			]
		]
	];

	const ALLOWED_BLOCKS = [];

	if (preview) {
        return (
            <>
                <img 
					src={previewImg} 
					alt="Preview"
					/>
            </>
        );
    }
	return (
		<>
			<InspectorControls>
                <PanelBody title={'Choix du thème'} initialOpen={true}>
					<PanelRow>
						<ToggleControl 
							label="Activer/désactiver les thèmes couleurs d'autres filiales Citeo"
							help={
								themeSwapConfirm
									? 'Ces thèmes couleurs appartiennent à d\'autres filiales de Citeo. Activez-les seulement si vous devez illustrer ou mentionner ces marques dans votre page.'
									: 'Je ne souhaite pas activer les thèmes couleurs non natif au site web actuel.'
							}
							checked={ themeSwapConfirm }
							onChange={(val) => {
								const CURRENT_ENV = ENV_LIST.find(el => Array.from(document.body.classList).includes(el.value))

								if(!val && CURRENT_ENV) setAttributes({ theme: CURRENT_ENV.value });
								setAttributes( { themeSwapConfirm: val } );
							}}
						/>
					</PanelRow>

					{themeSwapConfirm && (
                        <SelectControl
                            label={'Thème actif'}
                            value={theme}
                            options={ENV_LIST}
                            onChange={(value) => {
                                setAttributes({ theme: value });
								setAttributes({ subTheme: 'default' });
                            }}
                        />
                    )}

					{!isWhite && (
						<>
							{theme !== 'ds-subtheme-group' && (
								<SelectControl
									label={'Thème secondaire'}
									value={subTheme}
									options={ENV_LIST.find(el => el.value === theme)?.subThemes}
									onChange={(value) => setAttributes({ subTheme: value })}
								/>
							)}
						</>
					)}

					<PanelRow>
						<ToggleControl 
							label="Fond blanc"
							help={
								isWhite
									? 'Section sur fond blanc.'
									: 'Section sur fond coloré.'
							}
							checked={ isWhite }
							onChange={(val) => {
								setAttributes( { isWhite: val } );
							}}
						/>
					</PanelRow>
                </PanelBody>

				<PanelBody title={'Illustration décorative'}>
					<SelectControl
						label={'Liste des illustration'}
						value={
							sortedKeys.find((key) => illustrations_list[key] === backgroundPictoUrl)
						}
						options={[...sortedKeys.map((key) => ({
							label: key,
							value: key,
						}))]}
						onChange={(val) => setAttributes({ backgroundPictoUrl: illustrations_list[val]})}
					/>
					{backgroundPictoUrl && (
						<>
							<img src={backgroundPictoUrl} style={{ width: '100%', objectFit: 'contain', filter: 'brightness(0)' }} />

							<Button
								isDestructive
								onClick={() => setAttributes({ backgroundPictoUrl: '' })}
								style={{
									display: 'block',
									margin: 'auto'
								}}
							>
								Supprimer l'illustration
							</Button>
						</>
					)}
				</PanelBody>

			</InspectorControls>
			<section {...blockProps} ref={section}>
				<div className='back-picto' style={{maskImage: `url(${backgroundPictoUrl})`}} />

				<InnerBlocks 
                    template={TEMPLATE}
                    allowedBlocks={ALLOWED_BLOCKS}
                />
			</section>
		</>
		
	);
}
