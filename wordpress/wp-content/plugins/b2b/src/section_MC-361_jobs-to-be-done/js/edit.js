import { useBlockProps, useInnerBlocksProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from "@wordpress/components";

import '../scss/editor.scss';

import previewImg from '/assets/img/section-jobs-to-be-done.jpg';

export default function Edit({ attributes, setAttributes }) {
    const { preview, textSize } = attributes;
    
    const blockProps = useBlockProps({
        className: textSize
    });
    
    const TEMPLATE = [
        ['b2b/block-job-to-be-done']
    ];

    const ALLOWED_BLOCKS = ['b2b/block-job-to-be-done'];

    const innerBlocksProps = useInnerBlocksProps(blockProps, {
        template: TEMPLATE,
        allowedBlocks: ALLOWED_BLOCKS
    })
    
    if (preview) {
        return (
            <>
                <img src={previewImg} alt="Preview" />
            </>
        );
    }

    return (
        <>
            <InspectorControls>
				<PanelBody title={'Style de boutons'} initialOpen={true}>
					<ToggleGroupControl
						label="Format des boutons"
						value={ textSize }
						onChange={ (val) => setAttributes({textSize: val})}

						style={{width: '100%'}}
					>
						<ToggleGroupControlOption
							value="big-cta" 
							label="Grand" 
							aria-label={'Les liens sont dans leur grand format avec un espace blanc supplémentaire en dessous du texte.'}
							showTooltip={ true }
						/>
						<ToggleGroupControlOption 
							value="small-cta"
							label="Compact" 
							aria-label={'Les liens sont dans leur format compact avec des textes plus petits et espacements plus serrés.'}
							showTooltip={ true }
						/>
					</ToggleGroupControl>			
				</PanelBody> 
			</InspectorControls>

            <section {...innerBlocksProps } />
        </>
    );
}