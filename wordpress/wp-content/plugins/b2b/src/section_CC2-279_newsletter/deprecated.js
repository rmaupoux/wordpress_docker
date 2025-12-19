import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';

/*
* Copy and paste what you had in your previous save.js here
*/

const v8 = {
   
	attributes: {
		"checkboxLabel": {
            "type": "string",
			"default": ""
        },
		"submitLabel": {
            "type": "string",
			"default": "S'inscrire"
        },
		"preview": {
			"type": "boolean",
			"default": false
    	},
		"isEnglish": {
			"type": "boolean",
			"default": false 
		},
		"captchaSiteKey": {
            "type": "string",
            "default": "default-key"
        },
		"formDestination": {
			"type": "string"
		},
		"theme": {
            "type": "string",
            "default": ""
        },
		"subTheme": {
            "type": "string",
            "default": "default"
        },
        "themeSwapConfirm": {
            "type": "boolean",
            "default": false
        },
		"emailLabel": {
			"type": "string",
			"default": "Adresse e-mail"
		}
	},

    supports: {
		"html": false
	},

    migrate(attributes) {
		const legacyToNewMap = {
			'ds-subtheme-pro': 'citeo-pro',
		};

		return {
			...attributes,
			formDestination: legacyToNewMap[attributes.formDestination] || attributes.formDestination
		};
	},
    
    save({ attributes }) {
        const { checkboxLabel, submitLabel, emailLabel, isEnglish, captchaSiteKey, formDestination, theme, subTheme } = attributes;

        const blockProps = useBlockProps.save({
            className: `${theme} ${subTheme}`
        });

        return (
            <section {...blockProps}>
                <div className='newsletter-ttl-col'>
                    <InnerBlocks.Content />
                </div>

                <form className='newsletter-input-col' method="post" action='/wp-admin/admin-ajax.php'>
                    <input type='hidden' name='type_newsletter' className='citeo-newsletter-type-newsletter' value={ formDestination } />
                    <div className='input-group'>
                        <RichText.Content
                            tagName="label"
                            value={emailLabel || "Adresse e-mail"}
                            className="ds-text-base"
                            htmlFor="citeo-newsletter-email"
                        />
                        <input type='email' name='email' className='ds-text-base citeo-newsletter-email' placeholder=''/>
                    </div>
                    <div className='checkbox-wrap'>
                        <input type='checkbox' name='agreement' className='citeo-newsletter-optin' />
                        <RichText.Content
                            tagName="label"
                            value={checkboxLabel}   
                            className='ds-text-xsmall'
                        />
                    </div>

                    <div className='frc-captcha' data-lang={isEnglish ? 'en' : 'fr'} data-sitekey={captchaSiteKey} />

                    <div className='wp-block-button'>
                        <RichText.Content 
                            tagName="button" 
                            value={ submitLabel } 
                            className='wp-block-button__link wp-element-button newsletter'
                            type='submit'
                        />
                    </div>

                    <div className="form-message ds-text-small citeo-newsletter-message" />

                </form>
            </section>
        );
    }
}


const v7 = {
   
	attributes: {
		"checkboxLabel": {
            "type": "string",
			"default": ""
        },
		"submitLabel": {
            "type": "string",
			"default": "S'inscrire"
        },
		"preview": {
			"type": "boolean",
			"default": false
    	},
		"isEnglish": {
			"type": "boolean",
			"default": false 
		},
		"captchaSiteKey": {
            "type": "string",
            "default": "default-key"
        },
		"formDestination": {
			"type": "string"
		},
		"theme": {
            "type": "string",
            "default": ""
        },
		"subTheme": {
            "type": "string",
            "default": "default"
        },
        "themeSwapConfirm": {
            "type": "boolean",
            "default": false
        },
		"emailLabel": {
			"type": "string",
			"default": "Adresse e-mail"
		}
	},

    supports: {
		"html": false
	},

    migrate(attributes) {
		const legacyToNewMap = {
			'groupe-citeo': 'ds-subtheme-group',
			'citeo-pro': 'ds-subtheme-pro',
			'citeo-emp': 'ds-subtheme-emp',
			'citeo-sh': 'ds-subtheme-sh',
		};

		return {
			...attributes,
			theme: legacyToNewMap[attributes.theme] || attributes.theme
		};
	},
    
    save({ attributes }) {
        const { checkboxLabel, submitLabel, emailLabel, isEnglish, captchaSiteKey, formDestination, theme, subTheme } = attributes;

        const blockProps = useBlockProps.save({
            className: `${theme} ${subTheme}`
        });

        return (
            <section {...blockProps}>
                <div className='newsletter-ttl-col'>
                    <InnerBlocks.Content />
                </div>

                <form className='newsletter-input-col' method="post" action='/wp-admin/admin-ajax.php'>
                    <input type='hidden' name='type_newsletter' className='citeo-newsletter-type-newsletter' value={ formDestination } />
                    <div className='input-group'>
                        <RichText.Content
                            tagName="label"
                            value={emailLabel || "Adresse e-mail"}
                            className="ds-text-base"
                            htmlFor="citeo-newsletter-email"
                        />
                        <input type='email' name='email' className='ds-text-base citeo-newsletter-email' placeholder=''/>
                    </div>
                    <div className='checkbox-wrap'>
                        <input type='checkbox' name='agreement' className='citeo-newsletter-optin' />
                        <RichText.Content
                            tagName="label"
                            value={checkboxLabel}   
                            className='ds-text-xsmall'
                        />
                    </div>

                    <div className='frc-captcha' data-lang={isEnglish ? 'en' : 'fr'} data-sitekey={captchaSiteKey} />

                    <div className='wp-block-button'>
                        <RichText.Content 
                            tagName="button" 
                            value={ submitLabel } 
                            className='wp-block-button__link wp-element-button newsletter'
                            type='submit'
                        />
                    </div>

                    <div className="form-message ds-text-small citeo-newsletter-message" />

                </form>
            </section>
        );
    }
}

const v6 = {
   
	attributes: {
		"checkboxLabel": {
            "type": "string",
			"default": ""
        },
		"submitLabel": {
            "type": "string",
			"default": "S'inscrire"
        },
		"preview": {
			"type": "boolean",
			"default": false
    	},
		"isEnglish": {
			"type": "boolean",
			"default": false 
		},
		"captchaSiteKey": {
            "type": "string",
            "default": "default-key"
        },
		"formDestination": {
			"type": "string"
		},
		"theme": {
            "type": "string",
            "default": ""
        },
        "themeSwapConfirm": {
            "type": "boolean",
            "default": false
        },
        "privacyLink": {
            "type": "string",
            "default": ""
        }
	},
    supports: {
		"html": false,
		"multiple": false,
		"align": ["full"]
	},
    save({ attributes }) {
    const { checkboxLabel, submitLabel, isEnglish, captchaSiteKey, formDestination, theme, privacyLink } = attributes;

    const blockProps = useBlockProps.save({
        className: `${theme}`
    });

    return (
        <div {...blockProps}>
            <div className='newsletter-ttl-col'>
                <InnerBlocks.Content />
            </div>

            <form className='newsletter-input-col' id="citeo-newsletter-form" method="post" action='/wp-admin/admin-ajax.php'>
                <input type='hidden' name='type_newsletter' id='citeo-newsletter-type-newsletter' value={ formDestination } />

                <input type='text' name='email' id="citeo-newsletter-email" className='ds-text-base' placeholder='Entrer mon email'/>

                <div className='checkbox-wrap'>
                    <input type='checkbox' name='agreement' id='citeo-newsletter-optin' />
                    <RichText.Content 
                        tagName="label" 
                        value={ checkboxLabel } 
                        className='ds-text-xsmall'
                    />
                    {privacyLink && (
                        <a href={privacyLink} className="privacy-link" target="_blank" rel="noopener noreferrer">
                            Politique de confidentialité
                        </a>
                    )}
                </div>

                <div className='frc-captcha' data-lang={isEnglish ? 'en' : 'fr'} data-sitekey={captchaSiteKey} />

                <div className='wp-block-button'>
                    <RichText.Content 
                        tagName="button" 
                        value={ submitLabel } 
                        id='submit-newsletter'
                        className='wp-block-button__link wp-element-button'
                        type='submit'
                    />
                </div>

                <div id="citeo-newsletter-message" className="form-message ds-text-small" />

            </form>
        </div>
    );
}

}

const v5 = {
    attributes: {
        "checkboxLabel": {
            "type": "string",
			"default": ""
        },
		"submitLabel": {
            "type": "string",
			"default": "S'inscrire"
        },
		"preview": {
			"type": "boolean",
			"default": false
    	},
		"isEnglish": {
			"type": "boolean",
			"default": false 
		},
		"captchaSiteKey": {
            "type": "string",
            "default": "default-key"
        },
		"formDestination": {
			"type": "string"
		},
		"theme": {
            "type": "string",
            "default": ""
        },
        "themeSwapConfirm": {
            "type": "boolean",
            "default": false
        }
	},
    supports: {
		"html": false,
		"multiple": false,
		"align": ["full"]
	},
    save({ attributes }) {
    const { checkboxLabel, submitLabel, isEnglish, captchaSiteKey, formDestination, theme } = attributes;

    const blockProps = useBlockProps.save({
        className: `${theme}`
    });

    return (
        <div {...blockProps}>
            <div className='newsletter-ttl-col'>
                <InnerBlocks.Content />
            </div>

            <form className='newsletter-input-col' id="citeo-newsletter-form" method="post" action='/wp-admin/admin-ajax.php'>
                <input type='hidden' name='type_newsletter' id='citeo-newsletter-type-newsletter' value={ formDestination } />

                <input type='text' name='email' id="citeo-newsletter-email" className='ds-text-base' placeholder='Entrer mon email'/>

                <div className='checkbox-wrap'>
                    <input type='checkbox' name='agreement' id='citeo-newsletter-optin' />
                    <RichText.Content 
                        tagName="label" 
                        value={ checkboxLabel } 
                        className='ds-text-xsmall'
                    />
                </div>

                <div className='frc-captcha' data-lang={isEnglish ? 'en' : 'fr'} data-sitekey={captchaSiteKey} />

                <div className='wp-block-button'>
                    <RichText.Content 
                        tagName="button" 
                        value={ submitLabel } 
                        id='submit-newsletter'
                        className='wp-block-button__link wp-element-button'
                        type='submit'
                    />
                </div>

                <div id="citeo-newsletter-message" className="form-message ds-text-small" />

            </form>
        </div>
    );
}

}

const v4 = {
    attributes: {
        "checkboxLabel": {
            "type": "string",
			"default": "Vos données seront traitées par Citeo conformément à notre politique de confidentialité. J'accepte de recevoir la newsletter \"Ecoconception\" de Citeo."
        },
		"submitLabel": {
            "type": "string",
			"default": "S'inscrire"
        },
		"preview": {
			"type": "boolean",
			"default": false
    	},
		"isEnglish": {
			"type": "boolean",
			"default": false 
		},
		"captchaSiteKey": {
            "type": "string",
            "default": "default-key"
        }
	},

    supports: {
        "html": false,
        "multiple": true
    },

    save( attributes ) {    
        const { checkboxLabel, submitLabel, isEnglish, captchaSiteKey, formDestination } = attributes;

        const blockProps = useBlockProps.save({
            className: `newsletter-section`
        });

        return (
            <section {...blockProps}>
                <div className='newsletter-ttl-col'>
                    <InnerBlocks.Content />
                </div>

                <form className='newsletter-input-col' id="citeo-newsletter-form" method="post" action='/wp-admin/admin-ajax.php'>
                    <input type='hidden' name='type_newsletter' id='citeo-newsletter-type-newsletter' value={ formDestination } />

                    <div className='checkbox-wrap'>
                        <input type='checkbox' name='agreement' id='citeo-newsletter-optin' />
                        <RichText.Content 
                            tagName="label" 
                            value={ checkboxLabel } 
                            className='Body-4'
                        />
                    </div>

                    <div 
                        className='frc-captcha' data-lang={isEnglish ? 'en' : 'fr'} data-sitekey={captchaSiteKey} 
                    />

                    <div className='input-wrap'>
                        <input type='text' name='email' id="citeo-newsletter-email" className='Body-2' placeholder='Entrer mon email'/>
                        <div className='wp-block-button'>
                            <RichText.Content 
                                tagName="button" 
                                value={ submitLabel } 
                                id='submit-newsletter'
                                className='wp-block-button__link wp-element-button'
                                type='submit'
                            />
                        </div>
                    </div>

                    <div id="citeo-newsletter-message" className="form-message Body-3" />

                </form>
            </section>
        );
    }
}
const v3 = {
    attributes: {
        "checkboxLabel": {
            "type": "string",
			"default": "Vos données seront traitées par Citeo conformément à notre politique de confidentialité. J'accepte de recevoir la newsletter \"Ecoconception\" de Citeo."
        },
		"submitLabel": {
            "type": "string",
			"default": "S'inscrire"
        },
		"preview": {
			"type": "boolean",
			"default": false
    	},
		"isEnglish": {
			"type": "boolean",
			"default": false 
		},
		"captchaSiteKey": {
            "type": "string",
            "default": "default-key"
        }
	},

    supports: {
        "html": false,
        "multiple": true
    },

    save( attributes ) {    
        const { checkboxLabel, submitLabel, isEnglish, captchaSiteKey } = attributes;

    const blockProps = useBlockProps.save({
        className: `newsletter-section`
    });

    return (
        <section {...blockProps}>
            <div className='newsletter-ttl-col'>
                <InnerBlocks.Content />
            </div>

            <form className='newsletter-input-col' id="citeo-newsletter-form" method="post" action='/wp-admin/admin-ajax.php'>

                <div className='checkbox-wrap'>
                    <input type='checkbox' name='agreement' id='citeo-newsletter-optin' />
                    <RichText.Content 
                        tagName="label" 
                        value={ checkboxLabel } 
                        className='Body-4'
                    />
                </div>

                <div 
                    className='frc-captcha' data-lang={isEnglish ? 'en' : 'fr'} data-sitekey={captchaSiteKey} 
                />

                <div className='input-wrap'>
                    <input type='text' name='email' id="citeo-newsletter-email" className='Body-2' placeholder='Entrer mon email'/>
                    <div className='wp-block-button'>
                        <RichText.Content 
                            tagName="button" 
                            value={ submitLabel } 
                            id='submit-newsletter'
                            className='wp-block-button__link wp-element-button'
                            type='submit'
                        />
                    </div>
                </div>

                <div id="citeo-newsletter-message" className="form-message Body-3" />

            </form>
        </section>
    );
    }
}

const v2 = {
    attributes: {
        "checkboxLabel": {
            "type": "string",
        },
		"submitLabel": {
            "type": "string",
        },
		"preview": {
			"type": "boolean",
    	}
	},

    supports: {
        "html": false,
        "multiple": true
    },

    save( attributes ) {    
        const { checkboxLabel, submitLabel } = attributes

        const blockProps = useBlockProps.save({
            className: `newsletter-section`
        });

        return (
            <section {...blockProps}>
                <div className='newsletter-ttl-col' >
                    <InnerBlocks.Content />
                </div>

                <form className='newsletter-input-col' id="citeo-newsletter-form" method="post" action='/wp-admin/admin-ajax.php'>

                    <div className='checkbox-wrap'>
                        <input type='checkbox' name='agreement' id='citeo-newsletter-optin' />
                        <RichText.Content 
                            tagName="label" 
                            value={ checkboxLabel } 
                            className='Body-4'
                        />
                    </div>

                    <div className='frc-captcha' data-sitekey="FCMITMCHB1FLUKKG"/>

                    <div className='input-wrap'>
                        <input type='text' name='email' id="citeo-newsletter-email" className='Body-2' placeholder='Entrer mon email'/>
                        <div className='wp-block-button'>
                        <RichText.Content 
                            tagName="button" 
                            value={ submitLabel } 
                            id='submit-newsletter'
                            className='wp-block-button__link wp-element-button'
                            type='submit'
                        />
                        </div>
                    </div>

                    <div id="citeo-newsletter-message" className="form-message Body-3" />

                </form>
            </section>
        );
    }
}

const v1 = {
    attributes: {
        "checkboxLabel": {
            "type": "string",
        },
		"submitLabel": {
            "type": "string",
        },
		"preview": {
			"type": "boolean",
    	}
	},

    supports: {
        "html": false,
        "className": false
    },

    save( attributes ) {    
        const { checkboxLabel, submitLabel } = attributes

        const blockProps = useBlockProps.save({
            className: `newsletter-ttl-col`
        });

        return (
            <section className='newsletter-section'>
                <div {...blockProps}>
                    <InnerBlocks.Content />
                </div>

                <form className='newsletter-input-col' id="citeo-newsletter-form" method="post" action='/wp-admin/admin-ajax.php'>

                    <div className='checkbox-wrap'>
                        <input type='checkbox' name='agreement' id='citeo-newsletter-optin' />
                        <RichText.Content 
                            tagName="label" 
                            value={ checkboxLabel } 
                            className='Body-4'
                        />
                    </div>

                    <div className='frc-captcha' data-sitekey="FCMITMCHB1FLUKKG"/>

                    <div className='input-wrap'>
                        <input type='text' name='email' id="citeo-newsletter-email" className='Body-2' placeholder='Entrer mon email'/>
                        <div className='wp-block-button'>
                        <RichText.Content 
                            tagName="button" 
                            value={ submitLabel } 
                            id='submit-newsletter'
                            className='wp-block-button__link wp-element-button'
                            type='submit'
                        />
                        </div>
                    </div>

                    <div id="citeo-newsletter-message" className="form-message Body-3" />

                </form>
            </section>
        );
    }
}

// Latest version first in the array
export default [ v8, v7, v6, v5, v4, v3, v2, v1 ];