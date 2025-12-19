import {  registerFormatType, applyFormat, removeFormat } from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { Dropdown, MenuGroup, MenuItem } from '@wordpress/components';

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const FONT_SIZE_FORMATS = [
  { className: 'ds-heading-1', title: __('Titre très grand', 'citeo') },
  { className: 'ds-heading-2', title: __('Titre grand', 'citeo') },
  { className: 'ds-heading-3', title: __('Titre basique', 'citeo') },
  { className: 'ds-heading-4', title: __('Titre petit', 'citeo') },
  { className: 'ds-display-number', title: __('Exergue chiffre', 'citeo') },
  { className: 'ds-display-1', title: __('Exergue titre grand', 'citeo') },
  { className: 'ds-display-2', title: __('Exergue titre petit', 'citeo') },
  { className: 'ds-text-large', title: __('Texte grand', 'citeo') },
  { className: 'ds-text-base', title: __('Texte basique', 'citeo') },
  { className: 'ds-text-paragraph', title: __('Texte paragraphe', 'citeo') },      
  { className: 'ds-text-small', title: __('Texte petit', 'citeo') },
  { className: 'ds-text-xsmall', title: __('Texte très petit', 'citeo') },
];


const sizeIcon = <svg fill="#000000" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m22 6-3-4-3 4h2v4h-2l3 4 3-4h-2V6zM9.307 4l-6 16h2.137l1.875-5h6.363l1.875 5h2.137l-6-16H9.307zm-1.239 9L10.5 6.515 12.932 13H8.068z"/></svg>

registerFormatType('citeo-semantic/font-size-selector', {
	title: 'Choix taille police',
	tagName: 'span',
	className: 'custom-size',
	edit: ( { isActive, onChange, value } ) => {
		const [size, setSize] = useState('ds-text-base');

		const applySize = (val) => {
			const sizeMatch = FONT_SIZE_FORMATS.find(el => el.className === val)

			if(sizeMatch) {
				onChange(
					applyFormat(value, {
						attributes: {
							class: `${val}`
						},
						type: 'citeo-semantic/font-size-selector',
					})
				);
				setSize(val);
			} else {
				console.log('Remove custom size');
				onChange(
					removeFormat(value, 'citeo-semantic/font-size-selector')
				);
				setSize('');
			}   
		}

		return (
			<Dropdown
				popoverProps={{
					placement: 'right-start',
					modifiers: [
						{
							name: 'preventOverflow',
							options: {
								boundariesElement: 'viewport',
								padding: 24,
							},
						}
					],
				}}
				renderToggle={({ isOpen, onToggle, ref }) => (
					<RichTextToolbarButton
						icon={sizeIcon}
						title="Choix taille police"
						onClick={onToggle}
						isActive={isActive || isOpen}
						ref={ref}
					/>
				)}
				renderContent={() => (
					<MenuGroup label={__('Choisir une taille', 'citeo')}>
						{FONT_SIZE_FORMATS.map(({ className, title }) => (
							<MenuItem
								key={className}
								icon={size === className ? 'yes' : null}
								onClick={() => {
									applySize(className);
								}}
							>
								{title}
							</MenuItem>
						))}
						<MenuItem
							isDestructive
							onClick={() => {
								applySize('');
							}}
						>
							{__('Supprimer le style', 'citeo')}
						</MenuItem>
					</MenuGroup>
				)}
			/>
		)
	},
});