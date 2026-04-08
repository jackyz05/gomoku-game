# Gomoku Game - 五子棋小游戏

一个使用HTML、CSS和JavaScript实现的前端五子棋游戏。

## 功能特性

- ✅ 15x15标准五子棋棋盘
- ✅ 黑白双方轮流下棋
- ✅ 自动判断胜负（连成5子获胜）
- ✅ 悔棋功能
- ✅ 重新开始游戏
- ✅ 响应式设计，支持移动设备
- ✅ 美观的用户界面

## 游戏规则

1. 黑子先行，白子后行
2. 玩家轮流在棋盘交叉点下棋
3. 率先连成5个棋子的一方获胜
4. 可以横向、纵向或对角线连成5子

## 技术栈

- HTML5
- CSS3（Grid布局、Flexbox、响应式设计）
- JavaScript（ES6+，模块化）

## 项目结构

```
gomoku-game/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── script.js           # 游戏逻辑
├── package.json        # 项目配置
└── README.md           # 项目说明
```

## 使用方法

1. 克隆或下载项目到本地
2. 在项目目录中启动本地服务器：
   ```bash
   npm start
   ```
   或者使用Python简单服务器：
   ```bash
   python3 -m http.server 8000
   ```
3. 在浏览器中访问 `http://localhost:8000`

## 开发规范

本项目遵循CLAUDE.md规范：
- 使用ES模块语法（import/export）
- 使用解构导入
- 添加中文注释
- 完成后进行类型检查

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 许可证

MIT License