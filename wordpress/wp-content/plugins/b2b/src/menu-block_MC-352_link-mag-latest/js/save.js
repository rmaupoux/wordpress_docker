import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { magURL } = attributes

	const blockProps = useBlockProps.save({})

	return (
		<article {...blockProps} >
            <a href={magURL} className='mag-ttl-wrap'>
                <h4 className="ds-text-base mag-ttl">LE MAG</h4>
                <arrow-right-icon-component size="16" color="var(--ds-semantic-color-neutral-content-medium)" />
            </a>
            <div className='mag-content'>
                <InnerBlocks.Content />
            </div>                
        </article>   
	);
}
