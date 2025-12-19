import { addFilter } from "@wordpress/hooks";
import { createHigherOrderComponent } from "@wordpress/compose";
import { InspectorControls } from "@wordpress/block-editor";
import { SelectControl, PanelBody, PanelRow } from "@wordpress/components";
import { useEffect } from 'react';


const allowedBlocks = ['core/list-item'];

function addAttributes(settings, name) {
	if (!allowedBlocks.includes(name) || !settings.attributes) {
		return settings;
	}

	settings.attributes.icon = {
		type: "string",
		default: "Aucun"
	}

	return settings;
}

const addAdvancedControls = createHigherOrderComponent((Block) => {
	return (props) => {

		const { name, attributes, setAttributes, isSelected } = props;

		// Si ce n'est pas le bon bloc, on quitte et on retourne le bloc original, inchangé
		if (!allowedBlocks.includes(name)) {
			return (
				<Block {...props} />
			)
		}

		const { icon } = attributes;

		useEffect(() => {
			let extraClass = []
			if(icon !== undefined) extraClass.push(`list-icon--${icon}`)
			
			if(extraClass.length > 0) {
				let classNames = extraClass.join(' ');

				if(attributes.className !== undefined) {
					const currClass = attributes.className.split(' ')
					const filteredClass = currClass.filter(el => !el.includes('list-icon--') && !el.includes('color--'))
					const concatArr = [...new Set([...filteredClass, ...extraClass])]
		
					classNames = concatArr.join(' ');
				}

				setAttributes( {className: classNames} );
			}
		}, [icon])

		// Ajout de l'élément dans l'inspecteur
		return (
			<>
				<Block {...props} />
				
				{isSelected &&
					<InspectorControls>						
						<PanelBody title={"Gestionnaire d'icônes"}>
							<PanelRow>
								<SelectControl
									label={'Icône'}
									value={icon}
									options={icons_list}
									onChange={(val) => {
										setAttributes({ icon: val });
									}}
								/>
							</PanelRow>
						</PanelBody>
					</InspectorControls>
				}
			</>
		);
	};
}, 'addAdvancedControls');

// Ajout d’un nouvel attribut dans le bloc
addFilter(
	'blocks.registerBlockType',
	'ds-citeocom/list-custom-attributes',
	addAttributes
);
// Ajout des champs dans l’inspecteur du bloc
addFilter(
	'editor.BlockEdit',
	'ds-citeocom/list-custom-advanced-control',
	addAdvancedControls
);