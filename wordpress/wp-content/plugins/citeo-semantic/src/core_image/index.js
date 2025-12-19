import { addFilter } from "@wordpress/hooks";
import { createHigherOrderComponent } from "@wordpress/compose";
import { InspectorControls, MediaUpload } from "@wordpress/block-editor";
import { PanelBody, PanelRow, TextareaControl, FocalPointPicker, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, } from "@wordpress/components";
import { useState, useEffect } from 'react';

const allowedBlocks = ['core/image'];

function addAttributes(settings, name) {
    if (!allowedBlocks.includes(name) || !settings.attributes) {
        return settings;
    }

    settings.attributes.mobileSrc = {
        type: "string",
        default: ""
    };

    settings.attributes.customCaption = {
        type: "string",
        default: ""
    };

    settings.attributes.focalPoint = {
        type: "object",
        default: { x: 0.5, y: 0.5 }
    };

    settings.attributes.objectFitType = {
        type: "string",
        default: "cover"
    };

    return settings;
}


const addAdvancedControls = createHigherOrderComponent((Block) => {
    return (props) => {

        const { name, attributes, setAttributes } = props;
        const { mobileSrc, customCaption, focalPoint, objectFitType, url } = attributes;
        const [localFocalPoint, setLocalFocalPoint] = useState(focalPoint || { x: 0.5, y: 0.5 });

        // Effet unique pour appliquer les styles en temps réel
        useEffect(() => {
           
            
            const timer = setTimeout(() => {
                // Chercher l'image dans l'éditeur (iframe ou document principal)
                let img = null;
                
                const iframe = document.querySelector('iframe[name="editor-canvas"]');
                if (iframe && iframe.contentDocument) {
                    const blockElement = iframe.contentDocument.querySelector(`[data-block="${props.clientId}"]`);
                    if (blockElement) {
                        img = blockElement.querySelector('div img') || blockElement.querySelector('img');
                    }
                }
                
                // Fallback sur le document principal
                if (!img) {
                    const blockElement = document.querySelector(`figure[data-block="${props.clientId}"]`);
                    if (blockElement) {
                        img = blockElement.querySelector('div img') || blockElement.querySelector('img');
                    }
                }
                
                // Appliquer les styles selon l'état
                if (img) {
                    
                    if (objectFitType === "cover" && localFocalPoint) {
                        img.style.objectFit = 'cover';
                        img.style.objectPosition = `${localFocalPoint.x * 100}% ${localFocalPoint.y * 100}%`;
                    } else {
                        img.style.objectFit = 'contain';
                        img.style.objectPosition = '';
                    }
                } 
            }, 100);
            
            return () => clearTimeout(timer);
        }, [objectFitType, localFocalPoint, url]); 

        // Si ce n'est pas le bon bloc, on quitte et on retourne le bloc original, inchangé
        if (!allowedBlocks.includes(name)) {
            return (
                <Block {...props} />
            )
        }

        // Ajout de l'élément dans l'inspecteur
        return (
            <>
                <Block {...props} />
                
                <InspectorControls>
                    <PanelBody 
                        title={"Gestion de l'image mobile"}
                        initialOpen={ true }
                    >
                        <PanelRow>
                            <MediaUpload
                                onSelect={(media) => {
                                    setAttributes({	mobileSrc: media.url });
                                }}
                                multiple={false}
                                title={'Téléversez votre image'}
                                render={({ open }) => (
                                    <>
                                        <button 
                                            onClick={open} 
                                            aria-label={'Uploadez votre fichier'}
                                            style={{
                                                padding: '.75rem 2rem',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                cursor: 'pointer',
                                                borderRadius: '.5rem',
                                                background: 'var(--wp-components-color-accent,var(--wp-admin-theme-color,#3858e9))',
                                                color: '#fff',
                                            }}
                                        >Téléverser l'image</button>
                                    </>
                                )}
                            />
                        </PanelRow>

                        {mobileSrc.length > 0 && 
                            <>
                                <PanelRow>
                                    Image mobile actuelle :
                                </PanelRow>

                                <PanelRow>
                                    <img 
                                        src={mobileSrc} 
                                        style={{
                                            width: '100%',
                                            maxHeight: '10rem',
                                            objectFit: 'contain',
                                            objectPosition: 'left center'
                                        }}
                                    />
                                </PanelRow>
                            </>
                        }
                        
                    </PanelBody>

                    <PanelBody 
                        title={"Caption personnalisé"}
                        initialOpen={ false }
                    >
                        <PanelRow>
                            <TextareaControl
                                label="Légende accessible via lecteur d'écran"
                                value={customCaption}
                                onChange={(value) => setAttributes({ customCaption: value })}
                                placeholder="Entrez une description accessible de l'image..."
                            />
                        </PanelRow>
                    </PanelBody>


                    <PanelBody title={'Paramètre d\'image'} initialOpen={true}>
                        <ToggleGroupControl
                            label="Affichage de l'image"
                            value={objectFitType}
                            onChange={(value) => setAttributes({ objectFitType: value })}
                            style={{width: '100%'}}
                        >
                            <ToggleGroupControlOption 
                                value="contain"
                                label="Entière" 
                                aria-label = {'L\'image non croppée occupe tout l\'espace disponible.'}
                                showTooltip = { true }
                            />
                            <ToggleGroupControlOption 
                                value="cover"
                                label="Point de focal" 
                                aria-label = {'Image avec point de focalisation défini.'}
                                showTooltip = { true }
                            />
					    </ToggleGroupControl>	

                    {objectFitType === "cover" && attributes.url && (
                            <PanelRow>
                                <FocalPointPicker
                                    __nextHasNoMarginBottom
                                    url={attributes.url}
                                    value={localFocalPoint}
                                    onDragStart={setLocalFocalPoint}
                                    onDrag={setLocalFocalPoint}
                                    onChange={(value) => {
                                        setLocalFocalPoint(value);
                                        setAttributes({ focalPoint: value });
                                    }}
                                />
                            </PanelRow>
                    )}		
				</PanelBody> 

                </InspectorControls>
            </>
        );
    };
}, 'addAdvancedControls');

// Ajout d’un nouvel attribut dans le bloc
addFilter(
    'blocks.registerBlockType',
    'ds-citeocom/image-custom-attributes',
    addAttributes
);
// Ajout des champs dans l’inspecteur du bloc
addFilter(
    'editor.BlockEdit',
    'ds-citeocom/image-custom-advanced-control',
    addAdvancedControls
);