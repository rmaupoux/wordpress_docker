import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { theme, subTheme, backgroundPictoUrl, hasWhitePicto } = attributes

	const blockProps = useBlockProps.save({
		className: `${theme} ${subTheme}${hasWhitePicto ? ' has-white-picto' : ''}`
	});

	return (
		<section {...blockProps}>
			<div className='back-picto' style={{maskImage: `url(${backgroundPictoUrl})`}} />
			<InnerBlocks.Content />
		</section>
	);
}
