/**
 * @Author: MichaelChen <mymac>
 * @Date:   2017-12-06T15:22:43+08:00
 * @Email:  teacherincafe@163.com
 * @Project: one_server
 * @Filename: Category.js
 * @Last modified by:   mymac
 * @Last modified time: 2017-12-06T15:26:41+08:00
 */

 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;
 const ObjectId = mongoose.Schema.Types.ObjectId

 var categorySchema = new Schema({
      topic: [{ type: String, default: ''}]
 })

 module.exports = mongoose.model('Category', categorySchema);
