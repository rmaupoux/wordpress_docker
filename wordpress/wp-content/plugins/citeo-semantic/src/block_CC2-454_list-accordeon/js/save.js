import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { multipleActive } = attributes

	const isMultiple = multipleActive ? 'multiple-active-accordeon' : 'unique-active-accordeon'

	const blockProps = useBlockProps.save({
		className: isMultiple
	});

	return (
		<div {...blockProps}>
			<InnerBlocks.Content />
		</div>
	);
}
