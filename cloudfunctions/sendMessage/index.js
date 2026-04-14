// cloudfunctions/sendMessage/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const currentUserId = wxContext.OPENID
  const { targetUserId, content } = event

  try {
    const result = await db.collection('messages').add({
      data: {
        fromId: currentUserId,
        toId: targetUserId,
        content: content,
        createTime: db.serverDate(),
        read: false
      }
    })

    return {
      code: 0,
      data: { messageId: result._id },
      message: '发送成功'
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