function getTitle(recepies) {
    
        let cim = document.getElementById('#cim');
        recepies.forEach(recept => {
            let h1 =document.createElement('h1');
            h1.innerHTML = recept.title;
            cim.appendChild(h1);
        });
        
        
}/*
 
function getRecipes() {
    let tartalom = document.querySelector('.tartalom');
 
    axios.get(`${serverUrl}/recipes`).then(res => {
        console.log(res.data);
 
        for (let i = 0; i < res.data.length; i++) {
            let recipeCard = document.createElement('div');
            recipeCard.id = `card${i}`;
            recipeCard.classList.add(
               
                'flex',
                'flex-row',
                'justify-center',
                'items-stretch',
                'h-full',
                'w-3/4',
                'bg-stone-400',
                'rounded-[15px]',
                'drop-shadow-lg',
                'overflow-hidden',
                'recipe'
            );
 
            const Content = document.createElement('div');
            Content.classList.add(
                'w-1/2',
                'flex',
                'flex-col',
                'justify-start',
                'items-center',
                'h-full',
                'text-xl',
                'text-stone-700',
                'cimClass'
               
            );
 
            const Title = document.createElement('h3');
            Title.id = `title${i}`;
            Title.innerHTML = res.data[i].title;
            Title.classList.add(
                'bg-stone-500',
                'w-full',
                'rounded-tr-[15px]',
                'text-center',
                'p-5',
                'text-stone-100',
                'text-2xl',
                'cimClass'
            );
 
            const desc = document.createElement('p');
            desc.id = `desc${i}`;
            desc.innerHTML = res.data[i].description;
            desc.classList.add('text-stone-600', 'text-justified', "w-full");
 
            const time = document.createElement('p');
            time.id = `time${i}`;
            time.innerHTML ="Idő: " + res.data[i].time + " perc";
 
            const additions = document.createElement('ul');
            additions.id = `additions${i}`;
 
            const additionsArray = res.data[i].additions.split(',');
 
            additionsArray.forEach(addition => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `- ${addition.trim()}`;
                additions.appendChild(listItem);
            });
 
            const calory = document.createElement('p');
            calory.id = `calory${i}`;
            calory.innerHTML = res.data[i].calory + " Kcal";
 
            const kep = document.createElement('div');
            kep.classList.add('kep', 'relative', 'w-1/2', 'h-full', 'rounded-l-[15px]','self-center');
 
            const descContainer = document.createElement('div');
            descContainer.classList.add(
                'flex',
                'flex-col',
                'justify-evenly',
                'content-center',
                'items-center',
                'w-full',
                'h-auto',
                'px-5',
                'text-xl',
                'text-stone-700',
                'py-5',
                'gap-5'
            );
 
            let hozzavalok = document.createElement('h3');
            hozzavalok.innerHTML = 'Hozzávalók:'
            let leiras = document.createElement('h3');
            leiras.innerHTML = 'Leírás:'
            descContainer.appendChild(hozzavalok)
            descContainer.appendChild(additions);
            descContainer.appendChild(leiras)
            descContainer.appendChild(desc);
            descContainer.appendChild(time);
            descContainer.appendChild(calory);
 
            Content.appendChild(Title);
            Content.appendChild(descContainer);
 
            recipeCard.appendChild(kep);
            recipeCard.appendChild(Content);
 
            tartalom.appendChild(recipeCard);
        }
    });
}*/