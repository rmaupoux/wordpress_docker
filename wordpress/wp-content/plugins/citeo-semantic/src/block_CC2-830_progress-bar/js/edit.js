import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, PanelRow, ColorPalette } from "@wordpress/components";

import '../scss/editor.scss';


export default function Edit( { attributes, setAttributes } ) {
	const { progress, color } = attributes

	const colorStyle = {
		"--progress-bar-color": color
	}

	const colors = [
		{ name: 'Noir', color: '#000000' },
		{ name: 'Blanc', color: 'var(--ds-semantic-color-layout-invert-content-medium)' },
		{ name: 'Gris', color: '#D1D5DB' },
		{ name: 'Bleu-clair', color: '#DBEAFE' },		
		{ name: 'Bleu', color: 'var(--ds-semantic-color-action-content-strong)' },	
		{ name: 'Bleu-foncé', color: '#1E3A8A' },	
		{ name: 'Vert-clair', color: '#DCFCE7' },
		{ name: 'Vert', color: 'var(--ds-semantic-color-success-content-medium)' },	
		{ name: 'Vert-foncé', color: '#14532D' },
		{ name: 'Rouge-clair', color: '#FEE2E2' },	
		{ name: 'Rouge', color: '#DC2626' },	
		{ name: 'Rouge-foncé', color: '#7F1D1D' },	
		{ name: 'Jaune-clair', color: '#FEF9C3'},
		{ name: 'Jaune', color: '#FACC15'},
		{ name: 'Jaune-foncé', color: '#A16207'},
		{ name: 'Ambre-clair', color: '#FEF3C7' },	
		{ name: 'Ambre', color: '#F59E0B' },	
		{ name: 'Ambre-foncé', color: '#B45309' },
		{ name: 'Violet-clair', color: '#EDE9FE' },	
		{ name: 'Violet', color: '#8B5CF6' },	
		{ name: 'Violet-foncé', color: '#4C1D95' },
	]

	const blockProps = useBlockProps({
		className: "progress-bar",
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={'Barre de progression'}>									
					<RangeControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={ "Pourcentage" }
						value={ progress }
						onChange={ (val) => setAttributes( { progress: val } ) }
						min={ 0 }
						max={ 100 }
						step={ 1 }
					/>
					<PanelRow>									
						<ColorPalette 
							label={'Couleur de la barre'}
							value={color}
							colors={colors}
							onChange={(selected) => setAttributes({ color: selected })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
				
			<progress { ...blockProps } 
				value={ progress }
				max="100"
				style={colorStyle}
			/>	
		</>					
	);
}
