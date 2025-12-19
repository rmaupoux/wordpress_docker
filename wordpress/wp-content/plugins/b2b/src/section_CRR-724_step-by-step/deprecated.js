import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import save from './js/save';

/*
* Copy and paste what you had in your previous save.js here
*/

const v1 = {
    attributes: {
        "preview": {
			"type": "boolean",
			"default": false
		}
    },

    save() {

        const blockProps = useBlockProps.save({
            className: `step-by-step-section has-slider`
        });

        return (
            <section {...blockProps}>
                <InnerBlocks.Content />
            </section>
        );

    }
}

// Latest version first in the array 
export default [ v1 ];