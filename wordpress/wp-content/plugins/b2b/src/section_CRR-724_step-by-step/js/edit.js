import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, ToggleControl } from "@wordpress/components";
import { useDispatch } from '@wordpress/data';

import { useRef, useEffect } from 'react';

import { ENV_LIST } from '../../../assets/env-list';

import '../scss/editor.scss';
import previewImg from '/assets/img/section-step-by-step.jpg';

export default function Edit({ attributes, setAttributes }) {
	const ref = useRef(null);
	const { preview, theme, subTheme, themeSwapConfirm } = attributes

	const { updateBlockAttributes } = useDispatch('core/block-editor');

	const TEMPLATE = [
		['b2b/title-description-button', {
			hasTags: true,
			noDesc: true
		}],
		['citeo-semantic/horizontal-slider', {
			allowedBlocks: ['b2b/block-step'],
			isInfinite: false,
            isDraggable: true,
            step: 1,
            hasStepper: false,
            hasTotal: true,
            hasControls: true,
            isAuto: false,
            isRandom: false,
			lock: {
				move: true,
				remove: true
			}
		},
			[
				['b2b/block-step', {
					stepIndex: '1'
				}],
				['b2b/block-step', {
					stepIndex: '2'
				}],
				['b2b/block-step', {
					stepIndex: '3'
				}],
			]
		]
	];

	const ALLOWED_BLOCKS = [];

	const blockProps = useBlockProps({
		className: `${theme} ${subTheme}`
	});

	const initSliderObserver = (sliderWrap) => {

		const mutationObserver = new MutationObserver(entries => {
			for (const entry of entries) {
				const steps = [...entry.target.children];

				steps.forEach((step, i) => {
					if (!step.classList.contains('wp-block-b2b-block-step')) return;

					const clientId = step.dataset.block;
					const index = i + 1;

					if (clientId) {
						updateBlockAttributes(clientId, { stepIndex: index.toString() });
					}
				});
			}
		});

		mutationObserver.observe(sliderWrap, { childList: true });
	}

	useEffect(() => {
		const wrapper = ref.current;

		if(!wrapper) return;
		const waitForSlider = new MutationObserver(() => {
			const sliderWrap = wrapper.querySelector('.slider-wrap');
			if (sliderWrap) {
				waitForSlider.disconnect();
				initSliderObserver(sliderWrap);
			}
		});

		waitForSlider.observe(wrapper, { childList: true, subtree: true });

    	return () => waitForSlider.disconnect();
	}, [ref.current]);

	useEffect(() => {
        const CURRENT_ENV = ENV_LIST.find(el => Array.from(document.body.classList).includes(el.value))
        
        if(CURRENT_ENV && !theme) {
            setAttributes( {theme: CURRENT_ENV.value} );
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
								setAttributes({ subTheme: 'subtheme-accent1' });
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

			<section {...blockProps} ref={ref}>
				<InnerBlocks
					template={TEMPLATE}
					allowedBlocks={ALLOWED_BLOCKS}
				/>
			</section>
		</>
	);
}
