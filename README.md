# 相亲小程序 (WeChat Make Friends Demo)

一个基于微信小程序的相亲交友小程序，包含推荐、匹配、聊天等核心功能。

## 功能特性

- **推荐页面**：展示用户卡片，支持喜欢/跳过操作
- **消息列表**：显示匹配用户的消息列表和未读角标
- **即时聊天**：匹配用户之间可以实时聊天
- **个人资料**：展示访客数、喜欢数、匹配数等统计信息
- **资料编辑**：编辑昵称、年龄、城市、职业、照片、兴趣爱好
- **我喜欢的**：查看已点击喜欢的用户列表
- **喜欢我的**：查看喜欢自己的用户，支持回应匹配
- **筛选功能**：按年龄范围、城市、兴趣标签筛选推荐用户

## 技术栈

- 微信小程序原生开发 (wxml + wxss + js)
- 微信云开发（云函数 + 云数据库）
- Flex 布局

## 项目结构

```
相亲App/
├── miniprogram/
│   ├── app.js / app.json / app.wxss
│   ├── utils/mockData.js
│   └── pages/
│       ├── home/           # 推荐页
│       ├── messages/       # 消息页
│       ├── profile/        # 我的页面
│       ├── profile-edit/   # 编辑资料
│       ├── mylikes/        # 我喜欢的
│       ├── likesme/        # 喜欢我的
│       ├── chat/           # 聊天页
│       └── filter/         # 筛选页
├── cloudfunctions/
│   ├── getUserList/        # 获取推荐用户列表
│   ├── likeUser/           # 喜欢用户
│   ├── respondLike/        # 回应喜欢
│   ├── getMessages/        # 获取消息列表
│   └── getMatches/         # 获取喜欢我的用户
└── project.config.json
```

## 云开发数据库集合

| 集合名 | 用途 |
|--------|------|
| users | 用户资料表 |
| user_likes | 喜欢关系表 |
| user_skips | 跳过关系表 |
| user_matches | 匹配关系表 |
| messages | 消息记录表 |

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
