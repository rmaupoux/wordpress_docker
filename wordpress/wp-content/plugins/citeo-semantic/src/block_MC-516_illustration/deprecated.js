import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/*
* Copy and paste what you had in your previous save.js here
*/

const v1 = {
    attributes: {
        "icon": {
			"type": "string",
			"default": ""
		},
		"isIllustration": {
			"type": "boolean",
			"default": false
		},
		"dsIcon": {
			"type": "string",
			"default": ""
		}
    },

    save ({ attributes }) {   
		const { icon, isIllustration, dsIcon } = attributes
		let className = []

		isIllustration && className.push('illustration-icon')
		icon && className.push(`has-icon--${icon}`)
		dsIcon ? className.push('ds-icon') : className.push('semantic-icon')

		className = className.join(' ');

		const blockProps = useBlockProps.save({
			className: className
		});

		const iconTag = dsIcon ? `${dsIcon.replace('icon-core_', '')}-icon-component` : ''

		return (
			<span { ...blockProps }>
				{(iconTag && iconTag.length > 0) &&
					React.createElement(iconTag, {
						size: 40,
						color: 'var(--ds-icon-color)'
					})
				}
			</span>
		);
    },
}

// Latest version first in the array 
export default [ v1 ];