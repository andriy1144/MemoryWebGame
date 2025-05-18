document.addEventListener("DOMContentLoaded", () => {
    const gridContainer = document.querySelector(".game-grid");
    const levelDisplay = document.createElement("h2");
    levelDisplay.textContent = "Рівень: 1";
    document.querySelector(".main-container").insertBefore(levelDisplay, gridContainer);
  
    let level = 1;
    let gridSize = 3;
    let pattern = [];
    let playerInput = [];
    let acceptingInput = false;
  
    function updateGridSize() {
      gridSize = 3 + Math.floor((level - 1) / 5);
      gridContainer.innerHTML = "";
      gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
      gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
      for (let i = 0; i < gridSize * gridSize; i++) {
        const div = document.createElement("div");
        div.classList.add("grid-cell");
        div.dataset.index = i;
        gridContainer.appendChild(div);
      }
    }
  
    function generatePattern() {
      const total = gridSize * gridSize;
      const length = 3 + Math.floor(level / 2);
      const indices = new Set();
      while (indices.size < length) {
        indices.add(Math.floor(Math.random() * total));
      }
      return Array.from(indices);
    }
  
    function showPattern(callback) {
      const cells = document.querySelectorAll(".grid-cell");
      let delay = 0;
      pattern.forEach((index, i) => {
        setTimeout(() => {
          cells[index].classList.add("active");
          setTimeout(() => cells[index].classList.remove("active"), 500);
          if (i === pattern.length - 1 && callback) {
            setTimeout(callback, 500);
          }
        }, delay);
        delay += 700;
      });
    }
  
    function indicateUserTurn() {
      document.querySelectorAll(".grid-cell").forEach(cell => {
        cell.classList.add("user-turn");
      });
      setTimeout(() => {
        document.querySelectorAll(".grid-cell").forEach(cell => {
          cell.classList.remove("user-turn");
        });
      }, 1000);
    }
  
    function handleError() {
        const cells = document.querySelectorAll(".grid-cell");
        const nextIndex = pattern[playerInput.length];
        const correctCell = cells[nextIndex];
      
        if (correctCell) {
          correctCell.classList.add("error");
          setTimeout(() => {
            correctCell.classList.remove("error");
          }, 1000);
        }
      }
      
  
    function startGame() {
      levelDisplay.textContent = `Рівень: ${level}`;
      updateGridSize();
      pattern = generatePattern();
      playerInput = [];
      acceptingInput = false;
      showPattern(() => {
        acceptingInput = true;
        indicateUserTurn();
      });
    }
  
    gridContainer.addEventListener("click", (e) => {
      if (!acceptingInput || !e.target.classList.contains("grid-cell")) return;
  
      const index = Number(e.target.dataset.index);
      const expected = pattern[playerInput.length];
      if (index === expected) {
        e.target.classList.add("active");
        playerInput.push(index);
        if (playerInput.length === pattern.length) {
          acceptingInput = false;
          level++;
          setTimeout(startGame, 1000);
        }
      } else {
        acceptingInput = false;
        handleError();
        setTimeout(startGame, 1500); // restart the level
      }
    });
  
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" && !acceptingInput) {
        startGame();
      }
    });
  });
  