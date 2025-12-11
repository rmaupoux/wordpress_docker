/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

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
	const { iconName = 'icon-core_arrow-right', iconColor = '#0073aa' } = attributes;
	
	return (
		<div { ...useBlockProps.save() }>
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				padding: '32px',
				border: '2px solid #e0e0e0',
				borderRadius: '8px',
				backgroundColor: '#fafafa',
				textAlign: 'center'
			}}>
				<div style={{
					padding: '24px',
					backgroundColor: '#fff',
					borderRadius: '8px',
					marginBottom: '16px'
				}}>
					<ds-citeo-icon 
						name={iconName}
						style={`color: ${iconColor}; font-size: 4rem; --ds-citeo-icon-color: ${iconColor}; --icon-color: ${iconColor}; fill: ${iconColor}; display: block;`}
					></ds-citeo-icon>
				</div>
				
				<div style={{
					fontSize: '14px',
					color: '#666',
					marginBottom: '8px'
				}}>
					<strong>Nom:</strong> {iconName}
				</div>
				
				<div style={{
					fontSize: '14px',
					color: '#666',
					display: 'flex',
					alignItems: 'center',
					gap: '8px'
				}}>
					<strong>Couleur:</strong>
					<div style={{
						width: '20px',
						height: '20px',
						backgroundColor: iconColor,
						borderRadius: '50%',
						border: '1px solid #ccc'
					}}></div>
					<span>{iconColor}</span>
				</div>
			</div>
		</div>
	);
}
