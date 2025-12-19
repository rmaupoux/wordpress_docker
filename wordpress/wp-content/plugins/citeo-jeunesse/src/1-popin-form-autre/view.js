document.addEventListener("DOMContentLoaded", () => {
    // Sélection des éléments HTML
    const telechargerDiv = document.querySelector('.popin-jeunesse--telecharger');
    const selectJeunesse = document.getElementById('selectJeunesseAutre');
    const closeButtonAutre = document.getElementById('closePopinButtonAutre');
    const overlayAutre = document.getElementById('popinOverlayAutre');
    const receiveNewsCheckbox = document.getElementById('receiveNewsAutre');
    const blockEmail = document.querySelector("#form-jeunesse-autre .show-email");
    const emailInput = document.getElementById('emailAutre');
    const cookieJeunesse = 'enregistrement_jeunesse';

    // Vérifie si un cookie est présent
    function checkCookie(cookieName) {
        return document.cookie.split(';').some(cookie => cookie.trim().startsWith(`${cookieName}=`));
    }

    // Téléchargement du fichier
    function triggerDownload(url) {
        const link = document.createElement('a');
        link.href = url;
        link.download = '';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Mise à jour de l'affichage du bouton de téléchargement
    function updateTelechargerVisibility() {
        const selectValue = selectJeunesse.value;
        const isEmailValid = emailInput && emailInput.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        const shouldShowTelecharge = selectValue && selectValue !== '...' && isEmailValid;
        telechargerDiv.classList.toggle('show-telecharge', shouldShowTelecharge);
    }

    // Gère le clic sur les boutons de téléchargement de fichiers PDF
    const pdfRegex = /\.pdf(\?.*|#.*|$)/i;
    const openButtonsAutre = [
        ...document.querySelectorAll('.has-prefix--Download a')
    ].filter(link => pdfRegex.test(link.href));

    // Ajout de l'attribut aria-haspopup="dialog" et aria-expanded="false" sur tous les openButtonsAutre
    openButtonsAutre.forEach((button) => {
        button.setAttribute('aria-haspopup', 'dialog');
        button.setAttribute('aria-expanded', 'false');
    });

    openButtonsAutre.forEach(button => {
        // Désactive le clic droit (menu contextuel)
        button.addEventListener('contextmenu', function (event) {
            event.preventDefault();
        });
        button.addEventListener('mousedown', function(event) {
                if (event.button === 1) event.preventDefault();
            });
        button.addEventListener('mouseup', function(event) {
                if (event.button === 1) event.preventDefault();
            });

        // Désactive Ctrl+clic ou Cmd+clic (ouverture dans un nouvel onglet)
        button.addEventListener('click', function (event) {
            if (event.ctrlKey || event.metaKey || event.button === 1) {
                event.preventDefault();
                return;
            }
            event.preventDefault();
            const downloadUrl = button.getAttribute('href');

            if (checkCookie(cookieJeunesse)) {
                if (downloadUrl) {
                    triggerDownload(downloadUrl);
                }
            } else {
                button.setAttribute('aria-expanded', 'true');
                const form = document.getElementById('form-jeunesse-autre');

                let hiddenInput = form.querySelector('input[name="typeDownload"]');
                if (!hiddenInput) {
                    hiddenInput = document.createElement('input');
                    hiddenInput.type = 'hidden';
                    hiddenInput.name = 'typeDownload';
                    form.appendChild(hiddenInput);
                }
                hiddenInput.value = downloadUrl;
                overlayAutre.style.display = 'flex';
            }
        });
    });

    // Fermeture de la popin au clic sur le bouton "fermer"
    closeButtonAutre.addEventListener('click', () => {
        openButtonsAutre.forEach((button) => {
            button.setAttribute('aria-expanded', 'false');
        });
        overlayAutre.style.display = 'none';
    });

    // Fermeture de la popin au clic en dehors de la boîte
    overlayAutre.addEventListener('click', event => {
        if (event.target === overlayAutre) {
            openButtonsAutre.forEach((button) => {
                button.setAttribute('aria-expanded', 'false');
            });
            overlayAutre.style.display = 'none';
        }
    });

    // Écoute des changements pour mettre à jour la visibilité du bouton de téléchargement
    selectJeunesse.addEventListener('change', updateTelechargerVisibility);
    emailInput.addEventListener('input', updateTelechargerVisibility);

    // Initialisation
    checkboxes.forEach(cb => cb?.addEventListener("change", updateEmailVisibility));
    updateEmailVisibility();
});
