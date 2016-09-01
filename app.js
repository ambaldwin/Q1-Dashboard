$(document).ready(function() {
    // console.log("I'm linked");

    $(".randomize-button").click(function() {
      randomBreweries();
  });

    const breweries = [];

    const randomBreweries = function() {
        $('#brewery-cards').empty();

        for (let i = 0; i < 6; i++) {

            let randomVariable = breweries[Math.floor(Math.random() * breweries.length)];
            let brewery = randomVariable;
            let $col = $('<div class="col s12 m4 l4">');
            let $card = $('<div class="card grey lighten-4">');
            let $content = $('<div class="card-content black-text">');
            let $title = $('<h3 class="card-title">');
            let $locality = $('<p class="card-locality">');
            // console.log(randomVariable);
            var breweryID = randomVariable.id;
            let $action = $(`<div id="${breweryID}" class="card-action waves-effect center-align">`);
            let $beer = $('<a class="waves-effect waves-light btn modal-trigger center-align" href="#' + breweryID + '"</a>');

            $title.text(brewery.name);
            $locality.text(brewery.locality);

            $beer.text('Show me the BEER');

            $action.append($beer);
            $card.append($action);

            $title.attr({
                align: 'center',
                'data-position': 'top',
            });

            $locality.attr({
                align: 'center'
            });

            $content.append($title, $locality, $action);
            $card.append($content);

            $col.append($card);

            $('#brewery-cards').append($col);

        } // for loop end
    }; // randomBreweries function end


    var randomBeers = function(beerInfo) {
        var $modal = $('#modal1')
        if (!$('#modal1').html()) {
            $modal = $(`<div class="modal" id="modal1">`);
        } else {
            $modal.html('')
        }

        var $modalContent = $('<div class="modal-content">');


        var length = beerInfo.length;
        if (length > 0) {
            if (length > 2) {
                length = 2
            }
            for (let i = 0; i < length; i++) {
                let beerBeer = beerInfo[i];
                let $modalHeader = $('<h4>').text(beerBeer.name);
                let $modalTextABV = $('<p>').text(`ABV: ${beerBeer.abv}`);
                // const $modalText = $('<p>').text('beer.description');
                // console.log(beerBeer);
                $modalContent.append($modalHeader, $modalTextABV);
                $modal.append($modalContent);
            } // for loop end
        }
        else {
          $modalContent.text("Sorry, no beer information at this time!")
          $modal.append($modalContent);
        }

        $('main').append($modal)
        $('#modal1').openModal();

    }; // randomBeers function end

    const requestData = function(page) {
        $.ajax({
            method: 'GET',
            url: `http://g-brewerydb.herokuapp.com/locations/?key=2be76c432d122aacf0bc16bc673a24c9&region=colorado&p=${page}`,
            dataType: 'json',
            success: function(received) {
                // console.log("success:", data);
                const results = received.data;
                const currentPage = received.currentPage;
                const numberOfPages = received.numberOfPages;

                // console.log(results);
                for (let i = 0; i < results.length; i++) {
                    const oneBrewery = results[i];
                    const brewery = {
                        id: oneBrewery.id,
                        locality: oneBrewery.locality,
                        name: oneBrewery.brewery.name,
                        open: oneBrewery.openToPublic
                    };
                    // console.log(brewery);
                    if (brewery.open === 'Y') {
                        breweries.push(brewery);
                    }
                } //  for loop
                if (currentPage < numberOfPages) {
                    const nextPage = currentPage + 1;
                    requestData(nextPage);
                } else {
                    // console.log(breweries);
                    randomBreweries();
                }
            },
            error: function(err) {
                console.log("Your search was not found", err);
            }
        }); // ajax call done
    }; // requestData function end

    requestData(1);

    $(document).on('click', '.card-action', function() {
        event.preventDefault();

        var breweryID = $(this).closest('.card-action')[0].id

        console.log('clicked ID', breweryID);

        $.ajax({
            method: 'GET',
            url: `http://g-brewerydb.herokuapp.com/brewery/${breweryID}/beers/?key=2be76c432d122aacf0bc16bc673a24c9`,
            dataType: 'json',
            success: function(receivedBeer) {
                // console.log("success:", receivedBeer);
                var results = receivedBeer.data;

                var beerInfo = []

                if (results !== undefined) {
                    for (let i = 0; i < results.length; i++) {
                        let oneBeer = results[i];

                        // console.log(oneBeer);
                        let beer = {
                            abv: oneBeer.abv,
                            name: oneBeer.name
                        };
                        // console.log(beer);
                        beerInfo.push(beer);
                    } //for loop end
                } //end if statement
                randomBeers(beerInfo);
            },
            error: function(err) {
                console.log("Your search was not found for beer data.", err);
            }
        }); // ajax call done
    }); // event listener end

}); // end of document.ready
