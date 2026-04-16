// cloudfunctions/updateUserProfile/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const currentUserId = wxContext.OPENID
  const { name, age, city, occupation, bio, interests, photos, avatar } = event

  try {
    const updateData = {}
    
    if (name !== undefined) updateData.name = name
    if (age !== undefined) updateData.age = age
    if (city !== undefined) updateData.city = city
    if (occupation !== undefined) updateData.occupation = occupation
    if (bio !== undefined) updateData.bio = bio
    if (interests !== undefined) updateData.interests = interests
    if (photos !== undefined) updateData.photos = photos
    if (avatar !== undefined) updateData.avatar = avatar

    await db.collection('users')
      .doc(currentUserId)
      .update({
        data: updateData
      })

    return {
      code: 0,
      message: '更新成功'
    }
  } catch (err) {
    console.error(err)
    return {
      code: -1,
      message: err.message
    }
  }
}