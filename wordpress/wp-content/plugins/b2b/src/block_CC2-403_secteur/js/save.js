import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { uuid, isDefaultActive } = attributes

	let classList = []
	if(isDefaultActive) classList.push('tab-active');
	classList = classList.length > 0 ? classList.join(' ') : '';

	const blockProps = useBlockProps.save({
		className: classList
	})
	const innerBlocksProps = useInnerBlocksProps.save(blockProps)

	return (
		<div {...innerBlocksProps} data-id={uuid} />
	);
}