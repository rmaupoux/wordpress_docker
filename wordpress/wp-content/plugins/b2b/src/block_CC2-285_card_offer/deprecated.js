import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/*
* Copy and paste what you had in your previous save.js here
*/

const v2 = {
    attributes: {
        "allowResize": {
			"type": "boolean",
			"default": false
		},
		"hasImage": {
			"type": "boolean",
			"default": false
		},
		"hasTags": {
			"type": "boolean",
			"default": true
		},
		"cardURL": {
			"type": "string",
			"default": ""
		},
		"targetBlank": {
			"type": "boolean",
			"default": false
		}
	},

    supports: {
        "html": false,
        "className": false
    },

    migrate: ( attributes ) => {
        const {
            cardURL,
            targetBlank,
            ...otherAttributes
        } = attributes;

        return {
            cardLink: {
                url: cardURL,
                opensInNewTab: targetBlank,
            },
            ...otherAttributes,
        };
    },

    save( { attributes } ) {
        const { cardURL, targetBlank } = attributes
        const blockProps = useBlockProps.save({});

        return (
            <>
                {cardURL ? (
                    <a {...blockProps} href={cardURL} target={targetBlank && '_blank'}>
                        <InnerBlocks.Content />
                    </a>
                ) : (
                    <div {...blockProps}>
                        <InnerBlocks.Content />
                    </div>
                )}	
            </>			
        );
    }
}

const v1 = {
    attributes: {
        "isBig": {
			"type": "boolean",
			"default": true
		},
		"allowResize": {
			"type": "boolean",
			"default": false
		}
	},

    supports: {
        "html": false,
        "className": false
    },

    save() {    
        return (
            <div className='card'>
                <InnerBlocks.Content />
            </div>
        );
    }
}

// Latest version first in the array 
export default [ v2, v1 ];