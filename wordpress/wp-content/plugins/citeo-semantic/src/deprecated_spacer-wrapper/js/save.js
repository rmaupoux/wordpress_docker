import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
	
	const blockProps = useBlockProps.save({
		className: 'section-wrapper'
	});

	return (
		<section {...blockProps}>
			<InnerBlocks.Content />
		</section>
	);
}

