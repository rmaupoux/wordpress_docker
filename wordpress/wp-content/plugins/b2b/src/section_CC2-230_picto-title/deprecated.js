import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/*
* Copy and paste what you had in your previous save.js here
*/

const v1 = {
    attributes: {
		"allowResize": {
			"type": "boolean",
			"default": false
		},
		"iconPosition": {
			"type": "string",
			"default": "left"
		},
		"theme": {
			"type": "string",
			"default": ""
		},
		"subTheme": {
			"type": "string",
			"default": ""
		},
		"themeSwapConfirm": {
            "type": "boolean",
            "default": false
        },
		"svgUrl": {
			"type": "string"
		},
		"svgContent": {
			"type": "string"
		},
		"svgSpaceBoxWidth": {
			"type": "number",
			"default": 600
		},
		"useSvgAsBackground": {
			"type": "boolean",
			"default": false
		},
		 "align": {
            "type": "string",
            "default": "full"
        }
	},

    migrate(attributes) {
		const legacyToNewMap = {
			'groupe-citeo': 'ds-subtheme-group',
			'citeo-pro': 'ds-subtheme-pro',
			'citeo-emp': 'ds-subtheme-emp',
			'citeo-sh': 'ds-subtheme-sh',
		};

		return {
			...attributes,
			theme: legacyToNewMap[attributes.theme] || attributes.theme
		};
	},

    save({ attributes }) {
        const getSvgDataUri = (svgContent) => {
        let svg = String(svgContent || '');

        const viewBoxSize = svg.match(/viewBox="(\d+)\s(\d+)\s(\d+)\s(\d+)"/)?.slice(1).map(Number);;

        if(viewBoxSize) {
            const sizeX = viewBoxSize[2], sizeY = viewBoxSize[3]

            svg = svg.replace(
                /viewBox="[^"]*"/,
                `viewBox="0 0 ${6 * sizeX} ${1.5 * sizeY}"`
            );
        }

        return `url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}')`;
    }

        const {
            iconPosition = 'left',
            theme,
            subTheme,
            svgSpaceBoxWidth,
            svgContent,
            useSvgAsBackground
        } = attributes;
    
        const blockProps = useBlockProps.save({
            className: `text-img-wrap ${theme} ${subTheme}`,
        });
    
        const backgroundStyle = useSvgAsBackground
            ? {
                maskImage: `${getSvgDataUri(svgContent)}, ${getSvgDataUri(svgContent)}`,
                maskSize: `${svgSpaceBoxWidth}px ${svgSpaceBoxWidth / 2}px`,
                maskRepeat: 'repeat',
                maskPosition: `0 0, ${svgSpaceBoxWidth / 2}px ${svgSpaceBoxWidth / 4}px`,
                backgroundColor: 'var(--ds-semantic-color-accent1-surface-medium)'
            } : {};
    
        return (
            <section {...blockProps}>
                <div
                    className={`chantier-flex  ${iconPosition === 'left' ? 'flex-row' : iconPosition === 'right' ? 'flex-row-reverse' : iconPosition === 'center' ? 'flex-row-center' : ''} ${useSvgAsBackground ? 'chantier-flex--background' : ''}`}
                >
                    {useSvgAsBackground ? (
                        <div
                            className='picto-back-repeat'
                            style={backgroundStyle}
                        />
                    ) : (
                        <span
                            className='main-picto'
                            style={{
                                maskImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}')`,
                            }}
                        />
                    )}
                    
                    <InnerBlocks.Content />
                </div>
            </section>
        );
    }
}

// Latest version first in the array 
export default [ v1 ];