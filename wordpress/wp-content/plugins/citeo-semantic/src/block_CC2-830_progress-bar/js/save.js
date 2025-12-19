
import { useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { progress, color } = attributes

	const colorStyle = {
		"--progress-bar-color": color
	}

	const blockProps = useBlockProps.save({
		className: "progress-bar"
	})

	return (
		<progress { ...blockProps } 
			value={progress}
			max="100"
			style={colorStyle}
		/>				
	);
}
