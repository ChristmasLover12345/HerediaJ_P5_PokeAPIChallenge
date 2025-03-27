import { getFav, saveFav, removeFav } from "./localStorage.js"

let pmImg = document.getElementById("pmImg")
let pmName = document.getElementById("pmName")
let pmElement = document.getElementById("pmElement")
let pmLocation = document.getElementById("pmLocation")
let pmMoves = document.getElementById("pmMoves")
let pmAbilities = document.getElementById("pmAbilities")
let pmEvolutions = document.getElementById("pmEvolutions")
let favorites = document.getElementById("favorites")
let dropdown = document.getElementById("dropdown")

let addFavBtn = document.getElementById("addFavBtn")
let shinyBtn = document.getElementById("shinyBtn")
let favDropBtn = document.getElementById("favDropBtn")
let randomBtn = document.getElementById("randomBtn")
let searchBar = document.getElementById("searchBar")

let isShiny = false;
let shinyUrl = ""
let normalUrl = ""
let currentPokemon = ""

const rng = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)

  return Math.floor(Math.random() * (max - min + 1)) + min
}

// fav dropdown
favDropBtn.addEventListener('click', () => {
    dropdown.classList.toggle("hidden")
})

// Fetches
async function pokemonFetch(userSearch)
{
    let promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${userSearch}`);
    let data = await promise.json();
    
    return data;
}

// Generate favorites
function makeFavs()
{
    // Clear up any previous favs
    favorites.innerHTML = ""
    // self explanatory
    let favsArr = getFav()
    
    // iterate tr
    for (let pokemon of favsArr)
    {

        let favContainer = document.createElement('div')
        let favoriteName = document.createElement('p')
        let removeFavBtn = document.createElement('p')

        favoriteName.innerText = pokemon
        removeFavBtn.innerText = "X"

        removeFavBtn.classList.add("border-s-2", "text-[#FF1E1E]", "h-full", "m-0", "text-[40px]", "px-[5px]", "self-center")
        favoriteName.classList.add("text-black", "text-[40px]", "m-0", "truncate", "h-full", "self-center", "w-full")

        removeFavBtn.addEventListener('click', () => {
            removeFav(pokemon);
            makeFavs()
        })

        favoriteName.addEventListener('click', () => {
            getInfo(pokemon)
        })

        favorites.appendChild(favContainer)
        favContainer.appendChild(favoriteName)
        favContainer.appendChild(removeFavBtn)


    }

}

// Logic
async function getInfo(userMon)
{
    let pokeInfo = await pokemonFetch(userMon)
    // checking if gen is 1 - 5
    if (pokeInfo.id > 649)
    {
    pmName.innerText = "gen 1 - 5 only"
    pmLocation.innerText = "gen 1 - 5 only"
    pmElement.innerText = "gen 1 - 5 only"
    pmImg.src = "./Assets/king-von-rapper.gif"
    pmAbilities.innerHTML = ""
    pmMoves.innerHTML = ""
    return
    }
    else
    {
        // Saving the current pokemon in case it's added to favorites
        currentPokemon = pokeInfo.name;
    }

    // Basic info
    normalUrl = pokeInfo.sprites.front_default
    shinyUrl = pokeInfo.sprites.front_shiny
    pmImg.src = pokeInfo.sprites.front_default
    pmName.innerText = pokeInfo.name

    // Fetch location
    let locationData = await fetch(pokeInfo.location_area_encounters)
    let locations = await locationData.json()
    // check if there is a location, if yes display it
    if (locations == null || locations == "")
    { pmLocation.innerText = "N/A"}
    else
    {pmLocation.innerText = locations[rng(0, (locations.length - 1))].location_area.name}

    // display the elements
    
    let typeArr = [];
    for (let i = 0; i < pokeInfo.types.length; i++)
    {
        typeArr.push(pokeInfo.types[i].type.name)
    }

    pmElement.innerText = typeArr.join(", ")




    // Evolution chain
    let speciesData = await fetch(pokeInfo.species.url)
    let speciesChain = await speciesData.json()
    let evoData = await fetch(speciesChain.evolution_chain.url)
    pmEvolutions.innerHTML = ""

    // Checks that evo data exists
    if(!evoData.ok)
    {
        
        const personItem = document.createElement('P');
        personItem.innerText = "N/A"
        pmEvolutions.appendChild(personItem)
    }
    else
    {
        let evoChain = await evoData.json()
        let evolutions = evoChain.chain

        // checks if there's evolutions
        if (!evolutions.evolves_to.length)
        {
            const personItem = document.createElement('P');
            personItem.innerText = "N/A"
            pmEvolutions.appendChild(personItem)
        }
        else
        {
            // sets the first pokemon in the three
            const baseForm = document.createElement('p');
            baseForm.innerText = evolutions.species.name;
            baseForm.classList.add("text-[20px]", "md:text-[25px]", "lg:text-[30px]")
            baseForm.addEventListener('click', () => {
                getInfo(evolutions.species.name)
            });
            pmEvolutions.appendChild(baseForm);

            // used for each loops since I only need the name inside, not modify it
            // iterates trough the nested evolves_to thats inside the the first pokemon
            for (let firstEvo of evolutions.evolves_to)
                {
                    const firstEvoItem = document.createElement('p');
                    firstEvoItem.innerText = firstEvo.species.name;
                    firstEvoItem.classList.add("text-[20px]", "md:text-[25px]", "lg:text-[30px]")
                    firstEvoItem.addEventListener('click', () => {
                        getInfo(firstEvo.species.name)
                    });
                    pmEvolutions.appendChild(firstEvoItem);

                    // iterates trough the nested evolves_to thats inside the evolved pokemon
                    for (let secondEvo of firstEvo.evolves_to)
                    {
                        const secondEvoItem = document.createElement('p');
                        secondEvoItem.innerText = secondEvo.species.name;
                        secondEvoItem.classList.add("text-[20px]", "md:text-[25px]", "lg:text-[30px]")
                        secondEvoItem.addEventListener('click', () => {
                            getInfo(secondEvo.species.name)
                        });
                        pmEvolutions.appendChild(secondEvoItem);
                    }
                }
                

        }
    }

    pmMoves.innerHTML = "";
    pmAbilities.innerHTML = "";

    //  Move fetch
    for (let pokemonMoves of pokeInfo.moves)
    {
        const moveItem = document.createElement('p');
        moveItem.innerText = pokemonMoves.move.name;
        pmMoves.appendChild(moveItem)
    }
    console.log(pokeInfo.moves)
    console.log(pokeInfo.abilities)

    // Abilitie fetch
    for (let pokemonAbilities of pokeInfo.abilities)
        {
            const moveItem = document.createElement('p');
            moveItem.innerText = pokemonAbilities.ability.name;
            pmAbilities.appendChild(moveItem)
        }

}

// search bar
searchBar.addEventListener("keydown", (event) => {
    if (event.key ==="Enter")
    {   
        isShiny = false
        getInfo(searchBar.value)
        shinyBtn.innerText = "Shiny"
    }
})

// random
randomBtn.addEventListener('click', () => {

    getInfo(rng(0, 649))
    isShiny = false
    shinyBtn.innerText = "Shiny"
    

})

// shiny toggle
shinyBtn.addEventListener('click', () => {
    
    if (!isShiny)
    {
        isShiny = true
        shinyBtn.innerText = "Normal"
        pmImg.src = shinyUrl
    }
    else if (isShiny)
    {
        isShiny = false
        shinyBtn.innerText = "Shiny"
        pmImg.src = normalUrl
    }

})

// add to fav button
addFavBtn.addEventListener('click', () => {

saveFav(currentPokemon);
makeFavs()

});

getInfo(rng(0, 649))
isShiny = false
shinyBtn.innerText = "Shiny"


makeFavs()