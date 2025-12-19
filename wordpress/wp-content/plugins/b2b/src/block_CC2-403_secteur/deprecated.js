import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/*
* Copy and paste what you had in your previous save.js here
*/

const v1 = {
    attributes: {
        "allowResize": {
			"type": "boolean"
		},
		"uuid": {
			"type": "string"
		}
	},

    save( attributes ) {    
        const classList = `secteur-grid`
        const { uuid } = attributes

        const blockProps = useBlockProps.save({
            className: classList
        })

        const innerBlocksProps = useInnerBlocksProps.save(blockProps)

        return (
            <div data-id={uuid} {...innerBlocksProps} />
        );
    }
}

// Latest version first in the array 
export default [ v1 ];