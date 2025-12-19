import { useBlockProps, InspectorControls, MediaUpload, BlockControls, LinkControl } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToolbarGroup, ToolbarButton, Popover } from "@wordpress/components";
import { useEffect, useState } from 'react';

import { ENV_LIST } from '../../../assets/env-list';

import logoEMP from '../img/EMP-row.svg';
import logoPRO from '../img/PRO-row.svg';
import logoSH from '../img/SH-row.svg';
import logoADELPHE from '../img/ADELPHE-row.svg';
import logoGROUP from '../img/GROUP-row.svg';

import '../scss/editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const { theme, cardLink, logoURL, backgroundImgUrl } = attributes
	const [ isLinkPopoverVisible, setIsLinkPopoverVisible ] = useState( false );

	const blockProps = useBlockProps({
		className: `${theme ? theme : ''}`
	});

	useEffect(() => {
		const CURRENT_ENV = ENV_LIST.find(el => Array.from(document.body.classList).includes(el.value))
		
		if(CURRENT_ENV && !theme) {
			setAttributes( {theme: CURRENT_ENV.value} );
		}
		
	}, []);

	useEffect(() => {
		switch(theme) {
			case "ds-subtheme-emp":
				setAttributes( { logoURL: logoEMP } );
				break;
			case "ds-subtheme-pro":
				setAttributes( { logoURL: logoPRO } );
				break;
			case "ds-subtheme-sh":
				setAttributes( { logoURL: logoSH } );
				break;
			case "adelphe":
				setAttributes( { logoURL: logoADELPHE } );
				break;
			default: 
				setAttributes( { logoURL: logoGROUP } );
				break;
		}
	}, [theme]);

	return (
		<>
			<InspectorControls>
                <PanelBody title={'Choix de la filiale'} initialOpen={true}>
					<SelectControl
						label={'Filiale sélectionnée'}
						value={theme}
						options={ENV_LIST}
						onChange={(value) => {
							setAttributes({ theme: value });
						}}
					/>
                </PanelBody>

				<PanelBody title={'Image de fond'}>										
					<MediaUpload
						onSelect={(media) => {
							setAttributes({	backgroundImgUrl: media.url });
						}}
						multiple={false}
						title={'Choix du picto'}
						render={({ open }) => (
							<>
								<button 
									onClick={open} 
									aria-label={'Téléversez votre picto'}
									style={{
										width: '100%',
										padding: 'var(--ds-semantic-spacing-s) var(--ds-semantic-spacing-xl)',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										cursor: 'pointer',
										borderRadius: '.5rem',
										border: 'none',
										background: 'var(--wp-admin-theme-color)',
										color: 'var(--ds-semantic-color-layout-invert-content-medium)',
										fontSize: 'var(--ds-core-typography-font-size-xs)'
									}}
								>Choisir l'image de fond</button>
							</>
						)}
					/>

					{backgroundImgUrl && (
						<>
							<img src={backgroundImgUrl} style={{width: '100%'}} />
						</>
					)}
				</PanelBody>
			</InspectorControls>


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


			<div {...blockProps} style={{backgroundImage: `url(${backgroundImgUrl})`}}>
				<div className='filiale-card'>
					<img src={logoURL} className='filiale-logo' />

					<arrow-right-icon-component size="16" color="var(--ds-semantic-color-neutral-content-medium)" />
				</div>
			</div>
		</>
	);
}
