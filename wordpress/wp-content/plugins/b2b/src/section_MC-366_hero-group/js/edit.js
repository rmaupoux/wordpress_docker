import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';

import '../scss/editor.scss';

import previewImg from '/assets/img/section-hero-text-img.jpg';
import animPlaceholder from '../img/animPlaceholder.gif';

export default function Edit({ attributes, setAttributes }) {
    const { preview, title } = attributes;
    
    const blockProps = useBlockProps({});
    
    const TEMPLATE = [
        ['b2b/section-image-jobs-to-be-done', {
            tagName: 'div'
        }],
    ];

    const ALLOWED_BLOCKS = [];
    
    if (preview) {
        return (
            <>
                <img src={previewImg} alt="Preview" />
            </>
        );
    }

    return (
        <>
            <section {...blockProps}>
    
                <div className='hero-top-row'>
                    <div className='lottie-anim-wrap'>
                        <img src={animPlaceholder} />
                    </div>
                    <RichText
                        tagName="h1"
                        className="site-ttl"
                        value={ title }
                        allowedFormats={[]}
                        onChange={ ( val ) => setAttributes( { title: val } ) }
                        placeholder='Label du lien'
                    />
                </div>
                
                <InnerBlocks 
                    template={ TEMPLATE }
                    allowedBlocks={ ALLOWED_BLOCKS }
                />
                
            </section>
        </>
    );
}