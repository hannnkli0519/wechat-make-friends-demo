// cloudfunctions/getMyLikes/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 获取我喜欢的用户列表
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const currentUserId = wxContext.OPENID

  try {
    console.log('查询用户:', currentUserId)

    // 获取当前用户喜欢的所有用户ID
    const likes = await db.collection('user_likes')
      .where({
        userId: currentUserId
      })
      .orderBy('createTime', 'desc')
      .get()

    console.log('喜欢记录数量:', likes.data.length)

    const targetIds = likes.data.map(item => item.targetId)
    console.log('目标用户IDs:', targetIds)

    if (targetIds.length === 0) {
      return {
        code: 0,
        data: [],
        message: '暂无喜欢的用户'
      }
    }

    // 获取这些用户的详细信息
    const users = await db.collection('users')
      .where({
        _id: db.command.in(targetIds)
      })
      .get()

    console.log('查询到的用户数量:', users.data.length)

    return {
      code: 0,
      data: users.data,
      message: 'success'
    }
  } catch (err) {
    console.error('getMyLikes 错误:', err)
    return {
      code: -1,
      data: null,
      message: err.message
    }
  }
}