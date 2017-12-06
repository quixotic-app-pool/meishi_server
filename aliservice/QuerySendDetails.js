/**
 * @Author: MichaelChen <mymac>
 * @Date:   2017-12-06T16:27:06+08:00
 * @Email:  teacherincafe@163.com
 * @Project: one_server
 * @Filename: QuerySendDetails.js
 * @Last modified by:   mymac
 * @Last modified time: 2017-12-06T16:28:41+08:00
 */

//https://help.aliyun.com/document_detail/57459.html?spm=5176.10629532.106.8.23537d5bXdemI8

/**
* 云通信基础能力业务短信发送、查询详情以及消费消息示例，供参考。
* Created on 2017-07-31
*/
const SMSClient = require('@alicloud/sms-sdk')
// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
const accessKeyId = 'yourAccessKeyId'
const secretAccessKey = 'yourAccessKeySecret'
//初始化sms_client
let smsClient = new SMSClient({accessKeyId, secretAccessKey})
//查询短信发送详情
smsClient.queryDetail({
   PhoneNumber: '1500000000',
   SendDate: '20170731',
   PageSize: '10',
   CurrentPage: "1"
}).then(function (res) {
   let {Code, SmsSendDetailDTOs}=res
   if (Code === 'OK') {
       //处理发送详情内容
       console.log(SmsSendDetailDTOs)
   }
}, function (err) {
   //处理错误
   console.log(err)
})
