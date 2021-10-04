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

var connectionData = {
	lastPlayer1Poll: new Date().getTime(),
	lastPlayer2Poll: new Date().getTime()
}

var deckData = {
	playDeck: [],
	terrainDeck: []
}



function shuffleDeck() {
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
}

function initGame() {
	gameData.turn = 1;
	gameData.round = 1;
	gameData.reveal = false;
	gameData.player1PlayCard = -1;
	gameData.player1RevealCard = -1;
	gameData.player2PlayCard = -1;
	gameData.player2RevealCard = -1;
	gameData.player1Ready = false;
	gameData.player2Ready = false;
}

app.get("/setUserID/:userid", (req, res) => {
	
	if (gameData.player1UID == "")
	{
		shuffleDeck();
		gameData.player1UID = req.params["userid"];
		console.log("User " + gameData.player1UID + " connected as player 1");
		connectionData.lastPlayer1Poll = new Date().getTime();
	}
	else if (gameData.player2UID == "")
	{
		gameData.player2UID = req.params["userid"];
		console.log("User " + gameData.player2UID + " connected as player 2");
		connectionData.lastPlayer2Poll = new Date().getTime();
	}
	
	res.json(gameData);
	
});

// Update the count down every 1 second
var x = setInterval(function() {
	var now = new Date().getTime();
	
	if ((gameData.player1UID != "") && (now - connectionData.lastPlayer1Poll > 10000))
	{
		gameData.player1UID = "";
		gameData.player2UID = "";
		initGame();
		console.log("Player 1 is timed out.  Restarting game.");
	}
	
	if ((gameData.player2UID != "") && (now - connectionData.lastPlayer2Poll > 10000))
	{
		gameData.player1UID = "";
		gameData.player2UID = "";
		initGame();
		console.log("Player 2 is timed out.  Restarting game.");
	}
}, 1000);

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
		if (gameData.turn == 5 && gameData.round == 1)
			console.log("End of round");
		else if (gameData.turn == 3 && gameData.round == 2)
			console.log("End of game");
		else
			console.log("Reveal phase");
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
	if (gameData.player1RevealCard != -1 && gameData.player2RevealCard != -1)
	{
		gameData.reveal = false;
		console.log("Play phase");
		gameData.turn++;
		console.log("Turn: " + gameData.turn);
	}
	
});

app.get("/setReady/:userid", (req, res) => {
	var userid = req.params["userid"];
	if (gameData.player1UID == userid)
	{
		gameData.player1Ready = true;
		console.log("Player 1 is ready for next round");
	}
	else if (gameData.player2UID == userid)
	{
		gameData.player2Ready = true;
		console.log("Player 2 is ready for next round");
	}
	
	//both players are ready for next round
	if (gameData.player1Ready == true && gameData.player2Ready == true && gameData.round == 1)
	{
		gameData.turn = 1;
		gameData.round = 2;
		gameData.reveal = false;
		gameData.player1PlayCard = -1;
		gameData.player1RevealCard = -1;
		gameData.player2PlayCard = -1;
		gameData.player2RevealCard = -1;
		gameData.player1Ready = false;
		gameData.player2Ready = false;
		console.log("Proceeding to next round");
	}
	else if (gameData.player1Ready == true && gameData.player2Ready == true && gameData.round == 2)
	{
		initGame();
		shuffleDeck();
	}
});

app.get("/gamedata/:userid", (req, res) => {
	
	var userid = req.params["userid"];
	
	if (gameData.player1UID == userid)
	{
		connectionData.lastPlayer1Poll = new Date().getTime();
	}
	else if (gameData.player2UID == userid)
	{
		connectionData.lastPlayer2Poll = new Date().getTime();
	}
	res.json(gameData);
});

app.listen( 8123, () => {
	console.log("Server has started!");
});
