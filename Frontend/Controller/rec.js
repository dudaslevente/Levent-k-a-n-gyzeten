let buttonValue;
function createRecipeCards(recipes) {
    const cardContainer = document.querySelector('.card-container');
    if (!cardContainer) {
        console.error("A .card-container elem nem található!");
        return;
    }

    cardContainer.innerHTML = '';

    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'card'; // Bootstrap osztályok
        card.style.width = '300px';
        card.style.margin = '10px';
        card.style.padding = '0'; // Eltávolítja a paddingot

        const img = document.createElement('img');
        img.className = 'card-img-mid';
        img.src = '/Frontend/Assets/kepek/kaja.jpg';
        img.alt = recipe.title;

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const title = document.createElement('h5');
        title.className = 'card-title';
        title.innerText = recipe.title;

        const time = document.createElement('p');
        time.innerText = `Idő: ${recipe.time} perc`;

        const button = document.createElement('a');
        button.href = '#';
        button.className = 'btn btn-primary';
        button.value = recipe.ID; 
        button.innerText = 'Részletes Leírás';

        button.onclick = function() {
            buttonValue = button.value; // Átadjuk a button.value értékét a buttonValue változónak
            console.log("A gomb értéke:", buttonValue); // Ellenőrzés, hogy helyesen működik-e
            //render('description'); // Átadjuk a render függvénynek
            createRecipeDetail(recipes,buttonValue);
        };


        cardBody.appendChild(title);
        cardBody.appendChild(time);
        cardBody.appendChild(button);

        card.appendChild(img);
        card.appendChild(cardBody);

        cardContainer.appendChild(card);
    });
}

function fetchRecipes() {
    axios.get(`${serverUrl}/recipes`)
        .then(res => {
            console.log(res.data);
            createRecipeCards(res.data);
        })
        .catch(error => {
            console.error("Error fetching recipes:", error);
        });
}




