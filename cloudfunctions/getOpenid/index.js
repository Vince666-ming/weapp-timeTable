// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
//获取用户的openid
exports.main =  (event, context) => {
  const wxContext=cloud.getWXContext()
  return {
    event,
    openid:wxContext.OPENID,
  }
}
