import { __ } from '@wordpress/i18n';

import { useBlockProps, InspectorControls, InnerBlocks, MediaUpload } from '@wordpress/block-editor';
import { PanelBody, PanelRow, Button, RadioControl, ToggleControl, SelectControl } from '@wordpress/components';
import { useEffect } from 'react';

import { ENV_LIST } from '../../../assets/env-list';

import '../scss/editor.scss';
import previewImg from '/assets/img/section-picto.jpg';
// import previewImg from '/assets/img/block-cartes-reglementaires.jpg';

export default function Edit({ attributes, setAttributes }) {
    const {
        preview,
        iconPosition = 'left',
        theme,
        subTheme,
        svgUrl,
        svgContent,
        svgSpaceBoxWidth,
        themeSwapConfirm,
        useSvgAsBackground
            } = attributes;

    useEffect(() => {
        const CURRENT_ENV = ENV_LIST.find(el => Array.from(document.body.classList).includes(el.value))

        if(CURRENT_ENV && !theme) {
            setAttributes( {theme: CURRENT_ENV.value} );
        }
    }, []);

    useEffect(() => {
        if (svgUrl) {
            fetch(svgUrl)
                .then(res => res.text())
                .then(text => {
                    setAttributes({ svgContent: text })
                });
        } else {
            setAttributes({ svgContent: '' });
        }
    }, [svgUrl]);


    const getSvgDataUri = ( svgContent ) => {
        let svg = String(svgContent || '');

        const viewBoxSize = svg.match(/viewBox="(\d+)\s(\d+)\s(\d+)\s(\d+)"/)?.slice(1).map(Number);

        if(viewBoxSize) {
            const sizeX = viewBoxSize[2], sizeY = viewBoxSize[3]

            svg = svg.replace(
                /viewBox="[^"]*"/,
                `viewBox="0 0 ${6 * sizeX} ${1.5 * sizeY}"`
            );
        }

        return `url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}')`;
    }


    const backgroundStyle = useSvgAsBackground && svgContent
    ? {
        maskImage: `${getSvgDataUri(svgContent)}, ${getSvgDataUri(svgContent)}`,
        maskSize: `${svgSpaceBoxWidth}px ${svgSpaceBoxWidth / 2}px`,
        maskRepeat: 'repeat',
        maskPosition: `0 0, ${svgSpaceBoxWidth / 2}px ${svgSpaceBoxWidth / 4}px`,
        backgroundColor: 'var(--ds-semantic-color-accent1-surface-medium)'
    }
    : {};

    const TEMPLATE = [
        ['core/group', {
            metadata: { name: 'Conteneur d\'alignement' },
            layout: { type: 'flex' },
            className: useSvgAsBackground ? 'large-align-block content-wrap' : 'content-wrap',
            allowedBlocks: ['core/image', 'b2b/title-description-button']
        }, [
            ['b2b/title-description-button', {
                noDesc: true
            }],
        ]]
    ];

    const ALLOWED_BLOCKS = ['core/group', 'core/image'];

    const blockProps = useBlockProps({
        className: `text-img-wrap ${theme} ${subTheme}`
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

                <PanelBody title={__('Position de l\'icône', 'b2b')} initialOpen={true}>
                    <RadioControl
                        label="Position de l'icône"
                        selected={iconPosition}
                        options={[
                            { label: 'Gauche', value: 'left' },
                            { label: 'Droite', value: 'right' },
                            { label: 'Centre', value: 'center' }
                        ]}
                        onChange={(value) => setAttributes({ iconPosition: value })}
                    />
                </PanelBody>

                <PanelBody title={__('Changer l\'icône', 'b2b')} initialOpen={true}>

                    <MediaUpload
                        onSelect={(media) => {
                            setAttributes({	svgUrl: media.url });
                        }}
                        multiple={false}
                        title={'Choix du picto'}
                        render={({ open }) => (
                            <>
                                <button 
                                    onClick={open} 
                                    aria-label={'Téléversez votre picto'}
                                    style={{
                                        width: '100%',
                                        padding: 'var(--ds-semantic-spacing-s) var(--ds-semantic-spacing-xl)',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        borderRadius: '.5rem',
                                        border: 'none',
                                        background: 'var(--wp-admin-theme-color)',
                                        color: 'var(--ds-semantic-color-layout-invert-content-medium)',
                                        fontSize: 'var(--ds-core-typography-font-size-xs)'
                                    }}
                                >Choisir le pictrogramme</button>
                            </>
                        )}
                    />

                    {svgUrl && (
                        <>
                            <img src={svgUrl} style={{width: '100%', objectFit: 'contain', filter: 'brightness(0)'}} />
                            <Button
                                onClick={() => setAttributes({ svgUrl: undefined })}
                                variant="link"
                                isDestructive
                                style={{ marginTop: 'var(--ds-semantic-spacing-xs)', marginLeft: 'var(--ds-semantic-spacing-xs)' }}
                            >
                                {__('Supprimer le SVG', 'b2b')}
                            </Button>
                        </>
                    )}
                  
                    <div style={{ padding: 'var(--ds-semantic-spacing-m)',
                            }}
                    ></div>

                    <ToggleControl
                        label={__("Trame de fond", "b2b")}
                        checked={useSvgAsBackground}
                        onChange={value => setAttributes({ useSvgAsBackground: value })}
                        style={{ marginTop: 'var(--ds-semantic-spacing-m)' }}
                    />
                    
                    { useSvgAsBackground &&  (
                     <>
                        <div style={{ marginTop: 'var(--ds-semantic-spacing-xl)' }}>
                            <label>
                                {__('Zoom d\'arrière-plan', 'b2b')}
                                <input
                                    type="range"
                                    min={300}
                                    max={1200}
                                    value={svgSpaceBoxWidth}
                                    onChange={e => setAttributes({ svgSpaceBoxWidth: Number(e.target.value) })}
                                    style={{ width: 180, marginLeft: 8, marginTop: .5 }}
                                />
                            </label>
                        </div>
                    </>
                    )}
                </PanelBody>                
            </InspectorControls>

            <section {...blockProps}>
                <div
                    className={`chantier-flex ${iconPosition === 'right' ? 'flex-row-reverse' : 'flex-row'} ${iconPosition === 'center' ? 'flex-row-center' : ''} ${useSvgAsBackground ? 'chantier-flex--background' : ''}`}>
                    {useSvgAsBackground ? (
                        <div
                            className='picto-back-repeat'
                            style={backgroundStyle}
                        />
                    ) : (
                        <span
                            className='main-picto'
                            style={{
                                maskImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}')`
                            }}
                        />
                    )}

                    <InnerBlocks
                        template={TEMPLATE}
                        allowedBlocks={ALLOWED_BLOCKS}
                    />
                </div>
            </section>
        </>
    );
}


