(function(wp) {

    const { blocks } = wp;
    const { getBlockTypes, unregisterBlockType, registerBlockType } = blocks;

    wp.domReady(() => {

        // Subscribe to state changes and wait until currentPostType is available
        const unsubscribe = wp.data.subscribe(() => {
            const currentPostType = wp.data.select('core/editor').getCurrentPostType();

            if (currentPostType) {
                // Unsubscribe so this only runs once
                unsubscribe();

                const allowedCategory = 'article';
                const allBlocks = getBlockTypes();

                if (currentPostType !== 'post') {
                    allBlocks.forEach((block) => {
                        if (block.category === allowedCategory) {
                            unregisterBlockType(block.name);
                        }
                    });
                    return;
                }

                allBlocks.forEach((block) => {
                    if (block.category !== allowedCategory) {
                        unregisterBlockType(block.name);
                        registerBlockType(block.name, {
                            ...block,
                            supports: {
                                ...block.supports,
                                inserter: false,
                            },
                        });
                    }
                });

            }
        });
    });
})(window.wp);
