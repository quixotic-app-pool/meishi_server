/**
 * @Author: MichaelChen <mymac>
 * @Date:   2017-12-06T17:14:02+08:00
 * @Email:  teacherincafe@163.com
 * @Project: one_server
 * @Filename: chatservice.js
 * @Last modified by:   mymac
 * @Last modified time: 2017-12-17T10:13:35+08:00
 */
 var express = require('express');
 var http = require('http')
 var socketio = require('socket.io');
 // var mongojs = require('mongojs');
 var mongoose = require('mongoose');
 var CircularJSON = require('circular-json');

 var UserModel = require("../models/user");

 // var ObjectID = mongojs.ObjectID;
 // var db = mongojs(process.env.MONGO_URL || 'mongodb://localhost:27017/local');
 var database = require('../config/Database')

 var app = express();
 var server = http.Server(app);
 var websocket = socketio(server);
 server.listen(3000, () => console.log('listening on *:3000'));

var db = mongoose.connect(database.url)
//数据库连接状态
db.connection.on("error", function (error) {
    console.log("数据库连接失败：" + error);
});

db.connection.on("open", function () {
    console.log("数据库连接成功");
})

db.connection.on('disconnected', function () {
    console.log('数据库连接断开');
})

 // Mapping objects to easily map sockets and users.
 // var clients = {};
 var userToSocket = {};
 var socketToUser = {}

 // This represents a unique chatroom.
 // For this example purpose, there is only one chatroom;
 var chatId = 1;

 var customerServiceSocketId = ''

 websocket.on('connection', (socket) => {
    //  console.log('user connected!');
    //  console.log('socket:' + CircularJSON.stringify(socket));
    //  clients[socket.id] = socket;
    //customer service events
     socket.on('customerServiceConnected', (data) => customerServiceConnected(data, socket));
     socket.on('csmessage', (msgData) => customerServiceMessage(msgData, socket));

     //user events
     socket.on('userJoined', (userId) => onUserJoined(userId, socket));
     socket.on('userMessage', (message, userId) => userMessage(message, userId, socket));

     socket.on('disconnect', () => whenDisconnected(socket))
 });

 function whenDisconnected(socket) {
   //remove the record so that mark it as offline
   var userId = socketToUser[socket.id];
   delete socketToUser[socket.id];
   delete userToSocket[userId];
 }

 function customerServiceMessage(msgData, socket) {
   var user = msgData.userId;
   var userSocket = userToSocket[user]
   UserModel.findOneAndUpdate({number: user}, {$push: {messages: msgData.message}, $inc: {userunread: 1}}, {new: true}, function(err, data) {
        if(err) return err

        if(!userSocket) {
          //user is offline, then message will show next time when user log in
        } else {
          //use is online
          socket.broadcast.to(userSocket).emit('csmessage', msgData.msg);
          socket.emit('csack', {user: user, success: 'ok'});
        }
   })
 }
 function customerServiceConnected(data, socket) {
   customerServiceSocketId = socket.id
   console.log('this socket is from customer service, socketId is: ' + socket.id);
   // send users messages
   moreUsers(0, socket)
 }
 function moreUsers(page, socket) {
   var option = {
     limit: 10,
     skip: 10 * page
   }
   UserModel.find({csunread: {$gt: 0}}, {}, option, function(err, docs){
       if(err) {
         res.send("Sorry, this operation failed, please try again.")
       } else {
         console.log('reply from db about list: ' + docs);
         if(!docs) {
           socket.emit('users', {info: 'no more users'})
          //  res.send('没有更多了')
         } else {
           socket.emit('users', {info: 'ok', pack: docs})
          //  res.json(docs);
         }
       }
     })
 }
 // Event listeners.
 // When a user joins the chatroom.
 function onUserJoined(userId, socket) {
   try {
       console.log('user coming!');
       console.log('userid is: ' + userId);
       userToSocket[userId] = socket.id;
       socketToUser[socket.id] = userId
       _sendExistingMessages(0, userId, socket);
   } catch(err) {
     console.err(err);
   }
 }

 // When a user sends a message in the chatroom.
 function userMessage(message, userId, senderSocket) {
   console.log('user send new message!');
   console.log('message: ' + JSON.stringify(message));
   console.log('userid: ' + userId);
   var formattedMsg = {from: '', text: message.text, createdAt: message.createdAt}
  //  var userId = users[senderSocket.id];
   UserModel.findOneAndUpdate({number: userId}, {$push: {messages: formattedMsg}, $inc: {csunread: 1}}, {new: true}, function(err, data) {
        if(err) return err

        if(!customerServiceSocketId) {
          //customer service is offline, then message will show next time when user log in
        } else {
          //use is online
          console.log('specific user data: ' +  data);
          senderSocket.broadcast.to(customerServiceSocketId).emit('userExistingMsg', {msg: message, userid: userId});
          senderSocket.emit('userack', {success: 'ok'});
        }
   })
   // Safety check.
   if (!userId) return;

   _sendAndSaveMessage(message, userId, senderSocket);
 }

 // Helper functions.
 // Send the pre-existing messages to the user that just joined.
 function _sendExistingMessages(page, userId, socket) {
   console.log('send message!');
   var option = {
     limit: 10,
     skip: 10 * page
   }
   UserModel.find({number: userId}, {}, option, function(err, docs){
       if(err) {
         res.send("Sorry, this operation failed, please try again.")
       } else {
         console.log('reply from db about list: ' + docs);
         if(!docs) {
           socket.emit('userMsg', {info: 'no more msg'})
          //  res.send('没有更多了')
         } else {
           socket.emit('userMsg', {info: 'ok', pack: docs})
          //  res.json(docs);
         }
       }
     })
 }

 // Save the message to the db and send all sockets but the sender.
 function _sendAndSaveMessage(message, userId, socket) {
   var messageData = {
     text: message.text,
     createdAt: new Date(message.createdAt)
   };
   UserModel.findOneAndUpdate({number: userId}, {$push: {messages: messageData}}, {}, function(err, docs) {
     if(err) return err;
     socket.broadcast.to(customerServiceSocketId).emit('message', message, socket.id);
   })
 }

 // Allow the server to participate in the chatroom through stdin.
 // var stdin = process.openStdin();
 // stdin.addListener('data', function(d) {
 //   _sendAndSaveMessage({
 //     text: d.toString().trim(),
 //     createdAt: new Date(),
 //     user: { _id: 'robot' }
 //   }, null /* no socket */, true /* send from server */);
 // });
