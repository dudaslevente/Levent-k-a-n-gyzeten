const AppTitle = "Fifty shades of chicken";
const Author = "13.a SZOFT";
const Company = "Bajai SZC Türr István Technikum";

const serverUrl = 'http://localhost:3000';
let loggedUser = null;

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

function renderNavItems(){
    let lgdOutNavItems = document.querySelectorAll('.lgdOut');
    let lgdInNavItems = document.querySelectorAll('.lgdIn');
    let admNavItems = document.querySelectorAll('.lgdAdm');

    if (loggedUser.role == null){
        lgdInNavItems.forEach(item =>{
            item.classList.add('d-none');
        });
        lgdOutNavItems.forEach(item => {
            item.classList.remove('d-none');
        });
        admNavItems.forEach(item => {
            item.classList.add('d-none');
        });
        return;
    }

    if (loggedUser.role == 'admin'){
        admNavItems.forEach(item => {
            item.classList.remove('d-none');
        });
    }

    if (loggedUser.role == 'user'){
        lgdInNavItems.forEach(item => {
            item.classList.remove('d-none');
        });
    
        lgdOutNavItems.forEach(item => {
            item.classList.add('d-none');
        });
    }
}
renderNavItems();