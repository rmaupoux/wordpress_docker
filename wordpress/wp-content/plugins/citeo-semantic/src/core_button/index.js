import { useEffect, useRef } from 'react';
import { addFilter } from "@wordpress/hooks";
import { createHigherOrderComponent } from "@wordpress/compose";
import { InspectorControls, MediaUpload, BlockControls } from "@wordpress/block-editor";
import { SelectControl, PanelBody, PanelRow, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from "@wordpress/components";

// icons_list is a variable generated in PHP
const allowedBlocks = ['core/button'];

wp.domReady(() => {
	setTimeout(() => {
		wp.blocks.unregisterBlockStyle('core/button', 'link');
		wp.blocks.unregisterBlockStyle('core/button', 'tag');
		wp.blocks.unregisterBlockStyle('core/button', 'fill');
		wp.blocks.unregisterBlockStyle('core/button', 'outline');
	}, 1);
});

function addAttributes(settings, name) {
	if (!allowedBlocks.includes(name) || !settings.attributes) {
		return settings;
	}

	settings.attributes.prefix = {
		type: "string",
		default: ""
	}
	settings.attributes.suffix = {
		type: "string",
		default: ""
	}
	settings.attributes.variationName = {
		type: "string",
		default: "standard"
	}

	return settings;
}

const addAdvancedControls = createHigherOrderComponent((Block) => {
	return (props) => {

		const { name, attributes, setAttributes, isSelected } = props;
		const { prefix, suffix, variationName, isPostButton } = attributes;

		// Si ce n'est pas le bon bloc, on quitte et on retourne le bloc original, inchangé
		if (!allowedBlocks.includes(name)) {
			return (
				<Block {...props} />
			)
		}

		// Ajout de l'élément dans l'inspecteur
		return (
			<>
				<Block {...props} />

				{variationName === 'download' &&
					<BlockControls>
						<MediaUpload
							onSelect={(media) => {
								setAttributes({	url: media.url });
							}}
							multiple={false}
							title={'Téléversez votre fichier à lier ou sélectionnez le depuis la médiathèque'}
							render={({ open }) => (
								<>
									<button 
										onClick={open} 
										className="dashicons dashicons-upload"
										aria-label={'Uploadez votre fichier'}
										style={{
											width: '3rem',
											height: '100%',
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											fontSize: '1.75em',
											cursor: 'pointer',
											border: '0',
											borderRight: 'solid 1px #000',
											background: '#fff'
										}}
									/>
								</>
							)}
						/>				
					</BlockControls>
				}
				
				{isSelected &&
					<InspectorControls>
						<PanelBody title={"Type de bouton"}>
							<PanelRow>
								<ToggleGroupControl
									label="Type de bouton"
									value={ variationName }
									onChange={ (name) => setAttributes({variationName: name})}
								>
									<ToggleGroupControlOption 
										value="standard" 
										label="Standard" 
										aria-label = {'Bouton standard avec ou sans icônes'}
										showTooltip = { true }
									/>
									<ToggleGroupControlOption
										value="download"
										label="Télécharger"
										aria-label = {'Bouton de téléchargement automatique au click avec icône de téléchargement'}
										showTooltip = {true}
									/>
								</ToggleGroupControl>
							</PanelRow>
						</PanelBody>

						{(variationName === 'standard' || variationName === 'icon') &&
							<PanelBody title={"Gestionnaire d'icônes"}>							
								{variationName !== 'icon' &&
									<PanelRow>
										<SelectControl
											label={'Icône préfixe'}
											value={prefix}
											options={icons_list}
											onChange={(prefix) => {
												setAttributes({ prefix });
											}}
										/>
									</PanelRow>
								}
								
								<PanelRow>
									<SelectControl
										label={variationName === 'standard' ? 'Icône suffixe' : 'Icône'}
										value={suffix}
										options={icons_list}
										onChange={(suffix) => {
											setAttributes({ suffix });
										}}
									/>
								</PanelRow>
							</PanelBody>
						}
					</InspectorControls>
				}
			</>
		);
	};
}, 'addAdvancedControls');

const addCustomClassToBlock = createHigherOrderComponent((Block) => {
	return (props) => {

		const { name, setAttributes } = props;
		const { variationName } = props.attributes;

		// Si ce n'est pas le bon bloc, on quitte
		if (!allowedBlocks.includes(name)) {
			return (
				<Block {...props} />
			)
		}

		const usePrevious = (value) => {
			const ref = useRef();
			useEffect(() => {
			  ref.current = value;
			});
			return ref.current;
		}
		const prevName = usePrevious(variationName)

		useEffect(() => {
			// Setting icon text to white space otherwise it doesn't display
			if(variationName === 'icon') setAttributes({text: ' '});
			// If we are coming from the icon mode we reset the text to trigger the default placeholder (otherwise the single white space creates accessability issue)
			else if(prevName === 'icon') setAttributes({text: ''});
		}, [variationName])

		const extraClass = swapClass(props.attributes)
		
		// Ajout de l'élément dans l'inspecteur
		return (
			<Block {...props} className={extraClass} />
		);
	};
}, 'addAdvancedControls');

function applyExtraClass(extraProps, blockType, attributes) {
	if (!allowedBlocks.includes(blockType.name)) {
		return extraProps;
	}

	const extraClass = swapClass(attributes)
	// Ajout de la classe
	if(extraClass) extraProps.className += extraClass;

	return extraProps;
}

const swapClass = (attributes) => {

	const { variationName, prefix, suffix } = attributes
	let classList = ''

	switch(variationName) {
		case 'icon':
			classList = ` no-text has-suffix--${suffix}`;
			break;
		case 'download':
			classList = ` add-download has-prefix--Download`;
			break;
		case 'standard':
			classList = prefix ? ` has-prefix--${prefix}` : '';
			classList += suffix ? ` has-suffix--${suffix}` : '';
	}

	return classList;
}

// Ajout d’un nouvel attribut dans le bloc
addFilter(
	'blocks.registerBlockType',
	'ds-citeocom/button-custom-attributes',
	addAttributes
);
// Ajout des champs dans l’inspecteur du bloc
addFilter(
	'editor.BlockEdit',
	'ds-citeocom/button-custom-advanced-control',
	addAdvancedControls
);
// Ajout de la classe dans le bloc dans l’éditeur
addFilter(
	'editor.BlockListBlock',
	'ds-citeocom/button-custom-block-class',
	addCustomClassToBlock
);
// Ajout de la classe dans le HTML sauvegardé
addFilter(
	'blocks.getSaveContent.extraProps',
	'ds-citeocom/button-applyExtraClass',
	applyExtraClass
);

wp.domReady(() => {
	/*
	* Others settings removed on theme.json (racine theme file)
	*/

	// Register custom style
	wp.blocks.registerBlockStyle('core/button', { label: 'Primaire', name: 'primary', isDefault: true });
	wp.blocks.registerBlockStyle('core/button', { label: 'Secondaire', name: 'secondary' });
	wp.blocks.registerBlockStyle('core/button', { label: 'Tertiaire', name: 'tertiary' });
	wp.blocks.registerBlockStyle('core/button', { label: 'Liens', name: 'link' });
	wp.blocks.registerBlockStyle('core/button', { label: 'Tag', name: 'tag' });
	// Unregister custom style
	wp.blocks.unregisterBlockStyle('core/button', 'fill');
	wp.blocks.unregisterBlockStyle('core/button', 'outline');
});
