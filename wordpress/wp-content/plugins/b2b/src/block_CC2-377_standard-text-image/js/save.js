import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function save({ }) {

	const blockProps = useBlockProps.save({
		className: `text-img-wrap`
	})

	const innerBlocksProps = useInnerBlocksProps.save(blockProps)

	return (
		<article {...innerBlocksProps} />
	);
}
