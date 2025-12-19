import { useBlockProps, InnerBlocks, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, SelectControl } from "@wordpress/components";

import { useDispatch, useSelect } from '@wordpress/data';

import { useFindNestedBlocks, ENV_LIST } from '../../../assets/utils'
import previewImg from '/assets/img/section-sommaire.jpg';

import { useEffect, useRef } from 'react';

import '../scss/editor.scss';

export default function Edit({ attributes, setAttributes, clientId }) {
	const { preview, pageTemplate, pageTitle, theme, subTheme } = attributes

	const uuid = crypto.randomUUID();

	// List the sections blocks to check for duplicate and block removal
    const sectionBlocks = useFindNestedBlocks(clientId, 'citeo-semantic/sticky-index-linked-section');
	// Find matching citeo-semantic/sticky-index-item blocks in current block
	const indexBlocks = useFindNestedBlocks(clientId, 'citeo-semantic/sticky-index-item');

    // Remove the paired menu/dropdown if a menu/dropdown-trigger is removed
    const { removeBlocks, updateBlockAttributes } = useDispatch('core/block-editor');
    const prevSectionBlocksRef = useRef(sectionBlocks);
	const prevIndexBlocksRef = useRef(indexBlocks);

	// Find the direct parent of the block to be removed
	const { getBlockHierarchyRootClientId, getBlock } = useSelect('core/block-editor');

	useEffect(() => {
		setAttributes({ clientId: clientId});
	}, [clientId]);

    useEffect(() => {
        const prevSectionBlocks = prevSectionBlocksRef.current;
		const prevIndexBlocks = prevIndexBlocksRef.current;
		const allLinkedBlocks = [...indexBlocks, ...sectionBlocks]

        // Find which blocks were removed by comparing previous and current.
        const currentIds = new Set(allLinkedBlocks.map(block => block.clientId));

        // Blocks that were in prev but not in current are the removed blocks
        const removedBlocks = [...prevSectionBlocks, ...prevIndexBlocks].filter(block => !currentIds.has(block.clientId));

        removedBlocks.forEach(removedBlock => {
            // Check if removed block is a 'menu/dropdown'
            if (removedBlock.name === 'citeo-semantic/sticky-index-linked-section' || removedBlock.name === 'citeo-semantic/sticky-index-item') {
                const removedUuid = removedBlock.attributes.uuid;
                
				if(!allLinkedBlocks.length) {
					console.warn(`All linked blocks have been removed. Exiting the function early.`);
					
					return;
				}

                const blocksToRemove = allLinkedBlocks.filter(block => 
                    block.attributes.uuid === removedUuid
                );

				if (!blocksToRemove.length) {
					console.warn('No linked block found. Some sections might be unsynchronized.')

					return;
				}

				// Remove the matching triggers
				const idsToRemove = blocksToRemove.map(block => block.clientId);
				const rootId = getBlockHierarchyRootClientId(idsToRemove[0]);

				console.log(`Removed the block ${idsToRemove}`);
				if(rootId) {
					idsToRemove.forEach(clientId => {
						updateBlockAttributes(clientId, {
							lock: { 
								remove: false
							}
						});
					});
					
					removeBlocks(idsToRemove, false, rootId);
				}
            }
        });

        // Update ref to current child blocks for next comparison
        prevSectionBlocksRef.current = sectionBlocks;
		prevIndexBlocksRef.current = indexBlocks;
    }, [sectionBlocks, indexBlocks, getBlockHierarchyRootClientId, removeBlocks]);

	useEffect(() => {
		const CURRENT_ENV = ENV_LIST.find(el => Array.from(document.body.classList).includes(el.value))
		
		if(CURRENT_ENV && !theme) {
			setAttributes( {theme: CURRENT_ENV.value} );
		}
	}, []);

	const ALLOWED_BLOCKS = [];

	const TEMPLATE = [
		['citeo-semantic/sticky-index-wrapper', {
			lock: {
				move: true,
				remove: true
			}
		}, 
			[
				['citeo-semantic/sticky-index-item', {
					uuid: uuid
				}]
			]
		],
		['core/group', {
			metadata: {
				name: 'Conteneur de sections'
			},
			lock: {
				move: true,
				remove: true
			},
			className: 'section-list',
			allowedBlocks: ['citeo-semantic/sticky-index-linked-section']
		}, 
			[
				['citeo-semantic/sticky-index-linked-section', {
					uuid: uuid
				}]
			]
		]
	];

	const blockProps = useBlockProps({
		className: `${pageTemplate}`
	});

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
				<PanelBody title={'Modèle de la page'} initialOpen={true}>
					<ToggleGroupControl
						label="Type de contenu"
						value={ pageTemplate }
						onChange={ (val) => setAttributes({pageTemplate: val})}

						style={{width: '100%'}}
					>
						<ToggleGroupControlOption 
							value="faq-template" 
							label="FAQ" 
							aria-label = {'Liste d\'accordéons avec questions / réponses'}
							showTooltip = { true }
						/>
						<ToggleGroupControlOption 
							value="text-template"
							label="Paragraphes" 
							aria-label = {'Enchaînement de paragraphe, notamment utilisé sur les pages Mentions légales.'}
							showTooltip = { true }
						/>
					</ToggleGroupControl>			
				</PanelBody> 
			</InspectorControls>
			
			<div {...blockProps}>
				{pageTemplate !== 'faq-template' && (
					<RichText 
						tagName='h1'
						className={`page-title ds-heading-1`}
						value={ pageTitle }
						onChange={ ( val ) => {
							setAttributes( { pageTitle: val } );
						} }
						placeholder='Titre de page.'
					/>
				)}
				
				<InnerBlocks 
					template={TEMPLATE}
					allowedBlocks={ALLOWED_BLOCKS}
				/>
			</div>
			
		</>
	);
}
