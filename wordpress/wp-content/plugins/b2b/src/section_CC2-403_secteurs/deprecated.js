import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/*
* Copy and paste what you had in your previous save.js here
*/

const v1 = {
    attributes: {
		"clientId": {
			"type": "string"
		},
		"preview": {
			"type": "boolean",
			"default": false
    	}
	},

    save() {    
        const classList = `sector-section`

        const blockProps = useBlockProps.save({
            className: classList
        })

        const innerBlocksProps = useInnerBlocksProps.save(blockProps)

        return (
            <div {...innerBlocksProps} />
        );
    }
}

// Latest version first in the array 
export default [ v1 ];