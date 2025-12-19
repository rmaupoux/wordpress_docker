import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, ToggleControl } from "@wordpress/components";
import { useEffect } from 'react';

import { ENV_LIST } from '../../../assets/env-list';

import '../scss/editor.scss';
import previewImg from '/assets/img/block-texte-image-2.jpg';

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
		['ds-citeocom/block-article']
	];

	const ALLOWED_BLOCKS = ['ds-citeocom/block-article'];
	
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
