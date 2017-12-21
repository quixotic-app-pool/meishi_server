/**
 * @Author: MichaelChen <mymac>
 * @Date:   2017-12-06T16:27:23+08:00
 * @Email:  teacherincafe@163.com
 * @Project: one_server
 * @Filename: MessageAPI.js
 * @Last modified by:   mymac
 * @Last modified time: 2017-12-06T16:30:02+08:00
 */
//https://help.aliyun.com/document_detail/57460.html?spm=5176.10629532.106.12.23537d5bXdemI8
/**
 * 云通信基础能力业务短信发送、查询详情以及消费消息示例，供参考。
 * Created on 2017-07-31
 */
const SMSClient =require('@alicloud/sms-sdk')
// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
const accessKeyId = 'yourAccessKeyId'
const secretAccessKey = 'yourAccessKeySecret'
//在云通信页面开通相应业务消息后，就能在页面上获得对应的queueName,不用填最后面一段
const queueName = 'Alicom-Queue-1092397003988387-'
//初始化sms_client
let smsClient = new SMSClient({accessKeyId, secretAccessKey})
//短信回执报告
smsClient.receiveMsg(0, queueName).then(function (res) {
    //消息体需要base64解码
    let {code, body}=res
    if (code === 200) {
        //处理消息体,messagebody
        console.log(body)
    }
}, function (err) {
    console.log(err)
})
//短信上行报告
smsClient.receiveMsg(1, queueName).then(function (res) {
    //消息体需要base64解码
    let {code, body}=res
    if (code === 200) {
        //处理消息体,messagebody
        console.log(body)
    }
}, function (err) {
    console.log(err)
})
