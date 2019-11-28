const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const ModelUser = require('../models/user');


module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            //find user
            ModelUser.findOne({ email: email })
                .then(user => {
                    if(!user){
                        return done(null, false, {msg : 'Pas de compte associé a cette email'});
                    }

                    //Found
                    bcrypt.compare(password, user.password, (err, isMatch)=>{
                        if(err) throw err;
                        //Found plus Match returning no err and the user
                        if(isMatch){
                            return done(null, user);
                        }else{
                            //Found but password is incorrect
                            return done(null, false, {msg : 'Mot de passe incorrect'});
                        }
                    });
                })
                .catch(err => console.log(err));
        })
    )
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        ModelUser.findById(id, function(err, user) {
          done(err, user);
        });
      });
}