


function createRecipeDetail(recipes,buttonValue) {
   
    recipes.forEach(recipe => {

        const cim = document.querySelector('.cim');
        const kepR = document.querySelector('.kepR');
        const hozzavalo = document.querySelector('.hozzavalo');
        const ido = document.querySelector('.ido');
        const kaloria = document.querySelector('.kaloria');
        const SZleiras = document.querySelector('.SZleiras');
    

        console.log(buttonValue);
        if(buttonValue == recipe.ID){
            console.log('egesz jo ');
            const h1 = document.createElement('h1');
            h1.innerText=recipe.title;
            cim.appendChild(h1);

            const img = document.createElement('img');
            img.className = 'rounded float-start ';
            img.src = '/Frontend/Assets/kepek/kaja.jpg';
            img.alt = recipe.title;
            kepR.appendChild(img);

            const itemsArray = recipe.additions.split(',');
            itemsArray.forEach(item => {
                const liH = document.createElement('li');
                liH.className ="list-group-item ";
                liH.innerText = item.trim(); // trim() eltávolítja a felesleges szóközöket
                hozzavalo.appendChild(liH);
            });
            console.log('egesz jo 1');
            const liI = document.createElement('li');
            liI.innerText = `Idő: ${recipe.time} perc`;
            liH.className ="list-group-item ";
            ido.appendChild(liI);

            const liK = document.createElement('li');
            liK.innerText = `${recipe.calory} cal`;
            liH.className ="list-group-item ";
            kaloria.appendChild(liK);

            const Leiras = recipe.descripton.split('.');
            Leiras.forEach(item => {
                const p = document.createElement('p');
                p.className =" ";
                p.innerText = item.trim(); // trim() eltávolítja a felesleges szóközöket
                SZleiras.appendChild(p);
            });
            console.log('egesz jo 2');

        }
        

    });

   
    


   // timeList.innerHTML = `<li class="list-group-item"><h4 class="">Elkészítési idő:</h4></li>`;
    

   // calorieList.innerHTML = `<li class="list-group-item"><h4 class="">Kalória:</h4></li>`;
    

}

// function fetchRecipes1() {
//     axios.get(`${serverUrl}/recipes/${buttonValue}`)
//         .then(res => {
//             console.log(res.data);
//             createRecipeCards(res.data);
//         })
//         .catch(error => {
//             console.error("Error fetching recipes:", error);
//         });
// }


// Call the function to create the recipe detail
