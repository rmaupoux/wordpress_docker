import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { uuid, content } = attributes

	const blockProps = useBlockProps.save({})

	return (
		<div {...blockProps} data-id={uuid}>
            <RichText.Content 
                value={ content }
				tagName="span"
				className="btn-text"
            />
            <chevron-down-icon-component size="12" color="var(--ds-semantic-color-neutral-content-medium)"></chevron-down-icon-component>
        </div>
	);
}
