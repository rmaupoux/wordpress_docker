import { useBlockProps, InnerBlocks, useInnerBlocksProps } from '@wordpress/block-editor';

/*
* Copy and paste what you had in your previous save.js here
*/
const v1 = {
    attributes: {
        "slideTimer": {
			"type": "number",
			"default": 5
		},
		"allowedBlocks": {
			"type": "array"
		}
    },

    save ({ attributes }) {  
        const { slideTimer } = attributes
	
		const blockProps = useBlockProps.save({
			className: "fade-slider-wrap"
		})

		const innerBlocksProps = useInnerBlocksProps.save(blockProps)

		return (
			<>
				<div { ...innerBlocksProps } data-timer={slideTimer} />	
			</>	
		);
    },
}

// Latest version first in the array 
export default [ v1 ];