import { useBlockProps, useInnerBlocksProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import '../scss/editor.scss';

import { ENV_LIST } from '../../../assets/env-list';
import previewImg from '/assets/img/section-hero-slider.jpg';
import { useEffect } from 'react';

export default function Edit({ attributes, setAttributes }) {
	const { preview, theme, subTheme } = attributes

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
		}],
		['citeo-semantic/fade-slider-wrap', {
			metadata: {
				name: 'Carousel d\'images'
			},
			allowedBlocks: ['b2b/card'],
			hasStepper: true,
			hasControls: true,
			hasTotal: true,
			slideTimer: 8
		}, 
			[
				['b2b/card', {
					className: 'is-active',
					hasImage: true,
					hasTags: true
				}],
				['b2b/card', {
					hasImage: true,
					hasTags: true
				}],
				['b2b/card', {
					hasImage: true,
					hasTags: true
				}]
			],
		]
	];

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
		allowedBlocks: []
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

			<section {...innerBlocksProps} />
		</>
	);
}
