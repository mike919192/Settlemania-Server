
class GameData {
	constructor() {
		this.turn = 1;
		this.round = 1;
		this.reveal = 0;
		this.player1PlayCard = -1;
		this.player1RevealCard = -1;
		this.player2PlayCard = -1;
		this.player2RevealCard = -1;
		this.player1Ready = false;
		this.player2Ready = false;
	}
  
	InitGame() {
		this.turn = 1;
		this.round = 1;
		this.reveal = 0;
		this.player1PlayCard = -1;
		this.player1RevealCard = -1;
		this.player2PlayCard = -1;
		this.player2RevealCard = -1;
		this.player1Ready = false;
		this.player2Ready = false;
	}
	
	CheckEqual(otherData) {
		if (this.turn == otherData.turn &&
			this.round == otherData.round &&
			this.reveal == otherData.reveal &&
			this.player1PlayCard == otherData.player1PlayCard &&
			this.player1RevealCard == otherData.player1RevealCard &&
			this.player2PlayCard == otherData.player2PlayCard &&
			this.player2RevealCard == otherData.player2RevealCard)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
}

class DeckData {
	constructor() {
		this.playDeck = [];
		this.terrainDeck = [];
	}
	
	ShuffleDeck() {
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
			this.playDeck[i] = tempPlayDeck.splice(index, 1);
		}

		console.log(this.playDeck.toString());

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
			this.terrainDeck[i] = tempTerrainDeck.splice(index, 1);
		}

		console.log(this.terrainDeck.toString());
	}
}

class ConnectionData {
	constructor() {
		this.player1UID = "";
		this.player2UID = "";		
		this.lastPlayer1Poll = new Date().getTime();
		this.lastPlayer2Poll = new Date().getTime();
	}
}

class GameInstance {
	constructor() {
		this.gameUID = this.GetRandomUID();
		this.numPlayers = 0;
		this.gameData = new GameData();	
		this.player1GameData = new GameData();
		this.player2GameData = new GameData();
		this.connectionData = new ConnectionData();
		this.deckData = new DeckData();
	}
	
	GetRandomUID() {
		const allowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		
		let buildString = "";
		
		for (let i = 0; i < 10; i++)
        {
            var index = Math.floor(Math.random() * allowedChars.length)

            buildString += allowedChars[index];
        }
        
        return buildString;
	}
	
	GetConnectionData(userid) {
		if (this.connectionData.player1UID == userid)
		{
			this.connectionData.lastPlayer1Poll = new Date().getTime();
			return this.connectionData;
		}
		else if (this.connectionData.player2UID == userid)
		{
			this.connectionData.lastPlayer2Poll = new Date().getTime();
			return this.connectionData;
		}
		else
		{	
			//user ID is not in this game
			return null;
		}	
	}
	
	GetGameData(userid) {
		if (this.connectionData.player1UID == userid)
		{
			this.connectionData.lastPlayer1Poll = new Date().getTime();
			return this.gameData;
		}
		else if (this.connectionData.player2UID == userid)
		{
			this.connectionData.lastPlayer2Poll = new Date().getTime();
			return this.gameData;
		}
		else
		{	
			//user ID is not in this game
			return null;
		}
	}
	
	SetReady(userid) {
		if (this.connectionData.player1UID == userid)
		{
			this.gameData.player1Ready = true;
			console.log("Player 1 is ready for next round");
		}
		else if (this.connectionData.player2UID == userid)
		{
			this.gameData.player2Ready = true;
			console.log("Player 2 is ready for next round");
		}
		else
		{	
			//user ID is not in this game
			return null;
		}
		
		//both players are ready for next round
		if (this.gameData.player1Ready == true && this.gameData.player2Ready == true && this.gameData.round == 1)
		{
			this.gameData.turn = 1;
			this.gameData.round = 2;
			this.gameData.reveal = 0;
			this.gameData.player1PlayCard = -1;
			this.gameData.player1RevealCard = -1;
			this.gameData.player2PlayCard = -1;
			this.gameData.player2RevealCard = -1;
			this.gameData.player1Ready = false;
			this.gameData.player2Ready = false;
			console.log("Proceeding to next round");
		}
		else if (this.gameData.player1Ready == true && this.gameData.player2Ready == true && this.gameData.round == 2)
		{
			console.log("Proceeding to next game");
			this.gameData.InitGame();
			this.deckData.ShuffleDeck();
		}
		
		return 0;
	}
	
	SetRevealCard(userid, revealCard) {
		if (this.connectionData.player1UID == userid)
		{
			this.gameData.player1RevealCard = revealCard;
			this.gameData.player1PlayCard = -1;
			console.log("User " + this.connectionData.player1UID + " revealed card " + this.gameData.player1RevealCard);
		}
		else if (this.connectionData.player2UID == userid)
		{
			this.gameData.player2RevealCard = revealCard;
			this.gameData.player2PlayCard = -1;
			console.log("User " + this.connectionData.player2UID + " revealed card " + this.gameData.player2RevealCard);
		}
		else
		{	
			//user ID is not in this game
			return null;
		}
		
		return 0;	
	}
	
	SetPlayCard(userid, playCard) {
		if (this.connectionData.player1UID == userid)
		{
			this.gameData.player1PlayCard = playCard;
			this.gameData.player1RevealCard = -1;
			console.log("User " + this.connectionData.player1UID + " played card " + this.gameData.player1PlayCard);
		}
		else if (this.connectionData.player2UID == userid)
		{
			this.gameData.player2PlayCard = playCard;
			this.gameData.player2RevealCard = -1;
			console.log("User " + this.connectionData.player2UID + " played card " + this.gameData.player2PlayCard);
		}
		else
		{	
			//user ID is not in this game
			return null;
		}
		
		return 0;	
	}
	
	GetDeckData(userid) {
		if (this.connectionData.player1UID == userid ||
			this.connectionData.player2UID == userid)
		{
			return this.deckData;
		}
		else
		{	
			//user ID is not in this game
			return null;
		}	
	}
	
	CheckTimeout() {
		var now = new Date().getTime();
		
		if ((this.connectionData.player1UID != "") && (now - this.connectionData.lastPlayer1Poll > 10000))
		{
			this.connectionData.player1UID = "";
			this.connectionData.player2UID = "";
			this.gameData.InitGame();
			console.log("Player 1 is timed out.  Restarting game.");
		}
		
		if ((this.connectionData.player2UID != "") && (now - this.connectionData.lastPlayer2Poll > 10000))
		{
			this.connectionData.player1UID = "";
			this.connectionData.player2UID = "";
			this.gameData.InitGame();
			console.log("Player 2 is timed out.  Restarting game.");
		}
	}
	
	SetUserID(userid) {
		if (this.connectionData.player1UID == "")
		{
			this.deckData.ShuffleDeck();
			this.connectionData.player1UID = userid;
			console.log("User " + this.connectionData.player1UID + " connected as player 1");
			this.connectionData.lastPlayer1Poll = new Date().getTime();
		}
		else if (this.connectionData.player2UID == "")
		{
			this.connectionData.player2UID = userid;
			console.log("User " + this.connectionData.player2UID + " connected as player 2");
			this.connectionData.lastPlayer2Poll = new Date().getTime();
		}
		else
		{
			//room is full
			return null;
		}
		
		return this.connectionData;
	}
	
	SendGameData(userid, 
		turn, 
		round, 
		reveal, 
		player1PlayCard, 
		player1RevealCard, 
		player2PlayCard, 
		player2RevealCard)
	{
		if (this.connectionData.player1UID == userid)
		{
			this.player1GameData.turn = turn;
			this.player1GameData.round = round;
			this.player1GameData.reveal = reveal;
			this.player1GameData.player1PlayCard = player1PlayCard;
			this.player1GameData.player1RevealCard = player1RevealCard;
			this.player1GameData.player2PlayCard = player2PlayCard;
			this.player1GameData.player2RevealCard = player2RevealCard;
		}
		else if (this.connectionData.player2UID == userid)
		{
			this.player2GameData.turn = turn;
			this.player2GameData.round = round;
			this.player2GameData.reveal = reveal;
			this.player2GameData.player1PlayCard = player1PlayCard;
			this.player2GameData.player1RevealCard = player1RevealCard;
			this.player2GameData.player2PlayCard = player2PlayCard;
			this.player2GameData.player2RevealCard = player2RevealCard;
		}
		else
		{	
			//user ID is not in this game
			return null;
		}
		
		//check that players and server are in sync before proceeding
		if (this.player1GameData.CheckEqual(this.player2GameData) && this.player2GameData.CheckEqual(this.gameData))
		{
			if (this.gameData.reveal == 0)
			{
				//both players have made their selection
				if (this.gameData.player1PlayCard != -1 && this.gameData.player2PlayCard != -1)
				{
					this.gameData.reveal = 1;
					if (this.gameData.turn == 5 && this.gameData.round == 1)
						console.log("End of round");
					else if (this.gameData.turn == 3 && this.gameData.round == 2)
						console.log("End of game");
					else
						console.log("Reveal phase");
				}
			}
			else
			{
				//both players have made their selection
				if (this.gameData.player1RevealCard != -1 && this.gameData.player2RevealCard != -1)
				{
					this.gameData.reveal = 0;
					console.log("Play phase");
					this.gameData.turn++;
					console.log("Turn: " + this.gameData.turn);
				}
			}
		}
		
		return 0;
	}
}
	

module.exports = {
  GameData : GameData,
  DeckData : DeckData,
  ConnectionData : ConnectionData,
  GameInstance : GameInstance
}
