const endpoint = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=151/";
const search_INPUT = document.querySelector("#search-poke");
const pokemons_CONT = document.querySelector(".pokemons-container");
const details_WRAP = document.querySelector(".details-wrapper");
const mouse_CURSOR = document.querySelector("#base-cursor");
const cursor_INNER = document.querySelector(".cursor-inner");

const MAIN_FUNCTION = {
  pokemon_ARR: [],
  data_FETCH(endpoint) {
    gsap.to(cursor_INNER, {
      backgroundColor: "blue",
      rotation: -135,
      borderRadius: 100,
      scale: 0.5,
      ease: "slow",
    });
    return fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        gsap.to(cursor_INNER, {
          backgroundColor: "#fff",
          rotation: -135,
          borderRadius: 0,
          scale: 0.05,
          ease: "slow",
        });
        return data;
      });
  },
  async show_ALL() {
    let render_HTML = "";
    const pokemon_ARR = await data_FETCH(endpoint);
    const all_DATA = await Promise.all(
      pokemon_ARR.results.map((data) => {
        const data_POKE = data_FETCH(data.url);
        return data_POKE;
      })
    );
    all_DATA.forEach((val) => {
      const render = render_POKE(val);
      render_HTML += render;
    });
    pokemons_CONT.innerHTML = render_HTML;
  },
  async show_FILTER(e) {
    isEmpty = false;
    let render_HTML = "";
    const input_VAL = e.target.value;
    const filtered = filter_ARR(input_VAL);
    const data_URL = await Promise.all(
      filtered.map((data) => {
        return data_FETCH(data.url);
      })
    );
    data_URL.forEach((val) => {
      const render = render_POKE(val);
      render_HTML += render;
      pokemons_CONT.innerHTML = render_HTML;
    });
  },
  async show_DETAILS(e) {
    if (e.target.dataset.trigger) {
      const endpoint_POKE = `https://pokeapi.co/api/v2/pokemon/${e.target.dataset.id}/`;
      const endpoint_DETAIL = e.target.dataset.url;
      const data_POKE = await data_FETCH(endpoint_POKE);
      const data_DETAIL = await data_FETCH(endpoint_DETAIL);
      // console.log(data_POKE, data_DETAIL);
      details_WRAP.innerHTML = render_DETAIL(data_POKE, data_DETAIL);
    }
  },
  filter_ARR(value) {
    const regex = new RegExp(value, "gi");
    return pokemon_ARR.filter((poke) => {
      return poke.name.match(regex);
    });
  },
};

const RENDER_FUNCTION = {
  render_POKE(data) {
    // console.log(data);
    return `
      <div class="card pokemon-item">
          <div class="circle">
              <div class="pokemon">
              <img
                  src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/${fixed_ID(
                    data.id.toString()
                  )}.png"
                  alt="pokemon image"
                  width="130px"
                  data-url="${data.species.url}"
                  data-id="${data.id}"
                  data-name="${data.name}"
                  data-trigger="true"
                  class="trigger-details"
              />
              <h5><span class="font-m">#${fixed_ID(
                data.id.toString()
              )}</span></h5>
              <h3><span class="font-l capitalize">${isNidoran(
                data.name
              )}</span></h3>
              </div>
          </div>
      </div>
      `;
  },
  render_DETAIL(data_POKE, data_DETAIL) {
    // * Extract data type
    let data_TYPE = "";
    data_POKE.types.forEach((x) => {
      const type = show_TYPE(x);
      data_TYPE += type;
    });

    // * Extract data abilities
    let data_ABILIY = "";
    data_POKE.abilities.forEach((x) => {
      const ability = show_ABILITY(x);
      data_ABILIY += ability;
    });

    // * Extract data stats
    let data_STAT = "";
    data_POKE.stats.forEach((x) => {
      const stat = show_STAT(x);
      data_STAT += stat;
    });

    // * Extract genus pokemon
    let genera = filter_GENUS(data_DETAIL);
    let [genus_en] = genera;

    // * Extract evolution from species
    let evol_FROM = show_EVOL_FROM(data_DETAIL);

    // * Extract flavor text
    let flavor_TXT = show_FLAVOR(data_DETAIL);
    let [flavor_en] = flavor_TXT;

    // * Change height to feet inches
    let feet = change_FEET_INCHES(data_POKE.height);

    // * Change weight to pounds
    let pounds = change_POUNDS(data_POKE.weight);

    return `
    <div class="render-details">
        <div class="pokemon-info">
          <img
            src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/${fixed_ID(
              data_POKE.id.toString()
            )}.png"
            alt=""
            width="170px"
          />
          <div class="card-text">
            <h3 class="pokemon-info-text bold capitalize">No. 
            ${fixed_ID(data_POKE.id.toString())} ${data_POKE.name}</h3>
            <h3 class="pokemon-info-text">${genus_en.genus}</h3>
            <br />
            <h3 class="pokemon-info-text line-height med bold">
              Type :
            </h3>
            ${data_TYPE}
          </div>
        </div>
        <div class="pokemon-detail-text">
          <div class="second-info">
            <div class="box-1 no-justify">
              <div class="base-happiness line-height high">
                <h5>Base Happiness</h5>
                <p>${data_DETAIL["base_happiness"]}</p>
              </div>
              <div class="capture-rate line-height high">
                <h5>Capture Rate</h5>
                <p>${data_DETAIL["capture_rate"]}</p>
              </div>
              <div class="growth-rate line-height high">
                <h5>Growth Rate</h5>
                <p class="capitalize">${data_DETAIL["growth_rate"].name}</p>
              </div>
            </div>
            <div class="box-2">
              <div class="habitat line-height high">
                <h5>Habitat</h5>
                <p class="capitalize">${data_DETAIL.habitat.name}</p>
              </div>
              ${evol_FROM}
            </div>
          </div>
          <div class="first-info">
            <div class="pokemon-stats">
              <div class="box-1">
                <div class="height-weight">
                  <div class="height">
                    <h5>Height</h5>
                    <p>${feet}</p>
                  </div>
                  <div class="weight">
                    <h5>Weight</h5>
                    <p>${pounds} lbs</p>
                  </div>
                </div>
                <div class="pokemon-abilities">
                  <h5>Abilites</h5>
                  ${data_ABILIY}
                </div>
              </div>
              <div class="box-2">
                <div class="stats">
                  <h5>Stats</h5>
                  ${data_STAT}
                </div>
              </div>
            </div>
            <div class="pokemon-flavor-text">
              <div class="flavor-text">
                "${flavor_en["flavor_text"]}"
              </div>
              <button class="next-data" data-next="true">
                Next Data
              </button>
            </div>
          </div>
        </div>
    </div>
    `;
  },
  show_TYPE(data) {
    return `
    <span class="type-container capitalize" style="background-color: var(--${
      data.type.name
    }); ${change_WHITE(data)}">${data.type.name}</span> 
    `;
  },
  show_ABILITY(data) {
    return `
    <p class="capitalize">${data.ability.name}</p>
    `;
  },
  show_STAT(data) {
    function ifHP(data) {
      return data.stat.name !== "hp"
        ? 'class="capitalize"'
        : 'class="uppercase"';
    }
    return `
    <p ${ifHP(data)}>${data.stat.name} : ${data["base_stat"]}</p>
    `;
  },
  show_FLAVOR(data) {
    return data["flavor_text_entries"].filter((x) => {
      return x.language.name == "en" && x.version.name == "alpha-sapphire";
    });
  },
};

const TOOL_FUNCTION = {
  fixed_ID(nums) {
    return nums.length === 1
      ? `00${nums}`
      : nums.length === 2
      ? `0${nums}`
      : nums;
  },
  isNidoran(data) {
    return data === "nidoran-m"
      ? "nidoran &#9794"
      : data === "nidoran-f"
      ? "nidoran &#9792"
      : data;
  },
  change_WHITE(data) {
    const y = data.type.name;
    return y == "poison" ||
      y == "fighting" ||
      y == "ghost" ||
      y == "water" ||
      y == "psychic" ||
      y == "dragon"
      ? "color: white;"
      : "";
  },
  filter_GENUS(data) {
    return data.genera.filter((x) => {
      return x.language.name == "en";
    });
  },
  show_EVOL_FROM(data) {
    return data["evolves_from_species"] == null
      ? ""
      : `
      <div class="evolution-from line-height high">
        <h5>Evolution from Species</h5>
        <p class="capitalize">${data["evolves_from_species"].name}</p>
      </div>
      `;
  },
  change_FEET_INCHES(n) {
    const toMetre = n * 10;
    const realFeet = (toMetre * 0.3937) / 12;
    const feet = Math.floor(realFeet);
    const inches = Math.round((realFeet - feet) * 12);
    function inches_FIX() {
      return inches.toString().length === 1 ? `0${inches}` : inches;
    }
    return `${feet}' ${inches_FIX(inches)}"`;
  },
  change_POUNDS(n) {
    const pounds = n / 4.536;
    return pounds.toFixed(1);
  },
  show_NEXT(e) {
    if (e.target.dataset.next) {
      const btn_TXT = e.target;
      document.querySelector(".second-info").classList.toggle("show");
      if (btn_TXT.textContent === "Back") {
        btn_TXT.textContent = "Next Data";
      } else {
        btn_TXT.textContent = "Back";
      }
    }
  },
};

// todo spreading object
const {
  pokemon_ARR,
  data_FETCH,
  filter_ARR,
  show_ALL,
  show_FILTER,
  show_DETAILS,
} = MAIN_FUNCTION;

const {
  render_POKE,
  render_DETAIL,
  show_TYPE,
  show_ABILITY,
  show_STAT,
  show_FLAVOR,
} = RENDER_FUNCTION;

const {
  fixed_ID,
  isNidoran,
  change_WHITE,
  filter_GENUS,
  show_EVOL_FROM,
  change_FEET_INCHES,
  change_POUNDS,
  show_NEXT,
} = TOOL_FUNCTION;

// todo Fetch all Pokemon data
fetch(endpoint)
  .then((res) => res.json())
  .then((data) => pokemon_ARR.push(...data.results));

// todo Control flow for showing pokemon
let isEmpty = search_INPUT.value.length == 0;
if (isEmpty) {
  show_ALL();
}

function cursor_FX(e) {
  gsap.to(mouse_CURSOR, {
    y: e.pageY,
    x: e.pageX,
    ease: "slow",
  });
}

search_INPUT.addEventListener("input", show_FILTER);
pokemons_CONT.addEventListener("click", show_DETAILS);
document.body.addEventListener("click", show_NEXT);
window.addEventListener("mousemove", cursor_FX);
