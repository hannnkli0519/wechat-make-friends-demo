// pages/messages/index.js
Page({
  data: {
    messageList: [],
    loading: false
  },

  onLoad() {
    this.loadMessages();
  },

  onShow() {
    this.loadMessages();
  },

  loadMessages() {
    var that = this;
    
    this.setData({ loading: true });
    
    wx.cloud.callFunction({
      name: 'getMessages',
      success: function(res) {
        console.log('获取消息列表成功:', res.result);
        
        if (res.result.code === 0) {
          that.setData({ 
            messageList: res.result.data || [],
            loading: false
          });
        } else {
          console.error('获取失败:', res.result.message);
          wx.showToast({ title: '加载失败', icon: 'none' });
          that.setData({ loading: false });
        }
      },
      fail: function(err) {
        console.error('调用云函数失败:', err);
        wx.showToast({ title: '网络错误', icon: 'none' });
        that.setData({ loading: false });
      }
    });
  },

  onMessageTap(e) {
    const userId = e.currentTarget.dataset.userid;
    const message = this.data.messageList.find(m => m.userId === userId);

    if (message) {
      wx.navigateTo({
        url: `/pages/chat/index?userId=${userId}&userName=${message.name}&userAvatar=${message.avatar}`
      });
    }
  },

  onScrollToLower() {
    console.log('滚动到底部，加载更多');
  }
});