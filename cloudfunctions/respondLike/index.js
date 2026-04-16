// cloudfunctions/respondLike/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 回应喜欢（双向匹配）
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const currentUserId = wxContext.OPENID

  const { targetId, targetName } = event

  try {
    // 添加双向喜欢
    await db.collection('user_likes').add({
      data: {
        userId: currentUserId,
        targetId: targetId,
        createTime: db.serverDate()
      }
    })

    // 创建匹配
    await db.collection('user_matches').add({
      data: {
        userId1: currentUserId,
        userId2: targetId,
        createTime: db.serverDate()
      }
    })

    // 从喜欢我的列表中移除
    await db.collection('user_likes')
      .where({
        userId: targetId,
        targetId: currentUserId
      })
      .remove()

    return {
      code: 0,
      data: { matched: true, targetName },
      message: `已与 ${targetName} 匹配成功`
    }
  } catch (err) {
    console.error(err)
    return {
      code: -1,
      data: null,
      message: err.message
    }
  }
}
