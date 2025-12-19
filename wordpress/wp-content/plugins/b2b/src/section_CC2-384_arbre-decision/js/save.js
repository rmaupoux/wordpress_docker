import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { theme, subTheme, backgroundPictoUrl, isWhite } = attributes

	const blockProps = useBlockProps.save({
		className: `${isWhite ? 'is-white' : subTheme} ${theme}`
	});

	return (
		<section {...blockProps}>
			<div className='back-picto' style={{maskImage: `url(${backgroundPictoUrl})`}} />
			<InnerBlocks.Content />
		</section>
	);
}
