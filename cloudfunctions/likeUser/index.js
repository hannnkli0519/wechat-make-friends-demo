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
    // 检查是否已经喜欢过
    const existingLike = await db.collection('user_likes')
      .where({
        userId: currentUserId,
        targetId: targetId
      })
      .get()

    if (existingLike.data.length > 0) {
      return {
        code: -1,
        data: null,
        message: '已经喜欢过了'
      }
    }

    // 添加到喜欢列表
    const likeResult = await db.collection('user_likes').add({
      data: {
        userId: currentUserId,
        targetId: targetId,
        createTime: db.serverDate()
      }
    })

    console.log('添加喜欢记录成功:', likeResult._id)

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

      console.log('匹配成功')

      isMatched = true
    }

    return {
      code: 0,
      data: { isMatched },
      message: isMatched ? '匹配成功' : '已喜欢'
    }
  } catch (err) {
    console.error('likeUser 错误:', err)
    return {
      code: -1,
      data: null,
      message: err.message
    }
  }
}