import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { label, cardLink } = attributes

	const blockProps = useBlockProps.save({})

	if(!cardLink) return (
		<div { ...blockProps } >
			<RichText.Content
				tagName="span"
				className="link-label ds-text-small"
				value={ label }
			/>
		</div>
	);

	return (
		<a href={cardLink.url} target={cardLink.opensInNewTab ? '_blank' : ''} { ...blockProps } >
			<RichText.Content
				tagName="span"
				className="link-label ds-text-small"
				value={ label }
			/>

			<arrow-right-icon-component size="16" color="var(--ds-semantic-color-neutral-content-medium)" />
		</a>
	);
}
