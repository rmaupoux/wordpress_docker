import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/*
* Copy and paste what you had in your previous save.js here
*/

const v1 = {
    attributes: {
		"allowResize": {
            "type": "boolean",
            "default": false
        },
        "preview": {
            "type": "boolean",
            "default": false
        },
        "align": {
			"type": "string",
			"default": "full"
		}
	},

    save({ }) {
        const blockProps = useBlockProps.save({});

        return (
            <section {...blockProps}>
                <InnerBlocks.Content />

                <div className='site-picto' />
            </section>
        );
    }
}

// Latest version first in the array 
export default [ v1 ];