import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { TextControl, PanelBody, PanelRow } from "@wordpress/components";
import { useEffect } from 'react';


import '../scss/editor.scss';


export default function Edit( {attributes, setAttributes} ) {
	const { iframeSrc, isValid } = attributes;

	useEffect(() => {
		const regex = /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g
		
		if(regex.test(iframeSrc)) {
			setAttributes( {isValid : true} );
		} else {
			setAttributes( {isValid : false} );
		}
		
	}, [iframeSrc]);

	return (
		<>
			<InspectorControls>
				<PanelBody title={"Gestionnaire d'iframe"}>										
					<PanelRow>
						<TextControl
							label="URL de l'iframe :"
							value={iframeSrc}
							onChange={(src) => {
								setAttributes({ iframeSrc: src });
							}}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			
			<section { ...useBlockProps() }>
				{isValid ? (
					<iframe loading="lazy" class="in-page-iframe" frameborder="0" src={iframeSrc} width="1040" height="650"></iframe>
				): (
					<>
						<p class="ds-text-base">Veuillez renseigner l'url de l'iframe dans les options de bloc à la droite de votre écran.</p>
					</>
				)}
				
			</section>
		</>
	);
}
