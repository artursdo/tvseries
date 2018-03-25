var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
  username: { type : String , unique : true, required : true, dropDups: true },
  email: String,
  avatar_path: String,
  passport: String
},
{ usePushEach: true });


// UserSchema.methods.validPassword = function(password) {
//
//   hash( password, this.salt, function (err, hash) {
//     return ( this.hash === hash );
//         });
//
// };

UserSchema.plugin(passportLocalMongoose, {usernameField: 'email'});

module.exports = mongoose.model("User", UserSchema);
