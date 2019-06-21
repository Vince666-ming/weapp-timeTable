// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
let db = cloud.database();

let _ = db.command;
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  return await db.collection("shareData").doc(event.shareId).update({
    data:{
      zan: _.inc(1),
      isZan: _.push(wxContext.OPENID),
    }
  })
}