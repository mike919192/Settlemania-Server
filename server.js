// This is the entry point for our whole application

var express = require("express");

var app = express();

var gameData = {
	player1UID: "",
	player2UID: "",
	turn: 1,
	round: 1,
	reveal: false,
	player1PlayCard: -1,
	player1RevealCard: -1,
	player2PlayCard: -1,
	player2RevealCard: -1
}

var deckData = {
	playDeck: [],
	terrainDeck: []
}

console.log("Shuffling play deck");
const playDeckSize = 30;
const tempPlayDeck = [];

for (let i = 0; i < playDeckSize; i++)
{
	tempPlayDeck[i] = i;
}

for (let i = 0; i < playDeckSize; i++)
{
	var index = Math.floor(Math.random() * tempPlayDeck.length)
	deckData.playDeck[i] = tempPlayDeck.splice(index, 1);
}

console.log(deckData.playDeck.toString());

console.log("Shuffling terrain deck");
const terrainDeckSize = 15;
const tempTerrainDeck = [];

for (let i = 0; i < terrainDeckSize; i++)
{
	tempTerrainDeck[i] = i;
}

for (let i = 0; i < terrainDeckSize; i++)
{
	var index = Math.floor(Math.random() * tempTerrainDeck.length)
	deckData.terrainDeck[i] = tempTerrainDeck.splice(index, 1);
}

console.log(deckData.terrainDeck.toString());

app.get("/setUserID/:userid", (req, res) => {
	
	if (gameData.player1UID == "")
	{
		gameData.player1UID = req.params["userid"];
		gameData.turn = 1;
		gameData.round = 1;
		gameData.reveal = false;
		console.log("User " + gameData.player1UID + " connected as player 1");
	}
	else
	{
		gameData.player2UID = req.params["userid"];
		gameData.turn = 1;
		gameData.round = 1;
		gameData.reveal = false;
		console.log("User " + gameData.player2UID + " connected as player 2");
	}
	
	res.json(gameData);
	
});

app.get("/deckData/", (req, res) => {
	
	res.json(deckData);
	
});

app.get("/setPlayCard/:userid/:playCard", (req, res) => {
	
	var userid = req.params["userid"];
	if (gameData.player1UID == userid)
	{
		gameData.player1PlayCard = req.params["playCard"];
		gameData.player1RevealCard = -1;
		console.log("User " + gameData.player1UID + " played card " + gameData.player1PlayCard);
	}
	else if (gameData.player2UID == userid)
	{
		gameData.player2PlayCard = req.params["playCard"];
		gameData.player2RevealCard = -1;
		console.log("User " + gameData.player2UID + " played card " + gameData.player2PlayCard);		
	}
	
	//both players have made their selection
	if (gameData.player1PlayCard != -1 && gameData.player2PlayCard != -1)
	{
		gameData.reveal = true;
	}
	
});

app.get("/setRevealCard/:userid/:revealCard", (req, res) => {
	
	var userid = req.params["userid"];
	if (gameData.player1UID == userid)
	{
		gameData.player1RevealCard = req.params["revealCard"];
		gameData.player1PlayCard = -1;
		console.log("User " + gameData.player1UID + " revealed card " + gameData.player1RevealCard);
	}
	else if (gameData.player2UID == userid)
	{
		gameData.player2RevealCard = req.params["revealCard"];
		gameData.player2PlayCard = -1;
		console.log("User " + gameData.player2UID + " revealed card " + gameData.player2RevealCard);		
	}
	
	//both players have made their selection
	if (gameData.player1PlayCard != -1 && gameData.player2PlayCard != -1)
	{
		gameData.reveal = false;
	}
	
});

app.get("/gamedata/", (req, res) => {
	
	res.json(gameData);
});

app.listen( 8123, () => {
	console.log("Server has started!");
});
