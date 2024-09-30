function createRecipeCards(recipes) {
    const cardContainer = document.querySelector('.card-container');

    if (!cardContainer) {
        console.error("A .card-container elem nem található!"); // Hibaüzenet a konzolon
        return;
    }

    // Clear the container before appending new cards
    cardContainer.innerHTML = '';

    // Define image map for categories
    const imageMap = {
        '1': '/Frontend/Assets/kepek/eloetel.jpg', // Előétel
        '2': '/Frontend/Assets/kepek/foetel.jpg', // Főétel
        '3': '/Frontend/Assets/kepek/desszert.jpg' // Desszert
    };

    // Loop through each recipe and create cards
    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'card mb-3'; // Bootstrap osztályok
        card.style.width = '300px';
        card.style.margin = '10px';

        // Create the image element
        const img = document.createElement('img');
        img.className = 'card-img-top';
        img.src = imageMap[recipe.catID] || '/Frontend/Assets/kepek/food.jpg'; // Default image
        img.alt = recipe.title;

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        // Create title and time elements
        const title = document.createElement('h5');
        title.className = 'card-title';
        title.innerText = recipe.title;

        const time = document.createElement('p');
        time.innerText = `IDŐ: ${recipe.time}`;

        // Create detail button
        const button = document.createElement('a');
        button.href = '#';
        button.className = 'btn btn-primary';
        button.innerText = 'Részletes Leírás';
        button.onclick = function () {
            render(recipe.title); // Pass the title to render function
        };

        // Append all elements to the card body
        cardBody.appendChild(title);
        cardBody.appendChild(time);
        cardBody.appendChild(button);

        // Append image and card body to the card
        card.appendChild(img);
        card.appendChild(cardBody);

        // Append the card to the container
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

// Call the fetchRecipes function to fetch and display the recipes
fetchRecipes();
