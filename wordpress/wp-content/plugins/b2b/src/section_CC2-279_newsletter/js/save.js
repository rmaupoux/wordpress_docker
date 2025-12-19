import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
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
