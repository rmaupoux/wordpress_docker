wp.domReady(() => {

    function addClassesToPatternIframeBody() {
        const currentPostId = wp.data.select('core/edit-site').getEditedPostId();

        if(!currentPostId) {
            requestAnimationFrame(addClassesToPatternIframeBody);
            return;
        }

        const currentPost = wp.data.select('core').getEntityRecord(
            'postType',
            'wp_block',
            currentPostId
        );

        let slugsClassNames = []
        currentPost?.wp_pattern_category.forEach(catId => {
            const term = wp.data.select('core').getEntityRecord(
                'taxonomy',
                'wp_pattern_category',
                catId
            );

            if(term) slugsClassNames.push(`wp-pattern-category-${term.slug}`)
        })

        const editorIframe = document.querySelector('iframe')

        if (editorIframe) {
            const editorBody = editorIframe.contentDocument.querySelector(".is-root-container");

            if (editorBody && slugsClassNames.length > 0) {
                console.log('Added categories as classes in the iframe.');

                editorBody.classList.add(...slugsClassNames);
                return true;
            }
        }
        return false;
    }

    if (!addClassesToPatternIframeBody()) {
        // Observe `document.body` for the iframe addition
        const observer = new MutationObserver(() => {

            const editorIframe = document.querySelector('iframe')

            if (editorIframe) {
                const editorBody = editorIframe.contentDocument.querySelector(".is-root-container");

                if (editorBody) {
                    if (addClassesToPatternIframeBody()) {
                        observer.disconnect();
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
});