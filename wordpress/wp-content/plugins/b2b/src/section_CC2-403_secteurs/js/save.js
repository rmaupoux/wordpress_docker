import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { backgroundPictoUrl } = attributes
	const blockProps = useBlockProps.save({})

	return (
		<section {...blockProps}>
			<InnerBlocks.Content />

			<div className='back-picto' style={{maskImage: `url(${backgroundPictoUrl})`}} />
		</section>
	);
}
