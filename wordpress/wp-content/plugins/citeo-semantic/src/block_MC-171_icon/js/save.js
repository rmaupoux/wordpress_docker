import { useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { icon, isIllustration, dsIcon, className } = attributes

	const addedClasses = [
		'wp-block-citeo-semantic-icon',
		isIllustration && 'illustration-icon',
		dsIcon ? 'ds-icon' : 'semantic-icon',
		icon && `has-icon--${icon}`,
		className
	].filter(Boolean);

	const iconTag = dsIcon ? `${dsIcon.replace('icon-core_', '')}-icon-component` : ''

	return (
		<span className={addedClasses.join(' ')}>
			{(iconTag && iconTag.length > 0) &&
				React.createElement(iconTag, {
					size: 40,
					color: 'var(--ds-icon-color)'
				})
			}
		</span>
	);
}