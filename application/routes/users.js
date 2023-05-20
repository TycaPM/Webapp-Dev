var express = require('express');
var router = express.Router();
var db = require('../conf/database');
var bcrypt = require('bcrypt');
var {isLoggedIn, isMyProfile} = require("../middleware/auth");
const { isUsernameUnique, usernameCheck } = require('../middleware/mvalidation');
const { isEmailUnique, emailCheck } = require('../middleware/mvalidation');
const { passwordCheck } = require('../middleware/mvalidation');
const { tosCheck, ageCheck } = require('../middleware/mvalidation');
const { default: isEmail } = require('validator/lib/isEmail');
const { getRecentPosts, getPostsForUserById } = require('../middleware/posts');

// router.use("/registration", function(req, res, next){
//   if(dataisgood){
//     next();
//   }else{
//     res.redirect('/registration');
//   }
// });

//localhost:3000/users/registraion
router.post(
  '/registration', 
  usernameCheck, 
  passwordCheck, 
  emailCheck, 
  tosCheck, 
  ageCheck,
  isUsernameUnique,
  isEmailUnique,
  async function(req, res, next) {
  var {username, email, password} = req.body;
  //check username is unique 
  try{
    var hashedPassword = await bcrypt.hash(password, 3);

    var [resultObject, fields] = await db.execute(`INSERT INTO users
    (username, email, password)
    value
    (?,?,?);`,[username, email, hashedPassword]);
    
    if(resultObject && resultObject.affectedRows == 1){
      res.redirect('/login');
    } else {
      res.redirect('/registration');
    }
  }catch(error){

  }
});

//localhost:3000/users/login
router.post('/login', async function(req, res, next){
  //pull username and password from request
  const {username, password} = req.body;
  //check if username or password is missing
  if(!username || !password) {
    return res.redirect('/login');
  } else {
    //execute a database query to validate the info
    var [rows, fields] = await db.execute(
      `select id,username,password,email from users where username=?;`,
      [username]
      );
    //retrieves the first user with that result
    var user = rows[0];
    //checks if that user exists 
    if(!user) {
      // req.flash("error",`Login Failed: Invalid Username/Password`);
      // req.session.save(function(err){
      //   return res.redirect('/login');
      // })
    } else {
      //passwordsMatch will return true if matching
      var passwordsMatch = await bcrypt.compare(password, user.password);
      if(passwordsMatch){
        req.session.user = {
          userId: user.id,
          email: user.email,
          username: user.username
        };
        // req.flash("success", `You are now logged in`);
        // req.session.save(function(err){
        //   return res.redirect('/login');
        // })
        return res.redirect('/');
      }else{
        return res.redirect('/login');
      }
    }
  }
});

router.use(function(req,res,next){
  if(req.session.user){
    next();
  }else{
    return res.redirect('/login');
  }
});

router.get('/profile/:id(\\d+)', isLoggedIn, isMyProfile, getPostsForUserById, function (req, res){
  res.render('profile');
});

router.post('/logout', isLoggedIn, function (req, res, next){
  req.session.destroy(function(err){
    if(err){
      next(err);
    } else {
      return res.redirect('/');
    }
  })
});
module.exports = router;
