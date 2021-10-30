
const GameClasses = require("./gameStateClasses");

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

const gameInstance = new GameClasses.GameInstance();


app.get("/sendGameData/:userid/:turn/:round/:reveal/:player1PlayCard/:player1RevealCard/:player2PlayCard/:player2RevealCard", (req, res) => {
	
	var userid = req.params["userid"];
	
	let sendGameDataResult = gameInstance.SendGameData(
		req.params["userid"],
		req.params["turn"],
		req.params["round"],
		req.params["reveal"],
		req.params["player1PlayCard"],
		req.params["player1RevealCard"],
		req.params["player2PlayCard"],
		req.params["player2RevealCard"]);
		
	if (sendGameDataResult !== null)
	{
		res.json();
	}
	else
	{
		res.status(409).json({error: "You are not in this game"});
	}	
	
});

app.get("/setUserID/:userid", (req, res) => {
	
	var userid = req.params["userid"];
	
	let setUserIDResult = gameInstance.SetUserID(userid);
	
	if (setUserIDResult !== null)
	{
		res.json(setUserIDResult);
	}
	else
	{
		res.status(409).json({error: "You are not in this game"});
	}	
});

// Update the count down every 1 second
var x = setInterval(function() {
	
	gameInstance.CheckTimeout();
	
}, 1000);

app.get("/getDeckData/:userid", (req, res) => {
	
	var userid = req.params["userid"];
	
	let getDeckResult = gameInstance.GetDeckData(userid);
	
	if (getDeckResult !== null)
	{
		res.json(getDeckResult);
	}
	else
	{
		res.status(409).json({error: "You are not in this game"});
	}
});

app.get("/setPlayCard/:userid/:playCard", (req, res) => {
	
	var userid = req.params["userid"];
	var playCard = req.params["playCard"];
	
	let setPlayCardResult = gameInstance.SetPlayCard(userid, playCard);
	
	if (setPlayCardResult !== null)
	{
		res.json();
	}
	else
	{
		res.status(409).json({error: "You are not in this game"});
	}
	
});

app.get("/setRevealCard/:userid/:revealCard", (req, res) => {
	
	var userid = req.params["userid"];
	var revealCard = req.params["revealCard"];
	
	let setRevealCardResult = gameInstance.SetRevealCard(userid, revealCard);
	
	if (setRevealCardResult !== null)
	{
		res.json();
	}
	else
	{
		res.status(409).json({error: "You are not in this game"});
	}	
});

app.get("/setReady/:userid", (req, res) => {
	var userid = req.params["userid"];
	
	let setReadyResult = gameInstance.SetReady(userid);
	
	if (setReadyResult !== null)
	{
		res.json();
	}
	else
	{
		res.status(409).json({error: "You are not in this game"});
	}
	
});

app.get("/getGameData/:userid", (req, res) => {
	
	var userid = req.params["userid"];
	
	let gameData = gameInstance.GetGameData(userid);
	
	if (gameData !== null)
	{
		res.json(gameData);		
	}
	else
	{
		//user ID is not in this game
		res.status(409).json({error: "You are not in this game"});
	}
});

app.get("/getConnectionData/:userid", (req, res) => {
	
	var userid = req.params["userid"];
	
	let connectionData = gameInstance.GetConnectionData(userid);
	
	if (connectionData !== null)
	{
		res.json(connectionData);		
	}
	else
	{
		//user ID is not in this game
		res.status(409).json({error: "You are not in this game"});
	}
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
