class Minesweeper {
  constructor() {
    this.gridSize = 10;
    this.mineCount = 20;
    this.lockGame = false;
    this.firstMove = true;
    this.debugMode = false;
    this.grid = document.querySelector("#grid");
    this.setupEventListeners();
    this.generateGrid();
  }

  setupEventListeners() {
    document.getElementById("reset").addEventListener("click", () => {
      minesweeper.generateGrid();
    });

    const applySettingsBtn = document.getElementById("applySettings");
    applySettingsBtn.addEventListener("click", () => {
      this.gridSize = parseInt(document.getElementById("gridSize").value);
      this.mineCount = parseInt(document.getElementById("mines").value);
      if (this.mineCount > this.gridSize * this.gridSize) {
        alert("Mines cannot exceed grid size");
        document.getElementById("mines").value = 20;
      } else {
        minesweeper.generateGrid();
      }
    });
  }

  generateGrid() {
    this.lockGame = false;
    this.firstMove = true;
    this.grid.innerHTML = "";

    for (let i = 0; i < this.gridSize; i++) {
      const row = this.grid.insertRow(i);
      for (let j = 0; j < this.gridSize; j++) {
        const cell = row.insertCell(j);
        cell.onclick = () => this.init(cell);
        cell.addEventListener("contextmenu", (e) =>{this.handleContextMenu(e, cell)})
        cell.setAttribute("mine", "false");
      }
    }

    this.generateMines();
  }

  generateMines() {
    for (let i = 0; i < this.mineCount; i++) {
      const row = Math.floor(Math.random() * this.gridSize);
      const col = Math.floor(Math.random() * this.gridSize);
      const cell = this.grid.rows[row].cells[col];
      cell.setAttribute("mine", "true");
      if (this.debugMode) {
        cell.innerHTML = "X";
      }
    }
  }

  handleContextMenu(event, cell) {
    event.preventDefault(); // Предотвращаем стандартное контекстное меню браузера
    if (!this.lockGame && !cell.classList.contains("active")) {
      if (cell.classList.contains("flag")) {
        cell.classList.remove("flag");
        cell.innerHTML = "";
      } else {
        cell.classList.add("flag"); 
        cell.innerHTML = "🚩";
      }
    }
  }

  revealMines() {
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const cell = this.grid.rows[i].cells[j];
        if (cell.getAttribute("mine") === "true") {
          cell.className = "mine";
        }
      }
    }
  }

  checkGameComplete() {
    let gameComplete = true;
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const cell = this.grid.rows[i].cells[j];
        if (cell.getAttribute("mine") === "false" && cell.innerHTML == "") {
          gameComplete = false;
        }
      }
    }

    if (gameComplete) {
      this.revealMines();
      alert("Game Complete");
    }
  }

  init(cell) {
    if (this.lockGame || cell.classList.contains("active")) {
      return;
    } else {
      if (this.firstMove && cell.getAttribute("mine") === "true") {
        this.firstMove = false;
        this.moveMineAwayFromCell(cell);
      }

      if (cell.getAttribute("mine") === "true") {
        this.revealMines();
        this.lockGame = true;
      } else {
        cell.className = "active";
        let mines = 0;
        const cellRow = cell.parentNode.rowIndex;
        const cellCol = cell.cellIndex;

        for (
          let i = Math.max(cellRow - 1, 0);
          i <= Math.min(cellRow + 1, this.gridSize - 1);
          i++
        ) {
          for (
            let j = Math.max(cellCol - 1, 0);
            j <= Math.min(cellCol + 1, this.gridSize - 1);
            j++
          ) {
            const adjacentCell = this.grid.rows[i].cells[j];
            if (
              adjacentCell.getAttribute("mine") === "true" &&
              !adjacentCell.classList.contains("active")
            ) {
              mines++;
            }
          }
        }
        if (mines !== 0) {
          cell.innerHTML = mines;
        }
        if (mines === 0) {
          for (
            let i = Math.max(cellRow - 1, 0);
            i <= Math.min(cellRow + 1, this.gridSize - 1);
            i++
          ) {
            for (
              let j = Math.max(cellCol - 1, 0);
              j <= Math.min(cellCol + 1, this.gridSize - 1);
              j++
            ) {
              const adjacentCell = this.grid.rows[i].cells[j];
              if (
                !adjacentCell.classList.contains("active") &&
                adjacentCell.innerHTML === ""
              ) {
                this.init(adjacentCell);
              }
            }
          }
        }
        this.checkGameComplete();
      }
    }
  }

  moveMineAwayFromCell(cell) {
    cell.setAttribute("mine", "false");
    cell.innerHTML = "";

    const emptyCells = [];
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const currCell = this.grid.rows[i].cells[j];
        if (currCell.getAttribute("mine") === "false" && currCell !== cell) {
          emptyCells.push(currCell);
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const newCell = emptyCells[randomIndex];
      newCell.setAttribute("mine", "true");
      if (this.debugMode) {
        newCell.innerHTML = "X";
      }
    }
  }
}

const minesweeper = new Minesweeper();
