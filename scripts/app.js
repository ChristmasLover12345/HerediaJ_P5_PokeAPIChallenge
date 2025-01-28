
let pmImg = document.getElementById("pmImg")
let pmName = document.getElementById("pmName")
let pmElement = document.getElementById("pmElement")
let pmLocation = document.getElementById("pmLocation")
let pmMoves = document.getElementById("pmMoves")
let pmAbilities = document.getElementById("pmAbilities")
let addFavBtn = document.getElementById("addFavBtn")
let favBtn = document.getElementById("favBtn")
let randomBtn = document.getElementById("randomBtn")
let searchBar = document.getElementById("searchBar")

// Fetches
async function pokemonFetch(userSearch)
{
    let promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${userSearch}`);
    let data = await promise.json();
    console.log(data)
    return data;
}



searchBar.addEventListener("keydown", (event) => {
    if (event.key ==="Enter")
    {
        pokemonFetch(searchBar.value)
    }
})

