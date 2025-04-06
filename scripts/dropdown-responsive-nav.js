document.getElementById('menu-toggle').addEventListener('click', toggleMenu);

function toggleMenu() {
    const navMenu = document.querySelector("nav ul");
    
    navMenu.classList.toggle('active');
}