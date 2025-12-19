import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { theme, subTheme } = attributes
	
	const blockProps = useBlockProps.save({
		className: `${theme} ${subTheme}`
	});

	return (
		<section {...blockProps}>
			<InnerBlocks.Content />
		</section>
	);
}
