import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ }) {

	const blockProps = useBlockProps.save({
		className: `discover`
	});

	return (
		<section {...blockProps}>
			<InnerBlocks.Content />
		</section>
	);
}
