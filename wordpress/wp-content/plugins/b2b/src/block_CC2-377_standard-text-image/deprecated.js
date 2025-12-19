import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/*
* Copy and paste what you had in your previous save.js here
*/
const v2 = {
    attributes: {},

    save() {   
        const blockProps = useBlockProps.save({
            className: `article-wrap article-grid`
        })

        const innerBlocksProps = useInnerBlocksProps.save(blockProps)

        return (
            <article {...innerBlocksProps} />
        );
    }
}
const v1 = {
    attributes: {},

    save() {   
        const blockProps = useBlockProps.save({
            className: `article-wrap`
        })
    
        const innerBlocksProps = useInnerBlocksProps.save(blockProps)

        return (
            <article {...innerBlocksProps} />
        );
    },
}

// Latest version first in the array 
export default [ v2, v1 ];