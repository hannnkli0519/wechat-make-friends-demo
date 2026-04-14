// pages/chat/index.js
Page({
  data: {
    userName: '',
    userAvatar: '',
    userId: '',
    myAvatar: '',
    messages: [],
    inputText: '',
    loading: false
  },

  onLoad(options) {
    const userName = options.userName || '对方';
    const userAvatar = options.userAvatar || '';
    const userId = options.userId || '';

    this.setData({
      userName,
      userAvatar,
      userId
    });

    this.loadMyProfile();
    this.loadChatMessages();
  },

  loadMyProfile() {
    var that = this;
    
    wx.cloud.callFunction({
      name: 'getUserProfile',
      success: function(res) {
        if (res.result.code === 0) {
          that.setData({
            myAvatar: res.result.data.avatar || ''
          });
        }
      },
      fail: function(err) {
        console.error('获取个人资料失败:', err);
      }
    });
  },

  loadChatMessages() {
    var that = this;
    
    this.setData({ loading: true });
    
    wx.cloud.callFunction({
      name: 'getChatMessages',
      data: {
        targetUserId: this.data.userId
      },
      success: function(res) {
        console.log('获取聊天记录成功:', res.result);
        
        if (res.result.code === 0) {
          that.setData({ 
            messages: res.result.data || [],
            loading: false
          });
          
          // 滚动到底部
          wx.nextTick(() => {
            that.scrollToBottom();
          });
        } else {
          console.error('获取失败:', res.result.message);
          that.setData({ loading: false });
        }
      },
      fail: function(err) {
        console.error('调用云函数失败:', err);
        that.setData({ loading: false });
      }
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
    const { inputText, userId } = this.data;

    if (!inputText.trim()) {
      return;
    }

    var that = this;

    wx.cloud.callFunction({
      name: 'sendMessage',
      data: {
        targetUserId: userId,
        content: inputText.trim()
      },
      success: function(res) {
        if (res.result.code === 0) {
          // 重新加载聊天记录以确保数据同步
          that.loadChatMessages();
        } else {
          wx.showToast({ title: '发送失败', icon: 'none' });
        }
      },
      fail: function(err) {
        console.error('发送消息失败:', err);
        wx.showToast({ title: '发送失败', icon: 'none' });
      }
    });
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