// require the original.json object and assign to cards
// create ids list to help index the cards
const cards = require('../../cards.json');
const imgURL = 'http://media.services.zam.com/v1/media/byName/hs/cards/enus/'
const routeFunctions = require('./routeFunctions.js')

// declare functions to be reused from routeFuncions.js in get & post routes
const getCardsIndexed = routeFunctions["indexCards"];
const getImgArr = routeFunctions["sendImgArr"];
const getCardArr = routeFunctions["sendCardArr"];
const getCardStatArr = routeFunctions["sendCardsByStats"];

/*Replace indexes with object mappings*/
// create indexes for card attributes
const cardIdIndexes = [],
	  cardNameIndexes = [], 
	  cardClassIndexes = [],
	  cardTypeIndexes = [],
	  cardRarityIndexes = [],
	  cardCost = [],
	  cardHealth = [],
	  cardAttack = [];

let data = cards["data"];

for (let a in data) {
	data[a].img = imgURL + data[a].id  + '.png';
}

// remove the <b>, </b>, /n & [x] characters from the original .json file
for (let obj in data) {
	let keyName = "text"
	let keyText = String(data[obj][keyName]);

	// create replace all function to replace strings noted above
	// uses regexp 'g' functionality to find all matches in string and replace with ""
	String.prototype.replaceAll = function(search, replacement) {
 		let target = this;
  			return target.replace(new RegExp(search, 'g'), replacement);
	};

	keyText = keyText.replaceAll("<b>", "");
	keyText = keyText.replaceAll("</b>", "");
	keyText = keyText.replaceAll("\n", "");
	keyText = keyText.replaceAll("[x]", "");

	data[obj][keyName] = keyText;

};

function filterByCardClass (className, cardList = data) {
	let returnCardList = [];
	for (let card in cardList) {
		if (typeof cardList[card].cardClass != 'undefined') {
			if (cardList[card].cardClass = className) {
				returnCardList.push(cardList[card]);
			}
		}
	}
	console.log(returnCardList);
	return returnCardList;
}

let cardMap = {};
for (let card in data) {
	cardMap[data[card].id] = data[card];
};

// index the cards by their "id"
getCardsIndexed(cardIdIndexes, "id", data);

// index the cards by their "name"
getCardsIndexed(cardNameIndexes, "name", data);

// index the cards by their "cardClass"
getCardsIndexed(cardClassIndexes, "cardClass", data);
		
// index the cards by their "type"
getCardsIndexed(cardTypeIndexes, "type", data);

// index the cards by their "rarity"
getCardsIndexed(cardRarityIndexes, "rarity", data);

// index the cards by their "cost"
getCardsIndexed(cardCost, "cost", data);

// index the cards by their "health"
getCardsIndexed(cardHealth, "health", data);

// index the cards by their "attack"
getCardsIndexed(cardAttack, "attack", data);


// create routes
module.exports = (app, db) => {

/****************CARD INFO ROUTES****************/

    // get all card information
	app.get('/cards', (req, res) => {
		res.set('Content-Type', 'application/json');
		// res.send(JSON.stringify(data))
		
		let cardList = data;
		let pageNum = req.query.pageNum;
		let pageSize = req.query.pageSize;
		let cardClass = req.params.class;

		if (!pageSize) {
			pageSize = 24;
		}

		if (!pageNum) {
			pageNum = 1;
		}

		// loop through all parameters in the query
		for (param in req.query) {
			switch(param.toLowerCase()) {
				case 'class':
					cardList = filterByCardClass(req.query[param], cardList)
					break;
				default:
					cardList = cardList;
			}
		}

		cardList = cardList.slice((pageNum-1)*pageSize, pageNum*pageSize);

		res.send(JSON.stringify(cardList));
	});

	// get card information based on id
	app.get('/cards/:id', (req, res) => {
		const id = req.params.id;
		// use id indexes to pull correct card from data
		const cardTemp = cardMap[id];

		res.set('Content-Type', 'application/json')
		res.send(JSON.stringify(cardTemp, null, 4));
	});

	// get card information based on name
	app.get('/cards/names/:name', (req, res) => {
		const name = req.params.name;
		// use name indexes to pull correct card from data
		const cardNameIndex = cardNameIndexes.indexOf(name);

		res.set('Content-Type', 'application/json')
		res.send(JSON.stringify(data[cardNameIndex], null, 4));
	});

	// get card information based on card class
	app.get('/cards/class/:cardClass', (req, res) => {
		let cardsByClass = getCardArr(req.params.cardClass, cardClassIndexes, data);

		res.set('Content-Type', 'application/json')
		res.send(JSON.stringify(cardsByClass, null, 4))
	});

	// get card information based on type
	app.get('/cards/types/:cardType', (req, res) => {
		let cardsByType = getCardArr(req.params.cardType, cardTypeIndexes, data);

		res.set('Content-Type', 'application/json')
		res.send(JSON.stringify(cardsByType, null, 4))
	});

	// get card information based on rarity
	app.get('/cards/rarity/:rarity', (req, res) => {
		let cardsByRarity = getCardArr(req.params.rarity, cardRarityIndexes, data);

		res.set('Content-Type', 'application/json')
		res.send(JSON.stringify(cardsByRarity, null, 4))
	});

	// get card information based on stats
	app.get('/cards/stats/:cost/:health/:attack', (req, res) => {
		let cardsByStat = getCardStatArr(req.params.cost, req.params.health, req.params.attack, data);

		res.set('Content-Type', 'application/json')
		res.send(JSON.stringify(cardsByStat, null, 4))
	});

/****************CARD IMAGE ROUTES****************/

	// get all card image urls
	app.get('/cards/imgs/all/:class', (req, res) => {
		
		let imgObjSend = getImgArr(false, cardIdIndexes, data);
		let pageNum = req.query.pageNum;
		let pageSize = req.query.pageSize;
		let cardClass = req.params.class;

		if (!pageSize) {
			pageSize = 24;
		}

		if (!pageNum) {
			pageNum = 1;
		}

		imgObjSend = imgObjSend.slice((pageNum-1)*pageSize, pageNum*pageSize);

		res.set('Content-Type', 'application/json');
		res.send(JSON.stringify(imgObjSend), null, 4);
	});

	// get card image url based on id
	app.get('/cards/imgs/:id', (req, res) => {
		const id = req.params.id;
		const imgURL_Temp = imgURL + id + '.png';
		
		let arr = {};
		arr["url"] = imgURL_Temp

		res.set('Content-Type', 'application/json');
		res.json(arr);
	});

	// get card image url based on class
	app.get('/cards/imgs/class/:cardClass', (req, res) => {
		let imgObjClass = getImgArr(req.params.cardClass, cardClassIndexes, data);

		res.set('Content-Type', 'application/json');
		res.send(JSON.stringify(imgObjClass), null, 4);
	});

	// get card image url based on type
	app.get('/cards/imgs/types/:cardType', (req, res) => {
		let imgObjType = getImgArr(req.params.cardType, cardTypeIndexes, data);

		res.set('Content-Type', 'application/json')
		res.send(JSON.stringify(imgObjType, null, 4))
	});

	// get card image url based on rarity
	app.get('/cards/imgs/rarity/:rarity', (req, res) => {
		let imgObjRarity = getImgArr(req.params.rarity, cardRarityIndexes, data);

		res.set('Content-Type', 'application/json')
		res.send(JSON.stringify(imgObjRarity, null, 4))
	});

/****************CARD POST ROUTES****************/

	// post information for new card
	app.post('/cards', (req, res) => {
		res.send()
	});
};