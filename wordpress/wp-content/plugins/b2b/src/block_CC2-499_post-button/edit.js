import { useBlockProps, RichText } from '@wordpress/block-editor';
// import { useEntityProp } from "@wordpress/core-data";

export default function Edit({ attributes, context, setAttributes }) {
	const { buttonText } = attributes
	// const { postType, postId } = context

	// const [ acf, setAcf ] = useEntityProp(
	// 	'postType',
	// 	postType,
	// 	'acf',
	// 	postId
	// );

	// setAttributes( { postLink: acf.article_url } );

	const blockProps = useBlockProps({
		className: 'is-style-tertiary has-suffix--Arrow-right wp-block-button'
	});

	return (
		<div { ...blockProps }>
			<RichText
				className={ 'wp-block-button__link wp-element-button' }				
				tagName="a"
				value={ buttonText }
				allowedFormats={ [ 'core/bold' ] }
				onChange={ ( content ) => setAttributes( { buttonText: content } ) }
			/>
		</div>
	);
}