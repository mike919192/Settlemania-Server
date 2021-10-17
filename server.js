
const GameState = require("./gameStateClasses");

const fs = require('fs');
const https = require('https');
const homedir = require('os').homedir();
const privateKey  = fs.readFileSync(homedir + '/certs/privkey.pem', 'utf8');
const certificate = fs.readFileSync(homedir + '/certs/fullchain.pem', 'utf8');

const credentials = {key: privateKey, cert: certificate};

const express = require("express");
const app = express();

const compression = require('compression');
const cors = require('cors');

const serveCount = 0;

app.use(cors());
app.use(compression());

const httpsServer = https.createServer(credentials, app);

app.use(express.static(__dirname + "/client/", {
	index: false
}));

const gameData = new GameState.GameData();

const player1GameData = new GameState.GameData();

const player2GameData = new GameState.GameData();

const connectionData = new GameState.ConnectionData();

const deckData = new GameState.DeckData();

app.get("/sendGameData/:userid/:turn/:round/:reveal/:player1PlayCard/:player1RevealCard/:player2PlayCard/:player2RevealCard", (req, res) => {
	
	var userid = req.params["userid"];
	if (connectionData.player1UID == userid)
	{
		player1GameData.turn = req.params["turn"];
		player1GameData.round = req.params["round"];
		player1GameData.reveal = req.params["reveal"];
		player1GameData.player1PlayCard = req.params["player1PlayCard"];
		player1GameData.player1RevealCard = req.params["player1RevealCard"];
		player1GameData.player2PlayCard = req.params["player2PlayCard"];
		player1GameData.player2RevealCard = req.params["player2RevealCard"];
	}
	else if (connectionData.player2UID == userid)
	{
		player2GameData.turn = req.params["turn"];
		player2GameData.round = req.params["round"];
		player2GameData.reveal = req.params["reveal"];
		player2GameData.player1PlayCard = req.params["player1PlayCard"];
		player2GameData.player1RevealCard = req.params["player1RevealCard"];
		player2GameData.player2PlayCard = req.params["player2PlayCard"];
		player2GameData.player2RevealCard = req.params["player2RevealCard"];
	}
	
	//check that players and server are in sync before proceeding
	if (player1GameData.CheckEqual(player2GameData) && player2GameData.CheckEqual(gameData))
	{
		if (gameData.reveal == 0)
		{
			//both players have made their selection
			if (gameData.player1PlayCard != -1 && gameData.player2PlayCard != -1)
			{
				gameData.reveal = 1;
				if (gameData.turn == 5 && gameData.round == 1)
					console.log("End of round");
				else if (gameData.turn == 3 && gameData.round == 2)
					console.log("End of game");
				else
					console.log("Reveal phase");
			}
		}
		else
		{
			//both players have made their selection
			if (gameData.player1RevealCard != -1 && gameData.player2RevealCard != -1)
			{
				gameData.reveal = 0;
				console.log("Play phase");
				gameData.turn++;
				console.log("Turn: " + gameData.turn);
			}
		}
	}
	res.json();
});

app.get("/setUserID/:userid", (req, res) => {
	
	if (connectionData.player1UID == "")
	{
		deckData.ShuffleDeck();
		connectionData.player1UID = req.params["userid"];
		console.log("User " + connectionData.player1UID + " connected as player 1");
		connectionData.lastPlayer1Poll = new Date().getTime();
	}
	else if (connectionData.player2UID == "")
	{
		connectionData.player2UID = req.params["userid"];
		console.log("User " + connectionData.player2UID + " connected as player 2");
		connectionData.lastPlayer2Poll = new Date().getTime();
	}
	
	res.json(connectionData);
	
});

// Update the count down every 1 second
var x = setInterval(function() {
	var now = new Date().getTime();
	
	if ((connectionData.player1UID != "") && (now - connectionData.lastPlayer1Poll > 10000))
	{
		connectionData.player1UID = "";
		connectionData.player2UID = "";
		gameData.InitGame();
		console.log("Player 1 is timed out.  Restarting game.");
	}
	
	if ((connectionData.player2UID != "") && (now - connectionData.lastPlayer2Poll > 10000))
	{
		connectionData.player1UID = "";
		connectionData.player2UID = "";
		gameData.InitGame();
		console.log("Player 2 is timed out.  Restarting game.");
	}
}, 1000);

app.get("/deckData/", (req, res) => {
	
	res.json(deckData);
	
});

app.get("/setPlayCard/:userid/:playCard", (req, res) => {
	
	var userid = req.params["userid"];
	if (connectionData.player1UID == userid)
	{
		gameData.player1PlayCard = req.params["playCard"];
		gameData.player1RevealCard = -1;
		console.log("User " + connectionData.player1UID + " played card " + gameData.player1PlayCard);
	}
	else if (connectionData.player2UID == userid)
	{
		gameData.player2PlayCard = req.params["playCard"];
		gameData.player2RevealCard = -1;
		console.log("User " + connectionData.player2UID + " played card " + gameData.player2PlayCard);		
	}
	
	res.json();
	
});

app.get("/setRevealCard/:userid/:revealCard", (req, res) => {
	
	var userid = req.params["userid"];
	if (connectionData.player1UID == userid)
	{
		gameData.player1RevealCard = req.params["revealCard"];
		gameData.player1PlayCard = -1;
		console.log("User " + connectionData.player1UID + " revealed card " + gameData.player1RevealCard);
	}
	else if (connectionData.player2UID == userid)
	{
		gameData.player2RevealCard = req.params["revealCard"];
		gameData.player2PlayCard = -1;
		console.log("User " + connectionData.player2UID + " revealed card " + gameData.player2RevealCard);		
	}
	
	res.json();
	
});

app.get("/setReady/:userid", (req, res) => {
	var userid = req.params["userid"];
	if (connectionData.player1UID == userid)
	{
		gameData.player1Ready = true;
		console.log("Player 1 is ready for next round");
	}
	else if (connectionData.player2UID == userid)
	{
		gameData.player2Ready = true;
		console.log("Player 2 is ready for next round");
	}
	
	//both players are ready for next round
	if (gameData.player1Ready == true && gameData.player2Ready == true && gameData.round == 1)
	{
		gameData.turn = 1;
		gameData.round = 2;
		gameData.reveal = 0;
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
		gameData.InitGame();
		deckData.ShuffleDeck();
	}
	
	res.json();
});

app.get("/gamedata/:userid", (req, res) => {
	
	var userid = req.params["userid"];
	
	if (connectionData.player1UID == userid)
	{
		connectionData.lastPlayer1Poll = new Date().getTime();
	}
	else if (connectionData.player2UID == userid)
	{
		connectionData.lastPlayer2Poll = new Date().getTime();
	}
	res.json(gameData);
});

app.get("/", (req, res) => {
	serveCount++;
	console.log("Content served to " + serveCount);
	//res.setHeader('Content-Encoding', 'gzip');
	res.sendFile(__dirname + "/client/index.html");
});

httpsServer.listen( 8030, () => {
	console.log("Server has started!");
});
