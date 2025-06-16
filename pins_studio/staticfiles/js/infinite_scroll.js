(function () {
    let page = 1;
    let isLoading = false;
    const pinsContainer = document.getElementById('pins-container');
    const loading = document.getElementById('loading');
    const query = new URLSearchParams(window.location.search).get('q') || '';

    // Initialize Masonry
    let msnry;
    function initMasonry() {
        msnry = new Masonry(pinsContainer, {
            itemSelector: '.pin-item',
            columnWidth: window.innerWidth <= 767 ? 130 : 233,
            percentPosition: false,
            gutter: 12,
            transitionDuration: '0.2s',
            fitWidth: true // Ensure Masonry fits container width
        });
        msnry.layout(); // Force immediate layout
    }

    // Initialize Masonry after images are loaded
    imagesLoaded(pinsContainer, function() {
        initMasonry();
    });

    function loadMorePins() {
        if (isLoading) return;
        isLoading = true;
        if (loading) loading.style.display = 'block';

        fetch(`/load-more-pins/?page=${page + 1}&q=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                if (loading) loading.style.display = 'none';
                if (data.html) {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = data.html;
                    const newItems = tempDiv.querySelectorAll('.pin-item');
                    newItems.forEach(item => pinsContainer.appendChild(item));
                    imagesLoaded(newItems, function() {
                        msnry.appended(newItems);
                        msnry.layout();
                    });
                    page++;
                }
                isLoading = false;
                if (!data.has_next) {
                    window.removeEventListener('scroll', debouncedHandleScroll);
                }
            })
            .catch(error => {
                console.error('Error loading pins:', error);
                if (loading) loading.style.display = 'none';
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

    // Debounced resize handler
    const handleResize = () => {
        if (msnry) {
            msnry.options.columnWidth = window.innerWidth <= 767 ? 130 : 233;
            msnry.options.gutter = 12;
            msnry.layout();
        }
    };

    const debouncedHandleResize = debounce(handleResize, 50); // Faster for smooth resizing
    window.addEventListener('resize', debouncedHandleResize);

    const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
            loadMorePins();
        }
    };

    const debouncedHandleScroll = debounce(handleScroll, 200);
    window.addEventListener('scroll', debouncedHandleScroll);
})();
