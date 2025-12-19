import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function save({ }) {

	const blockProps = useBlockProps.save({
		className: '',
	});

	const innerBlocksProps = useInnerBlocksProps.save(blockProps)

	return (
		<section {...innerBlocksProps} />
	);
}