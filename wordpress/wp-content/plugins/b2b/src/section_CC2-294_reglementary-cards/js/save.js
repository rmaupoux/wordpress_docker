import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { theme, subTheme, backgroundPictoUrl, hasWhitePicto, isWhite } = attributes

	const blockProps = useBlockProps.save({
		className: `${theme} ${subTheme}${hasWhitePicto ? ' has-white-picto' : ''}${isWhite ? ' is-white' : ''}`
	});

	return (
		<section {...blockProps}>
			<div className='back-picto' style={{maskImage: `url(${backgroundPictoUrl})`}} />
			<InnerBlocks.Content />
		</section>
	);
}
