
let pmImg = document.getElementById("pmImg")
let pmName = document.getElementById("pmName")
let pmElement = document.getElementById("pmElement")
let pmLocation = document.getElementById("pmLocation")
let pmMoves = document.getElementById("pmMoves")
let pmAbilities = document.getElementById("pmAbilities")
let pmEvolutions = document.getElementById("pmEvolutions")

let addFavBtn = document.getElementById("addFavBtn")
let shinyBtn = document.getElementById("shinyBtn")
let favBtn = document.getElementById("favBtn")
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



// Fetches
async function pokemonFetch(userSearch)
{
    let promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${userSearch}`);
    let data = await promise.json();
    console.log(data)
    return data;
}



// Logic
async function getInfo(userMon)
{
    let pokeInfo = await pokemonFetch(userMon)
    // checking if gen is 1 - 5
    if (pokeInfo.id > 649)
    {
    alert("Only gen 1 - 5")
    return
    }
    else
    {
        // Saving the current pokemon in case it's added to favorites
        currentPokemon = userMon;
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
            baseForm.addEventListener('click', () => {
                getInfo(evolutions.species.name)
            });
            pmEvolutions.appendChild(baseForm);

            console.log(evolutions)
            // used for each loops since I only need the name inside, not modify it
            // iterates trough the nested evolves_to thats inside the the first pokemon
            for (let firstEvo of evolutions.evolves_to)
                {
                    const firstEvoItem = document.createElement('p');
                    firstEvoItem.innerText = firstEvo.species.name;
                    firstEvoItem.addEventListener('click', () => {
                        getInfo(firstEvo.species.name)
                    });
                    pmEvolutions.appendChild(firstEvoItem);

                    // iterates trough the nested evolves_to thats inside the the evolved pokemon
                    for (let secondEvo of firstEvo.evolves_to)
                    {
                        const secondEvoItem = document.createElement('p');
                        secondEvoItem.innerText = secondEvo.species.name;
                        secondEvoItem.addEventListener('click', () => {
                            getInfo(secondEvo.species.name)
                        });
                        pmEvolutions.appendChild(secondEvoItem);
                    }
                }
                

        }
    }

}

// Event listeners
searchBar.addEventListener("keydown", (event) => {
    if (event.key ==="Enter")
    {   
        isShiny = false
        getInfo(searchBar.value)
    }
})

randomBtn.addEventListener('click', () => {

    getInfo(rng(0, 649))

})

shinyBtn.addEventListener('click', () => {
    
    if (!isShiny)
    {
        isShiny = true
        pmImg.src = shinyUrl
    }
    else if (isShiny)
    {
        isShiny = false
        pmImg.src = normalUrl
    }

})


