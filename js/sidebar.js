// Переключение сайдбара на ПК (сворачивание со стрелочкой)
function toggleDesktopSidebar() {
    const sidebar = document.getElementById('sidebar');
    const body = document.body;

    sidebar.classList.toggle('collapsed');
    body.classList.toggle('sidebar-collapsed');

    // Сохранение состояния в локальном хранилище браузера
    const isCollapsed = sidebar.classList.contains('collapsed');
    localStorage.setItem('sidebar-collapsed', isCollapsed);
}

// Переключение сайдбара на телефонах
function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('mobile-open');
}

// Восстановление сохранённого состояния при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    if (isCollapsed && window.innerWidth > 768) {
        document.getElementById('sidebar').classList.add('collapsed');
        document.body.classList.add('sidebar-collapsed');
    }
});
