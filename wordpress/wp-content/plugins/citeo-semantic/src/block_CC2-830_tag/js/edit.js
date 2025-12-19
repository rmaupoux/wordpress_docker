import { useBlockProps, RichText, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, PanelRow, ToggleControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from "@wordpress/components";

import IconEdit from '../../block_MC-171_icon/js/edit';

import '../scss/editor.scss';

export default function Edit( {attributes, setAttributes} ) {
	const { tagText, hasIcon, iconPos, icon, dsIcon, isIllustration } = attributes

	const blockProps = useBlockProps({});

	return (
		<>
			<InspectorControls>
				<PanelBody title={'Options d\'icône'}>
					<PanelRow>
						<ToggleControl
							__nextHasNoMarginBottom
							label="Afficher une icône"
							checked={ hasIcon }
							onChange={(val) => {
								setAttributes( { hasIcon: val } );
							}}
						/>
					</PanelRow>	

					{hasIcon && (						
						<PanelRow>
							<ToggleGroupControl
								label="Position de l'icone"
								value={ iconPos }
								onChange={ (pos) => setAttributes({iconPos: pos})}
							>
								<ToggleGroupControlOption 
									value="left" 
									label="Gauche" 
									aria-label = {'L\'icône est à gauche du texte'}
									showTooltip = { true }
								/>
								<ToggleGroupControlOption
									value="right"
									label="Droite"
									aria-label = {'L\'icône est à droite du texte'}
									showTooltip = {true}
								/>
							</ToggleGroupControl>
						</PanelRow>
					)}
				</PanelBody>
			</InspectorControls>

			<span { ...blockProps } >
				{ (hasIcon && iconPos === 'left') && (
					<IconEdit 
						className='wp-block-citeo-semantic-icon'
						attributes={{ icon: icon, isIllustration: isIllustration, dsIcon: dsIcon }}
						setAttributes={setAttributes}
					/>
				)}
				<RichText 
					{ ...blockProps }
					tagName="span"
					className="tag-text"
					value={ tagText }
					onChange={ ( val ) => setAttributes( { tagText: val } ) }
					placeholder='Ajouter du texte...'
				/>
				{ (hasIcon && iconPos === 'right') && (
					<IconEdit 
						className='wp-block-citeo-semantic-icon'
						attributes={{ icon: icon, isIllustration: isIllustration, dsIcon: dsIcon }}
						setAttributes={setAttributes}
					/>
				)}
			</span>
		</>
	);
}