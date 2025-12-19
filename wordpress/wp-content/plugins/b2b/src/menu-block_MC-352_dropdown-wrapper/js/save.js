import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { uuid } = attributes

	const blockProps = useBlockProps.save({})

	const innerBlocksProps = useInnerBlocksProps.save(blockProps)

	return (
		<div {...innerBlocksProps} data-id={uuid} />
	);
}
