import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { isInfinite, isDraggable, step, hasStepper, stepperType, hasControls, isAuto, speed, autoDir, isRandom, hasTotal } = attributes

	const blockProps = useBlockProps.save({
		className: 'has-horizontal-slider'
	});	

	return (
		<div {...blockProps} data-draggable={isDraggable} data-infinite={isInfinite} data-step={step ? step : 1} data-stepper={hasStepper} data-stepper-type={hasStepper ? stepperType : null} data-is-auto={isInfinite ? isAuto : null} data-speed={isAuto ? speed : null} data-auto-dir={isAuto ? autoDir : null} data-is-random={isRandom} data-total={hasTotal}>
			<div className='slider-wrap'>
				<InnerBlocks.Content />
			</div>
			
			{hasStepper && 
				<div className='stepper-wrap' />
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
	);
}

