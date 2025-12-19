import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import '../scss/editor.scss';
import previewImg from '../../../assets/img/hero-5.jpg';

export default function Edit({ attributes }) {
    const { preview } = attributes;

    const blockProps = useBlockProps({});

    const TEMPLATE = [
        ['core/cover', {
            metadata: { 
                name: 'Hero banner image' 
            },
            align: "full",
            layout: {
                type: "constrained"
            },
            dimRatio: 0,
        },
            [
                ['b2b/page-title-button']
            ]
        ]
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
                <InnerBlocks
                    template={TEMPLATE}
                    allowedBlocks={ALLOWED_BLOCKS}
                />
            </section>
        </>
    );
}
