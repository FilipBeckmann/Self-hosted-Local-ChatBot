const queryParams = new URLSearchParams(window.location.search);

function observerFunc() {
    if (queryParams.has('showmodal')) {

        // zum Ausblenden der Scrollbar
        document.documentElement.style.overflow = 'hidden';

        // hier die Sucheingabe mittels CSS ausblenden
        document.querySelector('.md-search__output').style.visibility = "visible";
        document.querySelector('.md-search__output').style.top = 0;

        // Vollbildmodus der Suche
        document.querySelector('.container').style.width = '100%';
        document.querySelector('.container').style.position = "absolute";
        document.querySelector('.container').style.top = 0;
        document.querySelector('.container').style.left = 0;

        document.querySelector('.md-search').style.padding = 0;

        document.querySelector('.md-search__inner').style.width = '100%';

        document.querySelector('.md-search__scrollwrap').style.width = '100%';
        document.querySelector('.md-search__scrollwrap').style.maxHeight = '100vh';

        // hier dafür sorgen, dass durch einen 'Klick' der Such-Dialog nicht verschwindet
        const searchToggle = document.getElementById('__search');
        searchToggle.addEventListener('change', event => {
            if (!searchToggle.checked) {
                searchToggle.checked = true;
            }
        });
    } else {
        document.querySelector('.md-container').style.visibility = "visible";
        document.querySelector('.md-header').style.visibility = "visible";
    }

}

const observerOptions = {
    childList: true
};

const observer = new MutationObserver(observerFunc);
observer.observe(document.querySelector('body'), observerOptions);