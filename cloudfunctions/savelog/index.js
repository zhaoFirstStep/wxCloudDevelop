// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  let result,upateResult;
  let _id = event.subClassId;
  try{
    if (event.logType == 0 && event.useType == '2') {//填入故障后置位故障
      upateResult = await db.collection('subclass').doc(_id).update({
        data: {
          isError: true
        }
      })
    }
    if (event.logType == 1) {//维修后故障不显示
      upateResult = await db.collection('subclass').doc(_id).update({
        data: {
          isError: false
        }
      })
    }
    let data = Object.assign({},event);
    // delete event.useriInfo;
    data.creatTime = new Date();
    result = await db.collection('record').add({
      data: data
    })
  }catch(e){
    result = {
      isError:true
    }
  }

  return {
    result,
    upateResult
  }
}