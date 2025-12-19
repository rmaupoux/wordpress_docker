import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';

import { ENV_LIST } from '../../../assets/env-list';
import '../scss/editor.scss';
import { useEffect } from 'react';

import previewImg from '/assets/img/section-support.jpg';

export default function Edit({ attributes, setAttributes }) {
    const { preview, theme, subTheme } = attributes;
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
        ['b2b/page-title-button', {
            hasButton: false
        }]
    ];

    if (preview) {
        return (
            <>
                <img src={previewImg} alt="Preview" />
            </>
        );
    }

    return (
        <>
            {theme !== 'ds-subtheme-group' && (
				<InspectorControls>
					<PanelBody title={'Choix du sous-thème'} initialOpen={true}>					
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
			)}
        
            <section {...blockProps} >
                <InnerBlocks 
                    template={ TEMPLATE }
                />

                <div className='site-picto' />
            </section>
        </>
    );
}