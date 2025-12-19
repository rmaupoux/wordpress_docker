import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { theme } = attributes

	return (
		<section {...useBlockProps.save({ className: `${theme}` })}>
            <div className="large-align-block">
                <InnerBlocks.Content />
            </div>
        </section>
	);
}