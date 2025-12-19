import { useBlockProps, RichText } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';
import { TextControl, Button, SelectControl } from '@wordpress/components';
import { Icon, addCard, trash } from '@wordpress/icons';
import previewImgVideo from '../../assets/img/preview-form-mp4.png';

const Edit = ({ attributes, setAttributes }) => {
    const {
        title,
        subtitle,
        selectLabel,
        numberLabel,
        numberPlaceholder,
        recieveActu,
        textNumberKid,
        emailPlaceholder,
        emailLabel,
        checkboxLabel,
        checkboxSondageLabel,
        disclaimer,
        telecharge,
        options,
        preview 
    } = attributes;

    const captchaSiteKey =
        typeof acfDataCaptcha !== 'undefined' ? acfDataCaptcha.captchaSiteKey : 'default-key';
    const currentLang =
        typeof acfDataCaptcha !== 'undefined' ? acfDataCaptcha.currentLang : 'en';

    const [newOption, setNewOption] = useState('');

    setAttributes({ captchaSiteKey });
    setAttributes({ currentLang });

    const addOption = () => {
        if (newOption.trim() !== '') {
            const updatedOptions = [...options, newOption];
            setAttributes({ options: updatedOptions });
            setNewOption('');
        }
    };

    const removeOption = (index) => {
        const updatedOptions = options.filter((_, i) => i !== index);
        setAttributes({ options: updatedOptions });
    };
    if (preview) {
                return (
                    <>
                        <img src={previewImgVideo} alt="Preview" />
                    </>
                );
    }
    return (
        <div {...useBlockProps()}>
            <div className="popin-jeunesse">
                <RichText
                    tagName="div"
                    className="wp-block-heading"
                    value={title}
                    onChange={(newTitle) => setAttributes({ title: newTitle })}
                />
                <RichText
                    tagName="div"
                    className="Body-2"
                    value={subtitle}
                    onChange={(newSubTitle) => setAttributes({ subtitle: newSubTitle })}
                />
                 <RichText
                        value={selectLabel}
                        tagName="label"
                        onChange={(newTitle) => setAttributes({ selectLabel: newTitle })}
                />
                <SelectControl
                        label=""
                        value=""
                        options={options.map((option) => ({
                            label: option,
                            value: option,
                        }))}
                    />

                    <TextControl
                        label=""
                        value={newOption}
                        onChange={(value) => setNewOption(value)}
                        placeholder='Ajouter une option'
                    />
                    <Button variant="primary" onClick={addOption}>
                        <Icon icon={addCard} />&nbsp;&nbsp;Ajouter une option
                    </Button>

                    <ul className="editor--option-list">
                        {options.map((option, index) => (
                            index !== 0 && (
                                <li key={option}>
                                    {option}
                                    <Button variant="link" onClick={() => removeOption(index)}>
                                        <Icon icon={trash} />
                                    </Button>
                                </li>
                            )
                        ))}
                    </ul>

                     <div className="input-group">
                        <RichText
                            tagName="label"
                            value={emailLabel}
                            onChange={(newEmail) => setAttributes({ emailLabel: newEmail })}
                        />
                        <RichText
                            tagName="label"
                            className="input-edit"
                            value={emailPlaceholder}
                            onChange={(newEmail) => setAttributes({ emailPlaceholder: newEmail })}
                        />
                    </div>

                    <div className="input-group encard">
                    <div className="case-fake">&nbsp;</div>
                    <RichText
                        tagName="label"
                        value={recieveActu}
                        onChange={(newLabel) => setAttributes({ recieveActu: newLabel })}
                    />
                    
                    <RichText
                        tagName="div"
                        className="input-edit"
                        value={numberPlaceholder}
                        onChange={(newLabel) => setAttributes({ numberPlaceholder: newLabel })}
                    />
                    <RichText
                        tagName="label"
                        value={textNumberKid}
                        onChange={(newLabel) => setAttributes({ textNumberKid: newLabel })}
                    />
                    </div>
                    <RichText
                        tagName="label"
                        value={numberLabel}
                        onChange={(newLabel) => setAttributes({ numberLabel: newLabel })}
                    />
                    <div className="input-group">
                    <div className="edit-checkbox-fake">
                        <RichText
                            tagName="label"
                            className="label-input"
                            value={checkboxLabel}
                            onChange={(checkBox) => setAttributes({ checkboxLabel: checkBox })}
                        />
                    </div>
                    <div className="edit-checkbox-fake">
                        <RichText
                            tagName="label"
                            className="label-input"
                            value={checkboxSondageLabel}
                            onChange={(checkBox) => setAttributes({ checkboxSondageLabel: checkBox })}
                        />
                    </div><br/>
                        <RichText
                            tagName="p"
                            className="font-small"
                            value={disclaimer}
                            onChange={(checkBox) => setAttributes({ disclaimer: checkBox })}
                            allowedFormats={['core/bold', 'core/italic', 'core/link']}
                        />

                    
                </div>

                <div className="popin-jeunesse--telecharge-video show-telecharge">
                    <div className="btn-with-svg">
                        <RichText
                            tagName="div"
                            value={telecharge}
                            onChange={(text) => setAttributes({ telecharge: text })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Edit;
