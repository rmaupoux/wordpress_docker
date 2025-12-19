import { useBlockProps, InspectorAdvancedControls, RichText } from '@wordpress/block-editor';
import { TextControl } from "@wordpress/components";
import { useDispatch, useSelect } from '@wordpress/data';

import { useMemo, useEffect } from 'react';

import IconEdit from '../../../../citeo-semantic/src/block_MC-171_icon/js/edit';
import { useFindNestedBlocks } from '../../../../citeo-semantic/assets/utils';

import '../scss/editor.scss';

export default function Edit({ attributes, setAttributes, context, clientId }) {
	const { uuid, text, isDefaultActive, icon, isIllustration, dsIcon } = attributes;
	const sectionClientId = context["ds-citeocom/sector-list-id"]

	const { updateBlockAttributes } = useDispatch('core/block-editor');

	const allSectors = useFindNestedBlocks(sectionClientId, 'ds-citeocom/block-secteur');
	// Used to synchronize the sector watermark
	const linkedSector = allSectors?.find( (block) => block.attributes.uuid === uuid );

	const parentClientId = useSelect((select) => {
        const { getBlockRootClientId } = select('core/block-editor');
        return getBlockRootClientId(clientId);
    }, [clientId]);

	const childBlocks = useSelect((select) => {
        const { getBlocks } = select('core/block-editor');
        return parentClientId ? getBlocks(parentClientId) : [];
    }, [parentClientId]);

    const isDuplicate = useMemo(() => {
        const matching = childBlocks.filter((block) => block.name === 'ds-citeocom/block-tab' && block.attributes.uuid === uuid);

        return matching.length > 1;
    }, [childBlocks, uuid]);

	const sectorWrap = useSelect((select) => {
        const { getBlockRootClientId } = select('core/block-editor');
		if(!allSectors[0]) return undefined;

		return getBlockRootClientId(allSectors[0].clientId);
    }, [allSectors]);

    const { insertBlocks } = useDispatch('core/block-editor');

    useEffect(() => {
        if(!uuid || isDuplicate) {
            const id = crypto.randomUUID();
            const sectorBlock = wp.blocks.createBlock('ds-citeocom/block-secteur', { uuid: id, isDefaultActive: false });

			// tabWrapper should only contain one item here
			if(sectorWrap) {
				// undefined append the block at the end
				insertBlocks(sectorBlock, undefined, sectorWrap);
            	setAttributes( {uuid : id, name: '', isDefaultActive: false} );
			} else {
				console.warn('No sector wrapper found. The sector block cannot be added to the editor.')
			}
        }
    }, [uuid, sectorWrap]);

	let classList = []
	if(isDefaultActive) classList.push('tab-active');
	classList = classList.length > 0 ? classList.join(' ') : '';

	const blockProps = useBlockProps({
		className: classList
	});

	return (
		<>
			<InspectorAdvancedControls>
				<TextControl 
					label={ "ID à copier/coller" }
					value={ uuid }
					onChange={ (val) => setAttributes( {uuid: val} ) }
				/>	
			</InspectorAdvancedControls>

			<div {...blockProps} data-id={uuid}>
				<IconEdit 
					className='wp-block-citeo-semantic-icon'
					attributes={{ icon: icon, isIllustration: isIllustration, dsIcon: dsIcon }}
					setAttributes={setAttributes}
				/>
				<RichText
					tagName="span"
					className="ds-text-base"
					value={ text }
					allowedFormats={[]}
					onChange={ ( val ) => {
						if (linkedSector) {
							updateBlockAttributes(linkedSector.clientId, {
								name: val,
							});
						}
						setAttributes( { text: val } ) }
					}
					placeholder='Texte tabulation'
				/>
			</div>
		</>
	);
}
