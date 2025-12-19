import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { SelectControl, PanelBody, PanelRow } from "@wordpress/components";

import { useEffect } from 'react';

import '../scss/editor.scss';

import { illustrations_list } from '../../../assets/utils';

export default function Edit( {attributes, setAttributes} ) {

	const { illustration } = attributes;

	const sortedKeys = Object.keys(illustrations_list).sort((a, b) =>
		a.localeCompare(b)
	);

	// Default to Boite illustration on block load
	useEffect(() => {
		if(!illustration) setAttributes({ illustration: illustrations_list.Boite });
	}, []);

	const blockProps = useBlockProps({});
	
	return (
		<>
			<div {...blockProps}>
				{illustration && (
					<span className='illustration-wrapper' style={{
						maskImage: `url(${illustration}`,
					}}/>
				)}
			</div> 

			<InspectorControls>
				<PanelBody title={"Choix de l'illustration"}>	
					<SelectControl
						label={'Liste des illustration'}
						value={
							sortedKeys.find((key) => illustrations_list[key] === illustration)
						}
						options={
							[...sortedKeys.map((key) => ({
								label: key,
								value: key,
							}))]
						}
						onChange={(val) => setAttributes({ illustration: illustrations_list[val]})}
					/>
				</PanelBody>
			</InspectorControls>			
		</>
	);
}