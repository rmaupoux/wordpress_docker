import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import '../scss/editor.scss';

import previewImg from '../../assets/img/encart-chiffres.jpg';

export default function Edit({ attributes }) {
    const { preview } = attributes;
    const TEMPLATE = [
        ['core/heading',
            {
                level: 2,
                content: __('Les chiffres clés du réemploi', 'citeo-articles'),
                placeholder: __('Titre des chiffres clés', 'citeo-articles'),
                className: 'ds-heading-2',
                metadata: {
                    name: __('Titre des chiffres clés', 'citeo-articles'),
                }
            },
        ],
        ['core/paragraph',
            {
                content: `<span class="ds-display-1">67%</span>\n<span class="ds-text-large">${__('pour plus d\'informations', 'citeo-articles')}</span> `,
                metadata: {
                    name: __('Chiffre clé mis en avant', 'citeo-articles'),
                }
            },
        ],
        ['core/paragraph',
            {
                content: `<span class="ds-display-1">4</span>&nbsp;<span class="ds-heading-3">${__('millions', 'citeo-articles')}</span>\n<span class="ds-text-large">${__('De tonnes d\'emballages recyclés', 'citeo-articles')}</span> `,
                metadata: {
                    name: __('Chiffre clé', 'citeo-articles'),
                }
            },
        ],
        ['core/paragraph',
            {
                content: `<span class="ds-display-1">2,3</span>&nbsp;<span class="ds-heading-3">${__('millions', 'citeo-articles')}</span>\n<span class="ds-text-large">${__('de tonnes de CO2, évitées !', 'citeo-articles')}</span> `,
                metadata: {
                    name: __('Chiffre clé', 'citeo-articles'),
                }
            },
        ],
    ];

    const blockProps = useBlockProps({});

     if (preview) {
                        return (
                            <>
                                <img src={previewImg} alt="Preview" />
                            </>
                        );
            }
    return (
        <div {...blockProps}>
            <InnerBlocks
                template={TEMPLATE}
                templateLock={false}
                allowedBlocks={['core/paragraph']}
            />
        </div>
    );
}