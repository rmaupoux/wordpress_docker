/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save({ attributes }) {
	const { cardLink, label } = attributes
	const blockProps = useBlockProps.save({});

	return (
		<>
			{cardLink.url ? (
				<a href={cardLink.url} target={cardLink.opensInNewTab ? '_blank' : ''} {...blockProps}>
					<InnerBlocks.Content />

					<div className='link-label'>
						<RichText.Content
							tagName="span"
							className="ds-text-base"
							value={ label }
						/>

						<arrow-right-icon-component size="16" color="var(--ds-semantic-color-neutral-content-medium)" />
					</div>
				</a>
			) : (
				<div {...blockProps}>
					<InnerBlocks.Content />

					<div className='link-label'>
						<RichText.Content
							tagName="span"
							className="ds-text-base"
							value={ label }
						/>
					</div>
				</div>
			)}	
		</>			
	);
}
