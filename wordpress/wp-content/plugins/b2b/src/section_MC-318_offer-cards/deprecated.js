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

    save({attributes}) {
        
        const { theme, subTheme, backgroundPictoUrl, isWhite } = attributes

        const blockProps = useBlockProps.save({
            className: `${theme} ${subTheme}${isWhite ? ' is-white' : ''}`
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
        },
		"isCardOffer": {
			"type": "boolean",
			"default": false
		}
    },

    save() {
        const blockProps = useBlockProps.save({
            className: `reglementary-cards`
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