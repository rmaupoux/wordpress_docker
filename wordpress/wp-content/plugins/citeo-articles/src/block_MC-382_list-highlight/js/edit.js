import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import '../scss/editor.scss';

import previewImg from '../../assets/img/encart-liste.jpg';

export default function Edit({ attributes, clientId }) {
    const { preview } = attributes;
    const TEMPLATE = [
        ['core/paragraph',
            {
                placeholder: __('Titre de liste', 'citeo-articles'),
                className: 'ds-heading-3 title',
                metadata: {
                    name: __('Titre de liste', 'citeo-articles'),
                }
            }
        ],
        ['core/list',
            {
                className: 'ds-text-large',
                metadata: {
                    name: __('Contenu de liste', 'citeo-articles'),
                }
            }
        ]
    ];
    const innerBlocks = useSelect(
        (select) => select('core/block-editor').getBlocks(clientId), [clientId]
    );
    const { updateBlockAttributes } = useDispatch('core/block-editor');

    useEffect(() => {
        innerBlocks.forEach((block) => {
            if (block.name !== 'core/paragraph') return;

            const cls = (block.attributes.className || '').trim();
            const isTitle = cls.includes('ds-heading-3');
            const hasTextLarge = cls.includes('ds-text-large');

            if (!isTitle && !hasTextLarge) {
                const newClass = (cls + ' ds-text-large').trim();
                updateBlockAttributes(block.clientId, { className: newClass });
            }
        });
    }, [innerBlocks, updateBlockAttributes]);

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