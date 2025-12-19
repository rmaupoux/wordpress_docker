import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useRef } from 'react';

import '../scss/editor.scss';

export default function Edit({ attributes, clientId }) {
    const { isTop } = attributes

    const blockProps = useBlockProps({});

    // List the children of the parent block to check for duplicate and block removal
    const childBlocks = useSelect((select) => {
        const { getBlocks } = select('core/block-editor');

        const blocks = clientId ? getBlocks(clientId) : [];

        return blocks;
    }, [clientId]);

    // Remove the paired menu/dropdown if a menu/dropdown-trigger is removed
    const { removeBlocks } = useDispatch('core/block-editor');
    const prevChildBlocksRef = useRef(childBlocks);

    useEffect(() => {
        const prevChildBlocks = prevChildBlocksRef.current;

        // Find which blocks were removed by comparing previous and current
        const currentIds = new Set(childBlocks.map(block => block.clientId));

        // Blocks that were in prev but not in current => removed blocks
        const removedBlocks = prevChildBlocks.filter(block => !currentIds.has(block.clientId));

        removedBlocks.forEach(removedBlock => {
            // Check if removed block is a 'menu/dropdown'
            if (removedBlock.name === 'menu/dropdown' || removedBlock.name === 'menu/dropdown-trigger') {
                const removedUuid = removedBlock.attributes.uuid;
                
                // Find matching menu/dropdown-trigger blocks in current childBlocks
                const blocksToRemove = childBlocks.filter(block => 
                    block.attributes.uuid === removedUuid
                );

                if (blocksToRemove.length) {
                    // Remove the matching triggers
                    const idsToRemove = blocksToRemove.map(block => block.clientId);
                    removeBlocks(idsToRemove, false, clientId);
                }
            }
        });

        // Update ref to current child blocks for next comparison
        prevChildBlocksRef.current = childBlocks;
    }, [childBlocks, clientId, removeBlocks]);

    const TEMPLATE_TOP = [
        ['core/group', {
            metadata: {
                name:'Retour haut de page'
            },
            className: 'back-to-top',
            layout: {
                type: 'flex',
                flexWrap: 'nowrap'
            },
            allowedBlocks: ['citeo-semantic/icon']
        }, 
            [
                ['citeo-semantic/icon', {
                    metadata: {
                        name: "Flèche vers le haut"
                    },
                    className: "back-top-icon",
                    icon: "",
                    dsIcon: "icon-core_arrow-up"
                }],
                ['citeo-semantic/icon', {
                    metadata: {
                        name: "Logo du site"
                    },
                    className: "back-top-logo",
                    icon: "",
                    dsIcon: "icon-core_citeo"
                }]
            ]
        ],
        ['core/paragraph', {
            content: 'Vous êtes ?',
            className: 'top-dropdown-item'
        }]
        ['core/navigation', {
            className:"top-menu",
            overlayMenu:"never",
            showSubmenuIcon:false
        }],
    ];

    const TEMPLATE_INTERNAL = [
        ['core/group', {
            metadata: {
                name:'Retour haut de page'
            },
            className: 'back-to-top',
            layout: {
                type: 'flex',
                flexWrap: 'nowrap'
            },
            allowedBlocks: ['citeo-semantic/icon']
        }, 
            [
                ['citeo-semantic/icon', {
                    metadata: {
                        name: "Flèche vers le haut"
                    },
                    className: "back-top-icon",
                    icon: "",
                    dsIcon: "icon-core_arrow-up"
                }],
                ['citeo-semantic/icon', {
                    metadata: {
                        name: "Logo du site"
                    },
                    className: "back-top-logo",
                    icon: "",
                    dsIcon: "icon-core_citeo"
                }]
            ]
        ],
        ['core/navigation', {
            className: "internal-menu",
            openSubmenusOnClick: true,
            overlayMenu: "never"
        }],
    ];

    const TEMPLATE = isTop ? TEMPLATE_TOP : TEMPLATE_INTERNAL

    const ALLOWED_BLOCKS = ['menu/dropdown', 'menu/dropdown-trigger', 'core/group', 'core/buttons', 'core/navigation', 'core/paragraph'];
    
    const innerBlocksProps = useInnerBlocksProps(blockProps, {
        template: TEMPLATE,
        allowedBlocks: ALLOWED_BLOCKS,
        layout: { type: 'flex' }
    });
    
    return (            
        <div {...innerBlocksProps} />
    );
}