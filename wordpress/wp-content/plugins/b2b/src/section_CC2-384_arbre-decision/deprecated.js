import { useBlockProps, useInnerBlocksProps, InnerBlocks } from '@wordpress/block-editor';

/*
* Copy and paste what you had in your previous save.js here
*/

const v2 = {
    attributes: {
		"preview": {
			"type": "boolean",
			"default": false
		},
		"align": {
			"type": "string",
			"default": "full"
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
		"isWhite": {
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
        const { theme, subTheme, backgroundPictoUrl, isWhite } = attributes

        const blockProps = useBlockProps.save({
            className: `${isWhite ? 'is-white' : subTheme} ${theme}`
        });

        return (
            <section {...blockProps}>
                <div className='back-picto' style={{maskImage: `url(${backgroundPictoUrl})`}} />
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
            className: `chart-wrapper`
        });
    
        const innerBlocksProps = useInnerBlocksProps.save(blockProps)
    
        return (
            <section {...innerBlocksProps} />
        );
    }
}

// Latest version first in the array 
export default [ v2, v1 ];