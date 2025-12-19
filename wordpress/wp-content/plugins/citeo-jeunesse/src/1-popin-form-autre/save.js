import { useBlockProps } from '@wordpress/block-editor';
import { RawHTML } from '@wordpress/element';

const Save = ({ attributes }) => {
    const {
        captchaSiteKey,
        currentLang,
        title,
        subtitle,
        selectLabel,
        numberLabel,
        numberPlaceholder,
        emailPlaceholder,
        emailLabel,
        checkboxLabel,
        checkboxSondageLabel,
        disclaimer,
        textTelecharge,
        telecharge,
        options
    } = attributes;

    return (
        <div {...useBlockProps.save()}>
            <div className="overlay" id="popinOverlayAutre">
                <div className="popin-jeunesse">
                    <button className="close-button" id="closePopinButtonAutre">&times;</button>
                    <div className="wp-block-heading"><RawHTML>{title}</RawHTML></div>
                    <div className="Body-2"><RawHTML>{subtitle}</RawHTML></div>
                    <form id="form-jeunesse-autre" method="POST">
                        <div className="input-group">
                            <label>
                            <RawHTML>{selectLabel}</RawHTML>
                            </label>
                            <select id="selectJeunesseAutre" className="selectOption" name="statut">
                                {options.map((option, index) => (
                                    <option key={index} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                            
                        <div className="input-group input-group--mail">
                                <label><RawHTML>{emailLabel}</RawHTML></label>
                                <input 
                                    type="email"
                                    id="emailAutre"
                                    placeholder={emailPlaceholder}
                                    name="email" />
                        </div>
                       
                        <label className="input-div">
                            <input
                                type="checkbox"
                                name="receive_news"
                                id="receiveNewsAutre"
                                value="true"
                            />
                            <span><RawHTML>{checkboxLabel}</RawHTML></span>
                        </label>
                        <label className="input-div">
                            <input
                                type="checkbox"
                                name="refuse_surveys"
                                id="refuseSurveysAutre"
                                value="true"
                            />
                            <span><RawHTML>{checkboxSondageLabel}</RawHTML></span>
                        </label>
                        
                        <input type="hidden" name="type" value="PDF"/>
                        <div
                            className="frc-captcha"
                            data-lang={currentLang === 'fr' ? 'fr' : 'en'}
                            data-sitekey={captchaSiteKey}
                        ></div>
                        <p className="font-small"><RawHTML>{disclaimer}</RawHTML></p>
                        <div className="popin-jeunesse--telecharger">
                            <button
                                type="submit"
                                action="closePopinButtonAutre-submit"
                                name="submit_jeunesse_form_autre"
                                className="btn-with-svg btn-with-svg--download"
                            >
                                {telecharge}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Save;