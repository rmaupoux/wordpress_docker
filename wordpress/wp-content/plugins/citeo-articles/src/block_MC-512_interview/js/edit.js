import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import '../scss/editor.scss';
import previewImg from '../../assets/img/vignette_interview.jpg';

export default function Edit({ attributes }) {
    const { preview } = attributes;

    const TEMPLATE = [
        ['core/group', {
            className: 'author-block__header',
            metadata: { name: 'En-tête de l\interview' },
            allowedBlocks: ['core/paragraph'],
        }, [
                ['core/paragraph', {
                    content: 'INTERVIEW DE',
                    className: 'author-block__label',
                    metadata: { name: 'Titre' },
                    placeholder: 'INTERVIEW DE'
                }],
            ]],
        ['core/group', {
            className: 'author-block__content',
            metadata: { name: 'Contenu de l\'interviewé(e)' },
            allowedBlocks: ['core/image', 'core/group'],
        }, [
                ['core/image', {
                    className: 'author-block__image',
                    metadata: { name: 'Photo' }
                }],
                ['core/group', {
                    className: 'author-block__info',
                    metadata: { name: 'Informations de l\'interviewé(e)' },
                    allowedBlocks: ['core/paragraph'],
                }, [
                        ['core/paragraph', {
                            className: 'author-block__name',
                            metadata: { name: 'Nom de l\'interviewé(e)' },
                            placeholder: 'Nom de l\'interviewé(e)'
                        }],
                        ['core/paragraph', {
                            className: 'author-block__biography',
                            metadata: { name: 'Poste de l\'interviewé(e)' },
                            placeholder: 'Poste de l\'interviewé(e)'
                        }],
                    ]
                ],
            ]
        ],
    ];

    const blockProps = useBlockProps({});

    if (preview) {
        return (
            <>
                <img src={previewImg} alt="Preview" />
            </>
        );
    }

    return (
        <section {...blockProps}>
            <InnerBlocks
                template={TEMPLATE}
                allowedBlocks={[]}
            />
        </section>
    );
}