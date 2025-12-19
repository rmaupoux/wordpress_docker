import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ }) {
    const blockProps = useBlockProps.save({});

    return (
        <section {...blockProps}>
            <InnerBlocks.Content />
        </section>
    );
}
