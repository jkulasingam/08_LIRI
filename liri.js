var reqKeys = require("./keys.js");
var fs = require("fs");
var twitter = require('twitter');
var spotify = require('node-spotify-api');
var request = require('request');

var myTweets = function() {
	var client = new twitter(datakeys.twitterKeys);
	var params = { screen_name: 'jkulasingam', count: 20};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {
			var data =[];
			for (var i = 0; i < tweets.length; i++) {
				data.push({
					'created at: ' : tweets[i].created_at,
					'Tweets: ' : tweets[i].text,
				});
			};
			console.log(data);
			appendLog(data);
		};
	});
};

var appendLog = function(data) {
	fs.appendFile("log.txt");
	fs.appendFile("log.txt", JSON.stringify(data), function(err) {
		if (err) {
			return console.log(err);
		};

		console.log("========\nlog.txt updated\n========");
	});
};

var srchSpotify = function(songName) {
	if (songName === undefined) {
		songName = 'The Sign';
	};

	spotify.search({ type: 'track', query: songName }, function(err, data) {
		if (err) {
			console.log("Error: " + err);
			return;
		};

		var songs = data.tracks.items;
		var data = [];
		for (var i = 0; i < songs.length; i++) {
			data.push({
				'artist(s)': songs[i].artists.map(getArtistNames),
				'song name: ': songs[i].name,
				'preview song: ': songs[i].preview_url,
				'album: ':songs[i].album.name,
			});
		};
		console.log(data);
		appendLog(data);
	});
};

var srchOMDB = function(movieName) {
	if (movieName === undefined) {
		movieName = "Mr. Nobody";
	};

	var urlHit = "http://www.omdbapi.com/?apikey=40e9cece&t=" + movieName + "&y=&plot=full&tomatoes=true&r=json";
	request(urlHit, function(error, response, body) {
		if(!error && response.statusCode == 200) {
			var data = [];
			var jsonData = JSON.parse(body);
			data.push({
				'Title: ' : jsonData.Title,
				'Year: ' : jsonData.Year,
				'IMDB Rating: ' : jsonData.imdbRating,
				'Tomato Rating: ' : jsonData.tomatoRating,
				'Country: ' : jsonData.Country,
				'Language: ' : jsonData.Language,
				'Plot: ' : jsonData.Plot,
				'Actors: ' : jsonData.Actors,
			});

			console.log(data);
			appendLog(data);
		};
	});
};

var doWhatItSays = function() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		console.log(data);
		appendLog(data);

		var dataArr = data.split(',');
		if (dataArr.length == 2) {
			pick(dataArr [0], dataArr[1]);
		} else if (dataArr.length == 1) {
			pick(dataArr[0]);
		};
	});
};

var pick = function(caseData, functionData) {
	switch (caseData) {
		case 'my-tweets' :
			myTweets();
			break;
		case 'spotify-this-song' :
			srchSpotify();
			break;
		case 'movie-this' :
			srchOMDB();
			break;
		case 'do-what-it-says' :
			doWhatItSays();
			break;
		default:
			console.log("I'm sorry, Dave, but I'm afraid I can't do that.");	
	};
};

var runThis = function(argOne, argTwo) {
	pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);




















