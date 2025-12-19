import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/*
* Copy and paste what you had in your previous save.js here
*/

// Version 2 : avec theme et subTheme
const v2 = {
    attributes: {
        "theme": {
            type: "string",
            default: "",
        },
        "subTheme": {
            type: "string",
            default: "",
        },
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
        const { theme, subTheme } = attributes;

        const blockProps = useBlockProps.save({
            className: `${theme} ${subTheme}`,
        });

        return (
            <section {...blockProps}>
                <div className="large-align-block">
                    <InnerBlocks.Content />
                </div>
            </section>
        );
    },
};

// Version 1 : uniquement box-media
const v1 = {
    attributes: {
        allowResize: {
            type: 'boolean',
            default: false,
        },
        preview: {
            type: 'boolean',
            default: false,
        },
    },
    save() {
        const blockProps = useBlockProps.save({
            className: `box-media`,
        });

        return (
            <section {...blockProps}>
                <InnerBlocks.Content />
            </section>
        );
    },
};

// Latest version first in the array
export default [v2, v1];