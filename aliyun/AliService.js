/**
 * @Author: MichaelChen <mymac>
 * @Date:   2017-12-06T16:26:58+08:00
 * @Email:  teacherincafe@163.com
 * @Project: one_server
 * @Filename: SendSms.js
 * @Last modified by:   mymac
 * @Last modified time: 2018-01-23T11:23:30+08:00
 */

//https://help.aliyun.com/document_detail/57458.html?spm=5176.10629532.106.4.23537d5bXdemI8

/**
 * 云通信基础能力业务短信发送、查询详情以及消费消息示例，供参考。
 * Created on 2017-07-31
 */
const SMSClient = require('@alicloud/sms-sdk')
// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
const accessKeyId = ''
const secretAccessKey = ''
//初始化sms_client
let smsClient = new SMSClient({accessKeyId, secretAccessKey})

var aliService = {}

aliService.sendSMS = function(number, callback) {
  var sixdigitcode = Math.floor(Math.random()*900000 + 100000);
  //发送短信
  smsClient.sendSMS({
      PhoneNumbers: number,
      SignName: '青菜帮',
      TemplateCode: 'SMS_115930413',
      TemplateParam: '{"code":'+ sixdigitcode + '}'
  }).then(function (res) {
      let {Code}=res
      if (Code === 'OK') {
          //处理返回参数
          callback(number, sixdigitcode)
      }
  }, function (err) {
      console.log(err)
  })
}

module.exports = aliService
