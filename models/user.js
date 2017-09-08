var mongoose = require('mongoose'),
	bcrypt = require("bcrypt"),
	saltRounds = 10;

var userModel = mongoose.Schema({
	name : { type : String, required : true },
	email : { type : String, required : true },
	password :  { type : String, required : true }
})

userModel.pre('save', function(next) {
	console.log("HASHING")	
	var data = this;
	bcrypt.hash(data.password, saltRounds)
	.then(function(hash) {
		data.password = hash;
		console.log("hash", hash)
		next();
	})
	.catch(function(err){
		console.log("err in hashing", err);
		next(err);
	})
	
});

userModel.methods.verifyPassword = function (pass) {
    return bcrypt.compare(pass, this.password);
};

module.exports = mongoose.model('user', userModel);