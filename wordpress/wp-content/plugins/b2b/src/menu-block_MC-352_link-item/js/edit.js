import { useBlockProps, BlockControls, LinkControl, RichText } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton, Popover } from "@wordpress/components";

import { useState } from 'react';

import '../scss/editor.scss';

export default function Edit({ attributes, setAttributes }) {
    const { cardLink, label } = attributes
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

            <div { ...blockProps } >
                <RichText
                    tagName="span"
                    className="link-label ds-text-small"
                    value={ label }
                    allowedFormats={[]}
                    onChange={ ( val ) => setAttributes( { label: val } ) }
                    placeholder='Label du lien'
                />

                {cardLink && (
                    <arrow-right-icon-component size="16" color="var(--ds-semantic-color-neutral-content-medium)" />
                )}
            </div>
        </>
    );
}