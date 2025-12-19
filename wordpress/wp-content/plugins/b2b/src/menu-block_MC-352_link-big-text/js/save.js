import { useBlockProps, useInnerBlocksProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { cardLink, title, description } = attributes

	const blockProps = useBlockProps.save({})

	const innerBlocksProps = useInnerBlocksProps.save(blockProps)

	if(!cardLink) return;
	
	return (
		<a href={cardLink.url} target={cardLink.opensInNewTab ? '_blank' : ''} {...blockProps}>

			{title && (
				<div className='link-ttl-wrap' >
					<RichText.Content
						tagName="h6"
						className="link-ttl ds-text-base"
						value={ title }
					/>

					<arrow-right-icon-component size="16" color="var(--ds-semantic-color-neutral-content-medium)" />
				</div>
			)}
			
			{(title && description) && (
				<RichText.Content
					tagName="p"
					className="link-desc ds-text-small"
					value={ description }
				/>
			)}
			
		</a>
	);
}
