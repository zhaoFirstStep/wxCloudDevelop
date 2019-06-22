// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  let conlactionList, logresult;
  try {
    conlactionList = await db.collection('subclass').where({
      _id: event.id
    }).remove();
   logresult = await db.collection('record').where({
      subClassId: event.id
    }).remove();
  } catch (e) {
    console.log(e);
  }
  // console.log(conlactionList);
  return {
    conlactionList,
    logresult
  }
}