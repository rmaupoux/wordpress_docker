import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function save({ }) {

	const blockProps = useBlockProps.save({
		className: 'alignfull'
	});

	const innerBlocksProps = useInnerBlocksProps.save(blockProps)

	return (
		<section {...innerBlocksProps } />
	);
}