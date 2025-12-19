import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

import '../scss/editor.scss';

export default function Edit({ attributes, setAttributes }) {
    const { title, magURL } = attributes

    const blockProps = useBlockProps({});

    wp.apiFetch({ path: '/b2b/v1/mag-url' }).then((res) => {
        setAttributes({ magURL: res.url });
    });

    const TEMPLATE = [
        ['core/group', {
            metadata: {
                name: 'Colonne de gauche'
            }, 
            className: 'left-col',
            allowedBlocks: []
        }, 
            [
                ['core/paragraph', {
                    className: 'ds-text-paragraph',
                    content: 'Thématiques'
                }],
                ['core/buttons', {
                    metada: {
                        name: 'Liste de tags'
                    }
                }],
            ]
        ],
        ['core/group', {
            metadata: {
                name: 'Colonne de droite'
            }, 
            className: 'right-col',
            allowedBlocks: []
        }, 
            [
                ['core/paragraph', {
                    className: 'ds-text-paragraph',
                    content: 'Dernières publication'
                }],
                ['core/query', {
                    metada: {
                        name: 'Dernières publications'
                    },
                    query: {
                        perPage: 3,
                        pages: 1,
                        offset: 0,
                        postType: 'post',
                        order: 'desc',
                        orderBy: 'date',
                        sticky: 'only',
                        inherit: false,
                    }
                }, 
                    [
                        ['core/post-template', {}, 
                            [
                                ['citeo-semantic/post-link-wrapper', {}, 
                                    [
                                        ['core/post-featured-image', {
                                            useFirstImageFromPost: true,
                                            isLink: false,
                                        }],
                                        
                                        ['core/group', {
                                            metadata: {
                                                name:'Titre et excerpt d\'article'
                                            },
                                            className: 'post-wrapper',
                                            allowedBlocks: ['core/post-title', 'core/post-excerpt']
                                        }, 
                                            [				
                                                ['core/post-title', {
                                                    level: 4,
                                                    className: 'ds-heading-3',
                                                    isLink: false
                                                }],
                                                ['core/post-date', {
                                                    format: 'j M Y',
                                                    className: 'ds-text-xsmall'
                                                }]
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ]	
                    ]
                ]
            ]
        ]
        
    ];

    const ALLOWED_BLOCKS = []
    
    return (         
        <article {...blockProps} >
            <div className='mag-ttl-wrap'>
                <h4 className="ds-text-base mag-ttl">LE MAG</h4>
                <arrow-right-icon-component size="16" color="var(--ds-semantic-color-neutral-content-medium)" />
            </div>
            <div className='mag-content'>
                <InnerBlocks 
                    template={ TEMPLATE }
                    ALLOWED_BLOCKS={ ALLOWED_BLOCKS }
                />
            </div>                
        </article>   
    );
}