
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

module.exports = {
  GameData : GameData,
  DeckData : DeckData,
  ConnectionData : ConnectionData
}
