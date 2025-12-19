import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import '../scss/editor.scss';

export default function Edit({ attributes }) {
	// colorList is a color name that can be selected on the accordeon and added as an extra className
	const { multipleActive, allowedBlocks, colorList } = attributes
	const isMultiple = multipleActive ? 'multiple-active-accordeon' : 'unique-active-accordeon'

	const TEMPLATE = [
		['citeo-semantic/block-accordeon', {
			isActive: true
		}]
	]

	const ALLOWED_BLOCKS = allowedBlocks || ['citeo-semantic/block-accordeon']

	const blockProps = useBlockProps({
		className: isMultiple
	});

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		template: TEMPLATE
	})

	// ADD A BLOCK OPTION TO TOGGLE multipleActive ATTRIBUTE
	return (
		<>
			<div {...innerBlocksProps} />
		</>
	);
}
