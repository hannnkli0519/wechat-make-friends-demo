// cloudfunctions/getRecommendations/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const currentUserId = wxContext.OPENID

  try {
    // 获取当前用户已经喜欢或跳过的用户ID
    const likedRecords = await db.collection('user_likes')
      .where({
        userId: currentUserId
      })
      .get()

    const likedUserIds = likedRecords.data.map(record => record.targetId)

    // 获取推荐用户（排除已喜欢的用户和当前用户自己）
    let query = db.collection('users')
      .where({
        _id: db.command.neq(currentUserId)
      })

    if (likedUserIds.length > 0) {
      query = db.collection('users')
        .where({
          _id: db.command.and([
            db.command.neq(currentUserId),
            db.command.nin(likedUserIds)
          ])
        })
    }

    const result = await query.limit(20).get()

    return {
      code: 0,
      data: result.data,
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