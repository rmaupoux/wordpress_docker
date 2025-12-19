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
        "align": {
            "type": "string",
            "default": "none"
        },
        "theme": {
            "type": "string",
            "default": ""
        },
        "subTheme": {
            "type": "string",
            "default": "default"
        },
        "themeSwapConfirm": {
            "type": "boolean",
            "default": false
        },
        "backgroundPictoUrl": {
            "type": "string",
            "default": ""
        },
        "hasWhitePicto": {
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
        const { theme, subTheme, backgroundPictoUrl, hasWhitePicto } = attributes

        const blockProps = useBlockProps.save({
            className: `${theme} ${subTheme}${hasWhitePicto ? ' has-white-picto' : ''}`
        });

        return (
            <section {...blockProps}>
                <div className='back-picto' style={{maskImage: `url(${backgroundPictoUrl})`}} />
                <InnerBlocks.Content />
            </section>
        );
    }
}

// Latest version first in the array 
export default [ v1 ];