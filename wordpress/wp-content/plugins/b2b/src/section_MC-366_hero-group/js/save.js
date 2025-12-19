import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';

import animPlaceholder from '../img/animPlaceholder.gif';

export default function save({ attributes }) {
    const {title } = attributes;

    const blockProps = useBlockProps.save({});

    return (
        <section {...blockProps}>
            <div className='hero-top-row'>
                <div className='lottie-anim-wrap'>
                    <img src={animPlaceholder} />
                </div>
                <RichText.Content
                    tagName="h1"
                    className="site-ttl"
                    value={ title }
                />
            </div>
            
            <InnerBlocks.Content />
        </section>
    );
}
