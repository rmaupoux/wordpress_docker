import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import '../scss/editor.scss';

import previewImg from '../../assets/img/encart-demarrer.jpg';


export default function Edit({ attributes }) {
    const { preview } = attributes;

    const TEMPLATE = [
        ['core/heading',
            {
                level: 2,
                placeholder: __('Titre de section sur deux lignes maximum.', 'citeo-articles'),
                className: 'ds-heading-2',
                metadata: {
                    name: __('Titre du paragraphe', 'citeo-articles')
                }
            }
        ],
        ['core/heading',
            {
                level: 3,
                placeholder: __('Titre de paragraphe', 'citeo-articles'),
                className: 'ds-heading-3',
                metadata: {
                    name: __('Sous-titre du paragraphe', 'citeo-articles')
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

    const ALLOWED_BLOCKS = ['core/heading', 'core/paragraph', 'core/list']

    const blockProps = useBlockProps({});

    const innerBlocksProps = useInnerBlocksProps(blockProps, {
        template: TEMPLATE,
        allowedBlocks: ALLOWED_BLOCKS
    })

     if (preview) {
            return (
                <>
                    <img src={previewImg} alt={__('Aperçu', 'citeo-articles')} />
                </>
            );
    }
    return (
        <section {...innerBlocksProps} />
    );
}