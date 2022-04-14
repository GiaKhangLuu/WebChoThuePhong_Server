var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/User/user.model')
const bcrypt = require('bcrypt');


passport.serializeUser((user, done)=> {
    done(null,user.id);
  });
  
passport.deserializeUser((id, done)=>{
    User.findById(id, (err, user)=>{
      done(err,user);
    });
});

   //Passport register
passport.use('local.register', new LocalStrategy({
    usernameField : 'username',
    passswordField : 'password',
    passReqToCallback: true
},(req,username, password, done)=>{
    User.findOne({
    "local.username":username       
  },(err, user)=>{
      if(err){
          return done(err)
      }
      if(user){
          return done(null, false,req.flash(
            'signupMessage','Tài khoản đã được sử dụng, vui lòng chọn tài khoản khác'    
        ))
      }
      let {email,firstname,lastname}=req.body;
      var newUser = new User();
      newUser.local.username = username;
      newUser.local.password = password;
      newUser.local.email = email;
      newUser.infor.firstname = firstname;
      newUser.infor.lastname = lastname;
      bcrypt.hash(password, 10, (err, hash)=> {
            if(err) throw err;
             newUser.local.password=hash;
             newUser.save((err, result)=>{
                if (err) {
                    return done(err);
                } else {                    
                  return done(null, result);            
                }
            });
      });     
  })
}));

/* Passport login */
passport.use('local.login',new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, (req,username,password,done)=>{
    
     User.findOne({ 
        "local.username":username   
     },(err,user)=> {
         if (err) {
             return done(err);
         }
         if(!user){
             return done(null, false, req.flash('loginMessage','Tài khoản này không tồn tại, vui lòng kiểm tra lại.'));
         }
        bcrypt.compare(password,user.local.password,(err,isMacth)=> {
            if (err) {
                return done(err);
            }
            if (!isMacth) {
                return done(null, false, req.flash('loginMessage','Vui lòng kiểm tra lại mật khẩu'));
            }
            return done(null, user);
        });
     })}
));










