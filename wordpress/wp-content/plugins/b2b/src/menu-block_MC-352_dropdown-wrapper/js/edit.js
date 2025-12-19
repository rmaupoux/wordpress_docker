import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useMemo } from 'react';

import '../scss/editor.scss';

export default function Edit({ attributes, setAttributes, clientId }) {
    const { uuid, name } = attributes

    const blockProps = useBlockProps({});

    const parentClientId = useSelect((select) => {
        const { getBlockRootClientId } = select('core/block-editor');

        return getBlockRootClientId(clientId);
    }, [clientId]);

    const childBlocks = useSelect((select) => {
        const { getBlocks } = select('core/block-editor');

        const blocks = parentClientId ? getBlocks(parentClientId) : [];

        return blocks;
    }, [parentClientId]);

    const isDuplicate = useMemo(() => {
        const matching = childBlocks.filter((block) => block.name === 'menu/dropdown' && block.attributes.uuid === uuid);

        return matching.length > 1;
    }, [childBlocks]);

    const { insertBlocks } = useDispatch('core/block-editor');
    useEffect(() => {

        if(!uuid || isDuplicate) {
            const id = crypto.randomUUID();
            const dropdownTrigger = wp.blocks.createBlock('menu/dropdown-trigger', { uuid: id });

            // undefined append the block at the end
            insertBlocks(dropdownTrigger, undefined, parentClientId);
            setAttributes( {uuid : id, name: ''} );
        }

    }, []);

    const TEMPLATE = [
        ['core/heading', {
            metadata: {
                name: 'Titre de dropdown'
            },
            level: 4,
            className: 'dropdown-ttl ds-heading-3',
            lock: {
                move:true,
                remove:true
            }
        }],
        ['core/group', {
            metadata: {
                name: 'Corps de la modale'
            },
            className: 'dropdown-content',
            allowedBlocks: ['menu/link-image-card', 'menu/link-icon-card', 'menu/link-big-text', 'menu/link-list', 'menu/link-mag-latest'],
            layout: {
                type: 'flex'
            }
        }, 
            []
        ]
    ];

    const innerBlocksProps = useInnerBlocksProps(blockProps, {
        template: TEMPLATE,
        templateLock: false
    })
    
    return (         
        <>
            <div {...innerBlocksProps} data-id={uuid} data-name={name} />
        </>   
    );
}