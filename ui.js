// 五子棋游戏用户界面处理

import { GAME_STATES, PLAYERS } from './constants.js';
import { GomokuGame } from './game.js';

/**
 * 五子棋游戏UI类
 */
export class GomokuUI {
    constructor() {
        this.game = new GomokuGame();
        this.gameBoard = document.getElementById('gameBoard');
        this.currentPlayerDisplay = document.getElementById('currentPlayer');
        this.gameStatusDisplay = document.getElementById('gameStatus');
        this.restartBtn = document.getElementById('restartBtn');
        this.undoBtn = document.getElementById('undoBtn');

        this.initializeGame();
        this.setupEventListeners();
    }

    /**
     * 初始化游戏
     */
    initializeGame() {
        this.renderBoard();
        this.updateDisplay();
    }

    /**
     * 渲染棋盘
     */
    renderBoard() {
        this.gameBoard.innerHTML = '';

        for (let row = 0; row < 15; row++) {
            for (let col = 0; col < 15; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;

                // 如果有棋子，添加对应的类
                if (this.game.board[row][col]) {
                    cell.classList.add(this.game.board[row][col]);
                }

                this.gameBoard.appendChild(cell);
            }
        }
    }

    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 棋盘点击事件
        this.gameBoard.addEventListener('click', (e) => {
            if (e.target.classList.contains('cell')) {
                const row = parseInt(e.target.dataset.row);
                const col = parseInt(e.target.dataset.col);
                this.handleMove(row, col);
            }
        });

        // 重新开始按钮
        this.restartBtn.addEventListener('click', () => {
            this.handleRestart();
        });

        // 悔棋按钮
        this.undoBtn.addEventListener('click', () => {
            this.handleUndo();
        });
    }

    /**
     * 处理下棋
     */
    handleMove(row, col) {
        const success = this.game.makeMove(row, col);
        if (success) {
            this.renderBoard();
            this.updateDisplay();
        }
    }

    /**
     * 处理重新开始
     */
    handleRestart() {
        this.game.restartGame();
        this.renderBoard();
        this.updateDisplay();
    }

    /**
     * 处理悔棋
     */
    handleUndo() {
        const success = this.game.undoMove();
        if (success) {
            this.renderBoard();
            this.updateDisplay();
        }
    }

    /**
     * 更新显示
     */
    updateDisplay() {
        // 更新当前玩家显示
        const playerText = this.game.currentPlayer === PLAYERS.BLACK ? '黑子' : '白子';
        this.currentPlayerDisplay.textContent = playerText;

        // 更新游戏状态显示
        switch (this.game.gameState) {
            case GAME_STATES.BLACK_WIN:
                this.gameStatusDisplay.textContent = '黑子获胜！';
                this.gameStatusDisplay.style.color = '#28a745';
                break;
            case GAME_STATES.WHITE_WIN:
                this.gameStatusDisplay.textContent = '白子获胜！';
                this.gameStatusDisplay.style.color = '#dc3545';
                break;
            case GAME_STATES.DRAW:
                this.gameStatusDisplay.textContent = '平局！';
                this.gameStatusDisplay.style.color = '#ffc107';
                break;
            default:
                this.gameStatusDisplay.textContent = '游戏进行中';
                this.gameStatusDisplay.style.color = '#007bff';
        }

        // 更新悔棋按钮状态
        this.undoBtn.disabled = this.game.moveHistory.length === 0 || this.game.gameState !== GAME_STATES.PLAYING;
    }
}