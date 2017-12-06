/**
 * @Author: MichaelChen <mymac>
 * @Date:   2017-12-06T10:59:25+08:00
 * @Email:  teacherincafe@163.com
 * @Project: one_server
 * @Filename: Route.js
 * @Last modified by:   mymac
 * @Last modified time: 2017-12-06T16:47:14+08:00
 */

  var express = require('express');
  var dateFormat = require('dateformat');
  var CircularJSON = require('circular-json');
  //nnd，multer 比较娇贵，只能走这了

  var router = express.Router();

  var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
  router.use(bodyParser.json());                                     // parse application/json
  router.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded

  var RecipeModel = require("../models/recipe");
  var UserModel = require("../models/user");
  var CategoryModel = require("../models/category");

  //Middle ware that is specific to this router
 router.use(function timeLog(req, res, next) {
   console.log('#################Welcome to meishi_server!######################')
   var now = new Date();
   console.log('Time: ', dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT"));
   next();
 });


 //event
 router.get('/api/fetchitemdetail', function(req, res) {
    var _id = req.query._id;
    RecipeModel.findById( ObjectId(_id), function(err, docs){
      if(err) {
        console.log(err);
        res.send("Sorry, this operation failed, please try again.")
      } else {
        console.log('reply from db about detail: ' + docs);
        if(!docs) {
          res.send('找不到')
        } else {
          res.json(docs);
        }
      }
    })
 });

 router.get('/api/fetchweeklytrendlist', function(req, res) {
   var data = req.query;
   console.log("request regarding list: " + CircularJSON.stringify(data));
   var option = {
     limit: 10,
     skip: 10 * data.page
   }
   RecipeModel.find({categoryTwo: data.categoryTwo}, {}, option, function(err, docs){
       if(err) {
         res.send("Sorry, this operation failed, please try again.")
       } else {
         console.log('reply from db about list: ' + docs);
         if(!docs) {
           res.send('没有更多了')
         } else {
           res.json(docs);
         }
       }
     })
 });
 router.get('/api/fetchhotlist', function(req, res) {
   var data = req.query;
   console.log("request regarding list: " + CircularJSON.stringify(data));
   var option = {
     limit: 10,
     skip: 10 * data.page
   }
   RecipeModel.find({categoryTwo: data.categoryTwo}, {}, option, function(err, docs){
       if(err) {
         res.send("Sorry, this operation failed, please try again.")
       } else {
         console.log('reply from db about list: ' + docs);
         if(!docs) {
           res.send('没有更多了')
         } else {
           res.json(docs);
         }
       }
     })
 });
 router.get('/api/fetchdiscountlist', function(req, res) {
   var data = req.query;
   console.log("request regarding list: " + CircularJSON.stringify(data));
   var option = {
     limit: 10,
     skip: 10 * data.page
   }
   RecipeModel.find({categoryTwo: data.categoryTwo}, {}, option, function(err, docs){
       if(err) {
         res.send("Sorry, this operation failed, please try again.")
       } else {
         console.log('reply from db about list: ' + docs);
         if(!docs) {
           res.send('没有更多了')
         } else {
           res.json(docs);
         }
       }
     })
 });
 router.get('/api/fetchnewlist', function(req, res) {
   var data = req.query;
   console.log("request regarding list: " + CircularJSON.stringify(data));
   var option = {
     limit: 10,
     skip: 10 * data.page
   }
   RecipeModel.find({categoryTwo: data.categoryTwo}, {}, option, function(err, docs){
       if(err) {
         res.send("Sorry, this operation failed, please try again.")
       } else {
         console.log('reply from db about list: ' + docs);
         if(!docs) {
           res.send('没有更多了')
         } else {
           res.json(docs);
         }
       }
     })
 });
 router.get('/api/fetchcategorylist', function(req, res) {
   var data = req.query;
   console.log("request regarding list: " + CircularJSON.stringify(data));
   CategoryModel.find({}, function(err, docs){
       if(err) {
         res.send("Sorry, this operation failed, please try again.")
       } else {
         console.log('reply from db about list: ' + docs);
         res.json(docs);
       }
     })
 });

 router.post('/api/verify', function(req, res) {
   //need to interact with ali code
 });
 router.post('/api/addfavoriteitem', function(req, res) {
   var data = req.body.pack;
   UserModel.findByIdAndUpdate(id, {$push: { favorites: data.id }}, {}, function(err, data) {
      if(err) {
        return err;
      } else {
        res.send('success');
      }
   })
 });
 router.get('/api/fetchfavoritelist', function(req, res) {
   var data = req.query;
   console.log("request regarding list: " + CircularJSON.stringify(data));
   // page start from 0
   var numIndex = data.page * 10
   UserModel.findById( ObjectId(data.id), function(err, user){
     if(err) return err;
     console.log('populated: ' + user)
     var list = user.favorites.slice(numIndex, (numIndex + 9))
     var listContent = []
     var obj = {};
     list.forEach(function(id) {
       RecipeModel.findById( ObjectId(id), function(err, docs){
           if(err) {
             res.send("Sorry, this operation failed, please try again.")
           } else {
             console.log('reply from db about list: ' + docs);
             obj = {title: docs.title, imgUrl: docs.imgUrl}
             listContent.push(obj);
           }
         })
     })
     res.json(obj)
   })
 });
 router.post('/api/addreaditem', function(req, res) {
   var data = req.body.pack;
   UserModel.findByIdAndUpdate(id, {$push: { reads: data.id }}, {}, function(err, data) {
      if(err) {
        return err;
      } else {
        res.send('success');
      }
   })
 });
 router.get('/api/fetchreadlist', function(req, res) {
   var data = req.query;
   console.log("request regarding list: " + CircularJSON.stringify(data));
   // page start from 0
   var numIndex = data.page * 10
   UserModel.findById( ObjectId(data.id), function(err, user){
     if(err) return err;
     console.log('populated: ' + user)
     var list = user.favorites.slice(numIndex, (numIndex + 9))
     var listContent = []
     var obj = {};
     list.forEach(function(id) {
       RecipeModel.findById( ObjectId(id), function(err, docs){
           if(err) {
             res.send("Sorry, this operation failed, please try again.")
           } else {
             console.log('reply from db about list: ' + docs);
             obj = {title: docs.title, imgUrl: docs.imgUrl}
             listContent.push(obj);
           }
         })
     })
     res.json(obj)
   })
 });

 module.exports = router;
