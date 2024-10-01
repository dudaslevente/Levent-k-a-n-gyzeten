let recipes = [];

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
    axios.get(`${serverUrl}/me/${loggedUser[0].ID}`, authorize()).then(res => {
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

    axios.patch(`${serverUrl}/users/${loggedUser[0].ID}`, data, authorize()).then(res => {
        alert(res.data);
    });
}

function getUsers(){
    axios.get(`${serverUrl}/users`, authorize()).then(res => {
        renderUsers(res.data);
    });
}

function deleteUser(id){
    if (confirm('Are you sure to delete this user?')){
        axios.delete(`${serverUrl}/users/${id}`, authorize()).then(res => {
            alert(res.data);
            if (res.status == 200){
                getUsers();
            }
        })
    }
}

function updateUser(id){
    let data = {
        name: document.querySelector('#name').value,
        email: document.querySelector('#email').value,
        phone: document.querySelector('#phone').value,
        role: document.querySelector('#role').value
    }
    axios.patch(`${serverUrl}/users/${id}`, data, authorize()).then(res => {
        alert(res.data);
        if (res.status == 200){
            render('users');
        }
    });
}

function editUser(id){
    render('edituser').then(()=>{
        axios.get(`${serverUrl}/users/${id}`, authorize()).then(res => {
            document.querySelector('#name').value = res.data[0].name;
            document.querySelector('#email').value = res.data[0].email;
            document.querySelector('#phone').value = res.data[0].phone;
            document.querySelector('#role').value = res.data[0].role;
            document.querySelector('#updBtn').onclick = function() {updateUser(id)};
        });
    });
}

function renderUsers(users){
    let tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    users.forEach(user => {
        let tr = document.createElement('tr');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');
        let td4 = document.createElement('td');
        let td5 = document.createElement('td');
        let td6 = document.createElement('td');
        
        td1.innerHTML = '#';
        td2.innerHTML = user.name;
        td3.innerHTML = user.email;
        td4.innerHTML = user.phone;
        td5.innerHTML = user.role;
        
        
        if (user.ID != loggedUser[0].ID){
            let btn1 = document.createElement('button');
            let btn2 = document.createElement('button');
            btn1.innerHTML = 'Edit';
            btn1.classList.add('btn','btn-warning', 'btn-sm', 'me-2');
            btn2.innerHTML = 'Delete';
            btn2.classList.add('btn','btn-danger', 'btn-sm');
            td6.classList.add('text-end');
            btn1.onclick = function() {editUser(user.ID)};
            btn2.onclick = function() {deleteUser(user.ID)};
            td6.appendChild(btn1);
            td6.appendChild(btn2);   
        }

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);

        tbody.appendChild(tr);
    });

    let total = document.querySelector('strong');
    total.innerHTML = users.length;
}

function getUserStats(){
    axios.get(`${serverUrl}/statistics/${loggedUser[0].ID}`).then(res => {
        recipes = res.data;
    });

    let totalValue = 0;
    let mostCalory = 0;
    let leastCalory = 0;


    recipes.forEach(item => {
        totalValue += item.count;
        if (item.count > mostCalory){
            mostCalory = item.count;
        }
        if (item.count < leastCalory){
            leastCalory = item.count;
        }
    });

    document.querySelector('#total').innerHTML = totalValue;
    document.querySelector('#most').innerHTML = mostCalory;
    document.querySelector('#least').innerHTML = leastCalory;
}

function getAdminStats(){
    let alldata = [];
    axios.get(`${serverUrl}/statistics`).then(res => {
        alldata = res.data;
        alldata.sort((a, b) => a.userID.localeCompare(b.userID)); 

        let totalValue = 0;
        let userCount = 0;

        let userTotal = 0;
        let userDataCount = 0;
        let maxValue = 0;
        let userID = alldata[0].userID;

        alldata.forEach(item => {

            if (userID != item.userID){
                console.log(userTotal)
                userID = item.userID;
                userTotal = 0;
                userDataCount = 0;
                userCount++;
            }

            totalValue += item.count;

            userTotal += item.count;
            userDataCount++;

            if (item.count > maxValue){
                maxValue = item.count;
            }
            if (item.count < minValue){
                minValue = item.count;
            }
            
        });

        document.querySelector('#adm_total').innerHTML = totalValue;
        document.querySelector('#adm_max').innerHTML = maxValue;
    });
}