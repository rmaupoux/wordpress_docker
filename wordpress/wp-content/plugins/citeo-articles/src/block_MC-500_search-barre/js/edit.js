import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import '../scss/editor.scss';
import previewImg from '../../assets/img/block-searchbar.jpg';

export default function Edit({ attributes }) {
    const { preview } = attributes;

    const TEMPLATE = [
        ['core/group', {
            className: 'archive-page',
        },
            [
                [
                'core/heading', {
                    level: 1,
                    content: __('<span class="ds-heading-1">Actualités</span><br/><span class="ds-heading-3">Le mag</span>', 'citeo-articles'),
                    lock: {
                        move: true,
                    }
                }
                ],
                [
                'core/shortcode', {
                    text: '[citeo_searchbar]',
                    metadata: {
                        name: __('Barre de recherche Citeo', 'citeo-articles')
                    }
                }]
            ],
        ],

    ];

    const blockProps = useBlockProps({
        className: 'alignfull'
    });

    if (preview) {
        return (
            <>
                <img src={previewImg} alt={__('Aperçu', 'citeo-articles')} />
            </>
        );
    }

    return (
        <section {...blockProps}>
            <InnerBlocks
                template={TEMPLATE}
                allowedBlocks={['core/group', 'core/heading', 'core/shortcode']}
            />
        </section>
    );
}