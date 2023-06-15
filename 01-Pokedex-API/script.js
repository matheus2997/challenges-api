const pokemonList = document.getElementById('pokemonList');
const pokemonDetails = document.getElementById('pokemonDetails');
const pokemonName = document.getElementById('pokemonName');
const pokemonStatsContainer = document.getElementById('pokemonStatsContainer');
const loadMoreButton = document.getElementById('loadMoreButton');

let offset = 0; // Variável para controlar o offset da busca de pokémons

function fetchPokemons(limit, offset) {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

  return fetch(url)
    .then(response => response.json())
    .then(data => data.results);
}

function fetchPokemonDetail(url) {
  return fetch(url)
    .then(response => response.json());
}

function displayPokemonList(pokemons) {
  pokemons.forEach((pokemon, index) => {
    const listItem = document.createElement('div');
    listItem.classList.add('pokemon-card');
    const pokemonNumber = padNumber(index + 1 + offset);
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index + 1 + offset}.png`;

    const typesContainer = document.createElement('div');
    typesContainer.classList.add('type-container');

    listItem.innerHTML = `
      <div class="number">#${pokemonNumber}</div>
      <img class="pokemon-image" src="${imageUrl}" alt="${pokemon.name}">
      <div class="name">${pokemon.name}</div>
    `;
    listItem.appendChild(typesContainer);

    listItem.addEventListener('click', () => {
      showPokemonDetails(pokemon, listItem);
    });
    pokemonList.appendChild(listItem);

    fetchPokemonDetail(pokemon.url)
      .then(data => {
        const types = data.types.map(type => type.type.name);
        types.forEach(type => {
          const typeElement = document.createElement('div');
          typeElement.textContent = type;
          typeElement.classList.add('type');
          typesContainer.appendChild(typeElement);
        });
        listItem.classList.add(types[0]); // Adiciona a classe do primeiro tipo para alterar a cor de fundo do card
      });
  });
}

function displayPokemonDetails(pokemon, listItem) {
  pokemonName.textContent = pokemon.name;
  pokemonStatsContainer.innerHTML = `
    <li><span class="stat-label">HP:</span> ${pokemon.stats.hp}</li>
    <li><span class="stat-label">Attack:</span> ${pokemon.stats.attack}</li>
    <li><span class="stat-label">Defense:</span> ${pokemon.stats.defense}</li>
    <li><span class="stat-label">Sp. Atk:</span> ${pokemon.stats.spAtk}</li>
    <li><span class="stat-label">Sp. Def:</span> ${pokemon.stats.spDef}</li>
    <li><span class="stat-label">Speed:</span> ${pokemon.stats.speed}</li>
    <li><span class="stat-label">Total:</span> ${pokemon.stats.total}</li>
  `;
  pokemonDetails.classList.add('active');

  // Ajusta o posicionamento do detalhe do Pokémon
  const rect = listItem.getBoundingClientRect();
  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;

  pokemonDetails.style.top = `${rect.top + scrollY + listItem.offsetHeight}px`;
  pokemonDetails.style.left = `${rect.left + scrollX + 118}px`; // Soma 118 pixels da posição left
}

function showPokemonDetails(pokemon, listItem) {
  fetchPokemonDetail(pokemon.url)
    .then(data => {
      const pokemonStats = {
        hp: data.stats.find(stat => stat.stat.name === 'hp').base_stat,
        attack: data.stats.find(stat => stat.stat.name === 'attack').base_stat,
        defense: data.stats.find(stat => stat.stat.name === 'defense').base_stat,
        spAtk: data.stats.find(stat => stat.stat.name === 'special-attack').base_stat,
        spDef: data.stats.find(stat => stat.stat.name === 'special-defense').base_stat,
        speed: data.stats.find(stat => stat.stat.name === 'speed').base_stat,
        total: data.stats.reduce((sum, stat) => sum + stat.base_stat, 0),
      };
      const pokemonDetails = {
        name: data.name,
        types: data.types.map(type => type.type.name),
        stats: pokemonStats,
      };
      displayPokemonDetails(pokemonDetails, listItem); // Passa o listItem como argumento
    });
}

function padNumber(number) {
  return number.toString().padStart(3, '0');
}

function loadMorePokemons() {
  offset += 4; // Incrementa o offset para carregar mais pokémons
  fetchPokemons(4, offset)
    .then(pokemons => displayPokemonList(pokemons));
}

loadMoreButton.addEventListener('click', loadMorePokemons);

fetchPokemons(4, offset)
  .then(pokemons => displayPokemonList(pokemons));

document.addEventListener('click', (event) => {
  const target = event.target;
  const listItem = target.closest('.pokemon-card');

  if (listItem) {
    const rect = listItem.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    pokemonDetails.style.top = `${rect.top + scrollY + listItem.offsetHeight}px`;
    pokemonDetails.style.left = `${rect.left + scrollX + 118}px`; // Soma 118 pixels da posição left
  }
});
