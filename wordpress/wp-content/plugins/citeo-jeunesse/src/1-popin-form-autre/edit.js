import { useBlockProps, RichText } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';
import { TextControl, Button, SelectControl } from '@wordpress/components';
import { Icon, addCard, trash } from '@wordpress/icons';
import previewImgVideo from '../../assets/img/preview-form-pdf.png';

import './editor.scss';

const Edit = ({ attributes, setAttributes }) => {
    const {
        title,
        subtitle,
        selectLabel,
        emailPlaceholder,
        emailLabel,
        checkboxLabel,
        checkboxSondageLabel,
        disclaimer,
        telecharge,
        options,
        preview
    } = attributes;

    const captchaSiteKey = typeof acfDataCaptcha !== 'undefined' ? acfDataCaptcha.captchaSiteKey : 'default-key';
    const currentLang = typeof acfDataCaptcha !== 'undefined' ? acfDataCaptcha.currentLang : 'en';
    const [newOption, setNewOption] = useState('');

    setAttributes({ captchaSiteKey, currentLang });

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
                    className="h2-title"
                    value={subtitle}
                    onChange={(newSubTitle) => setAttributes({ subtitle: newSubTitle })}
                />

                <form id="form-jeunesse-autre">
                <div className="input-group">
                        <RichText
                            tagName="label"
                            value={selectLabel}
                            onChange={(newTitle) => setAttributes({ selectLabel: newTitle })}
                        />
                        <SelectControl
                            label=''
                            value=''
                            options={options.map((option, index) => ({
                                label: option,
                                value: option,
                            }))}
                        />
                        <TextControl
                            label=''
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
                    </div>

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
                    </div>
                    <RichText
                        tagName="p"
                        className="font-small"
                        value={disclaimer}
                        onChange={(checkBox) => setAttributes({ disclaimer: checkBox })}
                        allowedFormats={['core/bold', 'core/italic', 'core/link']}
                    />
                    
                    
                    
                
                    <div className="popin-jeunesse--telecharger show-telecharge">
                        <div className="btn-with-svg">
                            <RichText
                                tagName="div"
                                value={telecharge}
                                onChange={(text) => setAttributes({ telecharge: text })}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Edit;
