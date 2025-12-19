import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save() {

	const blockProps = useBlockProps.save({
		className: `cloud-word`
	});

	return (
		<section {...blockProps}>
			<InnerBlocks.Content />
		</section>
	);
}
