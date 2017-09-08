var router = require('express').Router(),
	utility = require('../utility/utility'),
	gameModel = require('../models/game');

router.use(utility.authCheck())

router.route('/')
.get(function(req, res, next){
	
	gameModel.findOne({ user : req.user._id, complete : false })
	.then(function(doc){
		res.json(doc);
	})
	.catch(next);

})
.post(function(req, res, next){
	
	new gameModel({
		user : req.user._id
	}).save()
	.then(function(doc){
		res.json(doc)
	})
	.catch(next);
	
})
.put(function(req, res, next){
	
	gameModel.update({ _id : req.body._id}, req.body)
	.then(function(doc){
		res.json();
	})
	.catch(next);
	
})

module.exports = router;