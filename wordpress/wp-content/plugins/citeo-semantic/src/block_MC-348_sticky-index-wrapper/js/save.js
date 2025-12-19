import { useBlockProps, useInnerBlocksProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { indexText } = attributes

	const blockProps = useBlockProps.save()

	const innerBlocksProps = useInnerBlocksProps.save()

	return (
		<div {...blockProps} >
			<RichText.Content 
				tagName="h3"
				className="ds-heading-2"
				value={ indexText }
			/>

			<nav>
				<ol {...innerBlocksProps} />
			</nav>
		</div>
		
	);
}
