import { useBlockProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function Edit({ attributes, setAttributes, context }) {
	const { postId } = context;
	const [sousTitle, setSousTitle] = useState('');
	const [isLoading, setIsLoading] = useState(true);

	// Récupération du post ID depuis le contexte si disponible
	const currentPostId = useSelect((select) => {
		if (postId) return postId;
		return select('core/editor')?.getCurrentPostId?.();
	}, [postId]);

	useEffect(() => {
		if (!currentPostId) {
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		
		// Appel API pour récupérer le champ ACF
		apiFetch({
			path: `/wp/v2/posts/${currentPostId}?_fields=acf`,
		})
		.then((post) => {
			const acfData = post.acf || {};
			setSousTitle(acfData.sous_titre_articles || '');
		})
		.catch((error) => {
			console.error('Erreur lors de la récupération du champ ACF:', error);
			setSousTitle('');
		})
		.finally(() => {
			setIsLoading(false);
		});
	}, [currentPostId]);

	const blockProps = useBlockProps({
		className: 'ds-display-2'
	});

	if (isLoading) {
		return (
			<div {...blockProps}>
				<span style={{ opacity: 0.6 }}>Chargement du sous-titre...</span>
			</div>
		);
	}

	if (!sousTitle) {
		return (
			<div {...blockProps}>
				<span style={{ opacity: 0.6, fontStyle: 'italic' }}>
					Aucun sous-titre défini
				</span>
			</div>
		);
	}

	return (
		<div {...blockProps}>
			{sousTitle}
		</div>
	);
}
