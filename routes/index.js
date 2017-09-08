var express = require('express'),
	passport = require('passport'),
    router = express.Router(),
    userModel = require('../models/user')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/login')
});

router.route('/signup')
.get(function(req, res, next){
    res.render('signup')
})
.post(function(req, res, next){
    console.log(req.body);
    
    new userModel(req.body).save()
    .then(function(doc){
        console.log("SUCCESS", doc)
        req.flash('signup', 'Successful Signup - ' + req.body.email);
        res.redirect('/login')
    })
    .catch(next)
    
})

router.route('/logout')
.get(function(req, res, next){
	
	req.logout();
	res.redirect('/');

})


router.route('/login')
.get(function(req, res, next){
    res.render('login', { errorMessage : req.flash('error'), successMessage : req.flash('signup') })
})
.post(passport.authenticate('local', { failureRedirect : '/login', failureFlash : true }), function(req, res){
    res.redirect("/home");
})

module.exports = router;
