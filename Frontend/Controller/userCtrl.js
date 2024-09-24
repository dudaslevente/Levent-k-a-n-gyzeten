function login(){
    let user = {
        email: document.querySelector('#email').value,
        passwd: document.querySelector('#passwd').value
    }

    axios.post(`${serverUrl}/login`, user).then(res => {

        if (res.status != 202){
            alert(res.data);
            return;
        }

        loggedUser = res.data;
        localStorage.setItem('pekseg', JSON.stringify(loggedUser));
        renderNavItems();
        render('recipes')
    });
}

function registration(){
    let newUser = {
        name: document.querySelector('#name').value,
        email: document.querySelector('#email').value,
        phone: document.querySelector('#phone').value,
        passwd: document.querySelector('#passwd').value,
        confirm: document.querySelector('#confirm').value,
    }

    axios.post(`${serverUrl}/reg`, newUser).then(res => {
        alert(res.data);
        render('login');
    });
}

function logout(){
    localStorage.removeItem('pekseg');
    loggedUser = null;
    renderNavItems();
    render('login');
}

function getMe(){
    axios.get(`${serverUrl}/me/${loggedUser[0].ID}`).then(res => {
        document.querySelector('#name').value = res.data[0].name;
        document.querySelector('#email').value = res.data[0].email;
        document.querySelector('#phone').value = res.data[0].phone;
        document.querySelector('#role').value = res.data[0].role;
    });
}

function updateProfile(){
    let data = {
        name: document.querySelector('#name').value,
        email: document.querySelector('#email').value,
        phone: document.querySelector('#phone').value,
        role: document.querySelector('#role').value
    }

    axios.patch(`${serverUrl}/users/${loggedUser[0].ID}`, data).then(res => {
        alert(res.data);
    });
}