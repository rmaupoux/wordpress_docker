import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const { hasWhiteBackground, theme, subTheme } = attributes;

    const blockProps = useBlockProps.save({
        className: `${hasWhiteBackground ? 'bg-white' : ''} ${theme} ${subTheme}`
    });

    return (
        <section {...blockProps}>
            <InnerBlocks.Content />
        </section>
    );
}
