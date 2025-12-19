import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { theme, subTheme, isWhite } = attributes

	const blockProps = useBlockProps.save({
        className: `${theme} ${subTheme}${isWhite ? ' is-white' : ''}`
    });

	return (
		<section {...blockProps}>
			<div className='picto-wrapper' />

			<InnerBlocks.Content />
		</section>
	);
}
