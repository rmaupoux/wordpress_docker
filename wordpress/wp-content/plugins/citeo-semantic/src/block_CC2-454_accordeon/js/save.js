import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { color, isActive, theme, subTheme } = attributes
	
	const blockProps = useBlockProps.save({
		className: `accordeon-wrapper${color ? ` ${color}` : ''}${isActive ? ' is-active' : ''}${theme ? ` ${theme}` : ''} ${subTheme}`
	});

	return (
		<article {...blockProps}>
			<InnerBlocks.Content />
		</article>
	);
}
