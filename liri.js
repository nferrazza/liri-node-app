require("dotenv").config();


var Spotify = require("node-spotify-api");

var keys = require("./keys");

var request = require("request");

var moment = require("moment");

var fs = require("fs");

var spotify = new Spotify(keys.spotify);



//func

var getArtistNames = function(artist) {
    return artist.name;
};

var getMeSpotify = function(songName) {
    if (songName === undefined) {
        songName = "What's my age again";
    }

    spotify.search({
        type: "track",
        query: songName
    },
    function (err, data) {
        if(err){
            console.log(err);
            return;
        }

        var songs = data.tracks.items;

        for (var i=0; i< songs.length; i++){
            console.log(i);
            console.log("artist(s): " + songs[i].artists.map(getArtistNames));
            console.log("song name: " + songs[i].name);
            console.log("preview song: " + songs[i].preview_url);
            console.log("album: " + songs[i].album.name);
            console.log("--------------------------");

        }

    });
};


var getMyBands = function(artist) {
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    request(queryURL, function(error, response, body){
        if (!error && response.statusCode === 200) {
            var jsonData = JSON.parse(body);

            if (!jsonData.length) {
                console.log("No results found for " + artist);
                return;
            }

            console.log("Upcoming concerts for " + artist + ":");

            for (var i=0; i < jsonData.length; i++) {
                var show = jsonData[i];



                console.log(
                    show.venue.city + "," + (show.venue.region || show.venue.country) + " at " + show.venue.name + " " + moment(show.datetime).format("MM/DD/YYYY")
                );
            }
        }
    });
};


var getMeMovie = function(movieName) {
    if (movieName ===  undefined){
        movieName = "Mr Nobody";
    }

    var urlHit =
    "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";

    request(urlHit, function(error, response, body){
        if (!error && response.statusCode === 200){
            var jsonData = JSON.parse(body);
            console.log(jsonData);

            console.log("Title: " +jsonData.Title);
            console.log("Year: " +jsonData.Year);
            console.log("Rated: " +jsonData.Rated);
            console.log("Rating (imbd): " +jsonData.imbdRating);
            console.log("Country: " +jsonData.Country);
            console.log("Language: " +jsonData.Language);
            console.log("Plot: " +jsonData.Plot);
            console.log("Actors: " +jsonData.Actors);
            console.log("RT Rating: " +jsonData.Ratings[1].Value);
        }
    });
};



var doWhatItSays = function() {
    fs.readFile("random.txt", "utf8", function(error, data){
        console.log(data);

        var dataArr = data.split(",");

        if (dataArr.length === 2) {
            pick(dataArr[0], dataArr[1]);
        } else if (dataArr.length === 1) {
            pick(dataArr[0]);
        }
    });
};

var pick = function(caseData, functionData) {
    switch(caseData){
    case "concert-this":
        getMyBands(functionData);
        break;
    case "spotify-this-song":
        getMeSpotify(functionData);
        break;
    case "movie-this":
        getMeMovie(functionData);
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
    console.log("Liri doesn't know that one");
    }
};

var runThis = function(argOne, argTwo){
    pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv.slice(3).join(" "));