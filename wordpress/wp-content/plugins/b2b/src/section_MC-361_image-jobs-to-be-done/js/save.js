import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const { tagName } = attributes

    const blockProps = useBlockProps.save({});

    if(tagName === 'div') return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );

    return (
        <section {...blockProps}>
            <InnerBlocks.Content />
        </section>
    );
}
