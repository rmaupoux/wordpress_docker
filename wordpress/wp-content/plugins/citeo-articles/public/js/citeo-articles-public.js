(() => {
    const generatePostDOM = (post) => {
        const postTitleItem = document.createElement('li');
        postTitleItem.classList.add('post-title-item');
        const postLink = document.createElement('a');
        postLink.classList.add('post-title-link');
        postLink.href = post.link;
        postLink.innerHTML = post.title.rendered;
        postTitleItem.appendChild(postLink);
        return postTitleItem;
    };

    const fetchPostsBySearch = (opt) => {
        let args = '';
        if (opt) {
            args += '?';
            let i = 0;
            for (const [key, value] of Object.entries(opt)) {
                args += i === 0 ? `${key}=${value}` : `&${key}=${value}`;
                i++;
            }
        }

        const loader = document.querySelector('.loader');
        const searchIcon = document.querySelector('.search-icon');
        const searchSubmit = document.querySelector('.search-submit'); 

        if (loader) loader.style.display = 'inline-block'; 
        if (searchIcon) searchIcon.style.display = 'none'; 

        fetch(`/wp-json/wp/v2/posts/${args}`)
            .then(async (response) => {
                const totalPosts = response.headers.get('X-WP-Total');
                const posts = await response.json();
                return { posts, totalPosts: parseInt(totalPosts) };
            })
            .then((body) => {
                if (loader) loader.style.display = 'none'; 
                if (searchIcon) searchIcon.style.display = 'inline-block'; 
                if (searchSubmit) searchSubmit.style.display = 'inline-block'; 

                const searchContainer = document.querySelector('.archive-page__search');
                const existingDropdown = document.querySelector('.search-results-dropdown');

                if (existingDropdown) existingDropdown.remove();

                // Créer le conteneur dropdown
                const dropdown = document.createElement('div');
                dropdown.classList.add('search-results-dropdown');

                const resultCount = document.createElement('div');
                resultCount.classList.add('search-results-count');
                if (body.totalPosts === 0) {
                    resultCount.innerHTML = `Aucun article trouvé`;
                    dropdown.appendChild(resultCount);
                    searchContainer.appendChild(dropdown);
                    return;
                }
                if (body.totalPosts === 1) {
                    resultCount.innerHTML = `Un article trouvé`;
                } else {
                    resultCount.innerHTML = `${body.totalPosts} articles trouvés`;
                }
                
                dropdown.appendChild(resultCount);

                const articleList = document.createElement('ul');
                articleList.classList.add('post-titles-list');

                body.posts.forEach((post) => {
                    const postDOM = generatePostDOM(post);
                    articleList.appendChild(postDOM);
                });

                dropdown.appendChild(articleList);
                searchContainer.appendChild(dropdown);
            })
            .catch((err) => {
                if (loader) loader.style.display = 'none'; 
                if (searchIcon) searchIcon.style.display = 'inline-block'; 
                if (searchSubmit) searchSubmit.style.display = 'inline-block'; 
                console.error(err);
            });
    };

    const searchInput = document.querySelectorAll('.search-field');
    const overlay = document.createElement('div');
    overlay.classList.add('search-overlay');
    document.body.appendChild(overlay);

    // Initialiser le bouton submit comme disabled au chargement
    const searchSubmit = document.querySelector('.search-submit');
    if (searchSubmit) {
        searchSubmit.setAttribute('disabled', 'disabled');
    }

    searchInput.forEach((el) => {
        el.addEventListener('input', () => {
            const searchSubmit = document.querySelector('.search-submit');
            
            if (el.value.length > 2) {
                const options = {
                    search: el.value,
                    per_page: 6,
                };
                fetchPostsBySearch(options);
                
                // Retirer l'attribut disabled du bouton submit
                if (searchSubmit) {
                    searchSubmit.removeAttribute('disabled');
                }
            } else {
                // Ajouter l'attribut disabled si moins de 3 caractères
                if (searchSubmit) {
                    searchSubmit.setAttribute('disabled', 'disabled');
                }
            }
        });

        el.addEventListener('focus', () => {
            overlay.style.display = 'block';
        });

        el.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const searchQuery = el.value.trim();
                if (searchQuery) {
                    const searchUrl = `/?s=${encodeURIComponent(searchQuery)}`;
                    window.location.href = searchUrl;
                }
            }
        });
    });

    const searchInputSingle = document.querySelector('.search-field');
    const searchContainer = document.querySelector('.archive-page__search');

    if (searchInputSingle && searchContainer) {
        searchInputSingle.addEventListener('focus', () => {
            searchContainer.classList.add('archive-page__search-show');
        });

        document.addEventListener('click', (event) => {
            if (!searchContainer.contains(event.target)) {
                searchContainer.classList.remove('archive-page__search-show');
                overlay.style.display = 'none';

                const searchResultsDropdown = document.querySelector('.search-results-dropdown');
                if (searchResultsDropdown) {
                    searchResultsDropdown.remove();
                }
            }
        });
    }

    // Effet de click sur le bouton search-clear
    const searchClearButton = document.querySelector('button.search-clear');
    if (searchClearButton) {
        searchClearButton.addEventListener('click', () => {
            const searchContainer = document.querySelector('.archive-page__search');
            const searchSubmit = document.querySelector('.search-submit');
            
            if (searchContainer) {
                searchContainer.classList.remove('archive-page__search-show');
            }
            
            // Ajouter l'attribut disabled au bouton submit
            if (searchSubmit) {
                searchSubmit.setAttribute('disabled', 'disabled');
            }
            
            overlay.style.display = 'none';

            const searchResultsDropdown = document.querySelector('.search-results-dropdown');
            if (searchResultsDropdown) {
                searchResultsDropdown.remove();
            }
        });
    }
})();
