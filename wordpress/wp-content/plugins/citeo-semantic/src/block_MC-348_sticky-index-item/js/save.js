import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { sectionTitle, uuid } = attributes

	const blockProps = useBlockProps.save({
		className: 'ds-text-small'
	})

	if(!uuid) return (
		<RichText.Content 
			{...blockProps} 
			tagName="span"
			className="no-linked-section"
			value={sectionTitle}
		/>
	);

	return (
		<li {...blockProps} data-id={uuid}>
			<RichText.Content 
				tagName="span"
				value={sectionTitle}
			/>	
		</li>
	);
}
