(function () {
    let page = 1;
    let isLoading = false;
    const pinsContainer = document.getElementById('pins-container');
    const loading = document.getElementById('loading');
    const preloader = document.getElementById('preloader');
    const query = new URLSearchParams(window.location.search).get('q') || '';

    // Custom Masonry layout function
    function applyMasonry() {
        const pins = Array.from(pinsContainer.children);
        const columnCount = window.innerWidth <= 767 ? 2 : 5; // 2 columns for mobile, 5 for desktop
        const columnHeights = Array(columnCount).fill(0);
        const columnItems = Array(columnCount).fill().map(() => []);

        // Reset grid positions
        pins.forEach(pin => {
            pin.style.gridRow = 'auto';
            pin.style.gridColumn = 'auto';
        });

        // Distribute pins to shortest column
        pins.forEach(pin => {
            const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
            columnItems[shortestColumn].push(pin);
            columnHeights[shortestColumn] += pin.offsetHeight + 10; // Include gap
            pin.style.gridColumn = shortestColumn + 1; // 1-based index for CSS Grid
        });

        // Set container height to tallest column
        pinsContainer.style.minHeight = `${Math.max(...columnHeights)}px`;
    }

    function loadMorePins() {
        if (isLoading) return;
        isLoading = true;
        if (loading) {
            loading.style.display = 'block';
            loading.style.clear = 'both';
        }
        if (preloader) preloader.style.display = 'block';

        console.log(`Loading more pins: page=${page + 1}, query=${query}`);

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
                    applyMasonry(); // Reapply Masonry layout after adding new pins
                    console.log(`Loaded ${data.html.length} bytes of new pins`);
                }
                isLoading = false;
                if (!data.has_next) {
                    window.removeEventListener('scroll', debouncedHandleScroll);
                    console.log('No more pins to load');
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

    // Apply Masonry on initial load and window resize
    window.addEventListener('load', applyMasonry);
    window.addEventListener('resize', debounce(applyMasonry, 200));
    const debouncedHandleScroll = debounce(handleScroll, 200);
    window.addEventListener('scroll', debouncedHandleScroll);
})();
