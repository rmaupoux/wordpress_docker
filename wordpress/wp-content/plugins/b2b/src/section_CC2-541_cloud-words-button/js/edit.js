import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import '../scss/editor.scss';
// import previewImg from '/assets/img/section-cloud-word.png';

export default function Edit({ attributes }) {
	const { preview } = attributes
	const blockProps = useBlockProps({
		className: `cloud-word`
	});

	const TEMPLATE = [
		['core/group', {
			templateLock: 'all', 
			className: 'heading-group'
		}, [
			['core/heading', {
				level: 2,
				textAlign: 'center',
				className: 'key-ttl',
				content: 'Dum haec in oriente aguntur'
			}],
			['core/heading', {
				level: 3,
				textAlign: 'center',
				className: 'key-ttl h3-title',
				content: 'Arelate hiemem agens Constantius post theatralis ludos atque circenses ambitioso editos apparatu diem sextum idus Octobres, qui imperii eius annum tricensimum terminabat'
			}]
		]],
		['core/buttons', { 
			metadata: {
				name: 'Nuage de mots'
			},
			className: 'numbers-button',
		}, 
			[
				['core/button', {
					text: 'Atque circenses',
					className: 'cloud-word--button'
				}],
				['core/button', {
					text: 'Inter',
					className: 'cloud-word--button'
				}],
				['core/button', {
					text: 'Insolentiae pondera gravius librans',
					className: 'cloud-word--button'
				}],
				['core/button', {
					text: 'Excarnificatum Gerontium',
					className: 'cloud-word--button'
				}],
				['core/button', {
					text: 'Constantius',
					className: 'cloud-word--button'
				}],
			]
		]
	];
	
	if (preview) {
        return (
            <>
                <img src={previewImg} alt="Preview" />
            </>
        );
    }

	const ALLOWED_BLOCKS = ['core/heading', 'core/buttons']

	return (
		<section {...blockProps}>
			<InnerBlocks
				template={TEMPLATE}
				allowedBlocks={ALLOWED_BLOCKS} 
			/>

		</section>
	);
}
