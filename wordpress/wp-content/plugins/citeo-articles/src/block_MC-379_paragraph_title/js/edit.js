import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import '../scss/editor.scss';

import previewImg from '../../assets/img/encart-titre-paragraphe.jpg';

export default function Edit({ attributes }) {
    const { preview } = attributes;
    const TEMPLATE = [
        ['core/paragraph',
            {
                placeholder: __('Titre du paragraphe', 'citeo-articles'),
                className: 'ds-heading-3',
                metadata: {
                    name: __('Titre du paragraphe', 'citeo-articles')
                }
            }
        ],
        ['core/paragraph',
            {
                placeholder: __('Contenu du paragraphe', 'citeo-articles'),
                className: 'ds-text-large',
                metadata: {
                    name: __('Contenu du paragraphe', 'citeo-articles')
                }
            }
        ]
    ];

    const blockProps = useBlockProps({});

     if (preview) {
                return (
                    <>
                        <img src={previewImg} alt={__('Aperçu', 'citeo-articles')} />
                    </>
                );
        }
    return (
        <div {...blockProps}>
            <InnerBlocks
                template={TEMPLATE}
                templateLock={false}
                allowedBlocks={['core/paragraph', 'core/list']}
            />
        </div>
    );
}