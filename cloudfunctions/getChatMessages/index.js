// cloudfunctions/getChatMessages/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const currentUserId = wxContext.OPENID
  const { targetUserId } = event

  try {
    // 获取聊天记录
    const messages = await db.collection('messages')
      .where({
        $or: [
          { fromId: currentUserId, toId: targetUserId },
          { fromId: targetUserId, toId: currentUserId }
        ]
      })
      .orderBy('createTime', 'asc')
      .get()

    // 标记消息为已读
    const unreadMessages = await db.collection('messages')
      .where({
        fromId: targetUserId,
        toId: currentUserId,
        read: false
      })
      .get()

    if (unreadMessages.data.length > 0) {
      const updatePromises = unreadMessages.data.map(msg => 
        db.collection('messages').doc(msg._id).update({
          data: { read: true }
        })
      )
      await Promise.all(updatePromises)
    }

    const formattedMessages = messages.data.map(msg => ({
      id: msg._id,
      senderId: msg.fromId,
      content: msg.content,
      time: formatTime(msg.createTime),
      isSelf: msg.fromId === currentUserId
    }))

    return {
      code: 0,
      data: formattedMessages,
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

function formatTime(date) {
  if (!date) return ''
  
  // 云函数环境是 UTC 时间，需要手动加 8 小时转为北京时间
  const msgDate = new Date(new Date(date).getTime() + 8 * 60 * 60 * 1000)
  const hours = String(msgDate.getHours()).padStart(2, '0')
  const minutes = String(msgDate.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}