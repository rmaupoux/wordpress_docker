import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/*
* Copy and paste what you had in your previous save.js here
*/
const v5 = {
    attributes: {
        "isInfinite" : {
			"type": "boolean",
			"default": false
		},
		"isDraggable" : {
			"type": "boolean",
			"default": true
		},
		"step" : {
			"type": "integer",
			"default": 1
		},
		"hasStepper" : {
			"type": "boolean",
			"default": false
		},
		"stepperType" : {
			"type": "string",
			"default": "none"
		},
		"hasControls": {
			"type": "boolean",
			"default": true
		},
		"allowedBlocks": {
			"type": "array"
		},
		"isAuto": {
			"type": "boolean",
			"default": false
		},
		"autoDir": {
			"type": "string",
			"default": "left"
		},
		"speed": {
			"type": "number",
			"default": 3
		},
		"isRandom": {
			"type": "boolean",
			"default": false
		}
    },

    save ({ attributes }) {  
        const { isInfinite, isDraggable, step, hasStepper, stepperType, hasControls, isAuto, speed, autoDir, isRandom } = attributes

		const blockProps = useBlockProps.save({
			className: 'has-horizontal-slider'
		});	

		return (
			<div {...blockProps} data-draggable={isDraggable} data-infinite={isInfinite} data-step={step ? step : 1} data-stepper={hasStepper} data-stepper-type={hasStepper ? stepperType : null} data-is-auto={isInfinite ? isAuto : null} data-speed={isAuto ? speed : null} data-auto-dir={isAuto ? autoDir : null} data-is-random={isRandom}>
				<div className='slider-wrap'>
					<InnerBlocks.Content />
				</div>
				
				{hasStepper && 
					<div className='stepper-wrap' />
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
    },
}

const v4 = {
    attributes: {
        "isInfinite" : {
			"type": "boolean",
			"default": false
		},
		"isDraggable" : {
			"type": "boolean",
			"default": true
		},
		"step" : {
			"type": "integer",
			"default": 1
		},
		"hasStepper" : {
			"type": "boolean",
			"default": false
		},
		"stepperType" : {
			"type": "string",
			"default": "none"
		},
		"hasControls": {
			"type": "boolean",
			"default": true
		},
		"allowedBlocks": {
			"type": "array"
		},
		"isAuto": {
			"type": "boolean",
			"default": false
		},
		"autoDir": {
			"type": "string",
			"default": "left"
		},
		"speed": {
			"type": "number",
			"default": 3
		},
		"isRandom": {
			"type": "boolean",
			"default": false
		}
    },

    save ({ attributes }) {  
        const { isInfinite, isDraggable, step, hasStepper, stepperType, hasControls, isAuto, speed, autoDir, isRandom } = attributes

		const blockProps = useBlockProps.save({
			className: 'has-horinzontal-slider'
		});	

		return (
			<div {...blockProps} data-draggable={isDraggable} data-infinite={isInfinite} data-step={step ? step : 1} data-stepper={hasStepper} data-stepper-type={hasStepper ? stepperType : null} data-is-auto={isInfinite ? isAuto : null} data-speed={isAuto ? speed : null} data-auto-dir={isAuto ? autoDir : null} data-is-random={isRandom}>
				<div className='slider-wrap'>
					<InnerBlocks.Content />
				</div>
				
				{hasStepper && 
					<div className='stepper-wrap' />
				}

				{hasControls && 
					<div class="wp-block-buttons slider-controls">
						<div class="wp-block-button prev-slide is-style-secondary no-text has-suffix--Arrow-left">
							<a class="wp-block-button__link wp-element-button" />
						</div>
						<div class="wp-block-button next-slide is-style-primary no-text has-suffix--Arrow-right">
							<a class="wp-block-button__link wp-element-button" />
						</div>
					</div>
				}
			</div>
		);
    },
}

const v3 = {
    attributes: {
        "isInfinite" : {
			"type": "boolean",
			"default": false
		},
		"isDraggable" : {
			"type": "boolean",
			"default": true
		},
		"step" : {
			"type": "integer",
			"default": 1
		},
		"hasStepper" : {
			"type": "boolean",
			"default": false
		},
		"stepperType" : {
			"type": "string",
			"default": "none"
		},
		"hasControls": {
			"type": "boolean",
			"default": true
		},
		"allowedBlocks": {
			"type": "array"
		},
		"isAuto": {
			"type": "boolean",
			"default": false
		},
		"autoDir": {
			"type": "string",
			"default": "left"
		},
		"speed": {
			"type": "number",
			"default": 3
		},
		"isRandom": {
			"type": "boolean",
			"default": false
		}
    },

    save ({ attributes }) {  
        // const [stepperDOM, setStepperDOM] = useState([])
	    // const ref = useRef(); 
        const { isInfinite, isDraggable, step, hasStepper, stepperType, hasControls, isAuto, speed, autoDir, isRandom } = attributes

        const blockProps = useBlockProps.save({
            className: 'has-horinzontal-slider'
        });	

        return (
            <div {...blockProps} data-draggable={isDraggable} data-infinite={isInfinite} data-step={step} data-stepper={hasStepper} data-stepper-type={stepperType} data-is-auto={isAuto} data-speed={speed} data-auto-dir={autoDir} data-is-random={isRandom}>
                <div className='slider-wrap'>
                    <InnerBlocks.Content />
                </div>
                
                {hasStepper && 
                    <div className='stepper-wrap' />
                }

                {hasControls && 
                    <div class="wp-block-buttons slider-controls">
                        <div class="wp-block-button prev-slide is-style-secondary no-text has-suffix--Arrow-left">
                            <a class="wp-block-button__link wp-element-button" />
                        </div>
                        <div class="wp-block-button next-slide is-style-primary no-text has-suffix--Arrow-right">
                            <a class="wp-block-button__link wp-element-button" />
                        </div>
                    </div>
                }
            </div>
        );
    },
}

const v2 = {
    attributes: {
        "isInfinite" : {
			"type": "boolean",
			"default": false
		},
		"isDraggable" : {
			"type": "boolean",
			"default": true
		},
		"step" : {
			"type": "integer",
			"default": 1
		},
		"hasStepper" : {
			"type": "boolean",
			"default": false
		},
		"stepperType" : {
			"type": "string",
			"default": "none"
		},
		"hasControls": {
			"type": "boolean",
			"default": true
		},
		"allowedBlocks": {
			"type": "array"
		}
    },

    save ({ attributes }) {   
        // const [stepperDOM, setStepperDOM] = useState([])
        // const ref = useRef();
        const { isInfinite, isDraggable, step, hasStepper, stepperType, hasControls } = attributes

        const blockProps = useBlockProps.save({
            className: 'has-horizontal-slider'
        });	

        return (
            <div {...blockProps} data-draggable={isDraggable} data-infinite={isInfinite} data-step={step} data-stepper={hasStepper} data-stepper-type={stepperType} >
                <div className='slider-wrap'>
                    <InnerBlocks.Content />
                </div>
                
                {hasStepper && 
                    <div className='stepper-wrap' />
                }

                {hasControls && 
                    <div class="wp-block-buttons slider-controls">
                        <div class="wp-block-button prev-slide is-style-secondary no-text has-suffix--Arrow-left">
                            <a class="wp-block-button__link wp-element-button" />
                        </div>
                        <div class="wp-block-button next-slide is-style-primary no-text has-suffix--Arrow-right">
                            <a class="wp-block-button__link wp-element-button" />
                        </div>
                    </div>
                }
            </div>
        );
    },
}

const v1 = {
    attributes: {
        "isInfinite" : {
			"type": "boolean",
			"default": false
		},
		"isDraggable" : {
			"type": "boolean",
			"default": true
		},
		"step" : {
			"type": "integer",
			"default": 1
		},
		"hasStepper" : {
			"type": "boolean",
			"default": false
		},
		"stepperType" : {
			"type": "string",
			"default": "none"
		},
		"hasControls": {
			"type": "boolean",
			"default": true
		},
		"allowedBlocks": {
			"type": "array"
		}
    },

    save ({ attributes }) {   
        // const [stepperDOM, setStepperDOM] = useState([])
        // const ref = useRef();
        const { isInfinite, isDraggable, step, hasStepper, stepperType, hasControls } = attributes

        const blockProps = useBlockProps.save({
            className: 'has-slider'
        });	

        return (
            <div {...blockProps} data-draggable={isDraggable} data-infinite={isInfinite} data-step={step} data-stepper={hasStepper} data-stepper-type={stepperType} >
                <div className='slider-wrap'>
                    <InnerBlocks.Content />
                </div>
                
                {hasStepper && 
                    <div className='stepper-wrap' />
                }

                {hasControls && 
                    <div class="wp-block-buttons slider-controls">
                        <div class="wp-block-button prev-slide is-style-secondary no-text has-suffix--Arrow-left">
                            <a class="wp-block-button__link wp-element-button" />
                        </div>
                        <div class="wp-block-button next-slide is-style-primary no-text has-suffix--Arrow-right">
                            <a class="wp-block-button__link wp-element-button" />
                        </div>
                    </div>
                }
            </div>
        );
    },
}

// Latest version first in the array 
export default [ v5, v4, v3, v2, v1 ];