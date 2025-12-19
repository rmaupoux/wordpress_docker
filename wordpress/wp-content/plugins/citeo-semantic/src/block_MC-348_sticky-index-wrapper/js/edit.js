import { useBlockProps, useInnerBlocksProps, RichText } from '@wordpress/block-editor';
import '../scss/editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const { indexText } = attributes

	const ALLOWED_BLOCKS = ['citeo-semantic/sticky-index-item'];

	const TEMPLATE = [];

	const blockProps = useBlockProps();

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
		allowedBlocks: ALLOWED_BLOCKS
	});
	
	return (
		<div {...blockProps} >
			<RichText 
				tagName="h3"
				className="index-title ds-heading-2"
				value={ indexText }
				onChange={ ( val ) => {
					setAttributes( { indexText: val } );
				} }
			/>

			<nav>
				<ol {...innerBlocksProps} />
			</nav>
		</div>
	);
}
