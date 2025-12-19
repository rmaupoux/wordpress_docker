
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { slideTimer, hasStepper, hasTotal, hasControls } = attributes
	
	const blockProps = useBlockProps.save({
		className: 'has-fade-slider'
	})
	return (
		<div {...blockProps}>
			<div className="slider-wrap" data-timer={slideTimer} data-stepper={hasStepper} data-total={hasTotal}>
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
