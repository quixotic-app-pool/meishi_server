/**
 * @Author: MichaelChen <mymac>
 * @Date:   2017-12-22T18:19:16+08:00
 * @Email:  teacherincafe@163.com
 * @Project: one_server
 * @Filename: CustomerService.js
 * @Last modified by:   mymac
 * @Last modified time: 2017-12-23T12:31:09+08:00
 */

 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;
 const ObjectId = mongoose.Schema.Types.ObjectId

 var csSchema = new Schema({
      number: { type: String, default: ''},
      sixdigitcode: { type: String, default: ''},
      online: { type: Boolean, default: false }
 })

 module.exports = mongoose.model('CustomerService', csSchema);
