document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab-header .tab');
    const contents = document.querySelectorAll('.tab-content .content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');

            // Hide all tab contents
            contents.forEach(content => content.classList.remove('active'));
            // Show the content corresponding to the clicked tab
            const tabNumber = tab.getAttribute('data-tab');
            document.getElementById(`tab-${tabNumber}`).classList.add('active');
        });
    });
});
