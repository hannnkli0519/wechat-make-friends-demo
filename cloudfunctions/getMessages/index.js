// cloudfunctions/getMessages/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 获取消息列表
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const currentUserId = wxContext.OPENID

  try {
    // 获取匹配的用户
    const matches = await db.collection('user_matches')
      .where({
        userId1: currentUserId
      })
      .get()

    // 获取对方的信息
    const userIds = matches.data.map(m => m.userId2)

    if (userIds.length === 0) {
      return {
        code: 0,
        data: [],
        message: '暂无消息'
      }
    }

    const users = await db.collection('users')
      .where({
        _id: db.command.in(userIds)
      })
      .get()

    // 获取最新一条消息
    const messages = []
    for (const user of users.data) {
      const lastMsg = await db.collection('messages')
        .where({
          $or: [
            { fromId: currentUserId, toId: user._id },
            { fromId: user._id, toId: currentUserId }
          ]
        })
        .orderBy('createTime', 'desc')
        .limit(1)
        .get()

      // 获取未读数
      const unreadCount = await db.collection('messages')
        .where({
          fromId: user._id,
          toId: currentUserId,
          read: false
        })
        .count()

      messages.push({
        userId: user._id,
        name: user.name,
        avatar: user.avatar,
        lastMessage: lastMsg.data.length > 0 ? lastMsg.data[0].content : '开始聊天吧',
        time: lastMsg.data.length > 0 ? formatTime(lastMsg.data[0].createTime) : '',
        unreadCount: unreadCount.total
      })
    }

    return {
      code: 0,
      data: messages,
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
  const d = new Date(date)
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}
