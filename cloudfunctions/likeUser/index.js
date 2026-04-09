// cloudfunctions/likeUser/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 喜欢用户
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const currentUserId = wxContext.OPENID

  const { targetId } = event

  try {
    // 添加到喜欢列表
    const likeResult = await db.collection('user_likes').add({
      data: {
        userId: currentUserId,
        targetId: targetId,
        createTime: db.serverDate()
      }
    })

    // 检查是否双向喜欢
    const mutualLike = await db.collection('user_likes')
      .where({
        userId: targetId,
        targetId: currentUserId
      })
      .get()

    let isMatched = false

    if (mutualLike.data.length > 0) {
      // 双向喜欢，创建匹配
      await db.collection('user_matches').add({
        data: {
          userId1: currentUserId,
          userId2: targetId,
          createTime: db.serverDate()
        }
      })

      // 更新用户的匹配计数
      await db.collection('users').doc(currentUserId).update({
        data: {
          matchCount: db.command.inc(1)
        }
      })

      isMatched = true
    }

    // 更新用户的喜欢计数
    await db.collection('users').doc(currentUserId).update({
      data: {
        likeCount: db.command.inc(1)
      }
    })

    return {
      code: 0,
      data: { isMatched },
      message: isMatched ? '匹配成功' : '已喜欢'
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
