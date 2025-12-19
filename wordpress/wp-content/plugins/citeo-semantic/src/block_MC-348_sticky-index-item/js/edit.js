import { useBlockProps, InspectorAdvancedControls } from '@wordpress/block-editor';
import { TextControl } from "@wordpress/components";
import { useDispatch } from '@wordpress/data';

import { useEffect } from 'react';

import '../scss/editor.scss';

export default function Edit({ attributes, clientId }) {
	const { sectionTitle, uuid } = attributes

	const blockProps = useBlockProps({
		className: 'ds-text-small'
	});

	const { updateBlockAttributes } = useDispatch('core/block-editor');

	useEffect(() => {
		updateBlockAttributes(clientId, {
			lock: { 
				remove: true,
				move: false
			}
		});
	}, [clientId]);
	
	return (
		<>
			<InspectorAdvancedControls>
				<TextControl 
					label={ "ID à copier/coller" }
					value={ uuid }
					onChange={ (val) => setAttributes( {uuid: val} ) }
				/>	
			</InspectorAdvancedControls>

			<li {...blockProps} data-uuid={uuid}>
				<span>
					{sectionTitle}
				</span>
			</li>
		</>
	);
}
