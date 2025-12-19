import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import '../scss/editor.scss';
export default function Edit({ attributes }) {
    const TEMPLATE = [
        ['core/image', {
            className: 'article-img'
        }], 
        ['core/group', {
            className: 'article-txt',
            templateLock: false,
            allowedBlocks: ['core/buttons','core/list','core/heading','core/paragraph'],
            metadata: {
                name: 'Texte de l\'article'
            },
            templateLock: false
        }, 
            [
                ['core/heading', {
                    level: 3,
                    className: 'ds-heading-3',
                    placeholder: 'Sous-titre qui peut être souligné'
                }],
                ['core/paragraph', {
                    className: 'ds-text-large',
                    placeholder: 'Texte de mise en exergue, peut être supprimé si non pertinent',
                }],
                ['core/paragraph', {
                    className: 'ds-text-paragraph',
                    placeholder: 'Texte descriptif, à conserverTexte descriptif qui appuie le titre. \nCelui ci doit être assez court pour inciter à lire la suite.',
                }],
                ['core/buttons', {}, 
                    [
                        ['core/button', {
							placeholder: "Action 1",
							className: 'is-style-primary'
						}],
						['core/button', {
							className: 'is-style-secondary',
							placeholder: "Action 2",
						}],
                    ]
                ]
            ]
        ],
    ];
    
    const ALLOWED_BLOCKS = ['core/group', 'core/image'];
    const blockProps = useBlockProps({
        className: `text-img-wrap`
    });
    const innerBlocksProps = useInnerBlocksProps(blockProps, {
        template: TEMPLATE,
        allowedBlocks: ALLOWED_BLOCKS,
        layout: { type: 'flex' }
    });
    return (            
        <article {...innerBlocksProps} />
    );
}