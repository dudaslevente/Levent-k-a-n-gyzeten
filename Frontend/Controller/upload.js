function uploadfood() {
    let newRecipe = {
        title: document.querySelector('#title').value,
        description: document.querySelector('#description').value,
        time: document.querySelector('#time').value,
        calory: document.querySelector('#calory').value,
        categories: document.querySelector('#categories').value,
        additions: document.querySelector('#additions').value,
    };

    // Küldés az API-ra
    axios.post(`${serverUrl}/description`, newRecipe)
        .then(res => {
            alert(res.data);
            render('recipes');
        })
        .catch(err => {
            alert('Hiba történt a feltöltés során!');
            console.error(err);
        });
}
