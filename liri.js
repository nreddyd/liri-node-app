require("dotenv").config();

var keys = require("./keys");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];

switch (command) {
  case "my-tweets":
    getLast20Tweets();
    break;
  case "spotify-this-song":
    spotifyThisSong();
    break;
  case "movie-this":
    displayMovieDetails();
    break;
}

function getLast20Tweets() {
  var params = { screen_name: "ProjMy", count: 20 };
  client.get("statuses/user_timeline", params, function(
    error,
    tweets,
    response
  ) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        console.log("-----------------------------------");
        console.log(tweets[i].text);
        console.log(tweets[i].created_at);
      }
    } else {
      console.log(error);
    }
  });
}

function spotifyThisSong() {
  var songname = "";
  for (var i = 3; i < process.argv.length; i++) {
    songname = songname + " " + process.argv[i];
  }
  console.log("songname : " + songname);
  spotify.search({ type: "track", query: songname }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    } else {
      console.log("*****************************************");
      console.log("Artist :" + data.tracks.items[0].artists[0].name);
      console.log("The song's name :" + data.tracks.items[0].name);
      console.log(
        "A preview link of the song from Spotify :" +
          data.tracks.items[0].preview_url
      );
      console.log(
        "The album that the song is from :" + data.tracks.items[0].album.name
      );
      console.log("*****************************************");
    }
  });
}

function displayMovieDetails() {
  var movieName = process.argv[3];

  if (!movieName) {
    movieName = "Mr. Nobody.";
    console.log(movieName);
    console.log(
      "If you haven't watched 'Mr. Nobody,' then you should: <http://www.imdb.com/title/tt0485947/>"
    );
    console.log("It's on Netflix!");
  }

  var queryUrl =
    "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

  request(queryUrl, function(err, response, body) {
    //if no error
    if (!err && response.statusCode === 200) {
      var movieData = JSON.parse(body);
      console.log("***************************************");
      console.log("Title of the movie :" + movieData.Title);
      console.log("Year the movie came out :" + movieData.Year);
      console.log("IMDB Rating of the movie :" + movieData.imdbRating);
      console.log(
        "Rotten Tomatoes Rating of the movie :" + movieData.Ratings[1].Value
      );
      console.log("Country where the movie was produced :" + movieData.Country);
      console.log("Language of the movie :" + movieData.Language);
      console.log("Plot of the movie :" + movieData.Plot);
      console.log("Actors in the movie :" + movieData.Actors);
    }
  });
}
