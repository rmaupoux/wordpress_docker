import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import '../scss/editor.scss';


import previewImg from '../../assets/img/encart-texte-excergue.jpg';



export default function Edit({ attributes, clientId }) {
    const { preview } = attributes;
    const TEMPLATE = [
        ['core/paragraph',
            {
                placeholder: __('Texte mis en avant', 'citeo-articles'),
                className: 'ds-heading-1',
                metadata: {
                    name: __('Texte mis en avant', 'citeo-articles'),
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
            const isTitle = cls.includes('ds-heading-1');
            if (!isTitle) {
                const newClass = (cls + ' ds-heading-1').trim();
                updateBlockAttributes(block.clientId, { className: newClass });
            }
        });
    }, [innerBlocks, updateBlockAttributes]);

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