import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import '../scss/editor.scss';
import previewImg from '../../assets/img/encart-citation.jpg';
import { __ } from '@wordpress/i18n';

export default function Edit({ attributes }) {
    const { preview } = attributes

    const TEMPLATE = [
       
                        ['core/group', { 
							className: 'blog-citations--col-left',
                            metadata: {
                                name: __('Colonne gauche', 'citeo-articles')
                            }
						
						}, 
                            [
                                ['core/group', { 
                                    className: 'wrapper-auteur',
                                    metadata: {
                                        name: __('Image, nom de l\'auteur et intitulé de poste', 'citeo-articles')
                                    }
                                }, 
                                    [
                                        ['core/image', {}],
                                        ['core/group', {}, 
                                            
                                            [
                                                ['core/paragraph', {
                                                    placeholder: __('Auteur', 'citeo-articles'),
                                                    className: 'ds-heading-4'
                                                }],
                                                ['core/paragraph', {
                                                    placeholder: __('Intitulé poste auteur', 'citeo-articles'),
                                                    className: 'ds-text-small'
                                                }]
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ],
                        ['core/group', { 
                            className: 'blog-citations--col-right',
                            metadata: {
                                      name: __('Citation', 'citeo-articles')
                            },
                        }, 
                            [
                                ['core/paragraph', {
                                    placeholder: __('Texte de la citation', 'citeo-articles'),
                                    className: 'blog-citations--texte'
                                }]
                            ]
                        ]
                    ];
   

    const blockProps = useBlockProps({
        className: 'blog-citations'
    });

    const innerBlocksProps = useInnerBlocksProps(blockProps, {
        template: TEMPLATE,
        allowedBlocks: []
    })

    if (preview) {
            return (
                <>
                    <img src={previewImg} alt={__('Aperçu', 'citeo-articles')} />
                </>
            );
    }
    return (
        <div {...innerBlocksProps} />
    );
}