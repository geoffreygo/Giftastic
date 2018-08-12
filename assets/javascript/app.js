$(document).ready(function () {

    var topics = [{movie:"The Matrix", presses: 0,}, {movie: "The Terminator", presses: 0,}, {movie: "Avengers", presses: 0,}, {movie: "Super Troopers", presses: 0,}];

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
                var catDiv = $("<div class='card mr-3 mb-3 pb-2 float-left'></div>");
                var cdBody = $("<div class='card-body'></div>")
                // var gfTitle = $("<p>" + rspArray[i].title + "</p>");
                var gfRating = $("<strong><p>Rating: " + rspArray[i].rating + "</p></strong>")
                var gfImg = $("<img class='card-img-top makeMeGo' src='" + rspArray[i].images.fixed_height_still.url + "' alt='gif'/>");
                gfImg.attr({"data-still": rspArray[i].images.fixed_height_still.url, "data-animate": rspArray[i].images.fixed_height.url, "data-state": "still"});
                cdBody.append(gfRating);
                catDiv.append(gfImg, cdBody);

                $("#gif-view").prepend(catDiv);
            }
        });

    }

    function renderButtons() {

        $("#buttons-view").empty();

        for (var i = 0; i < topics.length; i++) {

            var a = $("<button>");
            a.addClass("gif btn btn-success mr-3 mt-3 mb-3");
            a.attr({"data-name": topics[i].movie, type: "button"});
            console.log(topics[i].movie);
            a.text(topics[i].movie);
            $("#buttons-view").append(a);
        }
    }

    $("#gif-search").on("click", function (event) {
        event.preventDefault();

        var gif = $("#new-cat").val().trim();
        var newBtn = {movie: gif, presses: 0};
        console.log(topics);

        topics.push(newBtn);

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

    renderButtons();

})