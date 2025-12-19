// CC2-392 buttons variations
wp.blocks.registerBlockVariation(
	'core/button',
	{
		name: 'download-button',
		title: 'Lien à télécharger',
		attributes: {
			variationName: 'download'
		},
        isActive: [ 'variationName' ]
	}
);
wp.blocks.registerBlockVariation(
	'core/button',
	{
		name: 'icon-button',
		title: 'Icône',
		attributes: {
			variationName: 'icon'
		},
        isActive: [ 'variationName' ]
	}
);

// MC-234 card with image variation
wp.blocks.registerBlockVariation(
	'b2b/card',
	{
		name: 'b2b-image-card-tags',
		title: 'Carte avec image et tags',
		attributes: {
			className: 'image-card',
			hasImage: true,
			hasTags: true
		},
        isActive: [ 'hasImage', 'hasTags' ],
		innerBlocks: [
			['core/image', {}],
			['core/group', {
				metadata: {
					name: 'Liste de bulles'
				},
				layout: {
					type: 'flex'
				},
				allowedBlocks: ['citeo-semantic/tag'],
				className: 'ds-text-small'
			}, 
				[
					['citeo-semantic/tag', {}]
				]
			],
			['core/paragraph', {
				className: 'ds-text-large',
				placeholder: 'Texte descriptif qui appuie le titre.\nCelui ci doit être assez court pour inciter à lire la suite. '
			}],
		]
	}
);

// MC-234 card with image and no tags variation
wp.blocks.registerBlockVariation(
	'b2b/card',
	{
		name: 'b2b-image-card',
		title: 'Carte avec image',
		attributes: {
			className: 'image-card',
			hasImage: true,
			hasTags: false
		},
        isActive: [ 'hasImage', 'hasTags' ],
		innerBlocks: [
			['core/image', {}],
			['core/paragraph', {
				className: 'ds-heading-2 top-titre',
				placeholder: 'Top titre'
			}],
			['core/heading', {
				level: 4,
				className: 'ds-heading-4',
				placeholder: 'Titre de la carte sur 1 ligne'
			}],
			['core/paragraph', {
				className: 'ds-text-base',
				placeholder: 'Description de la carte. Maximum 2 lignes'
			}]
		]
	}
);

// MC-232 number card with image
wp.blocks.registerBlockVariation(
	'b2b/number-card',
	{
		name: 'b2b-number-icon-card',
		title: 'Exergue de chiffre avec icône',
		attributes: {
			className: 'icon-number-card',
			hasIcon: true
		},
        isActive: [ 'hasIcon' ],
		innerBlocks: [
			['citeo-semantic/icon', {}],
			['core/paragraph', {
				content: '<span class="ds-display-number">00M€</span>',
				placeholder: '00M€'
			}],
			['core/paragraph', {
				className: 'ds-text-base',
				placeholder: 'Texte descriptif qui appuie le chiffre.'
			}]
		]
	}
);

// MC-232 number card with image
wp.blocks.registerBlockVariation(
	'b2b/title-description-button',
	{
		name: 'b2b-title-description-button-tags',
		title: 'Tag, titre, description et bouton',
		attributes: {
			hasTags: true
		},
        isActive: [ 'hasTags' ],
		innerBlocks: [
			['core/group', {
				className: 'tag-wrapper',
				metadata: {
					name: 'Liste de tags'
				},
				layout: {
					type: 'flex',
					flexWrap: 'wrap'
				},
				allowedBlocks: ['citeo-semantic/tag']
			}, 
				[
					['citeo-semantic/tag']
				]
			],
			['core/heading', {
				level: 2,
				content: '<span class="custom-size ds-text-xsmall">Texte support</span>\n<span class="custom-size ds-heading-1">titre</span>\n<span class="custom-size ds-heading-3">sous-titre qui peut être <span class="underline">souligné</span></span>'
			}],
			['core/paragraph', {
				className: 'ds-text-large',
				placeholder: "Texte descriptif qui appuie le titre. \nCelui ci doit être assez court pour inciter à lire la suite.",
			}],
			['core/buttons', {}, 
				[
					['core/button', {
						variationName: 'standard',
						placeholder: "Button Action 1"
					}],
					['core/button', {
						variationName: 'standard',
						className: 'is-style-secondary',
						placeholder: "Button Action 2"
					}],
				]
			]
		]
	}
);

// MC-360 step card without image
wp.blocks.registerBlockVariation(
	'b2b/block-step',
	{
		name: 'b2b-step-no-image',
		title: 'Étape sans image',
		attributes: {
			hasImage: false
		},
        isActive: [ 'hasImage' ],
		innerBlocks: [
			['core/paragraph', {
				className: 'step-ttl ds-heading-2',
				placeholder: 'Titre de l\'étape. 2 lignes maximum.',
				lock: {
					remove: true,
					move: true
				}
			}],
			['core/paragraph', {
				className: 'step-desc ds-text-paragraph',
				placeholder: 'Courte description. 5 lignes maximum',
				lock: {
					move: true
				}
			}]
		]
	}
);

// MC-516 offer card without illustration
wp.blocks.registerBlockVariation(
	'b2b/card-offer',
	{
		name: 'b2b-offer-no-illustration',
		title: 'Carte offre sans illustration',
		attributes: {
			hasIllustration: false,
			className: 'no-illustration-card'
		},
        isActive: [ 'hasIllustration' ],
		innerBlocks: [
			['core/heading', {
				level: 2,
				className: 'ds-heading-2',
				placeholder: 'Titre de la carte'
			}],
			['core/paragraph', {
				className: 'ds-text-paragraph',
				placeholder: 'Description de la carte.'
			}]
		]
	}
);