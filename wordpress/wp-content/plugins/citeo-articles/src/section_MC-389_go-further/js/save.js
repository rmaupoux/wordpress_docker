import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { title } = attributes

	const blockProps = useBlockProps.save({});

	return (
		<section {...blockProps}>
			{/* Titre en RichText */}
			<RichText.Content
				tagName="h2"
				className="ds-heading-3"
				value={title || 'Pour aller plus loin'}
			/>
			
			{/* Structure avec groupes modifiée pour injecter les tags */}
			<div className="wp-block-group tags-articles-container">
				<div className="wp-block-group tags-group">
					{/* Tags relatifs avec quantité - affiché uniquement sur le frontend */}
					<div className="tags-display-shortcode">
						[tags_with_count show_count="true"]
					</div>
				</div>
				<div className="wp-block-group articles-group">
					<InnerBlocks.Content />
				</div>
			</div>

			

		</section>
	);
}
