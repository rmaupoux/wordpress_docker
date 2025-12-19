import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { SelectControl, PanelBody, PanelRow, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from "@wordpress/components";
import { ICON_NAME_LIST } from '@citeo/ds-citeo';
import { useEffect, useState } from 'react';

import '../scss/editor.scss';

export default function Edit( {attributes, setAttributes} ) {

	const { icon, isIllustration, dsIcon, className } = attributes
	const [iconTag, setIconTag] = useState()
	const [addedClassName, setAddedClassName] = useState([])

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

	useEffect(() => {
		const addedClasses = [
			'wp-block-citeo-semantic-icon',
			isIllustration && 'illustration-icon',
			dsIcon ? 'ds-icon' : 'semantic-icon',
			icon && `has-icon--${icon}`,
			className
		].filter(Boolean);

		setAddedClassName(addedClasses.join(' '));
	}, [isIllustration, dsIcon, className, icon]);
	
	return (
		<>
			<span className={addedClassName}>
				{(iconTag && iconTag.length > 0) &&
					React.createElement(iconTag, {
						size: 16,
						color: 'var(--ds-icon-color)'
					})
				}
			</span> 

			<InspectorControls>
				<PanelBody title={"Choix de l'icône"}>	
					<PanelRow>
						<ToggleGroupControl
							label="Type d'icône'"
							value={ isIllustration }
							onChange={ (val) => {
								setAttributes({ isIllustration: val });
								setAttributes({ icon: '' });
								setAttributes({ dsIcon: '' });
							}}
						>
							<ToggleGroupControlOption 
								value = { false } 
								label = "Standard" 
								aria-label = {'Icône monochrome et simple'}
								showTooltip = { true }
							/>
							<ToggleGroupControlOption
								value = { true }
								label = "Illustration"
								aria-label = {'Icône multicolore et/ou plus détaillée'}
								showTooltip = { true }
							/>
						</ToggleGroupControl>
					</PanelRow>		

					{isIllustration ? 
						<PanelRow>
							<SelectControl
								label={'Icônes illustrations'}
								value={icon}
								options={illustration_list}
								onChange={(val) => setAttributes({ icon: val, dsIcon: '' })}
							/>
						</PanelRow>
					: 
						<>
							<PanelRow>
								<SelectControl
									label={'Icônes navigation'}
									value={dsIcon}
									options={ICON_NAVIGATION_SELECT}
									onChange={(val) => setAttributes({ dsIcon: val, icon: '' })}
								/>
							</PanelRow>
							<PanelRow>
								<SelectControl
									label={'Icônes métiers'}
									value={dsIcon}
									options={ICON_METIER_SELECT}
									onChange={(val) => setAttributes({ dsIcon: val, icon: '' })}
								/>
							</PanelRow>
							<PanelRow>
								<SelectControl
									label={'Icônes génériques'}
									value={dsIcon}
									options={ICON_GENERIC_SELECT}
									onChange={(val) => setAttributes({ dsIcon: val, icon: '' })}
								/>
							</PanelRow>
							<PanelRow>
								<SelectControl
									label={'Icônes custom'}
									value={icon}
									options={icons_list}
									onChange={(val) => {
										setIconTag( '' );
										setAttributes({ dsIcon: '', icon: val });
									}}
								/>
							</PanelRow>
						</>
					}
				</PanelBody>
			</InspectorControls>			
		</>
	);
}