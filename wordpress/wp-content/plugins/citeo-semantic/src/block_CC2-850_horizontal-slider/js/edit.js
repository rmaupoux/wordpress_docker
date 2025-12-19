import { useBlockProps, useInnerBlocksProps, InspectorControls } from '@wordpress/block-editor';
import { ToggleControl, RangeControl, PanelBody, PanelRow, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from "@wordpress/components";
import { useRef, useEffect, useState } from 'react';
import '../scss/editor.scss';

import { calculateItemsInView } from '../../../assets/slider'

export default function Edit({ attributes, setAttributes }) {
	const [stepperDOM, setStepperDOM] = useState([])
	const ref = useRef(null);

	// Step supports integer only, stepperType can be anything but will display slide number if set to 'num'
	const { isInfinite, isDraggable, step, hasStepper, stepperType, hasControls, allowedBlocks, isRandom, isAuto, speed, autoDir, hasTotal } = attributes

	const stepperClass = `step-${stepperType} step-index`

	const toggleControls = (slider) => {
		if(slider) {		
			const slides = slider.children
			const controls = ref.current.querySelector('.slider-controls')

			const itemsInView = calculateItemsInView(0, slider)
			if(hasControls) slides && slides.length > itemsInView ? controls.style.display = 'flex' : controls.style.display = 'none'
		}
	};
	
	const createStepper = (wrap) => {
		const sliderItems = wrap.children

		if(sliderItems && sliderItems.length > 0) {
			const stepperList = [...sliderItems].map((_, i) => {
				return (
					<span className={stepperClass}>{stepperType === 'num' && i + 1}</span>
				)
			});
	
			setStepperDOM(stepperList);
		}
	}

	// Add/show non editable controls in the editor and create stepper DOM
	useEffect(() => {

		const mutationObserver = new MutationObserver((entries) => {
			for (const entry of entries) {	
				if(hasControls) toggleControls(entry.target);

				if(hasStepper) {
					createStepper(entry.target);
				}
			}
		});

		if (ref.current) {
			const slideWrapper = ref.current.querySelector('.slider-wrap');

			if(slideWrapper) {
				mutationObserver.observe(slideWrapper, { childList: true });

				if(hasStepper) {
					createStepper(slideWrapper);
				}
			}			

		}		
		
	}, [ref, hasStepper]);

	const blockProps = useBlockProps({
		className: 'slider-wrap'
	});

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		allowedBlocks: allowedBlocks
	});

	// Block attributes are hidden so far, so they can only be contributed at the bloc creation from a TEMPLATE call but could easily be added as shown block parameters.
	return (		
		<>
			<InspectorControls>
				<PanelBody title={"Paramétrage carousel"}>
					<PanelRow>
						<ToggleControl
							__nextHasNoMarginBottom
							label="Infini ?"
							help={
								isInfinite
									? 'Carousel infini.'
									: 'Carousel avec butées.'
							}
							checked={ isInfinite }
							onChange={(val) => {
								setAttributes( { isInfinite: val } );
							}}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							__nextHasNoMarginBottom
							label="Est intéractif ?"
							help={
								isDraggable
									? 'Carousel intéractif à la main.'
									: 'Carousel pas intéractif.'
							}
							checked={ isDraggable }
							onChange={(val) => {
								setAttributes( { isDraggable: val } );
							}}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							__nextHasNoMarginBottom
							label="Total de cartes"
							help={
								hasTotal
									? 'Montre le nombre total de cartes dans le carousel.'
									: 'Cache le total de cartes dans le carousel.'
							}
							checked={ hasTotal }
							onChange={(val) => {
								setAttributes( { hasTotal: val } );
							}}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							__nextHasNoMarginBottom
							label="Puces de carousel ?"
							help={
								hasStepper
									? 'Carousel avec puces.'
									: 'Carousel sans puces.'
							}
							checked={ hasStepper }
							onChange={(val) => {
								setAttributes( { hasStepper: val } );
							}}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							__nextHasNoMarginBottom
							label="Boutons de contrôles ?"
							help={
								hasControls
									? 'Avec boutons de contrôles'
									: 'Sans boutons de contrôles'
							}
							checked={ hasControls }
							onChange={(val) => {
								setAttributes( { hasControls: val } );
							}}
						/>
					</PanelRow>
					{isInfinite && (
						<>
						<PanelRow>
							<ToggleControl
								label="Défilement automatique ?"
								help={
									isRandom
										? 'Carousel automatique.'
										: 'Carousel manuel.'
								}
								checked={ isAuto }
								onChange={(val) => {
									setAttributes( { isAuto: val } );
								}}
							/>
						</PanelRow>

							{isAuto && (
								<>
									<RangeControl
										__nextHasNoMarginBottom
										label="Vitesse de défilement"
										help={'En seconde, par carte'}
										value={ speed }
										onChange={ ( val ) => setAttributes( { speed: val } ) }
										min={ 2 }
										max={ 15 }
										step={0.5}
									/>

									<PanelRow>
										<ToggleGroupControl
											__nextHasNoMarginBottom
											label="Direction du défilement"
											value={ autoDir }
											onChange={ (val) => setAttributes({autoDir: val})}
										>
											<ToggleGroupControlOption 
												value="left" 
												label="Gauche" 
												aria-label = {'Carousel défile vers la gauche'}
												showTooltip = { true }
											/>
											<ToggleGroupControlOption
												value="right"
												label="Droite"
												aria-label = {'Carousel défile vers la droite'}
												showTooltip = {true}
											/>
										</ToggleGroupControl>
									</PanelRow>
								</>
							)}
						</>
					)}					
					<PanelRow>
						<ToggleControl
							__nextHasNoMarginBottom
							label="Aléatoire ?"
							help={
								isRandom
									? 'Carousel aléatoire.'
									: 'Carousel fixe.'
							}
							checked={ isRandom }
							onChange={(val) => {
								setAttributes( { isRandom: val } );
							}}
						/>
					</PanelRow>
				</PanelBody>					
			</InspectorControls>

			<div className='has-horizontal-slider' ref={ref}>
				<div {...innerBlocksProps}>
				</div>
				
				{hasStepper && 
					<div className='stepper-wrap'>
						{stepperDOM}
					</div>
				}

				{hasTotal && 
					<div className='total-wrap'></div>
				}

				{hasControls && 
					<div class="wp-block-buttons slider-controls">
						<div class="wp-block-button prev-slide is-style-secondary no-text has-suffix--Chevron-right">
							<a class="wp-block-button__link wp-element-button" />
						</div>
						<div class="wp-block-button next-slide is-style-primary no-text has-suffix--Chevron-right">
							<a class="wp-block-button__link wp-element-button" />
						</div>
					</div>
				}
			</div>
		</>
	);
}
