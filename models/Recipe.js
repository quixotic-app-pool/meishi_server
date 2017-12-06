/**
 * @Author: MichaelChen <mymac>
 * @Date:   2017-12-06T13:47:42+08:00
 * @Email:  teacherincafe@163.com
 * @Project: one_server
 * @Filename: Recipe.js
 * @Last modified by:   mymac
 * @Last modified time: 2017-12-06T15:02:41+08:00
 */

 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;
 const ObjectId = mongoose.Schema.Types.ObjectId

 var recipeSchema = new Schema({
      categoryOne: { type: String, default: ''},
      categoryTwo: { type: String, default: ''},
      mainImgUrl: { type: String, default: ''},
      title: { type: String, default: ''},
      description: { type: String, default: ''},
      ingredients: [{
        { name: { type: String, default: ''},
        { quantity: { type: String, default: ''},
        { unit: { type: String, default: ''}
      }],
      steps: [
        {
          imgsUrl: [{ type: String, default: ''}],
          description: { type: String, default: ''}
        }
      ],
      tip: { type: String, default: ''},
      create_time: { type: String, default: ''}
 })

 module.exports = mongoose.model('Recipe', recipeSchema);
