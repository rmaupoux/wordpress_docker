import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/*
* Copy and paste what you had in your previous save.js here
*/

const v3 = {
    attributes: {
        "allowResize": {
			"type": "boolean",
			"default": false
		},
		"preview": {
			"type": "boolean",
			"default": false
    	},
		"hasWhiteBackground": {
			"type": "boolean",
			"default": false
		},
		"theme": {
			"type": "string",
			"default": ""
		},
		"subTheme": {
			"type": "string",
			"default": "default"
		},
		"align": {
			"type": "string",
			"default": "full"
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
        const { hasWhiteBackground, theme } = attributes;

        const blockProps = useBlockProps.save({
            className: `${hasWhiteBackground ? 'bg-white' : ''} ${theme}`
        });

        return (
            <section {...blockProps}>
                <InnerBlocks.Content />
            </section>
        );
    }
}

const v2 = {
    attributes: {
		"allowResize": {
			"type": "boolean",
			"default": false
		},
		"preview": {
			"type": "boolean",
			"default": false
    	}
	},

    save({ attributes }) {
        const { hasWhiteBackground, theme } = attributes;

        const blockProps = useBlockProps.save({
            className: `${hasWhiteBackground ? 'bg-white' : ''} ${theme}`
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
		"allowResize": {
			"type": "boolean",
			"default": false
		},
		"preview": {
			"type": "boolean",
			"default": false
    	}
	},

    save() {    
        const blockProps = useBlockProps.save({
            className: `hero`
        });
    
        return (
            <section {...blockProps}>
                <InnerBlocks.Content />
            </section>
        );
    }
}

// Latest version first in the array 
export default [ v3, v2, v1 ];