import { useBlockProps, InspectorControls, useInnerBlocksProps } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl, PanelRow } from "@wordpress/components";

import '../scss/editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const { slideTimer, allowedBlocks, hasStepper, hasTotal, hasControls } = attributes;

	const blockProps = useBlockProps({
		className: 'slider-wrap'
	});

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		allowedBlocks: allowedBlocks,
		templateLock: false
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={'Paramètres du carousel'}>
					<PanelRow>
						<ToggleControl
							__nextHasNoMarginBottom
							label="Carousel avec puces"
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
					<RangeControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={ "Délai entre chaque carte" }
						help={'En seconde, par carte'}
						value={ slideTimer }
						onChange={ (val) => setAttributes( { slideTimer: val } ) }
						min={ 2 }
						max={ 15 }
						step={ 0.5 }
					/>	
				</PanelBody>
			</InspectorControls>
			
			<div className='has-fade-slider'>
				<div {...innerBlocksProps} />
				
				{hasStepper && 
					<div className='stepper-wrap'/>
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
