document.addEventListener('DOMContentLoaded', function() {
    const pageInput = document.getElementById('current-page-selector');
    
    if (pageInput) {
        // Ajout de l'écouteur d'événement
        pageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                
                // Récupération des éléments DOM nécessaires
                const totalPagesElement = document.querySelector('.total-pages');
                const totalPages = parseInt(totalPagesElement.textContent, 10) || 1;
                let newPage = parseInt(this.value, 10) || 1;

                // Validation avancée
                newPage = Math.max(1, Math.min(newPage, totalPages));
                
                // Construction de la nouvelle URL
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.set('paged', newPage);
                
                // Redirection
                window.location.href = newUrl.toString();
            }
        });

        // Feedback visuel pour les entrées invalides
        pageInput.addEventListener('input', function() {
            const currentValue = parseInt(this.value, 10);
            const totalPages = parseInt(document.querySelector('.total-pages').textContent, 10);
            
            this.classList.toggle(
                'invalid-page', 
                !!this.value && (isNaN(currentValue) || currentValue < 1 || currentValue > totalPages)
            );
        });
    }
});