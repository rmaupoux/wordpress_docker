import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { TextControl, Spinner, Button, Card, CardBody, ToggleControl } from '@wordpress/components';
import { RichText, InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';

import previewImg from '../../assets/img/encart-articles.jpg';


export default function Edit({ attributes, setAttributes }) {
    
    const {
        preview, 
        postId,
        postTitle,
        postLink,
        postImage,
        postDate,
        customText,
        postSubTitle,
        cardRow,
    } = attributes;
    
    const [query, setQuery] = useState('');
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // États locaux pour la prévisualisation
    const [previewData, setPreviewData] = useState({
        title: '',
        image: '',
        date: '',
        subtitle: '',
        link: ''
    });
    
    // Charger les données de prévisualisation si un postId existe
    useEffect(() => {
        if (!postId) return;
        
        apiFetch({ path: `/wp/v2/posts/${postId}?_embed&acf_format=standard` })
            .then(async (post) => {
                const wpFeaturedMedia = post?._embedded?.['wp:featuredmedia'];
                const mediumImageUrl = wpFeaturedMedia?.[0]?.media_details?.sizes?.medium?.source_url;
                const externalImageUrl = post?.meta?.external_featured_image;
                const imageUrlToUse = externalImageUrl || mediumImageUrl;
                
                setPreviewData({
                    title: post.title.rendered,
                    image: imageUrlToUse || '',
                    date: post.date,
                    subtitle: post.acf?.sous_titre_articles || '',
                    link: post.link
                });
            })
            .catch((error) => {
                console.error('Erreur lors du chargement des données de prévisualisation:', error);
            });
    }, [postId]);
    
    function decodeHtmlEntities(str) {
        const txt = document.createElement('textarea');
        txt.innerHTML = str;
        return txt.value;
    }

    useEffect(() => {
        if (query.length < 3) {
            setOptions([]);
            return;
        }
        setLoading(true);
        apiFetch({ path: `/wp/v2/posts?search=${encodeURIComponent(query)}&per_page=20&_embed` })
            .then((posts) => {
                setOptions(posts.map((post) => ({
                    value: String(post.id),
                    label: post.title.rendered || '(sans titre)',
                    post,
                })));
                setLoading(false);
            })
            .catch(() => {
                setOptions([]);
                setLoading(false);
            });
    }, [query]);

    async function onSelectPost(id) {
        const selected = options.find((opt) => opt.value === id);
        if (!selected) return;
        const post = selected.post;

        // Récupérer le champ ACF sous_titre_articles
        let postSubTitle = '';
        try {
            const acfData = await apiFetch({ path: `/wp/v2/posts/${post.id}?acf_format=standard` });
            postSubTitle = acfData.acf?.sous_titre_articles || '';
        } catch (error) {
            console.log('Erreur lors de la récupération du champ ACF:', error);
        }

        const wpFeaturedMedia = post?._embedded?.['wp:featuredmedia'];
        const mediumImageUrl =
            wpFeaturedMedia &&
            wpFeaturedMedia[0]?.media_details?.sizes?.medium?.source_url;

        const externalImageUrl = post?.meta?.external_featured_image;
        const imageUrlToUse = externalImageUrl
            ? externalImageUrl
            : mediumImageUrl;

        // Stocker seulement le postId dans les attributs
        setAttributes({
            postId: post.id
        });
        
        // Stocker les données pour la prévisualisation
        setPreviewData({
            title: post.title.rendered,
            image: imageUrlToUse || '',
            date: post.date,
            subtitle: postSubTitle,
            link: post.link
        });
        
        setQuery('');
    }

    if (preview) {
            return (
                <>
                    <img src={previewImg} alt="Preview" />
                </>
            );
    }
    
    return (

<>
{/* REMOVE */}
        <InspectorControls>
            <PanelBody title={__('Paramètres d\'affichage', 'citeo')} initialOpen={true}>
                <ToggleControl
                    label={__('Mode ligne (sans texte personnalisé)', 'citeo')}
                    checked={cardRow}
                    onChange={(value) => setAttributes({ cardRow: value })}
                    help={__('Active le mode ligne qui masque le champ de texte personnalisé', 'citeo')}
                />
            </PanelBody>
        </InspectorControls>
        
        <Card style={{ marginBottom: 22 }}>
                <CardBody>
                            <TextControl
                                value={query}
                                onChange={setQuery}
                                placeholder="Rechercher un article (3 caractères minimum)…"
                            />
                </CardBody>
            </Card>
            {loading && <Spinner />}
            {!loading && query.length >= 2 && options.length > 0 && (
                <Card>
                    <CardBody>

                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }} className="post-selection-list-one-card">
                            {options.map((opt) => (
                                <li key={opt.value} style={{ marginBottom: 'var(--ds-semantic-spacing-xs)' }}>
                                    <Button
                                        variant="secondary"
                                        onClick={() => onSelectPost(opt.value)}
                                    >
                                        { decodeHtmlEntities(opt.label) }
                                    </Button>
                                </li>
                            ))}
                        </ul>
                        
                    </CardBody>
                </Card>
            )}
        {cardRow ? (
            <section className="wp-block-encart-article-row">
                {/* Affichage des éléments de l'article sélectionné (version row sans RichText) */}
                {postId && (
                    <div className="display-one-post-frontend">
                        {previewData.image && (
                            <div className="display-one-post-frontend--image">
                                <img
                                    src={previewData.image}
                                    alt={previewData.title}
                                    style={{ maxWidth: '100%', height: 'auto', marginBottom: 'var(--ds-semantic-spacing-m)' }}
                                />
                            </div>
                        )}

                        <div className="display-one-post-frontend--text">
                            {previewData.subtitle && (
                                <div className="ds-display-2">
                                    {previewData.subtitle}
                                </div>
                            )}

                            {previewData.title && <div className="ds-text-base-strong ds-heading-2" dangerouslySetInnerHTML={{ __html: previewData.title }} />}

                            {previewData.date && (
                                <div className="ds-text-small">
                                    {
                                        new Date(previewData.date)
                                            .toLocaleDateString('fr-FR', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                            })
                                            .replace(/(\d{2}) (\w+)\.? (\d{4})/, '$1 $2, $3')
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </section>
        ) : (
            <section className="wp-block-encart-article">
                {/* Champ texte riche personnalisé */}
                <RichText
                    tagName="div"
                    placeholder={__('Saisir un texte personnalisé...', 'citeo')}
                    value={customText || ''}
                    onChange={(value) => setAttributes({ customText: value })}
                    className="ds-text-xsmall"
                />
                
                {/* Affichage des éléments de l'article sélectionné */}
                {postId && (
                    <div className="display-one-post-frontend">
                        {previewData.image && (
                            <div className="display-one-post-frontend--image">
                                <img
                                    src={previewData.image}
                                    alt={previewData.title}
                                    style={{ maxWidth: '100%', height: 'auto', marginBottom: 'var(--ds-semantic-spacing-m)' }}
                                />
                            </div>
                        )}

                        <div className="display-one-post-frontend--text">
                            {previewData.subtitle && (
                                <div className="ds-display-2">
                                    {previewData.subtitle}
                                </div>
                            )}

                            {previewData.title && <div className="ds-text-base-strong ds-heading-2" dangerouslySetInnerHTML={{ __html: previewData.title }} />}

                            {previewData.date && (
                                <div className="ds-text-small">
                                    {
                                        new Date(previewData.date)
                                            .toLocaleDateString('fr-FR', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                            })
                                            .replace(/(\d{2}) (\w+)\.? (\d{4})/, '$1 $2, $3')
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </section>
        )}
  </>  );
}