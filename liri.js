require("dotenv").config();

var keys = require("./keys");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];

var movieName = process.argv.slice(3).join(" ");
var songName = process.argv.slice(3).join(" ");

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
  case "do-what-it-says":
    doWhatItSays();
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
        console.log(tweets[i].created_at + "\n");
      }
    } else {
      console.log(error);
    }
  });
}

function spotifyThisSong() {
  if (!songName) {
    songName = "The Sign";
  }

  console.log("songName : " + songName);
  spotify.search({ type: "track", query: songName }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    } else {
      console.log("*****************************************");
      console.log("Artist :" + data.tracks.items[0].artists[0].name + "\n");
      console.log("The song's name :" + data.tracks.items[0].name + "\n");
      console.log(
        "A preview link of the song from Spotify :" +
          data.tracks.items[0].preview_url +
          "\n"
      );
      console.log(
        "The album that the song is from :" +
          data.tracks.items[0].album.name +
          "\n"
      );
      console.log("*****************************************");
    }
  });
}

function displayMovieDetails() {
  if (!movieName) {
    movieName = "Mr. Nobody";
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
      console.log("Title of the movie :" + movieData.Title + "\n");
      console.log("Year the movie came out :" + movieData.Year + "\n");
      console.log("IMDB Rating of the movie :" + movieData.imdbRating + "\n");
      for (element in movieData.Ratings) {
        if (movieData.Ratings[element].Source === "Rotten Tomatoes") {
          console.log(
            "Rotten Tomatoes Rating of the movie :" +
              movieData.Ratings[element].Value +
              "\n"
          );
        }
      }
      console.log(
        "Country where the movie was produced :" + movieData.Country + "\n"
      );
      console.log("Language of the movie :" + movieData.Language + "\n");
      console.log("Plot of the movie :" + movieData.Plot + "\n");
      console.log("Actors in the movie :" + movieData.Actors + "\n");
    }
  });
}

function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function(err, data) {
    var fileData = data.split(",");
    option = fileData[0];
    arguments = fileData[1];

    if (!err) {
      switch (option) {
        case "movie-this":
          movieName = arguments;
          displayMovieDetails();
          break;
        case "spotify-this-song":
          songName = arguments;
          spotifyThisSong();
          break;
        case "tweets":
          getLast20Tweets();
          break;
      }
    }
  });
}
