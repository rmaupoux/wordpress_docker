import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/*
* Copy and paste what you had in your previous save.js here
*/

const v2 = {
    attributes: {
        "preview": {
			"type": "boolean",
			"default": false
		},
		"theme": {
            "type": "string",
            "default": ""
        },
        "themeSwapConfirm": {
            "type": "boolean",
            "default": false
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

    save({ attributes }) {
        const { theme } = attributes

        const blockProps = useBlockProps.save({
            className: `${theme}`
        });

        return (
            <section {...blockProps}>
                <InnerBlocks.Content />
            </section>
        );
    }
}

const v1 = {
    attributes: {
        "preview": {
			"type": "boolean",
			"default": false
		}
    },

    save() {
        const blockProps = useBlockProps.save({
            className: `article-section`
        });

        return (
            <section {...blockProps}>
                <InnerBlocks.Content />
            </section>
        );
    }
}

// Latest version first in the array 
export default [ v2, v1 ];