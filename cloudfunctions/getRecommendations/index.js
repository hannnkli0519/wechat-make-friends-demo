// cloudfunctions/getRecommendations/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const currentUserId = wxContext.OPENID
  const { filter = {} } = event
  const { minAge, maxAge, cities, interests } = filter
  const _ = db.command

  try {
    // 获取当前用户已经喜欢或跳过的用户ID
    const likedRecords = await db.collection('user_likes')
      .where({
        userId: currentUserId
      })
      .get()

    const skippedRecords = await db.collection('user_skips')
      .where({
        userId: currentUserId
      })
      .get()

    const excludeIds = [
      currentUserId,
      ...likedRecords.data.map(record => record.targetId),
      ...skippedRecords.data.map(record => record.targetId)
    ]

    // 构建查询条件
    let queryCondition = {
      _id: _.nin(excludeIds)
    }

    // 年龄筛选
    if (minAge || maxAge) {
      queryCondition.age = _.and([
        _.gte(minAge || 18),
        _.lte(maxAge || 100)
      ])
    }

    // 城市筛选
    if (cities && Array.isArray(cities) && cities.length > 0) {
      queryCondition.city = _.in(cities)
    }

    // 兴趣筛选
    if (interests && Array.isArray(interests) && interests.length > 0) {
      // 只要包含其中一个兴趣即可
      queryCondition.interests = _.in(interests)
    }

    const result = await db.collection('users')
      .where(queryCondition)
      .limit(20)
      .get()

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