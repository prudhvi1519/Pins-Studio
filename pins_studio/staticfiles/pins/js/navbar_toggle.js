(function () {
    const toggler = document.querySelector('.navbar-toggler');
    const collapse = document.querySelector('.navbar-collapse');

    toggler.addEventListener('click', function () {
        collapse.classList.toggle('show');
    });
})();
