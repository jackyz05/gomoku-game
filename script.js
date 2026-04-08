// 五子棋游戏主逻辑

// 游戏状态常量
const GAME_STATES = {
    PLAYING: 'playing',
    BLACK_WIN: 'black_win',
    WHITE_WIN: 'white_win',
    DRAW: 'draw'
};

// 玩家常量
const PLAYERS = {
    BLACK: 'black',
    WHITE: 'white'
};

// 游戏配置
const CONFIG = {
    BOARD_SIZE: 15,
    WIN_LENGTH: 5
};

/**
 * 五子棋游戏类
 */
class GomokuGame {
    constructor() {
        this.board = this.createEmptyBoard();
        this.currentPlayer = PLAYERS.BLACK;
        this.gameState = GAME_STATES.PLAYING;
        this.moveHistory = [];
        this.gameBoard = document.getElementById('gameBoard');
        this.currentPlayerDisplay = document.getElementById('currentPlayer');
        this.gameStatusDisplay = document.getElementById('gameStatus');
        this.restartBtn = document.getElementById('restartBtn');
        this.undoBtn = document.getElementById('undoBtn');

        this.initializeGame();
        this.setupEventListeners();
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

        for (let row = 0; row < CONFIG.BOARD_SIZE; row++) {
            for (let col = 0; col < CONFIG.BOARD_SIZE; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;

                // 如果有棋子，添加对应的类
                if (this.board[row][col]) {
                    cell.classList.add(this.board[row][col]);
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
                this.makeMove(row, col);
            }
        });

        // 重新开始按钮
        this.restartBtn.addEventListener('click', () => {
            this.restartGame();
        });

        // 悔棋按钮
        this.undoBtn.addEventListener('click', () => {
            this.undoMove();
        });
    }

    /**
     * 下棋
     */
    makeMove(row, col) {
        // 检查游戏状态和位置是否可用
        if (this.gameState !== GAME_STATES.PLAYING || this.board[row][col] !== null) {
            return;
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

        // 更新显示
        this.renderBoard();
        this.updateDisplay();
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
            return;
        }

        // 移除最后一步
        const lastMove = this.moveHistory.pop();
        this.board[lastMove.row][lastMove.col] = null;

        // 重置游戏状态
        this.gameState = GAME_STATES.PLAYING;
        // 悔棋后应该轮到对手下棋，而不是最后一步的玩家
        this.currentPlayer = lastMove.player === PLAYERS.BLACK ? PLAYERS.WHITE : PLAYERS.BLACK;

        // 更新显示
        this.renderBoard();
        this.updateDisplay();
    }

    /**
     * 重新开始游戏
     */
    restartGame() {
        this.board = this.createEmptyBoard();
        this.currentPlayer = PLAYERS.BLACK;
        this.gameState = GAME_STATES.PLAYING;
        this.moveHistory = [];

        this.renderBoard();
        this.updateDisplay();
    }

    /**
     * 更新显示
     */
    updateDisplay() {
        // 更新当前玩家显示
        const playerText = this.currentPlayer === PLAYERS.BLACK ? '黑子' : '白子';
        this.currentPlayerDisplay.textContent = playerText;

        // 更新游戏状态显示
        switch (this.gameState) {
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
        this.undoBtn.disabled = this.moveHistory.length === 0 || this.gameState !== GAME_STATES.PLAYING;
    }
}

// 当DOM加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new GomokuGame();
});