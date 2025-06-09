(function () {
    let page = 1;
    let isLoading = false;
    const pinsContainer = document.getElementById('pins-container');
    const loading = document.getElementById('loading');
    const preloader = document.getElementById('preloader');
    const query = new URLSearchParams(window.location.search).get('q') || '';

    function loadMorePins() {
        if (isLoading) return;
        isLoading = true;
        if (loading) loading.style.display = 'block';
        if (preloader) preloader.style.display = 'block';

        fetch(`/load-more-pins/?page=${page + 1}&q=${encodeURIComponent(query)}`)
            .then(response => {
                if (loading) loading.style.display = 'none';
                if (preloader) preloader.style.display = 'none';
                return response.json();
            })
            .then(data => {
                if (data.html) {
                    pinsContainer.insertAdjacentHTML('beforeend', data.html);
                    page++;
                }
                isLoading = False;
                if (!data.has_next) {
                    window.removeEventListener('scroll', debouncedHandleScroll);
                }
            })
            .catch(error => {
                console.error('Error loading pins:', error);
                if (loading) loading.style.display = 'none';
                if (preloader) preloader.style.display = 'none';
                isLoading = false;
            });
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
            loadMorePins();
        }
    };

    const debouncedHandleScroll = debounce(handleScroll, 200);
    window.addEventListener('scroll', debouncedHandleScroll);
})();
