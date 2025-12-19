import { useBlockProps, useInnerBlocksProps, InspectorControls, InspectorAdvancedControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from "@wordpress/components";


import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useMemo } from 'react';

import { useFindNestedBlocks } from '../../../../citeo-semantic/assets/utils'

import '../scss/editor.scss';

export default function Edit({ attributes, context, setAttributes, clientId }) {
	const { uuid, name, isDefaultActive } = attributes;

	const sectionClientId = context["ds-citeocom/sector-list-id"]

	const { updateBlockAttributes } = useDispatch('core/block-editor');

	const allTabs = useFindNestedBlocks(sectionClientId, 'ds-citeocom/block-tab');
	const allSectors = useFindNestedBlocks(sectionClientId, 'ds-citeocom/block-secteur');
	const linkedTab = allTabs?.find( (block) => block.attributes.uuid === uuid );

	const parentClientId = useSelect((select) => {
        const { getBlockRootClientId } = select('core/block-editor');
        return getBlockRootClientId(clientId);
    }, [clientId]);

	const childBlocks = useSelect((select) => {
        const { getBlocks } = select('core/block-editor');
        return parentClientId ? getBlocks(parentClientId) : [];
    }, [parentClientId]);

    const isDuplicate = useMemo(() => {
        const matching = childBlocks.filter((block) => block.name === 'ds-citeocom/block-secteur' && block.attributes.uuid === uuid);

        return matching.length > 1;
    }, [childBlocks, uuid]);

	const tabWrapper = useFindNestedBlocks(sectionClientId, 'citeo-semantic/horizontal-slider')

    const { insertBlocks } = useDispatch('core/block-editor');

    useEffect(() => {
        if(!uuid || isDuplicate) {
            const id = crypto.randomUUID();
            const sectorTab = wp.blocks.createBlock('ds-citeocom/block-tab', { uuid: id, isDefaultActive: false });

			// tabWrapper should only contain one item here
			if(tabWrapper && tabWrapper[0] && tabWrapper[0].clientId) {
				// undefined append the block at the end
				insertBlocks(sectorTab, undefined, tabWrapper[0].clientId);
            	setAttributes( {uuid : id, name: '', isDefaultActive: false} );
			} else {
				console.warn('No tabulation wrapper found. The tabulation block cannot be added to the editor.')
			}
        }
    }, [uuid, tabWrapper]);

	const TEMPLATE = [
		['core/image', {
			className: 'sector-img',
			lock: {
				remove: true,
				move: true
			}
		}], 
		['core/group', {
			metadata: {
				name: 'Colonne de droite'
			},
			className: 'sector-text-wrapper',
			allowedBlocks: [],
			lock: {
				remove: true,
				move: true
			}
		}, 
			[
				['core/group', {
					metadata: {
						name: 'Conteneur du titre'
					},
					className: 'title-wrapper',
					allowedBlocks: ['core/heading', 'citeo-semantic/tag'],
					lock: {
						remove: true,
						move: true
					}
				},
					[
						['citeo-semantic/tag', {
							placeholder: 'Nom du secteur',
						}],
						['core/heading', {
							levle: 3,
							className: 'ds-heading-3',
							placeholder: 'Titre de maximum 3 lignes',
							lock: {
								remove: true,
								move: true
							}
						}],
					]
				],
				['core/group', {
					metadata: {
						name: 'Conteneur du texte'
					},
					className: 'content-wrapper',
					allowedBlocks: ['core/paragraph', 'core/list'],
					lock: {
						remove: true,
						move: true
					}
				},
					[
						['core/paragraph', {
							className: 'ds-text-large',
							placeholder: 'Text d\'accroche de maximum 5 ~ 6 lignes',
							lock: {
								remove: true,
								move: true
							}
						}],
						['core/paragraph', {
							className: 'ds-text-paragraph',
							placeholder: 'Text descriptif ne pouvant dépasser la hauteur maximale du bloc.'
						}],
					]
				],
				['core/buttons', {
					lock: {
						remove: true,
						move: true
					}
				}, 
					[
						['core/button', {
							variationName: 'standard',
							text: 'Découvrir',
							suffix: 'Arrow-right'
						}],
					]
				]
			]
		]
	]

	const ALLOWED_BLOCKS = ['core/image'];

	let classList = []
	if(isDefaultActive) classList.push('tab-active');
	classList = classList.length > 0 ? classList.join(' ') : '';

	const blockProps = useBlockProps({
		className: classList
	});
	
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
		allowedBlocks: ALLOWED_BLOCKS
	});


	return (
		<>
			<InspectorControls>
				<PanelBody title={"Afficher / cacher le contenu"}>
					<ToggleControl
						label={ "Affiché par défaut" }
						help={ isDefaultActive ? 'Ce contenu sera affiché au chargement de la page.' : 'Ce contenu sera caché sans action de l\'utilisateur.' }
						checked={ isDefaultActive }
						onChange={ (val) => {
							if (linkedTab) {
								updateBlockAttributes(linkedTab.clientId, {
									isDefaultActive: val,
								});
							}
							setAttributes( {isDefaultActive: val} );

							// Remove the defaultActive from all other blocks
							if(val) {
								allSectors.forEach(sector => {
									if(sector.attributes.uuid !== uuid) updateBlockAttributes(sector.clientId, { isDefaultActive: false });
								});

								allTabs.forEach(tab => {
									if(tab.attributes.uuid !== uuid) updateBlockAttributes(tab.clientId, { isDefaultActive: false });
								});
							}
						} }
					/>					
				</PanelBody>								
			</InspectorControls>

			<InspectorAdvancedControls>
				<TextControl 
					label={ "ID à copier/coller" }
					value={ uuid }
					onChange={ (val) => setAttributes( {uuid: val} ) }
				/>	
			</InspectorAdvancedControls>
			<div data-id={uuid} data-name={name} {...innerBlocksProps} />
		</>
	);
}
