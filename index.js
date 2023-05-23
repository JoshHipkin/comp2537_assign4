  async function randomizePokemon(a) {
  var generatedIds = [];
  for (let i = 0; i < a; i++) {
    // don't want duplicate pokemon
    let pokeId;
    do {
        pokeId = Math.floor(Math.random() * 810) + 1;
        } while (generatedIds.includes(pokeId));        
        generatedIds.push(pokeId);
        generatedIds.push(pokeId);
  }
  console.log(generatedIds);
  for (let j = 0; j < generatedIds.length; j++) {
  const pokemon = generatedIds[j];
  console.log(pokemon);
  const result = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
  console.log(result);
  $('#game_grid').append(`
  <div class="card"> <img id="img${j}" class="front_face" src=${result.data.sprites.front_default} alt="oopsie!">
  <img class="back_face" src="back.webp" alt="oopsie!">
  </div>
  `);
  }
}



const setup = () => {
  
  let firstCard = undefined;
  let secondCard = undefined;
  
  randomizePokemon(3).then(() => {
    $(".card").on("click", function() {
      if (!firstCard) {
        firstCard = $(this).find(".front_face")[0];
        $(this).toggleClass("flip");
        $(this).toggleClass("disabled");
      } else if (!secondCard) {
        secondCard = $(this).find(".front_face")[0];
        $(this).toggleClass("flip");
        $(this).toggleClass("disabled");
  
        if (firstCard.src === secondCard.src) {
          // Matching cards
          $(`#${firstCard.id}`).parent().off("click");
          $(`#${secondCard.id}`).parent().off("click");
          firstCard = undefined;
          secondCard = undefined;
        } else {
          // Non-matching cards
          setTimeout(() => {
            $(`#${firstCard.id}`).parent().toggleClass("flip");
            $(`#${firstCard.id}`).parent().toggleClass("disabled");
            $(`#${secondCard.id}`).parent().toggleClass("flip");
            $(`#${secondCard.id}`).parent().toggleClass("disabled");
            firstCard = undefined;
            secondCard = undefined;
          }, 1000);
        }
      }
    });
  });
}


$(document).ready(setup)