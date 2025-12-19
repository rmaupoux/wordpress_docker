import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

import '../scss/editor.scss';

import previewImg from '../../assets/img/encart-slider.jpg';

export default function Edit({ attributes }) {
    const { preview } = attributes

    const TEMPLATE = [
        ['core/group', {
            className: 'slider-wrap',
            allowedBlocks: ['core/image'],
            metadata: { 
                name: __('Slider d\'images', 'citeo-articles')
            }
        }, 
            [
                ['core/image', {
                    className: 'active-slide',
                }],
                ['core/image', {}],
                ['core/image', {}]
            ]
        ]
    ];

    const ALLOWED_BLOCKS = ['core/group'];

    const blockProps = useBlockProps({});

    const innerBlocksProps = useInnerBlocksProps({
        className: 'article-slider-content'
    }, {
        template: TEMPLATE,
        allowedBlocks: ALLOWED_BLOCKS
    });

    if (preview) {
        return (
            <>
                <img src={previewImg} alt={__('Aperçu', 'citeo-articles')} />
            </>
        );
    }

    return (
        <div {...blockProps}>
            <div className='wrapper__sider-controls'>
                <div className="wp-block-buttons slider-controls">
                    <div className="wp-block-button prev-slide is-style-secondary no-text has-suffix--Chevron-right">
                        <a className="wp-block-button__link wp-element-button" />
                    </div>
                    <div className='total-wrap'></div>
                    <div className="wp-block-button next-slide is-style-primary no-text has-suffix--Chevron-right">
                        <a className="wp-block-button__link wp-element-button" />
                    </div>
                </div>
            </div>
            <div {...innerBlocksProps} />
        </div>
    );
}
