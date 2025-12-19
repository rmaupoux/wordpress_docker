import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl } from "@wordpress/components";
import { useEffect, useState } from 'react';

import { ICON_NAME_LIST } from '../../../citeo-semantic/node_modules/@citeo/ds-citeo'

import { addFilter } from "@wordpress/hooks";
import { createHigherOrderComponent } from "@wordpress/compose";

import './editor.scss';

/**
 * Add the attribute to the block.
 * This is the attribute that will be saved to the database.
 *
 * @param {object} settings block settings
 * @param {string} name block name
 * @returns {object} modified settings
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/filters/block-filters/#blocks-registerblocktype
 */
addFilter(
	"blocks.registerBlockType",
	"b2b/navigation-link",
	function (settings, name) {
		if (name !== "core/navigation-link" && name !== "core/navigation-submenu") {
			return settings;
		}

		return {
			...settings,
			attributes: {
				...settings.attributes,
				hasIcon: {
					type: "boolean",
					default: false,
				},
				dsIcon: {
					type: "string",
					default: "",
				},
				icon: {
					type: "string",
					default: ""
				}
			},
		};
	}
);

/**
 * Edit component for the block.
 *
 * @param {object} props block props
 * @returns {JSX}
 */
function Edit({ attributes, setAttributes, name }) {
	const { opensInNewTab, icon, hasIcon, dsIcon } = attributes;
	const [iconTag, setIconTag] = useState()

	const resetEntry = {
		label: 'Aucun',
		value: ''
	}

	// Icônes génériques imageant le contenu de la page
	const ICON_GENERIC_LIST = [
		'icon-core_acceleration',
		'icon-core_activity',
		'icon-core_adaptability',
		'icon-core_agreement',
		'icon-core_archive',
		'icon-core_award',
		'icon-core_balance',
		'icon-core_bolt',
		'icon-core_book',
		'icon-core_box',
		'icon-core_briefcase',
		'icon-core_calendar',
		'icon-core_cloud',
		'icon-core_coffee',
		'icon-core_communication',
		'icon-core_company',
		'icon-core_consumer',
		'icon-core_2-consumers',
		'icon-core_dollar-sign',
		'icon-core_euro-sign',
		'icon-core_feather',
		'icon-core_frown',
		'icon-core_funding',
		'icon-core_gift',
		'icon-core_globe',
		'icon-core_heart',
		'icon-core_incentive-calculator',
		'icon-core_map-pin',
		'icon-core_megaphone',
		'icon-core_meh',
		'icon-core_message-square',
		'icon-core_recommandation',
		'icon-core_rocket',
		'icon-core_rss',
		'icon-core_shopping-cart',
		'icon-core_smile',
		'icon-core_star',
		'icon-core_sun',
		'icon-core_tag',
		'icon-core_target',
		'icon-core_trending-down',
		'icon-core_trending-up',
		'icon-core_truck',
		'icon-core_umbrella',
		'icon-core_watch',
		'icon-core_wave',
		'icon-core_wind'
	]
	
	const ICON_GENERIC_LIST_FILTER = ICON_GENERIC_LIST.filter(icon => ICON_NAME_LIST.includes(icon)) // Make sure the icon list is included in the DS list and therefore has a react component associated
	const ICON_GENERIC_SELECT = ICON_GENERIC_LIST_FILTER.map(icon => {
		return {label: icon, value: icon}
	});
	ICON_GENERIC_SELECT.unshift(resetEntry);

	// Icônes thématisées imageant le contenu de la page
	const ICON_METIER_LIST = [
		'icon-core_abandoned-waste',
		'icon-core_adelphe',
		'icon-core_candy',
		'icon-core_citeo',
		'icon-core_care-hygiene',
		'icon-core_cup-straw',
		'icon-core_droplet',
		'icon-core_ecodesign',
		'icon-core_ecomodulation-check',
		'icon-core_ecomodulation-cross',
		'icon-core_ecomodulation-setting',
		'icon-core_experimentation',
		'icon-core_flight-takeoff',
		'icon-core_glass',
		'icon-core_hand-helping',
		'icon-core_lightweight-packaging',
		'icon-core_package',
		'icon-core_recycle',
		'icon-core_refresh-ccw',
		'icon-core_refresh-cw',
		'icon-core_responsible-communication',
		'icon-core_restauration',
		'icon-core_selective-collection',
		'icon-core_shopping-bag',
		'icon-core_thermometer',
		'icon-core_tree',
		'icon-core_user-tri',
		'icon-core_waste-sorting',
		'icon-core_weight',
	]
	const ICON_METIER_LIST_FILTER = ICON_NAME_LIST.filter(icon => ICON_METIER_LIST.includes(icon)) // Make sure the icon list is included in the DS list and therefore has a react component associated
	const ICON_METIER_SELECT = ICON_METIER_LIST_FILTER.map(icon => {
		return {label: icon, value: icon}
	});
	ICON_METIER_SELECT.unshift(resetEntry);

	// Images donnant à l'utilisateur un feedback visuel sur une fonctionnalité du site
	const ICON_NAVIGATION_LIST = [
		'icon-core_alert-triangle',
		'icon-core_arrow-down',
		'icon-core_arrow-up',
		'icon-core_arrow-right',
		'icon-core_arrow-up-right',
		'icon-core_arrow-left',
		'icon-core_bell',
		'icon-core_check',
		'icon-core_chevron-down',
		'icon-core_chevron-left',
		'icon-core_chevron-right',
		'icon-core_chevron-up',
		'icon-core_download',
		'icon-core_file-text',
		'icon-core_flag',
		'icon-core_help-circle',
		'icon-core_home',
		'icon-core_image-1',
		'icon-core_info',
		'icon-core_mail',
		'icon-core_menu',
		'icon-core_phone',
		'icon-core_pinned',
		'icon-core_problem',
		'icon-core_slash',
		'icon-core_trash-2',
		'icon-core_user',
		'icon-core_x',
	]
	const ICON_NAVIGATION_LIST_FILTER = ICON_NAME_LIST.filter(icon => ICON_NAVIGATION_LIST.includes(icon)) // Make sure the icon list is included in the DS list and therefore has a react component associated
	const ICON_NAVIGATION_SELECT = ICON_NAVIGATION_LIST_FILTER.map(icon => {
		return {label: icon, value: icon}
	});
	ICON_NAVIGATION_SELECT.unshift(resetEntry);

	useEffect(() => {
		const newIconTag = dsIcon ? `${dsIcon.replace('icon-core_', '')}-icon-component` : ''

		setIconTag( newIconTag );
	}, [dsIcon]);

	return (
		<>
			<InspectorControls>
				<PanelBody title={'Customisation du lien'}>	

					{name !== 'core/navigation-submenu' && (
						<ToggleControl 
							label="Ce lien redirige vers un autre site web."
							help={
								opensInNewTab
									? 'Le lien va s\'ouvrir dans un nouvel onglet.'
									: 'Le lien s\'ouvrira dans l\'onglet actuel.'
							}
							checked={ opensInNewTab }
							onChange={(val) => {
								setAttributes( { opensInNewTab: val } );
							}}
						/>
					)}							

					<ToggleControl 
						label="Ce lien a une icône."
						help={
							hasIcon
								? 'Une icône peut-être ajoutée à gauche du lien.'
								: 'Pas d\'icône affichée.'
						}
						checked={ hasIcon }
						onChange={(val) => {
							setAttributes( { hasIcon: val, icon: '', dsIcon: '' } );
						}}
					/>

					{hasIcon && (
						<>
							<SelectControl
								label={'Icônes navigation'}
								value={dsIcon}
								options={ICON_NAVIGATION_SELECT}
								onChange={(val) => setAttributes({ dsIcon: val, icon: '' })}
							/>
							<SelectControl
								label={'Icônes métiers'}
								value={dsIcon}
								options={ICON_METIER_SELECT}
								onChange={(val) => setAttributes({ dsIcon: val, icon: '' })}
							/>
							<SelectControl
								label={'Icônes génériques'}
								value={dsIcon}
								options={ICON_GENERIC_SELECT}
								onChange={(val) => setAttributes({ dsIcon: val, icon: '' })}
							/>
							<SelectControl
								label={'Icônes custom'}
								value={icon}
								options={icons_list}
								onChange={(val) => setAttributes({ icon: val, dsIcon: ''})}
							/>
						</>
					)}
					
				</PanelBody>
			</InspectorControls>
			
			{(hasIcon && iconTag && iconTag.length > 0) && 
				React.createElement(iconTag, {
					size: 16,
					color: 'var(--ds-icon-color)'
				})
			}
		</>
	);
}

/**
 * Add the edit component to the block.
 * This is the component that will be rendered in the editor.
 * It will be rendered after the original block edit component.
 *
 * @param {function} BlockEdit Original component
 * @returns {function} Wrapped component
 *
 * @see https://developer.wordpress.org/block-editor/developers/filters/block-filters/#editor-blockedit
 */
addFilter(
	"editor.BlockEdit",
	"b2b/separator",
	createHigherOrderComponent((BlockEdit) => {
		return (props) => {
			if (props.name !== "core/navigation-link" && props.name !== "core/navigation-submenu") {
				return <BlockEdit {...props} />;
			}

			const { opensInNewTab, icon, hasIcon, dsIcon } = props.attributes;

			useEffect(() => {
				const classList = props.attributes.className
				
				const classArr = classList?.split(' ');

				let cleanArr = []
				if(classArr) cleanArr = classArr.filter(cl => !cl.includes('has-icon'));
				
				if(hasIcon && icon !== '') {
					cleanArr.push(`has-icon`);
					cleanArr.push(`has-icon--${icon}`);
				}

				const setIcons = cleanArr.join(' ');
				props.setAttributes({ className: setIcons });
			}, [icon, opensInNewTab, dsIcon]);

			return (
				<div class="citeo-navigation-link-wrapper">
					<Edit {...props} />
					<BlockEdit {...props} />
					{opensInNewTab && (
						<arrow-up-right-icon-component size='12' color='var(--ds-semantic-color-layout-content-medium)'></arrow-up-right-icon-component>
					)}
				</div>
			);
		};
	})
);
