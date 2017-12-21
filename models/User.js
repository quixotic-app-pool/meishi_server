/**
 * @Author: MichaelChen <mymac>
 * @Date:   2017-12-06T13:47:46+08:00
 * @Email:  teacherincafe@163.com
 * @Project: one_server
 * @Filename: User.js
 * @Last modified by:   mymac
 * @Last modified time: 2017-12-17T12:53:58+08:00
 */
 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;
 const ObjectId = mongoose.Schema.Types.ObjectId

 var userSchema = new Schema({
      favorites: [{ type: ObjectId, ref: 'recipe'}],
      reads:[{ type: ObjectId, ref: 'recipe'}],
      number: { type: String, default: ''},
      sixdigitcode: { type: String, default: ''},
      userunread: { type: Number, default: 0},
      csunread: { type: Number, default: 0},
      messages: [{
        from: { type: String, default: ''},
        text: { type: String, default: ''},
        createdAt: { type: String, default: ''}
      }]
 })

 module.exports = mongoose.model('User', userSchema);
