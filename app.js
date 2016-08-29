$(document).ready(function(){
// console.log("I'm linked");

var breweries = [];

var randomBreweries = function() {
  $('#brewery-cards').empty();

    // for (var i = 0; i < breweries.length; i++) {
    //   var brewery = breweries[i]
    // }

    for (var i = 0; i < 6; i++) {
      var randomVariable = breweries[Math.floor(Math.random()*breweries.length)];
      var brewery = randomVariable;
      var $col = $('<div class="col s12 m4 l4">');
      var $card = $('<div class="card blue-grey darken-1">');
      var $content = $('<div class="card-content white-text">');
      var $title = $('<h6 class="card-title">');

      $title.text(brewery.name);

      $content.append($title);
      $card.append($content);

      $col.append($card);

      $('#brewery-cards').append($col);

    }
  };


var requestData = function(page) {

  $.ajax({
              method: "GET",
              url: `http://g-brewerydb.herokuapp.com/locations/?key=2be76c432d122aacf0bc16bc673a24c9&region=colorado&p=${page}`,
              dataType: "json",
              success: function(received) {
                  // console.log("success:", data);
                  var results = received.data;
                  var currentPage = received.currentPage;
                  var numberOfPages = received.numberOfPages;
                  // console.log(results);
                  for (var i = 0; i < results.length; i++) {
                    var oneBrewery = results[i];
                    var brewery = {
                      name: oneBrewery.brewery.name,
                      locality: oneBrewery.locality,
                      open: oneBrewery.openToPublic,
                      id: oneBrewery.id
                    };
                    // console.log(brewery);
                    if (brewery.open == "Y") {
                      breweries.push(brewery);
                    }

                  } //for loop
                  if (currentPage < numberOfPages) {
                    var nextPage = currentPage + 1;
                    requestData(nextPage);
                  } else {
                    // console.log(breweries);
                    //function goes here that appends the stuff to the stuff
                    randomBreweries();
                  }

              },
              error: function(err) {
                  console.log("Your search was not found", err);
              }
    }); //ajax call done
}; // requestData function end

requestData(1);


}); //end of document.ready
