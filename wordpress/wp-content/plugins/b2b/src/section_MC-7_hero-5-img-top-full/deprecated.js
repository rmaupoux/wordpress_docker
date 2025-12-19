import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/*
* Copy and paste what you had in your previous save.js here
*/

const v1 = {
    attributes: {
		"preview": {
			"type": "boolean",
			"default": false
		},
		 "heroImgPosition": {
			"type": "string",
			"default": "hero-img-center"
		},
		"align": {
			"type": "string",
			"default": "full"
		},
	},

    save({ }) {
        const blockProps = useBlockProps.save({});

        return (
            <section {...blockProps}>
                <InnerBlocks.Content />
            </section>
        );
    }
}

// Latest version first in the array 
export default [ v1 ];