import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const { cardLink, content } = attributes
    
    const blockProps = useBlockProps.save({});

    if(!cardLink) return (
		<div { ...blockProps } >
			<RichText.Content
				tagName="span"
				className="cta-text"
				value={ content }
			/>
		</div>
	);

	return (
		<a href={cardLink.url} target={cardLink.opensInNewTab ? '_blank' : ''} { ...blockProps } >
			<RichText.Content
				tagName="span"
				className="cta-text"
				value={ content }
			/>

			<arrow-right-icon-component size="16" color="var(--ds-semantic-color-neutral-content-medium)" />
		</a>
	);
}
