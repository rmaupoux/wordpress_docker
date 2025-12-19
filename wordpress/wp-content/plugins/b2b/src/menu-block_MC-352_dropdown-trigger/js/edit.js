import { useBlockProps, RichText } from '@wordpress/block-editor';

import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useMemo } from 'react';

import '../scss/editor.scss';

export default function Edit({ attributes, setAttributes, clientId }) {
    const { uuid, content } = attributes

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
        const matching = childBlocks.filter((block) => block.name === 'menu/dropdown-trigger' && block.attributes.uuid === uuid);

        return matching.length > 1;
    }, [childBlocks]);

    const { insertBlocks, updateBlockAttributes } = useDispatch('core/block-editor');
    useEffect(() => {

        if(!uuid || isDuplicate) {
            const id = crypto.randomUUID();
            const dropdownWrap = wp.blocks.createBlock('menu/dropdown', { uuid: id });

            insertBlocks(dropdownWrap, 999, parentClientId);
            setAttributes( {uuid : id} );
        }

    }, []);
    
    return (            
        <>
            <div {...blockProps} data-id={uuid} >
                <RichText 
                    tagName="span"
                    className="btn-text"
                    value={ content }
                    onChange={ ( val ) => {
                        setAttributes( { content: val } );

                        const linkedDropdown = childBlocks.find( (block) => block.name === 'menu/dropdown' && block.attributes.uuid === uuid );

                        if (linkedDropdown) {
                            updateBlockAttributes(linkedDropdown.clientId, {
                                name: val,
                            });
                        }
                    } }
                    placeholder='Mon bouton'
                />
                <chevron-down-icon-component size="12" color="var(--ds-semantic-color-neutral-content-medium)"></chevron-down-icon-component>
            </div>
        </>
    );
}