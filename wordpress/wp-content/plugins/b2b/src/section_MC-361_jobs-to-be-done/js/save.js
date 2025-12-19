import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const { textSize } = attributes
    
    const blockProps = useBlockProps.save({
        className: textSize
    });

    return (
        <section {...blockProps}>
            <InnerBlocks.Content />
        </section>
    );
}
