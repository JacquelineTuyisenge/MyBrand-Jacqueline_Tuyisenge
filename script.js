// Add a class to the header when the user scrolls down, and remove it when they scroll to the top
window.onscroll = function() {
    const header = document.querySelector('header');
    const scrollPosition = window.scrollY;

    if (scrollPosition > 50) { // Adjust the scroll position value based on your needs
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }
};
