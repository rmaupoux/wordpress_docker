import { useBlockProps, useInnerBlocksProps, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { Button, PanelBody, ToggleControl, SelectControl } from '@wordpress/components';

import { useEffect } from 'react';

import '../scss/editor.scss';

import { ENV_LIST } from '../../../assets/utils';

export default function Edit({ attributes, setAttributes, context }) {
	// color styling needs to be defined on the section calling this semantic block
	const { color, isActive, theme, subTheme } = attributes
	const colorList = context['citeo-semantic/colorList']

	useEffect(() => {
        const CURRENT_ENV = ENV_LIST.find(el => Array.from(document.body.classList).includes(el.value));

        if(CURRENT_ENV && !theme) {
            setAttributes( {theme: CURRENT_ENV.value} );
        }
    }, []);

	useEffect(() => {
		const optionList = ENV_LIST.find(el => el.value === theme)?.subThemes
		const resetEntry = {
			label: 'Par défaut',
			value: ''
		}

		if(optionList && !optionList.find(el => el.value ==='')) optionList.unshift(resetEntry);
	}, [theme]);

	const blockProps = useBlockProps({
		className: `accordeon-wrapper${color ? ` ${color}` : ''}${isActive ? ' is-active' : ''}${theme ? ` ${theme}` : ''} ${subTheme}` 
	});

	const TEMPLATE = [
		['core/button', {
			className: 'accordeon-toggle',
			metadata: {
				name: 'Contrôle de l\'accordéon'
			},
			placeholder: 'Bouton d\'activation de l\'accordéon'
		}],
		['core/group', {
			className: 'accordeon-content',
			metadata: {
				name: 'Contenu de l\'accordéon'
			}
		}, 
			[
				['core/paragraph', {
					placeholder: 'Contenu de l\'accordéon. Plusieurs paragraphes, listes, ... peuvent être ajoutés'
				}]
			]
		]
	];

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
		allowedBlocks: []
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={'Accordéon ouvert par défaut'} initialOpen={true}>
					<ToggleControl
						label="Ouvrir l'accordéon par défaut"
						help={
							isActive
								? 'L\'accordéon est ouvert par défaut.'
								: 'L\'accordéon est fermé par défaut.'
						}
						checked={ isActive }
						onChange={(val) => setAttributes( { isActive: val } )}
					/>
				</PanelBody>
				
				{(theme !== 'ds-subtheme-group' && ENV_LIST.find(el => el.value === theme)?.subThemes) && (
					<PanelBody title={'Choix du thème'} initialOpen={true}>					
						
						<SelectControl
							label={'Thème secondaire'}
							value={subTheme}
							options={ENV_LIST.find(el => el.value === theme)?.subThemes}
							onChange={(value) => setAttributes({ subTheme: value })}
						/>

					</PanelBody>
				)}

			</InspectorControls>

			{(colorList && colorList.length > 0) && (
				<BlockControls>
					<div className="color-picker-wrapper" style={{ 
						display: 'flex',
						gap: 'var(--ds-semantic-spacing-xs)',
						alignItems: 'center',
						marginLeft: 'var(--ds-semantic-spacing-m)'
					}}>
						<Button
							isPressed={color === ''}
							onClick={() => setAttributes({ color: '' })}
							style={{
								backgroundColor: 'transparent',
								borderRadius: '50%',
								width: 'var(--ds-semantic-sizing-m)',
								height: 'var(--ds-semantic-sizing-m)',
								padding: 0,
								borderWidth: "1px",
								borderStyle: "solid",
								borderColor: "#CCCCCC",
							}}
						/>
						{colorList.map(colorName => {
							return (
								<Button
									isPressed={color === colorName}
									onClick={() => setAttributes({ color: `accordeon-wrapper--${colorName}` })}
									className={`colorPicker--${colorName}`}
									style={{
										borderRadius: '50%',
										width: 'var(--ds-semantic-sizing-m)',
										height: 'var(--ds-semantic-sizing-m)',
										padding: 0,
										borderWidth: "1px",
										borderStyle: "solid",
										borderColor: "#CCCCCC",
									}}
								/>
							)
						})}
						
					</div>
				</BlockControls>
			)}
			<article {...innerBlocksProps} />
		</>
	);
}
