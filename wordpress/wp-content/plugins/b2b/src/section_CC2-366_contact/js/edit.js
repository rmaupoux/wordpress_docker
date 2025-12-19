import { useBlockProps, InspectorControls, useInnerBlocksProps } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, ToggleControl } from "@wordpress/components";
import { useEffect } from 'react';

import { ENV_LIST } from '../../../assets/env-list';

import '../scss/editor.scss';
import previewImg from '/assets/img/contact.png';

export default function Edit({ attributes, setAttributes }) {
	const { preview, theme, subTheme, themeSwapConfirm } = attributes

	const blockProps = useBlockProps({
		className: `${theme} ${subTheme}`
	});

	useEffect(() => {
		const CURRENT_ENV = ENV_LIST.find(el => Array.from(document.body.classList).includes(el.value))
		
		if(CURRENT_ENV && !theme) {
			setAttributes( {theme: CURRENT_ENV.value} );
		}
	}, []);

	const TEMPLATE = [ 
		['core/group', {
			className: 'contact-content-wrapper contact-left',
			metadata: {
				name: 'Conteneur titre & introduction'
			}
		},
			[
				['core/heading', {
					level: 3, 
					content: `<span class="ds-heading-1">CONTACTEZ-NOUS</span>\n<span class="ds-heading-3">pour plus d’informations</span> `, 
					className: 'contact-title',
					metadata: { 
						name: 'Section titre' 
					}
				}],
				['core/paragraph', {
						className: 'contact-intro ds-text-large',
						placeholder: 'Nous mettons régulièrement en ligne des appels à projet pour vous aider à financer votre transition vers des emballages écoconçus ou ',
						metadata: { 
							name: 'Section introduction' 
						}
					}
				],
			]
		],

		['core/group', {
			className: 'contact-content-wrapper contact-right ds-text-base',
			metadata: {
				name: 'Conteneur téléphone & infos'
			}
		},
			[
				['core/buttons', {
					className: 'contact-phone',
					metadata: { 
						name: 'Numéro de téléphone' 
					}
				}, 
					[
						['core/button', {
							placeholder: '0 808 80 00 50',
							className: 'phone-pill has-prefix--Phone ds-heading-2',
						}]
					]
				],
				['core/paragraph', {
					className: 'contact-hours ds-text-paragraph',
					content: 'De 9h00 à 18h00, du lundi au vendredi<br/>Service gratuit + prix appel'
				}],
				['core/paragraph', {
					className: 'contact-mail ds-text-paragraph',
					content: 'Depuis l’étranger : <a href="mailto:clients@citeo.com">clients@citeo.com</a>'
				}]
			]
		],
	];

	const ALLOWED_BLOCKS = ['core/group'];

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
		allowedBlocks: ALLOWED_BLOCKS,
		templateLock: false
	});

	if (preview) return <img src={previewImg} alt="Preview" />;

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

					{theme !== 'ds-subtheme-group' && (
                        <SelectControl
                            label={'Thème secondaire'}
                            value={subTheme}
                            options={ENV_LIST.find(el => el.value === theme)?.subThemes}
                            onChange={(value) => setAttributes({ subTheme: value })}
                        />
                    )}
                    
                </PanelBody>            
            </InspectorControls>

			<section {...innerBlocksProps} />
		</>
	);
}
