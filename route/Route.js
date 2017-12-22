/**
 * @Author: MichaelChen <mymac>
 * @Date:   2017-12-06T10:59:25+08:00
 * @Email:  teacherincafe@163.com
 * @Project: one_server
 * @Filename: Route.js
 * @Last modified by:   mymac
 * @Last modified time: 2017-12-22T18:35:53+08:00
 */

  var express = require('express');
  var dateFormat = require('dateformat');
  var CircularJSON = require('circular-json');
  var myAsync = require('async')
  //nnd，multer 比较娇贵，只能走这了

  var router = express.Router();

  var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
  router.use(bodyParser.json());                                     // parse application/json
  router.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded

  var RecipeModel = require("../models/recipe");
  var UserModel = require("../models/user");
  var CategoryModel = require("../models/category");
  var CustomerServiceModel = require('../models/CustomerService');
  var mongoose = require('mongoose');
  const ObjectId = mongoose.Types.ObjectId

  var aliService = require('../aliyun/AliService')


  const topicArray = ['本周流行菜谱', '活动折扣', '热门项目', '最新上架']



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

 router.post('/api/requestcode', function(req, res) {
   var phoneNumber = req.body.number;
   //need to interact with ali code
   aliService.sendSMS(phoneNumber, function(num, sixdigitcode) {
     //check if phonenumber is used or not
     UserModel.findOne({number: num}, function(err, data) {
       console.log('inside callback');
       console.log('err: ' + err);
       console.log('data: ' + data);
       if(err) {
         return err
       } else {
         if(!data) {
           //new user
           var userEntity = new UserModel({
              number: phoneNumber,
              sixdigitcode: sixdigitcode
           })
           userEntity.save(function(err, docs){
               if(err) console.log(err);
           })
         } else {
           data.sixdigitcode = sixdigitcode;
           data.save();
         }
         console.log('ali message has been sent');
         res.json({success: true})
       }
     })
   })
 });
 router.post('/api/csnumber', function(req, res) {
   var phoneNumber = req.body.number;
   //need to interact with ali code
   aliService.sendSMS(phoneNumber, function(num, sixdigitcode) {
     //check if phonenumber is used or not
     CustomerServiceModel.findOne({number: num}, function(err, data) {
       console.log('err: ' + err);
       console.log('data: ' + data);
       if(err) {
         return err
       } else {
         if(data) {
           data.sixdigitcode = sixdigitcode;
           data.save();
           console.log('ali message has been sent to customer servicebos');
           res.json({success: 'ok'})
         }
         console.log('unable to find customer service account in database');
         res.json({success: 'fail'})
       }
     })
   })
 });
 router.post('/api/verifycs', function(req, res) {
   var sixdigitcode = req.body.sixdigitcode;
   var number = req.body.number;
     CustomerServiceModel.findOne({number: number}, function(err, data) {
       if(err) return err;
       if(!data) {
          res.send({success: 'fail'})
       } else {
          if(data.sixdigitcode !== sixdigitcode) {
            res.json({success: 'fail'})
          } else {
            res.json({success: 'ok'})
          }
       }
   })
 });
 router.post('/api/verify', function(req, res) {
   var sixdigitcode = req.body.sixdigitcode;
   var number = req.body.number
   //need to interact with ali code
     UserModel.findOne({number: number}, function(err, data) {
       if(err) return err;
       if(!data) {
         //err: 0, '电话号码不正确'; err: 1, '验证码不正确'
          res.send({err: 0})
       } else {
          if(data.sixdigitcode !== sixdigitcode) {
            res.send({err: 1})
          } else {
            res.send({err: null})
          }
       }
   })
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
 router.get('/api/customerservice', function(req, res) {
   //here we need to offer an client code to render customer service page so that worker can talk with people
 });

 router.post('/api/updatecsunread', function(req, res) {
   console.log('req:' + JSON.stringify(req.body));
  //  UserModel.findOne({number:})
 })



 //APP side api
 router.get('/api/fetchlist', function(req, res) {
   // TODO:
   //I dont know what is happening most time data is not availbale from this
   var data = req.query;
   console.log("request regarding list: " + CircularJSON.stringify(data));
   // page start from 0
   var option = {
     limit: 10,
     skip: 10 * data.page
   }
   console.log('data.type: ' + data.type);
   RecipeModel.find( { type: topicArray[data.type] }, {}, option, function(err, data){
     if(err) return err;
     var arrs = [];
     var obj = {};
     console.log("data: " + data);
     data.forEach(function(item){
       obj = {title: item.title, imgUrl: item.mainImgUrl, tag: item.tag, _id: item._id};
       arrs.push(obj)
     })
     res.json({success: 'list is ready', data: arrs})
   })
 });

 router.get('/api/fetchmainpagecontent', async function(req, res) {
  //  var data = req.query;
  //  console.log("request regarding list: " + CircularJSON.stringify(data));
   // page start from 0
   var option = {
     limit: 5
   }
   var pack = []
   var obj = {};
   var typeArray = []
   myAsync.eachOf(topicArray, async function (type, index) {
     await RecipeModel.find({ type: type }, {}, option, function(err, data){
       if(err) return err;
       console.log('main page content bingo!');
       typeArray = []
       data.forEach(function(item){
         obj = {title: item.title, imgUrl: item.mainImgUrl, tag: item.tag, _id: item._id};
         typeArray.push(obj)
       })
       obj = {type: type, data: typeArray}
       pack[index] = obj
     })
    }, function (err) {
        if (err) {
          console.error(err.message);
        } else {
          res.json({success: 'main page content is ready', data: pack})
        }
    });
 });

 router.get('/api/fetchfavoriteorread', function(req, res) {
   var data = req.query;
   console.log("request regarding list of favorite or read: " + CircularJSON.stringify(data));
   // page start from 0
   var option = {
     limit: 10,
     skip: 10 * data.page
   }
   var topic = ''
   if(data.index === 0) {
     topic = 'favorites'
   } else {
     topic = 'reads'
   }
   var arr = []
   var obj = {}
   UserModel.findOne({number: data.userid}).populate({ path: topic, options: option }).exec(function(err, data){
     if(err) return err;
     console.log('getting topic list for specific users');
     data.forEach(function(item){
       obj = {tag: item.tag, imgUrl: item.mainImgUrl, title: item.title}
       arr.push(obj)
     })
   })
   res.json({success: 'topic data is ready', data: arr})
 });

router.get('/api/fetchrecipe', function(req, res) {
  var data = req.query
  // console.log('fetchrecipe: ' + JSON.stringify(data));
  RecipeModel.findById(ObjectId(data.id), function(err, data) {
    if(err) return err;
    // console.log('getting recipe detail: ' + JSON.stringify(data));
    res.json({success: 'ok', data: data})
  })
})

router.get('/api/addFavorite', function(req, res) {
  var data = req.query
  console.log('addFavorite');
  UserModel.findOne({number: data.userId}, function(err, user) {
     user.favorites.push(data.recipeId);
     user.save(function(err, data){
       console.log('增加favorite成功： ' + data)
       res.json({success: 'ok'})
     })
   })
})



 module.exports = router;
