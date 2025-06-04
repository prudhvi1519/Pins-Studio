let page = 1;
let isLoading = false;
const pinsContainer = document.getElementById('pins-container');
const loading = document.getElementById('loading');
const query = new URLSearchParams(window.location.search).get('q') || '';

function loadMorePins() {
    if (isLoading) return;
    isLoading = true;
    loading.style.display = 'block';

    fetch(`/load-more-pins/?page=${page + 1}&q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            loading.style.display = 'none';
            if (data.html) {
                pinsContainer.insertAdjacentHTML('beforeend', data.html);
                page++;
            }
            isLoading = false;
            if (!data.has_next) {
                window.removeEventListener('scroll', debouncedHandleScroll);
            }
        })
        .catch(error => {
            console.error('Error loading pins:', error);
            loading.style.display = 'none';
            isLoading = false;
        });
}

// Debounce function to limit scroll event frequency
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
