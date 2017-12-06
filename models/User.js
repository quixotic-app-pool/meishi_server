/**
 * @Author: MichaelChen <mymac>
 * @Date:   2017-12-06T13:47:46+08:00
 * @Email:  teacherincafe@163.com
 * @Project: one_server
 * @Filename: User.js
 * @Last modified by:   mymac
 * @Last modified time: 2017-12-06T15:42:14+08:00
 */
 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;
 const ObjectId = mongoose.Schema.Types.ObjectId

 var userSchema = new Schema({
      favorites: [{ type: ObjectId, ref: 'recipe'}],
      reads:[{ type: ObjectId, ref: 'recipe'}],
      number: { type: String, default: ''},
      pw: { type: String, default: ''}
 })

 module.exports = mongoose.model('User', userSchema);
