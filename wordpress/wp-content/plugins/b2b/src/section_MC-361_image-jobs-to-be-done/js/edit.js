import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

import '../scss/editor.scss';

import previewImg from '/assets/img/section-image-jobs-to-be-done.jpg';
import defaultBg from '../img/default-bg.png';

export default function Edit({ attributes }) {
    const { preview, tagName } = attributes;
    
    const blockProps = useBlockProps({});
    
    const TEMPLATE = [
        ['b2b/group-filiale-link', {
            theme: 'ds-subtheme-emp',
            backgroundImgUrl: defaultBg,
            cardLink: {
                url: 'https://citeo.com'
            }
        }],
        ['b2b/group-filiale-link', {
            theme: 'ds-subtheme-pro',
            backgroundImgUrl: defaultBg,
            cardLink: {
                url: 'https://citeopro.com'
            }
        }],
        ['b2b/group-filiale-link', {
            theme: 'ds-subtheme-sh',
            backgroundImgUrl: defaultBg,
            cardLink: {
                url: 'https://www.citeo-sh.com'
            }
        }],
        ['b2b/group-filiale-link', {
            theme: 'adelphe',
            backgroundImgUrl: defaultBg,
            cardLink: {
                url: 'https://adelphe.fr'
            }
        }]
    ];

    const ALLOWED_BLOCKS = [];
    
    if (preview) {
        return (
            <>
                <img src={previewImg} alt="Preview" />
            </>
        );
    }

    if(tagName === 'div') return (
        <div {...blockProps}>
            <InnerBlocks 
                template={ TEMPLATE }
                allowedBlocks={ ALLOWED_BLOCKS }
            />
        </div>
    );

    return (
        <section {...blockProps}>
            <InnerBlocks 
                template={ TEMPLATE }
                allowedBlocks={ ALLOWED_BLOCKS }
            />
        </section>
    );
}