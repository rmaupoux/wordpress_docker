/**
 * Add custom btn for RichText component
 */
import { registerFormatType, applyFormat, removeFormat, toggleFormat } from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { ColorPalette, Popover } from '@wordpress/components'
import { useSelect } from '@wordpress/data';

import { useState, useRef, useEffect } from 'react';

const titleZoro = ({ isActive, onChange, value }) => {
    
    const selectedBlock = useSelect( ( select ) => {
        return select( 'core/block-editor' ).getSelectedBlock();
    }, [] );

    if ( selectedBlock && (selectedBlock.name !== 'core/heading' && selectedBlock.name !== 'core/paragraph') ) {
        return;
    }

    // List of template class names where the zoro color option is activated
    const activeColorTemplate = ['onlr']
    const bodyClassList = [...document.body.classList]

    const hasColorOpt = activeColorTemplate.some(className => bodyClassList.includes(className))

    if(!hasColorOpt) {
        return (
            <RichTextToolbarButton
                icon="editor-underline"
                title="Texte souligné"
                onClick={() => {
                    onChange(
                        toggleFormat(value, {
                            type: 'ds-com-citeo/title-zoro',
                        })
                    );
                }}
                isActive={isActive}
            />
        );
    }

    // Color list of the color picker
    const colors = [
		{ name: 'Noir', color: '#000000' },
		{ name: 'Blanc', color: '#FFFFFF' },
		{ name: 'Gris', color: '#D1D5DB' },
		{ name: 'Bleu-clair', color: '#DBEAFE' },		
		{ name: 'Bleu', color: '#2563EB' },	
		{ name: 'Bleu-foncé', color: '#1E3A8A' },	
		{ name: 'Vert-clair', color: '#DCFCE7' },
		{ name: 'Vert', color: '#16A34A' },	
		{ name: 'Vert-foncé', color: '#14532D' },
		{ name: 'Rouge-clair', color: '#FEE2E2' },	
		{ name: 'Rouge', color: '#DC2626' },	
		{ name: 'Rouge-foncé', color: '#7F1D1D' },	
		{ name: 'Jaune-clair', color: '#FEF08A'},
		{ name: 'Jaune', color: '#FACC15'},
		{ name: 'Jaune-foncé', color: '#A16207'},
		{ name: 'Ambre-clair', color: '#FEF3C7' },	
		{ name: 'Ambre', color: '#F59E0B' },	
		{ name: 'Ambre-foncé', color: '#B45309' },
		{ name: 'Violet-clair', color: '#DDD6FE' },	
		{ name: 'Violet', color: '#8B5CF6' },	
		{ name: 'Violet-foncé', color: '#4C1D95' },
        { name: 'Cyan-clair', color: '#B7ECFF' },	
		{ name: 'Cyan', color: '#30CFFF' },	
		{ name: 'Cyan-foncé', color: '#02658A' }	
	]

    const [showPicker, setShowPicker] = useState(false);
    const [color, setColor] = useState('#000000');
    const optionRef = useRef();

    useEffect(() => {
        setShowPicker(false);
    }, [color]);

    const applyColor = (val) => {
        const colorMatch = colors.find(el => el.color === val)

        if(colorMatch) {
            onChange(
                applyFormat(value, {
                    attributes: {
                        class: `zoro-color--${colorMatch.name}`
                    },
                    type: 'ds-com-citeo/title-zoro',
                })
            );
            setColor(val);
        } else {
            console.log('Remove zoro');
            onChange(
                removeFormat(value, 'ds-com-citeo/title-zoro')
            );
            setColor('');
        }   
    }

    return (
        <>
            <RichTextToolbarButton
                icon="editor-underline"
                title="Texte avec soulignement coloré"
                onClick={() => {
                    setShowPicker(!showPicker)
                }}
                isActive={isActive}
                ref={optionRef}
            />

            {showPicker && (
                <Popover 
                    placement="top right"
                    anchor={optionRef.current}
                >
                    <div style={{ padding: '1rem' }}>
                        <ColorPalette 
                            label="Couleur du zoro"
                            value={color}
                            colors={colors}
                            onChange={(val) => applyColor(val)}
                            
                        />
                    </div>
                </Popover>
            )}
        </>
    );
}; 

registerFormatType('ds-com-citeo/title-zoro', {
    title: 'Texte souligné',
    tagName: 'span',
    className: 'underline',
    edit: titleZoro,
});