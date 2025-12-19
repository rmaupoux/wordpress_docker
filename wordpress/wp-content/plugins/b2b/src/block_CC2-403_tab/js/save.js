import { useBlockProps, RichText } from '@wordpress/block-editor';

import IconSave from '../../../../citeo-semantic/src/block_MC-171_icon/js/save';

export default function save({ attributes }) {
	const { uuid, text, isDefaultActive, icon, isIllustration, dsIcon } = attributes

	let classList = []
	if(isDefaultActive) classList.push('tab-active');
	classList = classList.length > 0 ? classList.join(' ') : '';
	
	const blockProps = useBlockProps.save({
		className: classList
	})

	return (
		<div {...blockProps} data-id={uuid}>
			<IconSave 
				className='wp-block-citeo-semantic-icon'
				attributes={{ icon: icon, isIllustration: isIllustration, dsIcon: dsIcon }}
			/>
			<RichText.Content
				tagName="span"
				className="ds-text-base"
				value={ text }
			/>
		</div>
	);
}
