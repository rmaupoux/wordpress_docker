document.addEventListener('DOMContentLoaded', function () {
console.log('Citeo Articles Copy JS loaded');
console.log('shareCounterData:', typeof shareCounterData !== 'undefined' ? shareCounterData : 'undefined');

    const shareButtons = document.querySelectorAll('.article-content__social-share a');
    shareButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();


            // Case of URL copy: no redirection
            if (this.classList.contains('copylink-button')) {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    const message = document.createElement('span');
                    message.textContent = (typeof shareCounterData !== 'undefined' && shareCounterData.copied_text) 
                        ? shareCounterData.copied_text 
                        : 'Lien copié !';
                    message.classList.add('tooltip-links');
                    const parent = this.parentElement;
                    parent.style.position = 'relative';
                    parent.appendChild(message);
                    setTimeout(() => {
                        message.remove();
                    }, 3000);

                  
                }).catch(error => {
                    const errorMsg = (typeof shareCounterData !== 'undefined' && shareCounterData.error_text) 
                        ? shareCounterData.error_text 
                        : 'Une erreur est survenue lors de la copie du lien. Veuillez réessayer.';
                    alert(errorMsg);
                });

                return;
            }

           

        });
    });
});