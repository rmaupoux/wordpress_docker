import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import '../scss/editor.scss';
import previewImg from '../../assets/img/encart-bref.jpg';

export default function Edit({ attributes }) {
    const { preview } = attributes;

    const TEMPLATE = [
        ['core/paragraph', { 
            className: 'ds-heading-2',
            placeholder: __('Ajouter un titre', 'citeo-articles'),
            content: __('En bref', 'citeo-articles'),
            metadata: {
                name: __('En bref', 'citeo-articles')
            }
        }],
        ['core/paragraph', { 
            className: 'ds-text-paragraph',
            metadata: {
                name: __('Suite de textes', 'citeo-articles')
            },
         }],
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
                allowedBlocks={['core/paragraph']}
            />
        </div>
    );
}