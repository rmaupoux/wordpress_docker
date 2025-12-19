import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

/*
* Copy and paste what you had in your previous save.js here
*/

const v2 = {
	attributes: {
        "tagText": {
			"type": "string",
			"source": "html",
			"selector": "span",
			"default": ""
		},
		"hasIcon": {
			"type": "boolean",
			"default": false
		},
		"iconPos": {
			"type": "string",
			"default": "left"
		}
    },

	 migrate: (attributes, innerBlocks) => {
      const iconBlock = innerBlocks.find(block => block.name === 'citeo-semantic/icon');
      const icon = iconBlock?.attributes?.icon;
	  const dsIcon = iconBlock?.attributes?.dsIcon;
	  const isIllustration = iconBlock?.attributes?.isIllustration;

      return {
        ...attributes,
        icon,
		dsIcon,
		isIllustration
      };
    },

    save ({ attributes }) {
		const { tagText, hasIcon, iconPos } = attributes

		const blockProps = useBlockProps.save({})

		return (
			<div { ...blockProps } >
				{ (hasIcon && iconPos === 'left') && (
					<InnerBlocks.Content />
				)}
				<RichText.Content 
					value={ tagText }
					tagName="span"
					className="tag-text"
				/>
				{ (hasIcon && iconPos === 'right') && (
					<InnerBlocks.Content />
				)}
			</div>
		);
	} 
}

const v1 = {
    attributes: {
        "content": {
			"type": "string",
			"source": "html",
			"selector": "span",
			"default": ""
		}
    },

    save ({ attributes }) {
		const { content } = attributes

		const blockProps = useBlockProps.save({
			className: "number-tag"
		})

		return (
			<RichText.Content 
				{ ...blockProps } 
				tagName="span" 
				value={ attributes.content } 
			/>
		);
	}
}

// Latest version first in the array 
export default [ v2, v1 ];