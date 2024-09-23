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

