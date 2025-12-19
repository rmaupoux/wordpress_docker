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
		"hasIcon": {
			"type": "boolean",
			"default": false
		},
		"theme": {
            "type": "string"
        },
        "subTheme": {
            "type": "string",
            "default": "default"
        }
    },

    migrate(attributes) {
		const legacyToNewMap = {
			'groupe-citeo': 'ds-subtheme-group',
			'citeo-pro': 'ds-subtheme-pro',
			'citeo-emp': 'ds-subtheme-emp',
			'citeo-sh': 'ds-subtheme-sh',
		};

		return {
			...attributes,
			theme: legacyToNewMap[attributes.theme] || attributes.theme
		};
	},

    save ({ attributes }) {
        const { theme, subTheme } = attributes

        const blockProps = useBlockProps.save({
            className: `${theme} ${subTheme ? subTheme : ''}`
        });

        return (
            <div {...blockProps}>
                <InnerBlocks.Content />
            </div>		
        );
    }
}

// Latest version first in the array 
export default [ v1 ];