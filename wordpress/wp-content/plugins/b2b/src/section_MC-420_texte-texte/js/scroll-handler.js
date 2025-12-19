/**
 * Gestion du bouton "Retour en haut" pour le bloc texte-texte
 */

document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner tous les blocs texte-texte
    const textBlocks = document.querySelectorAll('.wp-block-b2b-texte-texte');
    
    textBlocks.forEach(function(block, index) {
        // Ajouter un ID unique au bloc pour l'ancre
        if (!block.id) {
            block.id = `texte-texte-block-${index}`;
        }
        
        // Sélectionner la première colonne et le bouton retour en haut
        const firstColumn = block.querySelector('.wp-block-columns:nth-child(2) .wp-block-column:first-child');
        const backToTopBtn = block.querySelector('.back-to-top-btn a, .back-to-top-btn button');
        
        if (!firstColumn || !backToTopBtn) return;
        
        // Fonction pour vérifier si le contenu dépasse le viewport
        function checkColumnHeight() {
            const columnHeight = firstColumn.offsetHeight;
            const viewportHeight = window.innerHeight;
            const backToTopWrapper = block.querySelector('.back-to-top-wrapper');
            
            if (columnHeight > viewportHeight) {
                // Afficher le bouton
                if (backToTopWrapper) {
                    backToTopWrapper.style.display = 'block';
                    backToTopWrapper.style.opacity = '1';
                }
            } else {
                // Masquer le bouton
                if (backToTopWrapper) {
                    backToTopWrapper.style.display = 'none';
                    backToTopWrapper.style.opacity = '0';
                }
            }
        }
        
        // Ajouter le comportement de scroll au bouton
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            block.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
        
        // Vérifier initialement
        checkColumnHeight();
        
        // Vérifier lors du redimensionnement de la fenêtre
        window.addEventListener('resize', checkColumnHeight);
        
        // Observer les changements de contenu dans la colonne
        const observer = new ResizeObserver(checkColumnHeight);
        observer.observe(firstColumn);
    });
});