import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ComboboxControl, RadioControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import '../scss/editor.scss';
import previewImg from '../../assets/img/encart-contenu-froid.jpg';

export default function Edit({ attributes, setAttributes }) {
    const { preview, linkUrl, linkType, selectedPostId } = attributes;
    
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOptions, setSearchOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fonction pour rechercher pages et articles
    useEffect(() => {
        if (searchQuery.length < 2) {
            setSearchOptions([]);
            return;
        }
        
        setIsLoading(true);
        
        // Recherche simultanée dans les pages et articles
        Promise.all([
            apiFetch({ path: `/wp/v2/pages?search=${encodeURIComponent(searchQuery)}&per_page=10` }),
            apiFetch({ path: `/wp/v2/posts?search=${encodeURIComponent(searchQuery)}&per_page=10` })
        ])
        .then(([pages, posts]) => {
            const options = [
                ...pages.map(page => ({
                    value: page.id.toString(),
                    label: page.title.rendered || __('(sans titre)', 'citeo'),
                    url: page.link
                })),
                ...posts.map(post => ({
                    value: post.id.toString(),
                    label: post.title.rendered || __('(sans titre)', 'citeo'),
                    url: post.link
                }))
            ];
            setSearchOptions(options);
            setIsLoading(false);
        })
        .catch(() => {
            setSearchOptions([]);
        });
    }, [searchQuery]);

    const TEMPLATE = [
        ['core/paragraph', { 
            className: 'ds-text-xsmall teaser-text',
            metadata: { name: __('Texte d\'accroche', 'citeo') },
            placeholder: __('Saisir un texte personnalisé...', 'citeo'),
        }],
        ['core/group', {
            className: 'display-one-post-frontend',
            metadata: { name: __('Image + texte', 'citeo') }
        }, [
            
            ['core/image', {
                className: 'display-one-post-frontend--image',
                metadata: { name: __('Image', 'citeo') }
            }],
            ['core/group', {
                className: 'display-one-post-frontend--text',
                metadata: { name: __('Description texte principal', 'citeo') }
            }, [
                ['core/paragraph', {
                    className: 'ds-heading-2',
                    placeholder: __('Sur titre', 'citeo'),
                }],
                ['core/paragraph', {
                    className: 'ds-heading-4',
                    placeholder: __('Titre personnalisé', 'citeo'),
                }],
            ]],
        ]],
    ];

    const blockProps = useBlockProps({
        className: 'wp-block-encart-article'
    });

    if (preview) {
        return (
            <>
                <img src={previewImg} alt="Preview" />
            </>
        );
    }

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Paramètres du lien', 'citeo')} initialOpen={true}>
                    <RadioControl
                        label={__('Type de lien', 'citeo')}
                        selected={linkType || 'none'}
                        options={[
                            { label: __('Aucun lien', 'citeo'), value: 'none' },
                            { label: __('Contenu existant', 'citeo'), value: 'internal' },
                            { label: __('URL personnalisée', 'citeo'), value: 'custom' }
                        ]}
                        onChange={(value) => {
                            setAttributes({ linkType: value });
                            if (value === 'none') {
                                setAttributes({ linkUrl: '', selectedPostId: '' });
                            }
                        }}
                    />
                    
                    {linkType === 'internal' && (
                        <ComboboxControl
                            label={__('Rechercher du contenu', 'citeo')}
                            value={selectedPostId || ''}
                            onChange={(value) => {
                                setAttributes({ selectedPostId: value });
                                // Trouver l'URL correspondante
                                const selectedOption = searchOptions.find(option => option.value === value);
                                if (selectedOption) {
                                    setAttributes({ linkUrl: selectedOption.url });
                                }
                            }}
                            onFilterValueChange={(value) => setSearchQuery(value)}
                            options={searchOptions}
                            placeholder={isLoading ? __('Recherche en cours...', 'citeo') : __('Tapez pour rechercher...', 'citeo')}
                            help={__('Recherche dans les pages et articles du site', 'citeo')}
                            disabled={isLoading}
                        />
                    )}
                    
                    {linkType === 'custom' && (
                        <TextControl
                            label={__('URL personnalisée', 'citeo')}
                            value={linkUrl || ''}
                            onChange={(value) => setAttributes({ linkUrl: value })}
                            placeholder={__('https://exemple.com', 'citeo')}
                            help={__('URL qui englobera tout le bloc', 'citeo')}
                        />
                    )}
                </PanelBody>
            </InspectorControls>
            <section {...blockProps}>
                <InnerBlocks
                    template={TEMPLATE}
                    allowedBlocks={['core/paragraph', 'core/group', 'core/image']}
                />
            </section>
        </>
    );
}