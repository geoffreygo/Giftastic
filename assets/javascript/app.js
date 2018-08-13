$(document).ready(function () {

    var topics = [{movie:"Thor Ragnarok", presses: 0, favorite: false,}, {movie: "The Terminator", presses: 0, favorite: false,}, {movie: "Avengers", presses: 0, favorite: false,}, {movie: "Dawn of the Dead", presses: 0, favorite: false,}];

    function renderGifs(a) {

        var gifCat = a;
        console.log(gifCat);
        var offset = 0;
        for (var i=0; i < topics.length; i++) {
            if (a == topics[i].movie) {
                offset = (topics[i].presses - 1) * 10;
                console.log(offset);
            }
        }
        console.log(offset);
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + gifCat + "&api_key=mluAjBbyX0q2FntZs3a6RO8l5lUJXRzI&limit=10&offset=" + offset;
        console.log(queryURL);


        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
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

    function renderButtons() {

        $("#buttons-view").empty();

        for (var i = 0; i < topics.length; i++) {

            var a = $("<button>");
            a.addClass("gif btn btn-primary mr-3 mt-3 mb-3");
            a.attr({"data-name": topics[i].movie, type: "button"});
            console.log(topics[i].movie);
            a.text(topics[i].movie);
            $("#buttons-view").append(a);
        }
    }

    $("#gif-search").on("click", function (event) {
        event.preventDefault();

        var gif = $("#new-cat").val().trim();
        var newBtn = {movie: gif, presses: 0, favorite: false,};
        console.log(topics);

        topics.push(newBtn);
        $("#new-cat").val("");

        renderButtons();
        console.log(topics);

    });

    $(document).on("click", ".gif", function() {
        for (var i=0; i < topics.length; i++) {
            if ($(this).attr("data-name") == topics[i].movie) {
                console.log(topics[i].presses);
                topics[i].presses++;
                console.log(topics[i].presses);
            }
        }
        renderGifs($(this).attr("data-name"));
    });

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

    $(document).on("click", ".gifCard > .card-body", function(event) {
        console.log($(this));
        $("#favGifs").append($(this).parent());
    })

    renderButtons();

})