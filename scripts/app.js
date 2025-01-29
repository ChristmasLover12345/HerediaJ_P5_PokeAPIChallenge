
let pmImg = document.getElementById("pmImg")
let pmName = document.getElementById("pmName")
let pmElement = document.getElementById("pmElement")
let pmLocation = document.getElementById("pmLocation")
let pmMoves = document.getElementById("pmMoves")
let pmAbilities = document.getElementById("pmAbilities")

let addFavBtn = document.getElementById("addFavBtn")
let shinyBtn = document.getElementById("shinyBtn")
let favBtn = document.getElementById("favBtn")
let randomBtn = document.getElementById("randomBtn")
let searchBar = document.getElementById("searchBar")

let isShiny = false;
let shinyUrl = ""
let normalUrl = ""

let 

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

    if (pokeInfo.id > 649)
    {
    alert("Only gen 1 - 5")
    return
    }

    normalUrl = pokeInfo.sprites.front_default
    shinyUrl = pokeInfo.sprites.front_shiny

    pmImg.src = pokeInfo.sprites.front_default
    pmName.innerText = pokeInfo.name

    let locations = await (fetch(pokeInfo.location_area_encounters)).json()

    pmLocation.innerText = locations


}


searchBar.addEventListener("keydown", (event) => {
    if (event.key ==="Enter")
    {   
        isShiny = false
        getInfo(searchBar.value)
    }
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

