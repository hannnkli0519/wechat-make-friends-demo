// pages/chat/index.js
const { mockChatMessages, mockProfile } = require('../../utils/mockData');

Page({
  data: {
    userName: '',
    userAvatar: '',
    userId: 0,
    myAvatar: '',
    messages: [],
    inputText: ''
  },

  onLoad(options) {
    const userName = options.userName || '对方';
    const userAvatar = options.userAvatar || '';
    const userId = parseInt(options.userId) || 0;

    // 获取自己的头像
    const profile = wx.getStorageSync('profile') || mockProfile;
    const myAvatar = profile.avatar || '';

    // 加载聊天记录
    const chatKey = `chat_${userId}`;
    let messages = wx.getStorageSync(chatKey);
    if (!messages || messages.length === 0) {
      // 使用模拟数据
      messages = mockChatMessages.slice();
    }

    this.setData({
      userName,
      userAvatar,
      userId,
      myAvatar,
      messages
    });

    // 滚动到底部
    wx.nextTick(() => {
      this.scrollToBottom();
    });
  },

  // 输入框内容变化
  onInputChange(e) {
    this.setData({
      inputText: e.detail.value
    });
  },

  // 发送消息
  onSendMessage() {
    const { inputText, messages } = this.data;

    if (!inputText.trim()) {
      return;
    }

    const newMessage = {
      id: messages.length + 1,
      senderId: 0,
      content: inputText.trim(),
      time: this.getCurrentTime(),
      isSelf: true
    };

    messages.push(newMessage);

    // 保存到本地存储
    const chatKey = `chat_${this.data.userId}`;
    wx.setStorageSync(chatKey, messages);

    this.setData({
      messages: messages,
      inputText: ''
    });

    // 滚动到底部
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);

    // 模拟对方回复
    this.simulateReply();
  },

  // 模拟对方回复
  simulateReply() {
    setTimeout(() => {
      const replies = [
        '好的呀~',
        '哈哈，你说得对',
        '嗯嗯',
        '真的吗？',
        '太棒了！',
        '我也这么觉得'
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const newMessage = {
        id: this.data.messages.length + 1,
        senderId: this.data.userId,
        content: randomReply,
        time: this.getCurrentTime(),
        isSelf: false
      };

      const messages = this.data.messages;
      messages.push(newMessage);

      // 保存到本地存储
      const chatKey = `chat_${this.data.userId}`;
      wx.setStorageSync(chatKey, messages);

      this.setData({ messages });

      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    }, 1000);
  },

  // 获取当前时间
  getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  },

  // 滚动到底部
  scrollToBottom() {
    this.setData({
      scrollToView: `msg-${this.data.messages.length - 1}`
    });
  },

  // 返回
  onBack() {
    wx.navigateBack();
  }
});
