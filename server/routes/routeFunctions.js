const sendImgArr = (paramId, index, mainCardData) => {
	// set image url & object to return for get route
	const imgURL = 'http://media.services.zam.com/v1/media/byName/hs/cards/enus/'
	let imgObjGet = [];

	// if parameter is passed in get route, get all card images for cards related to the
	// parameter id in the URI
	if (paramId) {
		// iterate through index
		for (let a in index) {
			// if index attribute matches parameter attribute
			// add that card's url to the imbObjGet object
			if (index[a] === paramId) {
				let cardID = mainCardData[a]["id"];
				let imgURL_Temp = imgURL + cardID + '.png';
				imgObjGet[cardID] = imgURL_Temp;
			}
		}
	}
	// if no parameter provided, send image url for all cards
	else {
		for (let a in index) {
			// add card ID to imgURL and add to imgArr
			let cardID = index[a];
			let imgURL_Temp = imgURL + cardID + '.png';
			imgObjGet.push(imgURL_Temp);
		};
	};
	return imgObjGet;
};

const sendCardArr = (paramId, index, mainCardData) => {
	let cardsReturned = [];
	// iterate through the index
	for (let a in index) {
		// check for match in index
		if (index[a] === paramId) {
			// add cards that match paramId to the returned array
			cardsReturned.push(mainCardData[a]);
		}
	}
	// return array of cards that matched the paramId
	return cardsReturned;
}

const sendCardsByStats = (cost, health, attack, mainCardData) => {
	let matchedCards = [];

	if (cost === "false") {
		cost = false
	}
	if (health === "false") {
		health = false
	}
	if (attack === "false") {
		attack = false
	}

	for(let obj in mainCardData) {

		// checking if all 3 inputs are valid in parameters
		if (cost && health && attack) {
			// checking object versus parameter for 3 valid inputs
			if (mainCardData[obj].cost == cost && mainCardData[obj].health == health && mainCardData[obj].attack == attack) {
				// Find card and push to matchedCards array
				matchedCards.push(mainCardData[obj]);
			}
		}

		// checking if cost & health are valid in parameters
		else if (cost && health) {
			// check object versus parameter for cost & health
			if (mainCardData[obj].cost == cost && mainCardData[obj].health == health) {
				// Find card and push to matchedCards array
				matchedCards.push(mainCardData[obj]);
			}
		}

		// checking if cost & health are valid in parameters
		else if (cost && attack) {
			// check object versus parameter for cost & attack
			if (mainCardData[obj].cost == cost && mainCardData[obj].attack == attack) {
				// Find card and push to matchedCards array
				matchedCards.push(mainCardData[obj]);
			}
		}

		// checking if health & attack are valid in parameters
		else if (health && attack) {
			// check object versus parameter for health & attack
			if (mainCardData[obj].health == health && mainCardData[obj].attack == attack) {
				// Find card and push to matchedCards array
				matchedCards.push(mainCardData[obj]);
			}
		}

		// checking if cost is a valid parameter 
		else if (cost) {
			// check object versus parameter for cost
			if (mainCardData[obj].cost == cost) {
				// Find card and push to matchedCards array
				matchedCards.push(mainCardData[obj]);
			}
		}

		// checking if health is a valid parameter
		else if (health) {
			// check object versus parameter for health
			if (mainCardData[obj].health == health) {
				// Find card and push to matchedCards array
				matchedCards.push(mainCardData[obj]);
			}
		}

		// checking if attack is a valid parameter
		else if (attack) {
			// check object versus parameter for attack
			if (mainCardData[obj].attack == attack) {
				// Find card and push to matchedCards array
				matchedCards.push(mainCardData[obj]);
			}
		}
	};					
	return matchedCards;
};

const indexCards = (targetIndexArray, cardAttribute, mainCardData) => {
	// iterate through main card data
	for (let a in mainCardData) {
		// index the card by attribute called out in function argument
		targetIndexArray.push(mainCardData[a][cardAttribute]);
	}
}

// export functions for use in routes.js
module.exports = {
	sendImgArr: sendImgArr,
	sendCardArr: sendCardArr,
	indexCards: indexCards,
	sendCardsByStats: sendCardsByStats
};
