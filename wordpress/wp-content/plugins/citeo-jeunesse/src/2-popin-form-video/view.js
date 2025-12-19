document.addEventListener('DOMContentLoaded', () => {

    const closeButton = document.getElementById('closePopinButtonVideo');
    const overlay = document.getElementById('popinOverlay');

    const telechargeVideoDiv = document.querySelector('.popin-jeunesse--telecharge-video');
    const emailInputVideo = document.getElementById('emailVideo');

    const selectJeunesseVideo = document.getElementById('selectJeunesseVideo');

    const cookieJeunesse = 'enregistrement_jeunesse';

    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|shorts\/)?([a-zA-Z0-9_-]{11})/;
    const mp4Regex = /\.mp4$/;
    const numberEnfantVideo = document.getElementById('numberEnfantVideo');

    const openButtons = [
        ...document.querySelectorAll('.has-prefix--Download a')
    ].filter(link => youtubeRegex.test(link.href) || mp4Regex.test(link.href));

    // Ajout de l'attribut aria-haspopup="dialog" sur tous les openButtons et améliorer l'accessibilité
    openButtons.forEach((button) => {
        button.setAttribute('aria-haspopup', 'dialog');
        button.setAttribute('aria-expanded', 'false');
    });

    const checkCookie = (cookieName) => {
        const cookies = document.cookie;
        return cookies.split(';').some(cookie => cookie.trim().startsWith(cookieName + '='));
    };

    const updateTelechargeVideoVisibility = () => {
    const selectValue = selectJeunesseVideo.value;
    const isEmailValid = emailInputVideo && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInputVideo.value);
    const receiveActuCheckbox = document.getElementById('receive_actu');

    if (isEmailValid && selectValue && selectValue !== '...') {
        const isReceiveActuChecked = receiveActuCheckbox?.checked;

        let shouldShow = true;

        if (isReceiveActuChecked) {
            const numberValue = parseInt(numberEnfantVideo?.value || '0', 10);
            shouldShow = numberValue > 0;
        }

        telechargeVideoDiv.classList.toggle('show-telecharge', shouldShow);
    } else {
        telechargeVideoDiv.classList.remove('show-telecharge');
    }
};



    // Ajout de la condition globale pour checkCookie
    if (!checkCookie(cookieJeunesse)) {
        openButtons.forEach((button) => {
            button.addEventListener('contextmenu', function (event) {
                event.preventDefault();
            });
            button.addEventListener('mousedown', function(event) {
                if (event.button === 1) event.preventDefault();
            });
            button.addEventListener('mouseup', function(event) {
                if (event.button === 1) event.preventDefault();
            });

            button.addEventListener('click', function (event) {
                if (event.ctrlKey || event.metaKey || event.button === 1) {
                    event.preventDefault();
                    return;
                }
                event.preventDefault();
                const url = button.getAttribute('href');
                const isYoutube = youtubeRegex.test(url);
                const isMp4 = mp4Regex.test(url);

                const btnTelecharge = document.querySelector('.btn-with-svg.btn-with-svg--video');
                if (btnTelecharge && btnTelecharge.dataset.initialText) {
                    btnTelecharge.innerHTML = btnTelecharge.dataset.initialText;
                }

                if (isYoutube || isMp4) {
                    if (isMp4 && btnTelecharge) {
                        if (!btnTelecharge.dataset.initialText) {
                            btnTelecharge.dataset.initialText = btnTelecharge.innerHTML;
                        }
                        btnTelecharge.innerHTML = "Télécharger la video";
                    }
                    const form = document.getElementById('form-jeunesse-video');
                    let hiddenInput = form.querySelector('input[name="typeVideo"]');
                    if (!hiddenInput) {
                        hiddenInput = document.createElement('input');
                        hiddenInput.type = 'hidden';
                        hiddenInput.name = 'typeVideo';
                        form.appendChild(hiddenInput);
                    }
                    hiddenInput.value = url;
                    button.setAttribute('aria-expanded', 'true');
                    overlay.style.display = 'flex';
                }
            });
        });

        closeButton.addEventListener('click', () => {
            const btnTelecharge = document.querySelector('.btn-with-svg.btn-with-svg--video');
            if (btnTelecharge && btnTelecharge.dataset.initialText) {
                btnTelecharge.innerHTML = btnTelecharge.dataset.initialText;
            }
            openButtons.forEach((button) => {
                button.setAttribute('aria-expanded', 'false');
            });
            overlay.style.display = 'none';
        });

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                openButtons.forEach((button) => {
                    button.setAttribute('aria-expanded', 'false');
                });
                overlay.style.display = 'none';
            }
        });
    }

    const checkVideoBlock = document.getElementById('check-video');
    if (checkVideoBlock) {
        const checkbox = checkVideoBlock.querySelector('.check-video--checkbox');
        const textDiv = checkVideoBlock.querySelector('.check-video--text');
        const inputDiv = checkVideoBlock.querySelector('.check-video--input');

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                textDiv.style.display = 'none';
                inputDiv.style.display = 'flex';
            } else {
                textDiv.style.display = 'block';
                inputDiv.style.display = 'none';
            }
            updateTelechargeVideoVisibility();
        });
    }

    selectJeunesseVideo.addEventListener('change', updateTelechargeVideoVisibility);
    
    if (numberEnfantVideo) {
        numberEnfantVideo.addEventListener('input', updateTelechargeVideoVisibility);
    }
    emailInputVideo.addEventListener('input', updateTelechargeVideoVisibility);

});
