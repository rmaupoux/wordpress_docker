
import { useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { iframeSrc, isValid } = attributes;

	return (
		<>
			{isValid && (
				<section { ...useBlockProps.save() }>
					<iframe loading="lazy" class="in-page-iframe" frameborder="0" src={iframeSrc} width="1040" height="650"></iframe>
				</section>
			)}
		</>
	);
}
