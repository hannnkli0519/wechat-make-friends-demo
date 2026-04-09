// cloudfunctions/getMatches/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 获取喜欢我的用户列表
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const currentUserId = wxContext.OPENID

  try {
    // 获取喜欢当前用户但尚未回应的用户
    const likes = await db.collection('user_likes')
      .where({
        targetId: currentUserId
      })
      .get()

    const userIds = likes.data.map(item => item.userId)

    if (userIds.length === 0) {
      return {
        code: 0,
        data: [],
        message: '暂无喜欢你的用户'
      }
    }

    const users = await db.collection('users')
      .where({
        _id: db.command.in(userIds)
      })
      .get()

    return {
      code: 0,
      data: users.data,
      message: 'success'
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
