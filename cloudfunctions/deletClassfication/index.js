// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  let conlactionList, result, logList, logresult;
  try{
     conlactionList = await db.collection('subclass').where({
      parentId: event.id
    }).remove(); 
     result = await db.collection('classes').where({
      _id: event.id
    }).remove();
     imgresult = await cloud.deleteFile({
      fileList: [event.imgId]
    });
     logList = await db.collection('record').where({
      parentId: event.id
    }).get();
    if (logList.data.length>0){
       logresult = await db.collection('record').where({
        parentId: event.id
      }).remove();
    }
  }catch(e){
    console.log(e);
  }
  return {
    conlactionList,
    imgresult,
    logList,
    result
  }
}