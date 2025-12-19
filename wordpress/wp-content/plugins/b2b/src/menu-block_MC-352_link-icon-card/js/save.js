import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { cardLink, title, description, label } = attributes

	const blockProps = useBlockProps.save({})

	if(!cardLink) return;

	return (
		<a href={cardLink.url} target={cardLink.opensInNewTab ? '_blank' : ''} {...blockProps}>
			<InnerBlocks.Content />
			
			<div className='text-wrapper'>
				<RichText.Content
					tagName="h5"
					className="link-ttl ds-heading-3"
					value={ title }
				/>
			
				<RichText.Content
					tagName="p"
					className="link-desc ds-text-paragraph"
					value={ description }
				/>
			</div>
			
			{label && (
				<div className='link-label-wrap' >
					<RichText.Content
						tagName="span"
						className="link-label ds-text-base"
						value={ label }
					/>

					<arrow-right-icon-component size="16" color="var(--ds-semantic-color-neutral-content-medium)" />
				</div>
			)}			
		</a>          
	);
}
