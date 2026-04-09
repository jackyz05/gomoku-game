// 五子棋游戏主入口文件

import { GomokuUI } from './ui.js';

// 当DOM加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new GomokuUI();
});