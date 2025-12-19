import { useBlockProps, BlockControls, LinkControl, RichText } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton, Popover } from "@wordpress/components";

import { useState } from 'react';

import '../scss/editor.scss';

export default function Edit({ attributes, setAttributes }) {
    const { cardLink, title, description } = attributes
    const [ isLinkPopoverVisible, setIsLinkPopoverVisible ] = useState( false );

    const blockProps = useBlockProps({});

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
                            clearable={ true }
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
                <div className='link-ttl-wrap' >
                    <RichText
                        tagName="h6"
                        className="link-ttl ds-text-base"
                        value={ title }
                        allowedFormats={[]}
                        onChange={ ( val ) => setAttributes( { title: val } ) }
                        placeholder='Titre lien'
                    />

                    <arrow-right-icon-component size="16" color="var(--ds-semantic-color-neutral-content-medium)" />
                </div>

                <RichText
					tagName="p"
					className="link-desc ds-text-small"
					value={ description }
                    allowedFormats={[]}
					onChange={ ( val ) => setAttributes( { description: val } ) }
					placeholder='Description'
				/>
            </div>
        </>   
    );
}