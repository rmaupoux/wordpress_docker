import { useBlockProps, InnerBlocks, RichText, InspectorControls, useInnerBlocksProps } from '@wordpress/block-editor';
import { SelectControl, PanelBody, PanelRow, ToggleControl } from "@wordpress/components";
import { useEffect } from 'react';

import { ENV_LIST } from '../../../assets/env-list';

import '../scss/editor.scss';
import previewImg from '/assets/img/newsletter.png';

export default function Edit({ attributes, setAttributes }) {
	const {checkboxLabel, submitLabel, emailLabel, formDestination, preview, isEnglish, theme, themeSwapConfirm, subTheme } = attributes

	let detectedSiteName = '';
	let destination = '';

	const CURRENT_ENV = ENV_LIST.find(el => Array.from(document.body.classList).includes(el.value));
	if(CURRENT_ENV) {
		switch(CURRENT_ENV.value) {
			case "ds-subtheme-group":
				destination = 'onlr'; 
				detectedSiteName = 'Citeo';
				break;
			case "ds-subtheme-emp":
				destination = 'empg'; 
				detectedSiteName = 'Citeo';
				break;
			case "ds-subtheme-pro":
				destination = 'citeo-pro';
				detectedSiteName = 'Citeo Pro';
				break;
			case "ds-subtheme-sh":
				destination = 's&h'; 
				detectedSiteName = 'Citeo Soin & Hygiène';
				break;
			case "adelphe":
				destination = 'adelphe'; 
				detectedSiteName = 'Adelphe';
				break;
			default: 
				detectedSiteName = 'XXX';
				break;
		}
	}

	const isEnglishLanguage = document.body.classList.contains('pll-lang-en');

	if (!checkboxLabel) {		
		const defaultCheckboxText = `Vos données seront traitées par ${detectedSiteName} conformément à notre politique de confidentialité. J'accepte de recevoir la newsletter de ${detectedSiteName}.`;
	
		setAttributes({
			checkboxLabel: defaultCheckboxText,
			isEnglish: isEnglishLanguage,
			captchaSiteKey: typeof acfDataCaptcha !== 'undefined' ? acfDataCaptcha.captchaSiteKey : 'default-key'
		});
	}

	if (!formDestination) {
		setAttributes({
			formDestination: destination,
			isEnglish: isEnglishLanguage,
			captchaSiteKey: typeof acfDataCaptcha !== 'undefined' ? acfDataCaptcha.captchaSiteKey : 'default-key'
		});
	}

	const TEMPLATE = [
		['core/heading', {
			level: 3,
			content: '<span class="ds-heading-1">CONTACT</span>\n<span class="ds-heading-3">Inscrivez vous dès maintenant</span>'
		}],
		['core/paragraph', {
			className: 'ds-text-large',
			content: `Au rythme d\'une fois par mois maximum sur l\'actualité de ${detectedSiteName}. Abonnez-vous, c\'est gratuit.`
		}]
	];

	const ALLOWED_BLOCKS = ['core/heading', 'core/paragraph'];

	const blockProps = useBlockProps({
		className: `${theme} ${subTheme}`
	});

	useEffect(() => {
		const CURRENT_ENV = ENV_LIST.find(el => Array.from(document.body.classList).includes(el.value))
		
		if(CURRENT_ENV && !theme) {
			setAttributes( {theme: CURRENT_ENV.value} );
		}
	}, []);

	const newsletterOpt = [
		{
			label: "EMPG",
			value: "empg"
		},
		{
			label: "Soin & Hygiène",
			value: "s&h"
		},
		{
			label: "Citeo pro",
			value: "citeo-pro"
		},
		{
			label: "ONLR",
			value: "onlr"
		},
		{
			label: "Jeunesse",
			value: "jeunesse"
		},
		{
			label: "Adelphe",
			value: "adelphe"
		}
	]
	
	if (preview) {
        return (
            <>
                <img 
					src={previewImg} 
					alt="Preview"
					/>
            </>
        );
    }

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
		allowedBlocks: ALLOWED_BLOCKS,
		templateLock: false
	});
	
	return (
		<>
			<InspectorControls>
				<PanelBody title={"Embasement utilisateur"}>						
					<PanelRow>
						<SelectControl
							label={'Destination de l\'embasement'}
							value={formDestination}
							options={newsletterOpt}
							onChange={(val) => {
								setAttributes({ formDestination: val });
							}}
						/>
					</PanelRow>
				</PanelBody>
				
				<PanelBody title={'Choix du thème'} initialOpen={true}>
					<PanelRow>
						<ToggleControl 
							label="Activer/désactiver les thèmes couleurs d'autres filiales Citeo"
							help={
								themeSwapConfirm
									? 'Ces thèmes couleurs appartiennent à d\'autres filiales de Citeo. Activez-les seulement si vous devez illustrer ou mentionner ces marques dans votre page.'
									: 'Je ne souhaite pas activer les thèmes couleurs non natif au site web actuel.'
							}
							checked={ themeSwapConfirm }
							onChange={(val) => {
								const CURRENT_ENV = ENV_LIST.find(el => Array.from(document.body.classList).includes(el.value))

								if(!val && CURRENT_ENV) setAttributes({ theme: CURRENT_ENV.value });
								setAttributes( { themeSwapConfirm: val } );
							}}
						/>
					</PanelRow>

                    {themeSwapConfirm && (
                        <SelectControl
                            label={'Thème actif'}
                            value={theme}
                            options={ENV_LIST}
                            onChange={(value) => {
                                setAttributes({ theme: value });
								setAttributes({ subTheme: 'default' });
                            }}
                        />
                    )}
                    
                    {theme !== 'ds-subtheme-group' && (
                        <SelectControl
                            label={'Thème secondaire'}
                            value={subTheme}
                            options={ENV_LIST.find(el => el.value === theme)?.subThemes}
                            onChange={(value) => setAttributes({ subTheme: value })}
                        />
                    )}
                </PanelBody>
			</InspectorControls>

			<section {...innerBlocksProps}>
				<div className='newsletter-ttl-col'>
					<InnerBlocks 
						template={ TEMPLATE }
						allowedBlocks={ ALLOWED_BLOCKS }
						templateLock={ false }
					/>
				</div>

				<form className='newsletter-input-col'>
					<div className='input-group'>
						<RichText
							tagName="label"
							value={emailLabel}
							onChange={val => setAttributes({ emailLabel: val })}
							placeholder=""
							className="ds-text-base"
							htmlFor="citeo-newsletter-email"
						/>

						<input type='email' name='email' className='ds-text-base citeo-newsletter-email' placeholder=''/>
					</div>
					<div className='checkbox-wrap'>
						<input type='checkbox' name='agreement' className='citeo-newsletter-optin' />
						<RichText 
							tagName='label'
							value={ checkboxLabel }
							allowedFormats={ [ 'core/italic', 'core/link' ] }
							onChange={ ( val ) => setAttributes( { checkboxLabel: val } ) }
							placeholder={ 'Texte de la checkbox...' }
							className='ds-text-xsmall'
						/>
					</div>

					{/* Ajouter data-lang dans le div */}
					<div 
						className='frc-captcha' 
						data-sitekey="FCMITMCHB1FLUKKG" 
						data-lang={isEnglish ? 'en' : 'fr'}
					/>

					<div className='wp-block-button'>
						<RichText 
							tagName='a'
							value={ submitLabel }
							allowedFormats={ [] }
							onChange={ ( val ) => setAttributes( { submitLabel: val } ) }
							placeholder={ 'Texte du bouton' }
							className='wp-block-button__link wp-element-button'
						/>
					</div>

				</form>
			</section>
		</>
	);
}