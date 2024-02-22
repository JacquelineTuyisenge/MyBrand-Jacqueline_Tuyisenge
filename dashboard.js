document.addEventListener("DOMContentLoaded", function() {
    // Initial content loading (e.g., Dashboard)
    loadContent("dashboard.html");

    // Attach click event listeners to navigation links
    document.querySelectorAll('.sidebar a, .sidebar img').forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const pageUrl = link.getAttribute('href');
            loadContent(pageUrl);
        });
    });
});

function loadContent(url) {
    const mainContent = document.getElementById('main-content');

    // Fetch the content of the clicked link
    fetch(url)
        .then(response => response.text())
        .then(html => {
            // Update the content area with the fetched HTML
            mainContent.innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading content:', error);
        });
}
