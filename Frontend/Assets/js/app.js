const AppTitle = "Fifty shades of chicken";
const Author = "13.a SZOFT";
const Company = "Bajai SZC Türr István Technikum";

const serverUrl = 'http://localhost:3000';
let loggedUser = { role: null }; // vagy "user" vagy "admin"

let footer = document.querySelector('footer');

footer.innerHTML = Company + ' | ' + Author + ' | 2024.';

async function render(view){
    let main = document.querySelector('main');
    main.innerHTML = await (await fetch(`Views/${view}.html`)).text();

    switch(view){
        case 'profile': {
            getMe();
            break;
        }
        case 'users': {
            getUsers();
            break;
        }
        case 'recipes': {
            fetchRecipes()
            break;
        }
        case 'description': {
           // fetchRecipes1(buttonValue);
           // createRecipeDetail();
            
            break;
        }
        /*
        case 'statistics': {
            getStatistics();
            break;
        }
        */
    }
}

if (localStorage.getItem('pekseg')){
    loggedUser = JSON.parse(localStorage.getItem('pekseg'));
    render('recipes');
}else{
    render('recipes');
}

function renderNavItems() {

    let lgdOutNavItems = document.querySelectorAll('.lgdOut');
    let lgdInNavItems = document.querySelectorAll('.lgdIn');
    let admNavItems = document.querySelectorAll('.lgdAdm');

    if (!loggedUser ) {
        lgdOutNavItems.forEach(item => {
            item.classList.remove('d-none');
        });
        admNavItems.forEach(item => {
            item.classList.add('d-none');
        });
        lgdInNavItems.forEach(item => {
            item.classList.add('d-none');
        });
    }

    if (loggedUser && loggedUser[0].role === 'admin') {
        admNavItems.forEach(item => {
            item.classList.remove('d-none');
        });

        lgdInNavItems.forEach(item => {
            item.classList.remove('d-none');
        });

        lgdOutNavItems.forEach(item => {
            item.classList.add('d-none');
        });
    }

    if (loggedUser && loggedUser[0].role == 'user') {
        admNavItems.forEach(item => {
            item.classList.add('d-none');
        });

        lgdInNavItems.forEach(item => {
            item.classList.remove('d-none');
        });

        lgdOutNavItems.forEach(item => {
            item.classList.add('d-none');
        });
    }
}

function authorize(){
    let res = {
         headers: { "Authorization": loggedUser[0].ID  }
    }
    return res;
}

renderNavItems();