import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import '../scss/editor.scss';

export default function Edit({ attributes, setAttributes }) {
    const { } = attributes

    const blockProps = useBlockProps({});

    const TEMPLATE = [
        ['menu/link-item', {
            className: 'section-label'
        }],
        ['menu/link-item']
    ];

    const ALLOWED_BLOCKS = ['menu/link-item']

    const innerBlocksProps = useInnerBlocksProps(blockProps, {
        template: TEMPLATE,
        allowedBlocks: ALLOWED_BLOCKS
    })
    
    return (         
        <>
            <div {...innerBlocksProps} />
        </>   
    );
}