import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { theme, subTheme, backgroundPictoUrl, isWhite } = attributes

	const blockProps = useBlockProps.save({
		className: `${theme} ${subTheme} alignfull ${isWhite ? ' is-white' : ''}`
	});

	return (
		<section {...blockProps}>
			<div className='title-picto' style={{ maskImage: `url(${backgroundPictoUrl})` }} />
			<InnerBlocks.Content />
		</section>
	);
}
