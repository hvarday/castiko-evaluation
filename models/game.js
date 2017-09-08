var mongoose = require('mongoose');

var numbers = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
	houses = ['heart', 'club', 'spade', 'diamond'];

var card = mongoose.Schema({
	number : { type : String, required : true, enum : numbers },
	house : { type : String, required : true, enum : houses }
},{
	_id : false
})

var gameModel = mongoose.Schema({
	user : { type : mongoose.Schema.Types.ObjectId, required : true },
	cards : [{	type : card }],
	houses : {
		heart 	: [{ type : card }],
		diamond : [{ type : card }],
		club 	: [{ type : card }],
		spade 	: [{ type : card }]
	},
	complete : { type : Boolean, required : true, default : 'false' }
},{
	timestamps : true
})

gameModel.pre('save', function(next){
	var data = this;
	
	if(data.cards === undefined || !data.cards.length)
		Object.assign(data, { cards : createGame() });
	
	console.log(data)
	
	next();
})

function shuffle(data) {
	
	var a = data.slice(0);
	
	for (let i = a.length; i; i--) {
		let j = Math.floor(Math.random() * i);
		[a[i - 1], a[j]] = [a[j], a[i - 1]];
	}
	
	return a;
}

function createGame(){
	console.log("Creating game")
	var cards = [];
	houses.forEach(function(house){
		
		var temp = numbers.map((number)=>{
							return { "house" : house, "number" : number }
						})
		cards = cards.concat(temp)
	})

	console.log('cards', cards)
	var shuffledCards = shuffle(cards);
	shuffledCards = shuffle(shuffledCards);
	shuffledCards = shuffle(shuffledCards);
	console.log('shuffledCards', shuffledCards)
	return shuffledCards;
}

module.exports = mongoose.model('game', gameModel)