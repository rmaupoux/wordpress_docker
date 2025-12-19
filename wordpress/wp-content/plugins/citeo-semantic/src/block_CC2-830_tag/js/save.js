import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

import IconSave from '../../block_MC-171_icon/js/save';

export default function save( { attributes } ) {
	const { tagText, hasIcon, iconPos, icon, isIllustration, dsIcon } = attributes

	const blockProps = useBlockProps.save({})

	if(!tagText.length > 0 && !hasIcon) return;

	return (
		<div { ...blockProps } >
			{ (hasIcon && iconPos === 'left') && (
				<IconSave 
					className='wp-block-citeo-semantic-icon'
					attributes={{ icon: icon, isIllustration: isIllustration, dsIcon: dsIcon }}
				/>
			)}
			<RichText.Content 
				value={ tagText }
				tagName="span"
				className="tag-text"
			/>
			{ (hasIcon && iconPos === 'right') && (
				<IconSave 
					className='wp-block-citeo-semantic-icon'
					attributes={{ icon: icon, isIllustration: isIllustration, dsIcon: dsIcon }}
				/>
			)}
		</div>
	);
} 