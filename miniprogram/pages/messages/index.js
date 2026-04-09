// pages/messages/index.js
const { mockMessages } = require('../../utils/mockData');

Page({
  data: {
    messageList: []
  },

  onLoad() {
    this.loadMessages();
  },

  onShow() {
    this.loadMessages();
  },

  loadMessages() {
    const matchedUsers = wx.getStorageSync('matchedUsers') || [];

    let messages = mockMessages.slice();

    matchedUsers.forEach(user => {
      if (!messages.find(m => m.userId === user.id)) {
        messages.push({
          userId: user.id,
          name: user.name,
          avatar: user.avatar,
          lastMessage: '开始聊天吧',
          time: '刚刚',
          unreadCount: 0
        });
      }
    });

    if (matchedUsers.length === 0) {
      messages = [];
    }

    this.setData({
      messageList: messages
    });
  },

  onMessageTap(e) {
    const userId = e.currentTarget.dataset.userid;
    const message = this.data.messageList.find(m => m.userId === userId);

    if (message) {
      message.unreadCount = 0;
      this.setData({ messageList: this.data.messageList });

      wx.navigateTo({
        url: `/pages/chat/index?userId=${userId}&userName=${message.name}&userAvatar=${message.avatar}`
      });
    }
  },

  onScrollToLower() {
    console.log('滚动到底部，加载更多');
  }
});
