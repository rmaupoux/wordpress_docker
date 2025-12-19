import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, Button, SelectControl } from "@wordpress/components";
import { useDispatch, useSelect } from '@wordpress/data';

import { useEffect, useRef } from 'react';

import { useFindNestedBlocks, illustrations_list } from '../../../../citeo-semantic/assets/utils'

import '../scss/editor.scss';
import previewImg from '/assets/img/section-secteur.jpg';

export default function Edit({ setAttributes, clientId, attributes }) {
	const { preview, backgroundPictoUrl } = attributes

	// Add a reset entry to the option list
    illustrations_list.Aucun = '';
    const sortedKeys = Object.keys(illustrations_list).sort((a, b) => {
        if (a === "Aucun") return -1;
        if (b === "Aucun") return 1;
        return a.localeCompare(b)
    });

	// Generate a uuid to pass to the template
	const uuid = crypto.randomUUID();

	// List the sectors blocks to check for duplicate and block removal
    const sectorBlocks = useFindNestedBlocks(clientId, 'ds-citeocom/block-secteur');
	// Find matching menu/dropdown-trigger blocks in current sectorBlocks
	const tabBlocks = useFindNestedBlocks(clientId, 'ds-citeocom/block-tab');

    // Remove the paired menu/dropdown if a menu/dropdown-trigger is removed
    const { removeBlocks } = useDispatch('core/block-editor');
    const prevSectorBlocksRef = useRef(sectorBlocks);
	const prevTabBlocksRef = useRef(tabBlocks);

	// Find the direct parent of the block to be removed
	const { getBlockHierarchyRootClientId } = useSelect('core/block-editor');

	useEffect(() => {
		setAttributes({ clientId: clientId});

		if(backgroundPictoUrl === undefined) {
			setAttributes({ backgroundPictoUrl: illustrations_list.Boite });
		}
	}, [clientId]);

    useEffect(() => {
        const prevSectorBlocks = prevSectorBlocksRef.current;
		const prevTabBlocks = prevTabBlocksRef.current;
		const allLinkedBlocks = [...tabBlocks, ...sectorBlocks]

        // Find which blocks were removed by comparing previous and current.
        const currentIds = new Set(allLinkedBlocks.map(block => block.clientId));

        // Blocks that were in prev but not in current => removed blocks
        const removedBlocks = [...prevSectorBlocks, ...prevTabBlocks].filter(block => !currentIds.has(block.clientId));

        removedBlocks.forEach(removedBlock => {
            // Check if removed block is a 'menu/dropdown'
            if (removedBlock.name === 'ds-citeocom/block-secteur' || removedBlock.name === 'ds-citeocom/block-tab') {
                const removedUuid = removedBlock.attributes.uuid;
                
				if(!allLinkedBlocks.length) {
					console.warn(`All links blocks have been removed. Exiting the function early.`);
					
					return;
				}
                const blocksToRemove = allLinkedBlocks.filter(block => 
                    block.attributes.uuid === removedUuid
                );


				if (!blocksToRemove.length) {
					console.warn('No linked block found. Some section might be unsynchronized.')

					return;
				}

				// Remove the matching triggers
				const idsToRemove = blocksToRemove.map(block => block.clientId);
				const rootId = getBlockHierarchyRootClientId(idsToRemove[0]);

				console.log(`Removed the block ${idsToRemove}`);
				if(rootId) removeBlocks(idsToRemove, false, rootId);
            }
        });

        // Update ref to current child blocks for next comparison
        prevSectorBlocksRef.current = sectorBlocks;
		prevTabBlocksRef.current = tabBlocks;
    }, [sectorBlocks, tabBlocks, getBlockHierarchyRootClientId, removeBlocks]);

	const TEMPLATE = [
		['core/group', {
			metadata: {
				name: 'Colonne titre et tabulations'
			},
			layout: {
				type: 'flex',
				orientation: 'vertical'
			},
			allowedBlocks:[],
			className: 'left-col',
			lock: {
				remove: true,
				move: true
			}
		},
			[
				['core/heading', {
					level: 2,
					className: 'ds-heading-1',
					content: '<span class="custom-size ds-text-xsmall">Texte support</span>Titre de section'
				}],
				['citeo-semantic/horizontal-slider', {
					metadata: {
						name: 'Conteneur de tabulations'
					},
					allowedBlocks: ['ds-citeocom/block-tab'],
					isInfinite: false,
					isDraggable: true,
					step: 1,
					hasStepper: false,
					hasTotal: false,
					hasControls: true,
					isAuto: false,
					isRandom: false,
					lock: {
						remove: true,
					}
				}, 
					[
						['ds-citeocom/block-tab', {
							uuid: uuid,
							isDefaultActive: true
						}]
					]
				]
			]
		],
		['core/group', {
			metadata: {
				name: 'Conteneur de secteurs'
			},
			allowedBlocks: ['ds-citeocom/block-secteur'],
			className: 'right-col',
			lock: {
				remove: true,
				move: true
			}
		}, 
			[
				['ds-citeocom/block-secteur', {
					uuid: uuid,
					isDefaultActive: true
				}]
			]
		]
	];

	const ALLOWED_BLOCKS = [];

	const blockProps = useBlockProps({});

	if (preview) {
        return (
            <>
                <img src={previewImg} alt="Preview" />
            </>
        );
    }
	return (
		<>
			<InspectorControls>
				<PanelBody title={'Illustration décorative'}>
					<SelectControl
						label={'Liste des illustration'}
						value={
							sortedKeys.find((key) => illustrations_list[key] === backgroundPictoUrl)
						}
						options={[...sortedKeys.map((key) => ({
							label: key,
							value: key,
						}))]}
						onChange={(val) => setAttributes({ backgroundPictoUrl: illustrations_list[val]})}
					/>
					{backgroundPictoUrl && (
						<>
							<img src={backgroundPictoUrl} style={{ width: '100%', objectFit: 'contain', filter: 'brightness(0)' }} />

							<Button
								isDestructive
								onClick={() => setAttributes({ backgroundPictoUrl: '' })}
								style={{
									display: 'block',
									margin: 'auto'
								}}
							>
								Supprimer l'illustration
							</Button>
						</>
					)}
				</PanelBody>
			</InspectorControls>
			<section {...blockProps}>
				<InnerBlocks 
                    template={TEMPLATE}
                    allowedBlocks={ALLOWED_BLOCKS}
                />

				<div className='back-picto' style={{maskImage: `url(${backgroundPictoUrl})`}} />
			</section>
		</>
	);
}
