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
    render('login');
}