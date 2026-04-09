// cloudfunctions/getUserList/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 获取推荐用户列表
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const currentUserId = wxContext.OPENID

  const { filter = {} } = event
  const { minAge, maxAge, cities, interests } = filter

  try {
    // 查询条件
    let query = {}
    query._id = _.neq(currentUserId) // 排除自己

    // 年龄筛选
    if (minAge || maxAge) {
      query.age = {}
      if (minAge) query.age = _.gte(minAge)
      if (maxAge) query.age = _.lte(maxAge)
      if (minAge && maxAge) {
        query.age = _.and(_.gte(minAge), _.lte(maxAge))
      }
    }

    // 城市筛选
    if (cities && cities.length > 0) {
      query.city = _.in(cities)
    }

    // 兴趣筛选
    if (interests && interests.length > 0) {
      query.interests = _.in(interests)
    }

    const result = await db.collection('users')
      .where(query)
      .limit(20)
      .get()

    // 获取已喜欢和已跳过的用户ID
    const liked = await db.collection('user_likes')
      .where({ userId: currentUserId })
      .get()

    const skipped = await db.collection('user_skips')
      .where({ userId: currentUserId })
      .get()

    const likedIds = liked.data.map(item => item.targetId)
    const skippedIds = skipped.data.map(item => item.targetId)

    // 过滤已处理过的用户
    const filteredUsers = result.data.filter(user => {
      return !likedIds.includes(user._id) && !skippedIds.includes(user._id)
    })

    return {
      code: 0,
      data: filteredUsers,
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
