var express = require('express');
var router = express.Router();
var multer = require('multer');
var db = require('../conf/database');
const { isLoggedIn } = require("../middleware/auth")
const { makeThumbnail, getPostById, getCommentsForPostById } = require('../middleware/posts');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "public/videos/uploads");
    },
    filename: function(req, file, cb){
        var fileExt = file.mimetype.split("/")[1];
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExt}`);
    },
});

const upload = multer({storage: storage});


router.post("/create", isLoggedIn, upload.single("uploadVideo"), makeThumbnail, async function(req, res, next){
    var {title, description} = req.body;
    var {path, thumbnail} = req.file;
    var {userId} = req.session.user;

    try{
        var[insertResult, _ ] = await db.execute(
            `INSERT INTO posts (title, description, video, thumbnail, fk_userId) VALUE (?,?,?,?,?);`,
            [title, description, path, thumbnail, userId]
        );
        if(insertResult && insertResult.affectedRows){
            req.flash("success", `Your post was created`);
            return req.session.save(function(error){
                setTimeout(() => {
                    req.session.save((error) => {
                    if(error) next(error);
                    return res.redirect(`/users/profile/${userId}`);
                });
            }, 500);
        },       
        )} else {
            next(new Error('Post could not be created'));
        }
    }catch(error){
        next(error);
    }
});

router.get("/:id(\\d+)", getPostById, getCommentsForPostById, function(req,res){
    res.render("viewpost",{ title: `View post ${req.params.id}`});
  });

router.get("/search", async function(req, res, next){
    var {searchValue} = req.query;
    try{
        var [rows, _] = await db.execute(
            `select id,title,thumbnail, concat_ws(' ', title, description) as haystack 
            from posts 
            having haystack like ? 
            order by createdAt desc;`,
            [`%${searchValue}%`]
        );
        if(rows && rows.length == 0){
            return res.redirect(`/login`);
        }else{
            res.locals.posts = rows;
            return res.render('index');
        }

    }catch(error){
        next(error);
    }
});

router.post('/delete/:id(\\d+)', isLoggedIn, async function(req, res, next){
    var {userId} = req.session.user;
    var {id} = req.params;
    
    try {
        await db.execute(
            `DELETE FROM csc317db.comments WHERE fk_postId = ?;`,
            [id]
        );
        await db.execute(
            `DELETE FROM csc317db.posts WHERE id = ?;`,
            [id]
        );
        return res.redirect(`/users/profile/${userId}`);
    } catch(error) {
        next(error);
    }
});

module.exports = router;