import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

const v1 = {
    attributes: {
        // Définissez ici les attributs de la version dépréciée si nécessaire
    },
    save({ attributes }) {
        const blockProps = useBlockProps.save({
            className: 'section-nos-metiers article-section', // Classe de la version dépréciée
        });

        const innerBlocksProps = useInnerBlocksProps.save(blockProps);

        return (
            <section {...innerBlocksProps} />
        );
    },
}

const v2 = {
    attributes: {
		"isUniqueActive": {
			"type": "boolean",
			"default": false
		},
		"className": {
            "type": "string",
            "default": "section-nos-metiers"
        }
	},

    save({ }) {

        const blockProps = useBlockProps.save({
            className: 'faq-section-large',
        });

        const innerBlocksProps = useInnerBlocksProps.save(blockProps)

        return (
            <section {...innerBlocksProps} />
        );
    }
}

export default [v2, v1];
