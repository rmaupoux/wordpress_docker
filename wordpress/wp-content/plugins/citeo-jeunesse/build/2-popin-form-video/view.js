/******/ (() => { // webpackBootstrap
/*!****************************************!*\
  !*** ./src/2-popin-form-video/view.js ***!
  \****************************************/
document.addEventListener('DOMContentLoaded', () => {
  const telechargeVideoDiv = document.querySelector('.popin-jeunesse--telecharge-video');
  const selectJeunesseVideo = document.getElementById('selectJeunesseVideo');
  const numberEnfantVideo = document.getElementById('numberEnfantVideo');
  const closeButton = document.getElementById('closePopinButtonVideo');
  const overlay = document.getElementById('popinOverlay');
  const cookieJeunesse = 'enregistrement_jeunesse';
  const receiveActuCheckbox = document.getElementById('receive_actu');
  const receiveNewsCheckbox = document.getElementById('receiveNewsVideo');
  const checkboxes = [receiveNewsCheckbox, document.getElementById('refuseSurveysAutre')];
  const blockEmail = document.querySelector("#form-jeunesse-autre .show-email");
  const emailInput = document.getElementById('emailVideo');
  function checkCookie(cookieName) {
    const cookies = document.cookie;
    return cookies.split(';').some(cookie => cookie.trim().startsWith(cookieName + '='));
  }
  const updateTelechargeVideoVisibility = () => {
    const isOptionSelected = selectJeunesseVideo.value !== '' && selectJeunesseVideo.value !== '...';
    const isNumberEnfantValid = numberEnfantVideo.value > 0;
    const isReceiveActuChecked = receiveActuCheckbox.checked;
    const isReceiveNewsChecked = receiveNewsCheckbox.checked;
    const isEmailValid = emailInput && emailInput.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    if (isOptionSelected && !isReceiveActuChecked) {
      telechargeVideoDiv.classList.add('show-telecharge');
    } else {
      telechargeVideoDiv.classList.remove('show-telecharge');
    }
    if (isNumberEnfantValid && isOptionSelected) {
      telechargeVideoDiv.classList.add('show-telecharge');
    }
    if (isReceiveNewsChecked && !isEmailValid) {
      telechargeVideoDiv.classList.remove('show-telecharge');
    }
  };
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|shorts\/)?([a-zA-Z0-9_-]{11})/;
  const mp4Regex = /\.mp4$/;
  const openButtons = [...document.querySelectorAll('.has-prefix--Download a')].filter(link => youtubeRegex.test(link.href) || mp4Regex.test(link.href));

  // Ajout de l'attribut aria-haspopup="dialog" sur tous les openButtons et améliorer l'accessibilité
  openButtons.forEach(button => {
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-expanded', 'false');
  });

  // Ajout de la condition globale pour checkCookie
  if (!checkCookie(cookieJeunesse)) {
    openButtons.forEach(button => {
      button.addEventListener('contextmenu', function (event) {
        event.preventDefault();
      });
      button.addEventListener('mousedown', function (event) {
        if (event.button === 1) event.preventDefault();
      });
      button.addEventListener('mouseup', function (event) {
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
      openButtons.forEach(button => {
        button.setAttribute('aria-expanded', 'false');
      });
      overlay.style.display = 'none';
    });
    overlay.addEventListener('click', event => {
      if (event.target === overlay) {
        openButtons.forEach(button => {
          button.setAttribute('aria-expanded', 'false');
        });
        overlay.style.display = 'none';
      }
    });
  } else {
    // Si le cookie est présent, aucun comportement JS personnalisé n'est appliqué sur les boutons
    // Les liens fonctionnent normalement (comportement natif)
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
    });
  }
  selectJeunesseVideo.addEventListener('change', updateTelechargeVideoVisibility);
  numberEnfantVideo.addEventListener('change', updateTelechargeVideoVisibility);
  receiveNewsCheckbox.addEventListener('change', updateTelechargeVideoVisibility);
  receiveActuCheckbox.addEventListener('change', updateTelechargeVideoVisibility);
  emailInput.addEventListener('input', function () {
    updateTelechargeVideoVisibility();
  });

  // Affichage du champ email si la case newsletter ou refuse Survey est cochée // TODO : Supprimez car email tout le temps visible dans la nouvelle maquette
  function updateEmailVisibility() {
    // some() check dans l'array checkboxes si un element est checked si oui alors affiche le block email
    const shouldDisplay = checkboxes.some(cb => cb.checked);
    blockEmail.style.display = shouldDisplay ? "block" : "none";
  }

  // Initialisation
  checkboxes.forEach(cb => cb?.addEventListener("change", updateEmailVisibility));
  updateEmailVisibility();
});
/******/ })()
;
//# sourceMappingURL=view.js.map