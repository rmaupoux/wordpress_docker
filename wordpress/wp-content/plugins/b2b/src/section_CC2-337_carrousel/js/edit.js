import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, ToggleControl, Button } from "@wordpress/components";
import { useEffect } from 'react';

import { illustrations_list } from '../../../../citeo-semantic/assets/utils';
import { ENV_LIST } from '../../../assets/env-list';

import '../scss/editor.scss';
import previewImg from '/assets/img/section_carrousel.png';

export default function Edit({ attributes, setAttributes }) {
    const { preview, backgroundPictoUrl, theme, subTheme, themeSwapConfirm, hasWhitePicto } = attributes

    // Add a reset entry to the option list
    illustrations_list.Aucun = '';
    const sortedKeys = Object.keys(illustrations_list).sort((a, b) => {
        if (a === "Aucun") return -1;
        if (b === "Aucun") return 1;
        return a.localeCompare(b)
    });

    const blockProps = useBlockProps({
        className: `${theme} ${subTheme}${hasWhitePicto ? ' has-white-picto' : ''}`
    });

    const TEMPLATE = [
        ['b2b/title-description-button', {
            noDesc: true,
        }],
        ['citeo-semantic/horizontal-slider', {
            lock: {
                remove: true
            },
            allowedBlocks: ['b2b/card'],
            isInfinite: false,
            isDraggable: true,
            step: 1,
            hasStepper: false,
            hasTotal: true,
            hasControls: true,
            isAuto: false,
            isRandom: false
        }, 
            [
                ['b2b/card', {
                    className: 'image-card',
                    hasTags: false,
                    hasImage: true,
                }],
                ['b2b/card', {
                    className: 'image-card',
                    hasTags: false,
                    hasImage: true,
                }],
                ['b2b/card', {
                    className: 'image-card',
                    hasTags: false,
                    hasImage: true,
                }]
            ]
        ]
    ];

    const ALLOWED_BLOCKS = ['b2b/title-description-button'];

    useEffect(() => {
        const CURRENT_ENV = ENV_LIST.find(el => Array.from(document.body.classList).includes(el.value))
        
        if(CURRENT_ENV && !theme) {
            setAttributes( {theme: CURRENT_ENV.value} );
        }

        if(!backgroundPictoUrl) {
            setAttributes({ backgroundPictoUrl: illustrations_list.Boite });
        }
    }, []);

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
            <section {...blockProps}>
                <div className='back-picto' style={{maskImage: `url(${backgroundPictoUrl})`}} />
                <InnerBlocks 
                    template={TEMPLATE}
                    allowedBlocks={ALLOWED_BLOCKS}
                />
            </section>
        </>
    );
}
