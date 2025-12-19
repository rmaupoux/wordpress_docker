import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { pageTemplate, pageTitle, theme, subTheme } = attributes
	const blockProps = useBlockProps.save({
		className: `${pageTemplate}`
	})

	return (
		<div {...blockProps}>
			{pageTemplate !== 'faq-template' && (
				<RichText.Content 
					tagName='h1'
					className={`page-title ds-heading-1`}
					value={ pageTitle }
				/>
			)}
			
			<InnerBlocks.Content />
		</div>
	);
}
