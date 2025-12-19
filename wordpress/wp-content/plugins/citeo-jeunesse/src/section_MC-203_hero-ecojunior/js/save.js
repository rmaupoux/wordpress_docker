import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ }) {

	const blockProps = useBlockProps.save({
		className: 'ecojunior-content',
	});

	return (
		<section {...blockProps}>
			<InnerBlocks.Content />
		</section>
	);
}
