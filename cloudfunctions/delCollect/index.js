const cloud = require('wx-server-sdk')
cloud.init()
let db=cloud.database();
exports.main=async(event,context)=>{
  // return { sum: event.a + event.b} 
  return await db.collection("collection").where({
    colId:event.a
  }).remove()
}