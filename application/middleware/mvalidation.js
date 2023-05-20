var validator = require('validator');
var db = require('../conf/database');

module.exports = {
    usernameCheck: function(req, res, next){
        var {username} = req.body;
        username = username.trim();
        if(!validator.isLength(username, {min:3})){
            req.flash("error", `Username must be 3 or more chars`);
        } 
        if(!/[a-zA-Z]/.test(username.charAt(0))){
            req.flash("error", `Username must begin with a letter`);
        }
        if(req.session.flash.error){
            res.redirect('/registration');
        } else {
            next();
        }
    },
    passwordCheck: function(req, res, next){
        var {password} = req.body;
        password = password.trim();
        if(!validator.isLength(password, {min:8})){
            req.flash("error", `Password is not min 8 chars`);
        }
        if(!/[a-zA-Z0-9*\/\-\+!@#$^&~[\]]/.test(password)){
            req.flash("error", `User used unusual char in password`);
        }
        if(req.session.flash.error){
            res.redirect('/registration');
        } else {
            next();
        }
    },
    emailCheck: function(req, res, next){
        var {email} = req.body;
        email = email.trim();
        if(!/[a-zA-Z0-9_.*\/\-\+!@#$^&~[\]]/.test(email)){
            req.flash("error", `User used unusual char in email`);
        }
        if(req.session.flash.error){
            res.redirect('/registration');
        } else {
            next();
        }
    },
    tosCheck: function(req, res, next){
        var {tosCheck} = req.body;
        if(!tosCheck){
            req.flash("error", `User has not checked ToS check`);
        }
        if(req.session.flash.error){
            res.redirect('/registration');
        } else {
            next();
        }
    },
    ageCheck: function(req, res, next){
        var {ageCheck} = req.body;
        if(!ageCheck){
            req.flash("error", `User has not checked age check`);
        }
        if(req.session.flash.error){
            res.redirect('/registration');
        } else {
            next();
        }
    },
    isUsernameUnique: async function(req, res, next){
        var {username} = req.body;
        try{
            var [rows, fields] = await db.execute(`select id from users where username=?;`,[username]);
            if(rows && rows.length > 0){
              return res.redirect('/registration');
            } else {
                next();
            }
        }catch(error){
            next(error);
        }
    },
    isEmailUnique: async function(req, res, next){
        var {email} = req.body;
        try{
            var [rows, fields] = await db.execute(`select id from users where email=?;`,[email]);
            if(rows && rows.length > 0){
              return res.redirect('/registration');
            } else {
                next();
            }
        }catch(error){
            next(error);
        }
    }
};