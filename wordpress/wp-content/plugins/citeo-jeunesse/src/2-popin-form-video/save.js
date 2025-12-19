import { useBlockProps } from '@wordpress/block-editor';
import { RawHTML } from '@wordpress/element';

const Save = ({ attributes }) => {
    const {
        captchaSiteKey,
        currentLang,
        title,
        subtitle,
        selectLabel,
        textNumberKid,
        recieveActu,
        numberPlaceholder,
        numberLabel,
        emailPlaceholder,
        emailLabel,
        checkboxLabel,
        checkboxSondageLabel,
        disclaimer,
        telecharge,
        options
    } = attributes;

    return (
        <div {...useBlockProps.save()}>
            <div className="overlay" id="popinOverlay">
                <div className="popin-jeunesse">
                    <button className="close-button" id="closePopinButtonVideo">
                        &times;
                    </button>
                    <div className="wp-block-heading"><RawHTML>{title}</RawHTML></div>
                    <div className="Body-2"><RawHTML>{subtitle}</RawHTML></div>

                    <form id="form-jeunesse-video" method="POST">
                    <div className="input-group input-group--select">
                            <label>
                                <RawHTML>{selectLabel}</RawHTML>
                            </label>
                            <select id="selectJeunesseVideo" className="selectOption" name="statut">
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
                                    name="email" 
                                    id="emailVideo"
                                    placeholder={emailPlaceholder} />
                        </div>

                        <div id="check-video" className="check-video">
                            <label className="input-div">
                                <input
                                    type="checkbox"
                                    name="visionnement_video"
                                    id="receive_actu"
                                    value="true"
                                    className="check-video--checkbox"
                                />
                                <span><RawHTML>{recieveActu}</RawHTML></span>
                            </label>
                            <p className="check-video--text"><RawHTML>{textNumberKid}</RawHTML></p>
                            <div className="check-video--input">
                                <label><RawHTML>{numberLabel}</RawHTML><span class="required">*</span></label>
                                <input
                                    type="number"
                                    id="numberEnfantVideo"
                                    name="nombre_enfant"
                                    value=""
                                    placeholder={numberPlaceholder}
                                    min="0"
                                />
                            </div>
                        </div>
                        <label className="input-div">
                            <input
                                type="checkbox"
                                name="receive_news"
                                id="receiveNewsVideo"
                                value="true"
                                onChange="this.value = this.checked ? 'true' : 'false';"
                            />
                            <span><RawHTML>{checkboxLabel}</RawHTML></span>
                        </label>
                        <label className="input-div">
                            <input
                                type="checkbox"
                                name="refuse_surveys"
                                id="refuseSurveysVideo"
                                value="true"
                                onChange="this.value = this.checked ? 'true' : 'false';"
                            />
                            <span><RawHTML>{checkboxSondageLabel}</RawHTML></span>
                        </label>
                           
                        

                        
                        <input type="hidden" name="type" value="video"/>
                        <div
                            className="frc-captcha"
                            data-lang={currentLang === 'fr' ? 'fr' : 'en'}
                            data-sitekey={captchaSiteKey}
                        ></div>

                         <p className="font-small"><RawHTML>{disclaimer}</RawHTML></p>

                        <div className="popin-jeunesse--telecharge-video">
                            <button
                                type="submit"
                                className="btn-with-svg btn-with-svg--video"
                                name="submit_jeunesse_form_video"
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
