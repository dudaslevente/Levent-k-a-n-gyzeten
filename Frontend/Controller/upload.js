function uploadfood() {
    let newRecipe = {
        title: document.querySelector('#title').value,
        description: document.querySelector('#description').value,
        time: document.querySelector('#time').value,
        calory: document.querySelector('#calory').value,
        catID: document.querySelector('#catID').value,
        additions: document.querySelector('#additions').value,
    };

    axios.post(`${serverUrl}/upload/${loggedUser[0].ID}`, newRecipe).then(res => {
            alert(res.data);
            render('recipes');
        }).catch(err => {
            alert('Hiba történt a feltöltés során!');
            console.error(err);
        });
}