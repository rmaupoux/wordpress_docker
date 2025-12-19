import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { ToggleControl, PanelBody, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import '../scss/editor.scss';

import { ENV_LIST } from '../../../assets/env-list';
import previewImg from '/assets/img/entete-presentation-cible.jpg';
import { useEffect } from 'react';

export default function Edit({ attributes, setAttributes }) {
    const { preview, hasWhiteBackground, theme, subTheme } = attributes;
    
    const blockProps = useBlockProps({
        className: `${hasWhiteBackground ? 'bg-white' : ''} ${theme} ${subTheme}`
    });

    useEffect(() => {
        const CURRENT_ENV = ENV_LIST.find(el => Array.from(document.body.classList).includes(el.value))

        if(CURRENT_ENV && !theme) {
            setAttributes( {theme: CURRENT_ENV.value} );
        }
    }, []);
    
    const TEMPLATE = [
        ['core/group', {
            metadata: {
                name: 'Conteneur d\'alignement'
            },
            layout: {
                type: 'flex'
            },
            className: 'content-wrap',
            allowedBlocks: ['core/image', 'b2b/page-title-button']
        }, 
            [
                ['b2b/page-title-button'],
                ['core/image']
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
                <PanelBody title={__('Choix du sous-thème', 'b2b')} initialOpen={true}>
                    <ToggleControl
                        label={__('Fond blanc', 'b2b')}
                        checked={hasWhiteBackground}
                        onChange={() => setAttributes({ hasWhiteBackground: !hasWhiteBackground })}
                    />
					
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
            <section {...blockProps}>
                <InnerBlocks
                    template={TEMPLATE}
                    allowedBlocks={ALLOWED_BLOCKS}
                />
            </section>
        </>
    );
}