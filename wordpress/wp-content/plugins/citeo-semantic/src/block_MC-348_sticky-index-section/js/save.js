import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { sectionTitle, uuid, tagName, htmlAnchor, theme, subTheme } = attributes
	
	const blockProps = htmlAnchor ?
		useBlockProps.save({
			id: htmlAnchor,
			className: `${theme ? `${theme} ` : ''}${subTheme}`
		}) :
		useBlockProps.save({
			className: `${theme ? `${theme} ` : ''}${subTheme}`
		});

	return (
		<section {...blockProps} data-id={uuid || ''}>
			<RichText.Content
				tagName={tagName}
				className="section-title"
				value={ sectionTitle }
			/>
			<InnerBlocks.Content />
		</section>
	);
}
