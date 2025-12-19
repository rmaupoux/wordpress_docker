import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, ToggleControl } from "@wordpress/components";
import { useEffect } from 'react';

import { ENV_LIST } from '../../../assets/env-list';
import '../scss/editor.scss';
import previewImg from '/assets/img/chiffres_clefs.png';

export default function Edit({ attributes, setAttributes }) {
	const { preview, theme, themeSwapConfirm, textSize } = attributes

	const blockProps = useBlockProps({
		className: `${theme}`
	});

    useEffect(() => {
        const CURRENT_ENV = ENV_LIST.find(el => Array.from(document.body.classList).includes(el.value))
        
        if(CURRENT_ENV && !theme) {
            setAttributes( {theme: CURRENT_ENV.value} );
        }
    }, []);

	const TEMPLATE = [
        ['core/group', {
            metadata: { name: __('Conteneur de textes', 'b2b') },
            className: 'box-media-wrapper',
            allowedBlocks: []
        },
            [
                ['core/group', {
                    metadata: { 
                        name: __('Titre de section', 'b2b') 
                    },
                    className: 'ttl-wrap',
                    allowedBlocks: []
                },
                    [
                        ['b2b/title-description-button', {
                            textSize: 'ds-text-large',
                            hasTags: true
                        }],
                    ]
                ],
                ['core/group', {
                    metadata: { 
                        name: __('Conteneur de chiffre clé', 'b2b') 
                    },
                    className: 'box-media-stat-wrapper',
                    allowedBlocks: []
                },
                    [
                        ['citeo-semantic/horizontal-slider', {
                            allowedBlocks: ['b2b/number-card'],
                            isInfinite: false,
                            isDraggable: true,
                            step: 1,
                            hasStepper: false,
                            hasTotal: false,
                            hasControls: false,
                            isAuto: false,
                            isRandom: false
                        },
                            [
                                ['b2b/number-card', {}],
                                ['b2b/number-card', {}],
                                ['b2b/number-card', {}]
                            ]
                        ]
                    ]
                ]
            ]
        ],
        ['core/group', {
            className: 'box-embed-img',
            allowedBlocks: ['core/image', 'core/embed'],
            metadata: { 
                name: __('Conteneur de video/image', 'b2b') 
            },
        },
            [
                ['core/embed', {}]
            ]
        ]
    ];

	const ALLOWED_BLOCKS = [];

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
                            }}
                        />
                    )}
                    
                </PanelBody>            
            </InspectorControls>
            
            <section {...blockProps}>
                <div className="large-align-block">
                    <InnerBlocks
                        template={TEMPLATE}
                        allowedBlocks={ALLOWED_BLOCKS}
                        templateLock={false}
                    />
                </div>
            </section>
		</>
	);
}
