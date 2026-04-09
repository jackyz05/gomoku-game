// 五子棋游戏核心逻辑

import { GAME_STATES, PLAYERS, CONFIG } from './constants.js';

/**
 * 五子棋游戏类
 */
export class GomokuGame {
    constructor() {
        this.board = this.createEmptyBoard();
        this.currentPlayer = PLAYERS.BLACK;
        this.gameState = GAME_STATES.PLAYING;
        this.moveHistory = [];
    }

    /**
     * 创建空棋盘
     */
    createEmptyBoard() {
        return Array(CONFIG.BOARD_SIZE).fill(null).map(() =>
            Array(CONFIG.BOARD_SIZE).fill(null)
        );
    }

    /**
     * 下棋
     */
    makeMove(row, col) {
        // 检查游戏状态和位置是否可用
        if (this.gameState !== GAME_STATES.PLAYING || this.board[row][col] !== null) {
            return false;
        }

        // 放置棋子
        this.board[row][col] = this.currentPlayer;
        this.moveHistory.push({ row, col, player: this.currentPlayer });

        // 检查是否获胜
        if (this.checkWin(row, col)) {
            this.gameState = this.currentPlayer === PLAYERS.BLACK ? GAME_STATES.BLACK_WIN : GAME_STATES.WHITE_WIN;
        } else if (this.checkDraw()) {
            // 检查是否平局
            this.gameState = GAME_STATES.DRAW;
        } else {
            // 切换玩家
            this.currentPlayer = this.currentPlayer === PLAYERS.BLACK ? PLAYERS.WHITE : PLAYERS.BLACK;
        }

        return true;
    }

    /**
     * 检查是否获胜
     */
    checkWin(row, col) {
        const player = this.board[row][col];
        const directions = [
            [0, 1],   // 水平
            [1, 0],   // 垂直
            [1, 1],   // 对角线 \
            [1, -1]   // 对角线 /
        ];

        for (const [dx, dy] of directions) {
            let count = 1; // 当前位置已经有一个棋子

            // 向一个方向检查
            for (let i = 1; i < CONFIG.WIN_LENGTH; i++) {
                const newRow = row + dx * i;
                const newCol = col + dy * i;
                if (this.isValidPosition(newRow, newCol) && this.board[newRow][newCol] === player) {
                    count++;
                } else {
                    break;
                }
            }

            // 向相反方向检查
            for (let i = 1; i < CONFIG.WIN_LENGTH; i++) {
                const newRow = row - dx * i;
                const newCol = col - dy * i;
                if (this.isValidPosition(newRow, newCol) && this.board[newRow][newCol] === player) {
                    count++;
                } else {
                    break;
                }
            }

            if (count >= CONFIG.WIN_LENGTH) {
                return true;
            }
        }

        return false;
    }

    /**
     * 检查位置是否有效
     */
    isValidPosition(row, col) {
        return row >= 0 && row < CONFIG.BOARD_SIZE && col >= 0 && col < CONFIG.BOARD_SIZE;
    }

    /**
     * 检查是否平局（棋盘已满且无获胜者）
     */
    checkDraw() {
        for (let row = 0; row < CONFIG.BOARD_SIZE; row++) {
            for (let col = 0; col < CONFIG.BOARD_SIZE; col++) {
                if (this.board[row][col] === null) {
                    return false; // 还有空位，不是平局
                }
            }
        }
        return true; // 棋盘已满，平局
    }

    /**
     * 悔棋
     */
    undoMove() {
        // 游戏结束后不能悔棋
        if (this.moveHistory.length === 0 || this.gameState !== GAME_STATES.PLAYING) {
            return false;
        }

        // 移除最后一步
        const lastMove = this.moveHistory.pop();
        this.board[lastMove.row][lastMove.col] = null;

        // 重置游戏状态
        this.gameState = GAME_STATES.PLAYING;
        // 修正：悔棋后应该轮到刚刚下棋的玩家再次下棋
        this.currentPlayer = lastMove.player;

        return true;
    }

    /**
     * 重新开始游戏
     */
    restartGame() {
        this.board = this.createEmptyBoard();
        this.currentPlayer = PLAYERS.BLACK;
        this.gameState = GAME_STATES.PLAYING;
        this.moveHistory = [];
    }

    /**
     * 获取当前游戏状态
     */
    getGameState() {
        return {
            board: this.board,
            currentPlayer: this.currentPlayer,
            gameState: this.gameState,
            moveHistory: this.moveHistory
        };
    }
}