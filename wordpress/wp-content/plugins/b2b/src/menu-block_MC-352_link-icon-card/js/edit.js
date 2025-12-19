import { useBlockProps, InnerBlocks, BlockControls, LinkControl, RichText } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton, Popover } from "@wordpress/components";

import { useState } from 'react';

import '../scss/editor.scss';

export default function Edit({ attributes, setAttributes }) {
    const { cardLink, title, description, label } = attributes
    const [ isLinkPopoverVisible, setIsLinkPopoverVisible ] = useState( false );

    const blockProps = useBlockProps({});

    const TEMPLATE = [
        ['citeo-semantic/icon', {}]
    ];

    const ALLOWED_BLOCKS = []
    
    return (         
        <>
            <BlockControls>
                <ToolbarGroup>
                    <ToolbarButton
                        icon="admin-links"
                        label="Modifier le lien"
                        onClick={ () => setIsLinkPopoverVisible( ( prev ) => !prev ) }
                        isPressed={ isLinkPopoverVisible }
                    />
                </ToolbarGroup>

                { isLinkPopoverVisible && (
                    <Popover
                        className="button-edit-popover"
                        position="bottom center"
                        onClose={ () => setIsLinkPopoverVisible( false ) }
                    >
                        <LinkControl
                            value={ cardLink }
                            onChange={ ( newUrl ) => setAttributes( {cardLink: newUrl } ) }
                        />

                        <ToolbarButton
                            icon="editor-unlink"
                            label="Enlever le lien"
                            onClick={ () => {
                                setAttributes({ cardLink: undefined });
                                setIsLinkPopoverVisible(false);
                            } }
                        />
                    </Popover>
                ) }
            </BlockControls>

            <div {...blockProps}>

                <InnerBlocks 
                    template={TEMPLATE}
                    allowedBlocks={ALLOWED_BLOCKS}
                    templateLock='insert'
                />

                <div className='text-wrapper'>
                    <RichText
                        tagName="h5"
                        className="link-ttl ds-heading-3"
                        value={ title }
                        allowedFormats={[]}
                        onChange={ ( val ) => setAttributes( { title: val } ) }
                        placeholder='Titre'
                    />

                    <RichText
                        tagName="p"
                        className="link-desc ds-text-paragraph"
                        value={ description }
                        allowedFormats={[]}
                        onChange={ ( val ) => setAttributes( { description: val } ) }
                        placeholder='Description'
                    />
                </div>

                <div className='link-label-wrap' >
                    <RichText
                        tagName="span"
                        className="link-label ds-text-base"
                        value={ label }
                        allowedFormats={[]}
                        onChange={ ( val ) => setAttributes( { label: val } ) }
                        placeholder='Label'
                    />

                    <arrow-right-icon-component size="16" color="var(--ds-semantic-color-neutral-content-medium)" />
                </div>
            </div>            
        </>   
    );
}