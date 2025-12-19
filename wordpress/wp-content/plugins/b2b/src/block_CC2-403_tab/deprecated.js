import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/*
* Copy and paste what you had in your previous save.js here
*/

const v1 = {
    attributes: {
        "hasTooltip": {
			"type": "boolean",
			"default": false
		},
		"tooltip": {
			"type": "string",
			"default": ""
		},
		"uuid": {
			"type": "string"
		}
	},

    save( attributes ) {    
        const { uuid, hasTooltip, tooltip } = attributes

        const blockProps = useBlockProps.save({
            className: 'tab-button-wrap'
        })

        const classList = hasTooltip ? 'tab-name has-info' : 'tab-name'
        const innerBlocksProps = useInnerBlocksProps.save(useBlockProps.save({
            className: classList
        }));

        return (
            <>
                {hasTooltip ? 
                    <>
                        <div data-id={uuid} {...blockProps}>
                            <div aria-describedby={uuid} data-tooltip={tooltip} {...innerBlocksProps}/>
                            <span className='tab-tooltip' id={uuid}> {tooltip} </span> 
                        </div>
                    </>
                :
                    <div data-id={uuid} {...blockProps}>
                        <div {...innerBlocksProps}/>
                    </div>
                }
            </>
        );
    }
}

// Latest version first in the array 
export default [ v1 ];