$(document).ready(function () {
    // array with initial buttons
    var topics = [{movie:"Thor Ragnarok", presses: 0,}, {movie: "The Terminator", presses: 0,}, {movie: "Avengers", presses: 0,}, {movie: "Dawn of the Dead", presses: 0,}];
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
                var gfRating = $("<strong><p class='text-center'>Rating: " + rspArray[i].rating + "</p></strong>");
                var fav = $("<strong><p class='text-center pb-0' id='fav-tag'>Favorite</p></strong>");
                var gfImg = $("<img class='card-img-top makeMeGo' src='" + rspArray[i].images.fixed_height_still.url + "' alt='gif'/>");
                gfImg.attr({"data-still": rspArray[i].images.fixed_height_still.url, "data-animate": rspArray[i].images.fixed_height.url, "data-state": "still"});
                cdBody.append(gfRating, fav);
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
    // click handler to move a "favorite" to the favorites section
    $(document).on("click", ".gifCard > .card-body", function(event) {
        console.log($(this));
        $("#favGifs").append($(this).parent());
    })
    // initial call to renderButtons
    renderButtons();

})