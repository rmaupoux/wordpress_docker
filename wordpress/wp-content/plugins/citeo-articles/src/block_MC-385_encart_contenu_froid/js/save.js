import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { linkUrl, linkType } = attributes;

	const blockProps = useBlockProps.save({
		className: 'wp-block-encart-article'
	});

	// Si un lien est configuré (interne ou personnalisé) et qu'une URL existe
	if ((linkType === 'internal' || linkType === 'custom') && linkUrl && linkUrl.trim()) {
		// Pour les liens internes (pages/articles), ne pas ouvrir dans un nouvel onglet
		const linkProps = linkType === 'internal' 
			? { href: linkUrl, className: "link_encart" }
			: { href: linkUrl, target: "_blank", rel: "noopener noreferrer", className: "link-encart" };
			
		const innerBlocksProps = useInnerBlocksProps.save();
		
		return (
			<section {...blockProps}>
				<a {...linkProps}>
					<div {...innerBlocksProps} />
				</a>
			</section>
		);
	}

	const innerBlocksProps = useInnerBlocksProps.save(blockProps);
	return <section {...innerBlocksProps} />;
}