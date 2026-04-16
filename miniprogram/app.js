// app.js
App({
  globalData: {
    env: "cloudbase-7gsnbl9n078289bd"
  },

  onLaunch: function () {
    console.log('App onLaunch, env:', this.globalData.env);
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        env: this.globalData.env,
        traceUser: true,
      });
      console.log('wx.cloud.init 完成');
    }
  }
});
