async function randomizePokemon(pairs) {
  var generatedIds = [];
  for (let i = 0; i < pairs; i++) {
    // don't want duplicate pokemon
    let pokeId;
    do {
      pokeId = Math.floor(Math.random() * 810) + 1;
    } while (generatedIds.includes(pokeId));
    generatedIds.push(pokeId);
    generatedIds.push(pokeId);
  }
  generatedIds.sort(() => Math.random() - 0.5);

  for (let j = 0; j < generatedIds.length; j++) {
    const pokemon = generatedIds[j];
    const result = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${pokemon}`
    );
    $("#game_grid").append(`
  <div class="cards"> 
  <img id="img${j}" class="front_face" src=${result.data.sprites.other["official-artwork"].front_default} alt="oopsie!">
  <img class="back_face" src="back.webp" alt="oopsie!">
  </div>
  `);
  }
}

const setup = async () => {
  $("#reset").on("click", function () {
    window.location.reload();
  });

  function start() {
    $("#start_game").prop("disabled", true);
    $("#powerup").prop("disabled", false);

    var firstCard = undefined;
    var secondCard = undefined;
    var matches = 0;
    var clicks = 0;
    var pairs = 0;
    var timer = 0;
    var totalTime = 0;

    const difficulty = $('input[name="difficulty"]:checked').attr("id");
    switch (difficulty) {
      case "easy":
        pairs = 3;
        timer = 60;
        totalTime = timer;
        break;
      case "medium":
        pairs = 6;
        $("#game_grid").css("width", "800px");
        $("#game_grid").css("height", "600px");
        timer = 120;
        totalTime = timer;
        break;
      case "hard":
        pairs = 9;
        $("#game_grid").css("width", "1200px");
        $("#game_grid").css("height", "600px");
        timer = 160;
        totalTime = timer;
        break;
      default:
        pairs = 3;
        timer = 60;
        totalTime = timer;
    }
    var matchesRemaining = pairs;

    const theme = $('input[name="theme"]:checked').val();

    switch (theme) {
      case "theme1":
        $("body").css("background-image", "url(aqua.webp)");
        break;
      case "theme2":
        $("body").css("background-image", "url(magma.webp)");
        break;
      default:
        $("body").css("background-color", "white");
        break;
    }
   console.log(pairs);
   console.log(matches);
   console.log(matchesRemaining);
    $("#pairs").text(pairs);
    $("#matches").text(matches);
    $("#left").text(matchesRemaining);
    $("#clicks").text(clicks);
    $("#timer").text(timer);

    let timerInterval = setInterval(() => {
      timer--;
      $("#timer").text(timer);

      if (timer === 0) {
        clearInterval(timerInterval);
        alert("You've run out of time! Try again");
        location.reload();
        return;
      }
    }, 1000);

    $("#powerup").click(function () {
      const $unmatchedCards = $(".cards:not(.flip)").not(".disabled");
      $unmatchedCards.addClass("flip");
      $(".cards").addClass("disabled");
      setTimeout(function () {
        $unmatchedCards.removeClass("flip");
        $("#powerup").prop("disabled", true);
      }, 3000);
    });

    randomizePokemon(pairs).then(() => {
      $(".cards").on("click", function () {
        if (!firstCard) {
          firstCard = $(this).find(".front_face")[0];
          $(this).toggleClass("flip");
          $(this).toggleClass("disabled");
          clicks++;
          $("#clicks").text(clicks);
        } else if (!secondCard) {
          secondCard = $(this).find(".front_face")[0];
          $(this).toggleClass("flip");
          $(this).toggleClass("disabled");
          clicks++;
          $("#clicks").text(clicks);
          if (firstCard === secondCard) {
            return;
          }

          if (firstCard.src === secondCard.src) {
            // Matching cards
            $(`#${firstCard.id}`).parent().off("click");
            $(`#${secondCard.id}`).parent().off("click");
            matches++;
            $("#matches").text(matches);
            matchesRemaining--;
            $("#left").text(matchesRemaining);
            firstCard = undefined;
            secondCard = undefined;
            if (matches === pairs) {
              setTimeout(() => {
                alert(`Congratulations! You won the game! It took ${clicks / 2} matches
                and ${totalTime - timer} seconds!
                `);
                window.location.reload();
              }, 500);
            }
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
  $("#start_game").click(function () {
    start();
  });
};

$(document).ready(setup);
