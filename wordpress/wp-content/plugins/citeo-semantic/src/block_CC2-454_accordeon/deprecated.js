import { Fragment } from '@wordpress/element';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

/*
* Copy and paste what you had in your previous save.js here
*/

const v3 = {
    attributes: {
        "color": {
			"type": "string"
		},
		"isActive": {
			"type": "boolean",
			"default": false
		},
    },

    save({ attributes }) {
        const { color, isActive } = attributes
	
        const blockProps = useBlockProps.save({
            className: `accordeon-wrapper${color ? ` ${color}` : ''}${isActive ? ' is-active' : ''}`
        });

        return (
            <article {...blockProps}>
                <InnerBlocks.Content />
            </article>
        );
    }

}

const v2 = {
    attributes: {
        "color": {
			"type": "string"
		}
    },

    save({ attributes }) {
        const { color } = attributes
        
        const blockProps = useBlockProps.save({
            className: `accordeon-wrapper ${color && color}`
        });

        return (
            <article {...blockProps}>
                <InnerBlocks.Content />
            </article>
        );
    }

}

const v1 = {
    attributes: {
        "color": {
			"type": "string"
		}
    },

    save({ attributes }) {
        const { color } = attributes
        
        const blockProps = useBlockProps.save({
            className: `accordeon-wrapper ${color}`
        });

        return (
            <article {...blockProps}>
                <InnerBlocks.Content />
            </article>
        );
    }

}

// Latest version first in the array 
export default [ v3, v2, v1 ];