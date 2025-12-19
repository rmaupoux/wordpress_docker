import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import '../scss/editor.scss';

export default function Edit({ attributes }) {

	const blockProps = useBlockProps({
		className: 'section-wrapper'
	});

	const innerBlocksProps = useInnerBlocksProps(blockProps);

	return (
		<>			
			<section {...innerBlocksProps} />
		</>
	);
}
