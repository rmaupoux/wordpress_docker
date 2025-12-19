(function addDownloadAttr() {
    const btnList = document.querySelectorAll('.add-download .wp-block-button__link');
    if (btnList.length == 0) return;

    btnList.forEach(el => {
        try {
            const url = new URL(el.href);
            const pathname = url.pathname;
            const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
            if (filename) {
                el.setAttribute('download', filename);
            } else {
                el.setAttribute('download', '');
            }
        } catch (e) {
            // fallback si href n'est pas une URL absolue
            const parts = el.href.split('/');
            const filename = parts[parts.length - 1];
            el.setAttribute('download', filename || '');
        }
    });
})();