// cloudfunctions/getUserProfile/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const currentUserId = wxContext.OPENID

  try {
    // 获取用户资料
    let userResult
    try {
      userResult = await db.collection('users')
        .doc(currentUserId)
        .get()
    } catch (err) {
      // 用户不存在，创建新用户
      console.log('用户不存在，创建新用户:', currentUserId)
      
      const now = new Date()
      const defaultUser = {
        _id: currentUserId,
        name: '新用户',
        age: 25,
        city: '北京',
        occupation: '',
        bio: '这个人很神秘，什么都没有写~',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
        photos: [],
        interests: [],
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      }
      
      await db.collection('users').add({
        data: defaultUser
      })
      
      userResult = {
        data: defaultUser
      }
    }

    if (!userResult.data) {
      return {
        code: -1,
        data: null,
        message: '用户不存在'
      }
    }

    const userData = userResult.data

    // 获取喜欢数
    const likeCount = await db.collection('user_likes')
      .where({ userId: currentUserId })
      .count()

    // 获取被喜欢数
    const likedByCount = await db.collection('user_likes')
      .where({ targetId: currentUserId })
      .count()

    // 获取匹配数
    const matchCount = await db.collection('user_matches')
      .where({
        $or: [
          { userId1: currentUserId },
          { userId2: currentUserId }
        ]
      })
      .count()

    const profile = {
      _id: userData._id,
      name: userData.name,
      age: userData.age,
      city: userData.city,
      occupation: userData.occupation || '',
      bio: userData.bio || '',
      avatar: userData.avatar,
      photos: userData.photos || [],
      interests: userData.interests || [],
      visitors: likedByCount.total,
      likes: likeCount.total,
      matches: matchCount.total
    }

    return {
      code: 0,
      data: profile,
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