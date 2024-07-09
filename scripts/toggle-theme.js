document.documentElement.classList.toggle('dark-mode', localStorage.getItem('theme') === 'dark');
document.addEventListener('DOMContentLoaded', loadTheme);

function loadTheme() {
    const image = document.getElementById('theme-toggle');
    if (localStorage.getItem('theme') === 'dark') {
        image.src = "resources/assets/global/light-mode.svg";
        document.body.classList.add('dark-mode');
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const image = document.getElementById('theme-toggle');
    if (document.body.classList.contains('dark-mode')) {
        image.src = "resources/assets/global/light-mode.svg";
        localStorage.setItem('theme', 'dark');
    } else {
        image.src = "resources/assets/global/dark-mode.svg";
        localStorage.setItem('theme', 'light');
    }
}
