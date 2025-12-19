import { useBlockProps, InnerBlocks, RichText, InspectorAdvancedControls, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { TextControl, DropdownMenu, PanelBody, SelectControl } from "@wordpress/components";

import { useFindNestedBlocks, ENV_LIST } from '../../../assets/utils'

import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useMemo, useState } from 'react';

import '../scss/editor.scss';

const TagIcon = ({ tag }) => (
    <span
        style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
			height: '100%',
            fontWeight: '600',
            fontSize: '14px',
        }}
    >
        {tag.toUpperCase()}
    </span>
);

export default function Edit({ attributes, setAttributes, context, clientId }) {
	const { sectionTitle, uuid, tagName, htmlAnchor, theme, subTheme } = attributes
	const [allowedBlocks, setAllowedBlocks] = useState(['citeo-semantic/list-accordeon', 'core/paragraph', 'core/list']);

	const TAGS = [ 'H2', 'H3', 'H4' ];

	const sectionClientId = context["citeo-semantic/section-wrapper-id"]

	const { updateBlockAttributes } = useDispatch('core/block-editor');

	const allIndexes = useFindNestedBlocks(sectionClientId, 'citeo-semantic/sticky-index-item');
	const linkedIndex = allIndexes?.find( (block) => block.attributes.uuid === uuid );

	const parentClientId = useSelect((select) => {
        const { getBlockRootClientId } = select('core/block-editor');
        return getBlockRootClientId(clientId);
    }, [clientId]);

	const childBlocks = useSelect((select) => {
        const { getBlocks } = select('core/block-editor');
        return parentClientId ? getBlocks(parentClientId) : [];
    }, [parentClientId]);

    const isDuplicate = useMemo(() => {
        const matching = childBlocks.filter((block) => block.name === 'citeo-semantic/sticky-index-linked-section' && block.attributes.uuid === uuid);

        return matching.length > 1;
    }, [childBlocks, uuid]);

	const indexesWrapper = useFindNestedBlocks(sectionClientId, 'citeo-semantic/sticky-index-wrapper')

    const { insertBlocks } = useDispatch('core/block-editor');

    useEffect(() => {
        if(!uuid || isDuplicate) {
            const id = crypto.randomUUID();
            const sectionIndex = wp.blocks.createBlock('citeo-semantic/sticky-index-item', { uuid: id });

			// indexesWrapper should only contain one item here
			if(indexesWrapper && indexesWrapper[0] && indexesWrapper[0].clientId) {
				// undefined append the block at the end
				insertBlocks(sectionIndex, undefined, indexesWrapper[0].clientId);
            	setAttributes( {uuid : id, sectionTitle: ''} );
			} else {
				console.warn('No index wrapper found. The index block cannot be added to the editor.')
			}
        }
    }, [uuid, indexesWrapper]);

	useEffect(() => {
		
		// Changed the allowed blocks based on the template selected on the parent block
		if(context['citeo-semantic/sticky-index-page-template'] === 'faq-template') {
			setAllowedBlocks(['citeo-semantic/list-accordeon']);
			setAttributes({ tagName: 'H2' });
		}
		else if(context['citeo-semantic/sticky-index-page-template'] === 'text-template') {
			setAllowedBlocks(['core/paragraph', 'core/list']);
			setAttributes({ tagName: 'H3' });
		}

	}, [context['citeo-semantic/sticky-index-page-template']]);

	useEffect(() => {
		const CURRENT_ENV = ENV_LIST.find(el => Array.from(document.body.classList).includes(el.value))
		
		if(CURRENT_ENV && !theme) {
			setAttributes( {theme: CURRENT_ENV.value} );
		}
	}, []);

	const TEMPLATE = [];

	const blockProps = useBlockProps({
		id: htmlAnchor,
		className: `${theme ? ` ${theme}` : ''} ${subTheme}`
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
				
			<InspectorControls>
				{(theme !== 'ds-subtheme-group' && ENV_LIST.find(el => el.value === theme)) && (
					<PanelBody title={'Choix du thème'} initialOpen={true}>					
						
						<SelectControl
							label={'Thème secondaire'}
							value={subTheme}
							options={ENV_LIST.find(el => el.value === theme).subThemes}
							onChange={(value) => setAttributes({ subTheme: value })}
						/>

					</PanelBody>
				)}

				<PanelBody>
					<TextControl 
						label={ "Ancre HTML" }
						help={ "Ancre HTML que l'on peut passer dans l'url (précédé du symbole #) pour amener directement à un contenu de la page. Cette ancre doit être unique sur la page." }
						value={ htmlAnchor }
						onChange={ (val) => setAttributes( {htmlAnchor: val} ) }
					/>	
				</PanelBody>
			</InspectorControls>

			<BlockControls>
				<div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '1 / 1' }}>
					<DropdownMenu
						icon={ () => <TagIcon tag={ tagName } /> }
						label="Modifier le tag de titre"
						popoverProps={{
							placement: 'bottom-start',
						}}
						controls={ TAGS.map( (tag) => ({
							title: tag.toUpperCase(),
							isActive: tagName === tag,
							onClick: () => setAttributes({ tagName: tag }),
						})) }
					/>
				</div>
            </BlockControls>

			<section {...blockProps} data-uuid={uuid} >
				<RichText 
					tagName={ tagName }
					className={`section-title`}
					value={ sectionTitle }
					onChange={ ( val ) => {
						setAttributes( { sectionTitle: val } );

						if (linkedIndex) {
							updateBlockAttributes(linkedIndex.clientId, {
								sectionTitle: val,
							});
						}
					} }
					placeholder='Titre de section.'
				/>
				<InnerBlocks 
					template={TEMPLATE}
					allowedBlocks={allowedBlocks}
				/>
			</section>
		</>
	);
}
