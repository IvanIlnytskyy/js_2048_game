'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let i = 0; i < this.size; i++) {
      const row = this.board[i].filter((val) => val !== 0); // тільки ненульові
      const newRow = [];

      for (let j = 0; j < row.length; j++) {
        // Перевірка на об'єднання
        if (row[j] === row[j + 1]) {
          newRow.push(row[j] * 2);
          this.score += row[j] * 2;
          j++; // пропускаємо наступне число
        } else {
          newRow.push(row[j]);
        }
      }

      while (newRow.length < this.size) {
        newRow.push(0);
      }

      if (!this.arraysEqual(this.board[i], newRow)) {
        this.board[i] = newRow;
        moved = true;
      }
    }

    if (moved) {
      this.checkWin();
      this.addRandomTile();
      this.checkLose();
    }

    return moved;
  }
  arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }

    return arr1.every((val, i) => val === arr2[i]);
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let i = 0; i < this.size; i++) {
      // 🔁 Реверс рядка
      const row = [...this.board[i]].reverse().filter((val) => val !== 0);
      const newRow = [];

      for (let j = 0; j < row.length; j++) {
        if (row[j] === row[j + 1]) {
          newRow.push(row[j] * 2);
          this.score += row[j] * 2;
          j++;
          moved = true;
        } else {
          newRow.push(row[j]);

          if (this.board[i][this.size - 1 - j] !== row[j]) {
            moved = true;
          }
        }
      }

      while (newRow.length < this.size) {
        newRow.push(0);
      }

      // 🔁 Перевертаємо назад
      this.board[i] = newRow.reverse();
    }

    if (moved) {
      this.checkWin();
      this.addRandomTile();
      this.checkLose();
    }
  }
  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let col = 0; col < this.size; col++) {
      // ⬆️ Зчитуємо колонку
      const column = [];

      for (let row = 0; row < this.size; row++) {
        if (this.board[row][col] !== 0) {
          column.push(this.board[row][col]);
        }
      }

      const newCol = [];

      for (let i = 0; i < column.length; i++) {
        if (column[i] === column[i + 1]) {
          newCol.push(column[i] * 2);
          this.score += column[i] * 2;
          i++;
          moved = true;
        } else {
          newCol.push(column[i]);

          if (this.board[i][col] !== column[i]) {
            moved = true;
          }
        }
      }

      while (newCol.length < this.size) {
        newCol.push(0);
      }

      // ⬇️ Записуємо колонку назад
      for (let row = 0; row < this.size; row++) {
        if (this.board[row][col] !== newCol[row]) {
          this.board[row][col] = newCol[row];
          moved = true;
        }
      }
    }

    if (moved) {
      this.checkWin();
      this.addRandomTile();
      this.checkLose();
    }
  }
  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let col = 0; col < this.size; col++) {
      // 🔁 Зчитуємо колонку в зворотному порядку
      const column = [];

      for (let row = this.size - 1; row >= 0; row--) {
        if (this.board[row][col] !== 0) {
          column.push(this.board[row][col]);
        }
      }

      const newCol = [];

      for (let i = 0; i < column.length; i++) {
        if (column[i] === column[i + 1]) {
          newCol.push(column[i] * 2);
          this.score += column[i] * 2;
          i++;
          moved = true;
        } else {
          newCol.push(column[i]);

          if (this.board[this.size - 1 - i][col] !== column[i]) {
            moved = true;
          }
        }
      }

      while (newCol.length < this.size) {
        newCol.push(0);
      }

      // 🔁 Запис назад у зворотному напрямку
      for (let row = this.size - 1; row >= 0; row--) {
        const index = this.size - 1 - row;

        if (this.board[row][col] !== newCol[index]) {
          this.board[row][col] = newCol[index];
          moved = true;
        }
      }
    }

    if (moved) {
      this.checkWin();
      this.addRandomTile();
      this.checkLose();
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.board.map((row) => [...row]);
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    return this.status;
  }
  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  checkWin() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win'; // Якщо є 2048, змінимо статус на 'win'

          return true;
        }
      }
    }

    return false;
  }

  checkLose() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          return false; // Якщо є порожня клітинка, програшу немає
        }
      }
    }

    // Перевіряємо, чи є можливість об'єднати клітинки
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (
          (col < this.size - 1 &&
            this.board[row][col] === this.board[row][col + 1]) ||
          (row < this.size - 1 &&
            this.board[row][col] === this.board[row + 1][col])
        ) {
          return false; // Якщо є можливість об'єднати, програшу ще немає
        }
      }
    }
    this.status = 'lose'; // Якщо немає ходів, встановлюємо програш

    return true;
  }

  /**
   * Starts the game.
   */
  start() {
    if (this.status === 'idle') {
      this.status = 'playing';
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  /**
   * Resets the game.
   */
  constructor(initialState) {
    // eslint-disable-next-line no-console
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : Array.from({ length: this.size }, () => Array(this.size).fill(0));

    this.board = this.initialState.map((row) => [...row]);
  }

  restart() {
    this.status = 'idle';
    this.score = 0;
    this.board = this.initialState.map((row) => [...row]);
  }
}

module.exports = Game;
