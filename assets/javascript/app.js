$(document).ready(function () {
    // array with initial buttons
    var topics = [{movie:"Thor Ragnarok", presses: 0,}, {movie: "Fantasia", presses: 0,}, {movie: "Heavy Metal", presses: 0,}, {movie: "The Babadook", presses: 0,}];
    // array to keep favorites in, to write to localStorage
    var favorites = [];
    // Function to retrieve gifs from giphy api, create cards for each gif, and place them on the page. Receives "data-name" of button as argument
    function renderGifs(a) {
        // places "data-name" in variable
        var gifCat = a;
        // variable to keep offset value for placing in query url
        var offset = 0;
        // Loop to determine which movie button was pressed and update offset variable with correct value depending on how many times the button has been pressed
        for (var i=0; i < topics.length; i++) {
            if (a == topics[i].movie) {
                offset = (topics[i].presses - 1) * 10;
            }
        }
        // variable to store the query url
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + gifCat + "&api_key=mluAjBbyX0q2FntZs3a6RO8l5lUJXRzI&limit=10&offset=" + offset;
        // ajax call to get 10 gif results
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            // Puts the array of gifs into a variable then loops through the variable to create the necessary html and prepends the finished gif card to the page
            rspArray = response.data;
            for (var i = 0; i < rspArray.length; i++) {
                var catDiv = $("<div class='card mr-3 mb-3 pb-2 float-left gifCard'></div>");
                var cdBody = $("<div class='card-body'></div>");
                var gfRating = $("<p class='text-center rating'><strong>Rating: " + rspArray[i].rating + "</strong></p>");
                gfRating.attr("rating", rspArray[i].rating);
                var fav = $("<strong><p class='text-center' id='fav-tag'>Favorite</p></strong>");
                var dnld = $("<strong><a href='" + rspArray[i].images.fixed_height.url + "'download='giphy.gif class='dnld' target='_blank'>Download</a>");
                var gfImg = $("<img class='card-img-top makeMeGo' src='" + rspArray[i].images.fixed_height_still.url + "' alt='gif'/>");
                gfImg.attr({"data-still": rspArray[i].images.fixed_height_still.url, "data-animate": rspArray[i].images.fixed_height.url, "data-state": "still"});
                cdBody.append(gfRating, fav, dnld);
                catDiv.append(gfImg, cdBody);

                $("#gif-view").prepend(catDiv);
            }
        });

    }
    // function to create the buttons
    function renderButtons() {
        // clears out the div that the buttons go in
        $("#buttons-view").empty();
        // Loops through the  topics array, creates a button for each member with the name of the movie on it, then places the buttons on the page
        for (var i = 0; i < topics.length; i++) {

            var a = $("<button>");
            a.addClass("gif btn btn-primary mr-3 mt-3 mb-3");
            a.attr({"data-name": topics[i].movie, type: "button"});
            a.text(topics[i].movie);
            $("#buttons-view").append(a);
        }
    }
    // function to read array of gif objects from local storage and put them up in the Favorites section of the page
    function renderFavorites() {
        // get the array from localStorage and parse it back into objects
        var favs = JSON.parse(localStorage.getItem("favoriteGifs"));
        // check to make sure it's an array, to avoid blowing up the browser
        if (Array.isArray(favs)) {
            // since its an array, we can put the objects back in the global array variable
            favorites = favs;
            // clear the div that holds the favorites before recreating them all
            $("#favGifs").empty();
            // This for loop reconstructs the Bootstrap card elements for the favorite gifs and prepends them to the Favorites div
            for (var i = 0; i < favs.length; i++) {
                var catDiv = $("<div class='card mr-3 mb-3 pb-2 float-left gifCard'></div>");
                var cdBody = $("<div class='card-body'></div>");
                var gfRating = $("<p class='text-center rating'><strong>Rating: " + favs[i].rating + "</strong></p>");
                gfRating.attr("rating", favs[i].rating);
                var fav = $("<strong><p class='text-center pb-0' id='del-tag'>Remove</p></strong>");
                var dnld = $("<strong><a href='" + favs[i].animateUrl + "'download='giphy.gif class='dnld' target='_blank'>Download</a>");
                var gfImg = $("<img class='card-img-top makeMeGo' src='" + favs[i].stillUrl + "' alt='gif'/>");
                gfImg.attr({ "data-still": favs[i].stillUrl, "data-animate": favs[i].animateUrl, "data-state": "still" });
                cdBody.append(gfRating, fav, dnld);
                catDiv.append(gfImg, cdBody);
              
                $("#favGifs").prepend(catDiv);
            }
        }

    }
    // click handler for button used to add new movie button
    $("#gif-search").on("click", function (event) {
        // prevent normal use of button
        event.preventDefault();
        // get text from input box
        var gif = $("#new-cat").val().trim();
        //create new object and push it into the topics array
        var newBtn = {movie: gif, presses: 0,};
        topics.push(newBtn);
        // clear out the input box
        $("#new-cat").val("");
        // call renderButtons to get all the buttons on the page including the new one
        renderButtons();

    });
    // click handler for movie buttons (class gif)
    $(document).on("click", ".gif", function() {
        // Loop through topics to find which button was pressed and increment its presses for the correct offset in the query url
        for (var i=0; i < topics.length; i++) {
            if ($(this).attr("data-name") == topics[i].movie) {
                topics[i].presses++;
            }
        }
        // call renderGifs with the button's "data-name" as the argument
        renderGifs($(this).attr("data-name"));
    });
    // click handler to start and pause the gifs
    $(document).on("click", ".makeMeGo", function(event) {
        var state = $(this).attr("data-state");
        if (state === "still") {
            $(this).attr("src", $(this).attr("data-animate"));
            $(this).attr("data-state", "animate");
          } else if (state === "animate") {
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");
          }
    })
    // click handler to move a "favorite" to the favorites section and push it to the favorites array and localStorage
    // had to specify the child item of .card-body so that clicking on the img would still cause it to animate
    $("#gif-view").on("click", ".gifCard > .card-body", function(event) {
        console.log(event, $(this));
        $("#favGifs").append($(this).parent());
        // set a variable to hold the .makeMeGo element, which is the img
        var card = $(this).parent().children(".makeMeGo");
        // set a variable to hold the .rating element, which is the rating
        var rating = $(this).children(".rating");
        // add the still url, animate url, and rating as an object to the favorites array. These are the 3 pieces
        // of information that we need to rebuild the gif cards
        favorites.push({"stillUrl":card.attr("data-still"), "animateUrl":card.attr("data-animate"), "rating": rating.attr("rating")});
        // clear local storage
        localStorage.clear();
        // stringify our favorites array and put it in local storage
        localStorage.setItem("favoriteGifs", JSON.stringify(favorites));

        renderFavorites();
    })
    // click event handler for removing favorites
    $("#favGifs").on("click", ".card-body", function(event) {
        // set variable equal to the img element so that we can retrieve a url to compare
        var urls = $(this).parent().children(".makeMeGo");
        // remove the gif card from the Favorites section
        $(this).parent().remove();
        // Loop to check which object in the favorites array matches the card that was clicked to remove
        for (var i = 0; i < favorites.length; i++) {
            // when the match is found, remove the object from the array
            if (urls.attr("data-still") == favorites[i].stillUrl) {
                favorites.splice(i, 1);
            }
        }
        // it is now gone from html and from the favorites array, but now we must remove it from localStorage
        localStorage.clear();
        localStorage.setItem("favoriteGifs", JSON.stringify(favorites));
    })


    // initial calls to renderButtons and renderFavorites
    renderButtons();
    renderFavorites();

})