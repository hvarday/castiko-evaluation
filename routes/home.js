var router = require('express').Router(),
	utility = require('../utility/utility')

router.use(utility.authCheck())

router.route('/')
.get(function(req, res, next){
	res.render('home')
})

module.exports = router;