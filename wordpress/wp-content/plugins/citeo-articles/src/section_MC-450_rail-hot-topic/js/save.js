import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { } = attributes

	const blockProps = useBlockProps.save({});

	return (
		<section {...blockProps}>

				
				<InnerBlocks.Content />

			
		</section>
	);
}
