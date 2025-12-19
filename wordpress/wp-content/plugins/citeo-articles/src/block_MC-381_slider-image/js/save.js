import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {

	const blockProps = useBlockProps.save({});

	return (
		<div {...blockProps}>
			<div className='wrapper__sider-controls'>
				<div className="wp-block-buttons slider-controls">
					<div className="wp-block-button prev-slide is-style-secondary no-text has-suffix--Chevron-right">
						<a className="wp-block-button__link wp-element-button" />
					</div>
					<div className='total-wrap'></div>
					<div className="wp-block-button next-slide is-style-primary no-text has-suffix--Chevron-right">
						<a className="wp-block-button__link wp-element-button" />
					</div>
				</div>
			</div>
			<section className="article-slider-content">
				<InnerBlocks.Content />
			</section>
		</div>
	);
}
