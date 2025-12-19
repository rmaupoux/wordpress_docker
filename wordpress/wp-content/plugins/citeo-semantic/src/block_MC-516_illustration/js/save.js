import { useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { illustration } = attributes

	const blockProps = useBlockProps.save({});

	return (
		<div {...blockProps}>
			{illustration && (
				<span className='illustration-wrapper' style={{
					maskImage: `url(${illustration}`,
				}}/>
			)}
		</div> 
	);
}