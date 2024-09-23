const AppTitle = "Fifty shades of chicken";
const Author = "13.a SZOFT";
const Company = "Bajai SZC Türr István Technikum";

const serverUrl = 'http://localhost:3000';
let loggedUser = { role: null }; // vagy "user" vagy "admin"

//let title = document.querySelector('title');
//let header = document.querySelector('header');
let footer = document.querySelector('footer');

//title.innerHTML = AppTitle;
//header.innerHTML = title.innerHTML;
footer.innerHTML = Company + ' | ' + Author + ' | 2024.';

async function render(view){
    let main = document.querySelector('main');
    main.innerHTML = await (await fetch(`Views/${view}.html`)).text();
}

if (localStorage.getItem('pekseg')){
    loggedUser = JSON.parse(localStorage.getItem('pekseg'));
    render('recipes');
}else{
    render('recipes');
}

function renderNavItems() {
    
    let lgdOutNavItems = document.querySelectorAll('.lgdOut');  // Login és Sign Up gombok
    let lgdInNavItems = document.querySelectorAll('.lgdIn');    // Bejelentkezett felhasználói gombok (Profile, Upload, Logout stb.)
    let admNavItems = document.querySelectorAll('.lgdAdm');     // Adminisztrátori gombok (Users, Statistics)
    
    // Ha nincs bejelentkezve a felhasználó
    if (!loggedUser || loggedUser.role == null) {
        // Elrejtem a bejelentkezett felhasználóknak szánt gombokat
        lgdInNavItems.forEach(item => {
            item.classList.add('d-none');
        });

        // Megjelenítem a 'Login' és 'Sign up' gombokat
        lgdOutNavItems.forEach(item => {
            item.classList.remove('d-none');
        });

        // Admin gombok elrejtése
        admNavItems.forEach(item => {
            item.classList.add('d-none');
        });
    }

    // Ha admin felhasználó van bejelentkezve
    if (loggedUser && loggedUser.role === 'admin') {
        // Megjelenítem az adminisztrátori gombokat
        admNavItems.forEach(item => {
            item.classList.remove('d-none');
        });

        // Bejelentkezett felhasználók gombjainak megjelenítése
        lgdInNavItems.forEach(item => {
            item.classList.remove('d-none');
        });

        // Elrejtem a 'Login' és 'Sign up' gombokat
        lgdOutNavItems.forEach(item => {
            item.classList.add('d-none');
        });
    }

    // Ha egy sima felhasználó (user) van bejelentkezve
    if (loggedUser && loggedUser.role === 'user') {
        // Elrejtem az adminisztrátori gombokat
        admNavItems.forEach(item => {
            item.classList.add('d-none');
        });

        // Megjelenítem a bejelentkezett felhasználók gombjait
        lgdInNavItems.forEach(item => {
            item.classList.remove('d-none');
        });

        // Elrejtem a 'Login' és 'Sign up' gombokat
        lgdOutNavItems.forEach(item => {
            item.classList.add('d-none');
        });
    }
}

// Hívjuk meg a renderNavItems() függvényt, hogy frissítse a gombokat a felhasználó státuszának megfelelően
renderNavItems();
