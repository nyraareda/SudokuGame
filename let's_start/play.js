let timerInterval;
let sudokuGame;

window.onload = function () {
  let timer = document.querySelector("h2");
  const timerDuration = 120;
  let timeRemaining = timerDuration;

  // Updates the display of a timer element based on the time remaining.

  function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const displayMinutes = String(minutes).padStart(2, "0");
    const displaySeconds = String(seconds).padStart(2, "0");
    timer.innerText = ` ${displayMinutes}:${displaySeconds}`;
  }
  // Starts a countdown timer and updates the display every second
  function startTimer() {
    timerInterval = setInterval(function () {
      timeRemaining--;

      if (timeRemaining <= 0) {
        // Timer has reached zero, perform any action needed here
        updateTimerDisplay(); // Update timer display with "00:00" before showing the alert
        clearInterval(timerInterval);
        successAlertOfRegistration();
      } else {
        updateTimerDisplay();
      }
    }, 1000);
    //   Displays an alert when the timer reaches zero
    //  Redirects to the home page if the user chooses to exit
    function successAlertOfRegistration() {
      Swal.fire({
        title: "Unfortunately,Time end You lost:(",
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: "Restart",
        denyButtonText: `Exit`,
        confirmButtonColor: "#581139",
      }).then((result) => {
        window.location.href = `../../home/homePage.html`;
      });
    }
  }
  // Update every 1 second (1000 milliseconds)
  // Start the timer when the window loads
  startTimer();

  class SudokuGame {
    constructor(board) {
      this.board = board;
      this.point = 3;
      this.score = 0;
      this.selectedImage = null;
      this.selectedCell = { row: 0, col: 0 };
      this.initializeBoard();
      flag = 0;
    }
    // Initializes the Sudoku board in the sudoku-container
    //  Also adds event listeners for keyup events to handle keyboard input
    initializeBoard() {
      const container = document.getElementById("sudoku-container");
      const table = document.createElement("table");

      for (let i = 0; i < this.board.length; i++) {
        const row = document.createElement("tr");

        for (let j = 0; j < this.board[i].length; j++) {
          const cell = document.createElement("td");
          const imagePath = this.board[i][j];
          const img = document.createElement("img");
          img.src = imagePath;
          img.alt = imagePath;

          cell.appendChild(img);
          row.appendChild(cell);
        }

        table.appendChild(row);
      }

      container.innerHTML = "";
      container.appendChild(table);

      const firstCell = table.rows[0].cells[0];
      firstCell.classList.add("selected");

      if (flag)
        document.addEventListener("keyup", (event) =>
          this.handleKeyPress(event)
        );
    }
    //  Handles the selection of a cell in the Sudoku

    selectCell(row, col) {
      const previouslySelectedCell = document.querySelector(".selected");
      if (previouslySelectedCell) {
        previouslySelectedCell.classList.remove("selected");
      }

      const cellElement = document.querySelector(
        `#sudoku-container table tr:nth-child(${row + 1}) td:nth-child(${
          col + 1
        })`
      );
      cellElement.classList.add("selected");

      this.selectedCell = { row, col };

      if (this.selectedImage !== null) {
        const isDuplicateInRow = this.board[row].includes(this.selectedImage);
        const isDuplicateInColumn = this.board.some(
          (rowArray) => rowArray[col] === this.selectedImage
        );

        let img = document.getElementById("point").children;

        //  Updates the selected cell checks for duplicates in the row and column and performs actions
        if (isDuplicateInRow || isDuplicateInColumn) {
          this.point--;
          console.log(img);
          if (this.point < 3) {
            // Find the first visible image and hide it
            for (let i = 0; i < img.length; i++) {
              if (img[i].style.display !== "none") {
                img[i].style.display = "none";
                break;
              }
            }
          }

          console.log(this.point);
          if (this.point === 0) {
            clearInterval(timerInterval);
            Swal.fire({
              title: "You lost all your chances:(",
              showDenyButton: false,
              showCancelButton: false,
              confirmButtonText: "Restart",
              denyButtonText: `Exit`,
              confirmButtonColor: "#581139",
            }).then((result) => {
              window.location.href = `../../home/homePage.html`;
            });
          }
        } else {
          this.board[row][col] = this.selectedImage;
          this.updateBoard();
        }
      }
    }

    selectImage(imagePath) {
      this.selectedImage = imagePath;
    }
    //Update sudoku board
    updateBoard() {
      console.log(timerInterval);
      const table = document.querySelector("#sudoku-container table");

      for (let i = 0; i < this.board.length; i++) {
        for (let j = 0; j < this.board[i].length; j++) {
          const cell = table.rows[i].cells[j];
          const img = cell.firstChild;
          img.src = this.board[i][j];
          img.alt = this.board[i][j];
        }
      }
      const isBoardFilled = this.board.every((row) =>
        row.every((cell) => cell !== "Images/download.jpg")
      );
      //Checks if the board is filled and user don't lose all his chances
      if (isBoardFilled && this.point > 0) {
        clearInterval(timerInterval);
        const getName = (users, name) => {
          return users.find((el) => el.yourName === name);
        };

        let nameLocation = new URLSearchParams(location.search);
        let username = nameLocation.get("name");

        this.score += 10;

        // Update the score for the specific user in the local storage
        let usersData = JSON.parse(localStorage.getItem("usersData")) || [];
        let userToUpdate = getName(usersData, username);
        // Check if the user exists in the local storage
        if (userToUpdate) {
          userToUpdate.score += this.score;
          localStorage.setItem("usersData", JSON.stringify(usersData));

          Swal.fire({
            title: `Congratulations! You won! New score: ${userToUpdate.score}`,
            showDenyButton: false,
            showCancelButton: false,
            confirmButtonText: "Exit;-)",
            denyButtonText: `increase difficulty`,
            confirmButtonColor: "#581139",
          }).then((result) => {
            // Check if the user already exists
            window.location.href = `../../home/homePage.html`;
          });

          return userToUpdate.score;
        }
      }
    }
    //To controll the game by keyboard
    handleKeyPress(event) {
      const key = event.key;

      if (key === "ArrowUp") {
        this.selectedCell.row = Math.max(0, this.selectedCell.row - 1);
      } else if (key === "ArrowDown") {
        this.selectedCell.row = Math.min(
          this.board.length - 1,
          this.selectedCell.row + 1
        );
      } else if (key === "ArrowLeft") {
        this.selectedCell.col = Math.max(0, this.selectedCell.col - 1);
      } else if (key === "ArrowRight") {
        this.selectedCell.col = Math.min(
          this.board[0].length - 1,
          this.selectedCell.col + 1
        );
      } else if (key === "Enter") {
        this.selectCell(this.selectedCell.row, this.selectedCell.col);
      }

      this.selectedCell.row = Math.max(
        0,
        Math.min(this.selectedCell.row, this.board.length - 1)
      );
      this.selectedCell.col = Math.max(
        0,
        Math.min(this.selectedCell.col, this.board[0].length - 1)
      );

      const cellElement = document.querySelector(
        `#sudoku-container table tr:nth-child(${
          this.selectedCell.row + 1
        }) td:nth-child(${this.selectedCell.col + 1})`
      );
      const previouslySelectedCell = document.querySelector(".selected");

      if (previouslySelectedCell) {
        previouslySelectedCell.classList.remove("selected");
      }

      cellElement.classList.add("selected");
    }
  }

  var flag = 1;
  //Function to increase difficulty of the game by increase the board size
  function increaseDifficulty(imagePaths) {
    const newSize = 6;
    const shuffledImages = shuffleArray(imagePaths);
    const initialImages = generateRandomInitialImages(newSize, shuffledImages);
    const newBoard = generateSudokuBoard(
      newSize,
      initialImages,
      "Images/download.jpg"
    );
    sudokuGame.board = newBoard;
    sudokuGame.point = 3;
    sudokuGame.selectedCell = { row: 0, col: 0 };
    sudokuGame.initializeBoard();

    // Reset the timer
    startTimer();
    

    timeRemaining = timerDuration;
    
    updateTimerDisplay();
    clearInterval(timerInterval);
    let item_1 = document.getElementById("item_1");
    item_1.style.display = "inline";
    let item_2 = document.getElementById("item_2");
    item_2.style.display = "inline";
    let td1 = document.getElementById("td1");
    td1.style.display = "inline-block";
    let td2 = document.getElementById("td2");
    td2.style.display = "inline-block";
    document.getElementById("btn").style.display = "none";
  }
  // function to intial image in board when user start play
  function generateRandomInitialImages(size, imagePaths) {
    const initialImages = [];

    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push(imagePaths.pop());
      }
      initialImages.push(row);
    }

    return initialImages;
  }
  // function to generate the board when user increase difficulty
  function generateSudokuBoard(size, initialImages, defaultImage) {
    const board = [];

    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push(initialImages[i][j] || defaultImage);
      }
      board.push(row);
    }

    return board;
  }
  // fuction to make generateRandomInitialImages sperate rondomly
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * 16);
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const initialSize = 4;
  const imagePaths = [
    "Images/1.jpg",
    "Images/2.jpg",
    "Images/3.jpg",
    "Images/4.jpg",
  ];
  const shuffledImages = shuffleArray(imagePaths);
  const initialImages = generateRandomInitialImages(
    initialSize,
    shuffledImages
  );
  const initialBoard = generateSudokuBoard(
    initialSize,
    initialImages,
    "Images/download.jpg"
  );

  sudokuGame = new SudokuGame(initialBoard);
  document.getElementById("btn").addEventListener("click", function () {
    increaseDifficulty([
      "Images/1.jpg",
      "Images/2.jpg",
      "Images/3.jpg",
      "Images/4.jpg",
      "Images/5.jpg",
      "Images/6.jpg",
    ]);
  });

  const numberOptionsParent = document.getElementById("number-options");
  if (numberOptionsParent) {
    // Get all child elements of the parent
    const childElements = numberOptionsParent.children;

    // Iterate over each child element and assign the onclick event
    for (let i = 0; i < childElements.length; i++) {
      const imagePath = `Images/${i + 1}.jpg`;

      // Assign the onclick event dynamically
      childElements[i].onclick = function () {
        sudokuGame.selectImage(imagePath);
      };
    }
  } else {
    console.error("Element with id 'number-options' not found.");
  }
  document.addEventListener("keydown", function (event) {
    if (
      event.key === "1" ||
      event.key === "2" ||
      event.key === "3" ||
      event.key === "4" ||
      event.key === "5" ||
      event.key === "6"
    ) {
      // Get the index of the image to be selected
      var imageIndex = parseInt(event.key) - 1;

      selectImage(imageIndex);
    }
  });
  // Replace old image with your actual image selection code
  function selectImage(index) {
    var imageContainer = document.getElementById("number-options");
    var selectedImage = imageContainer.querySelectorAll("img")[index];

    var allImages = imageContainer.querySelectorAll("img");
    allImages.forEach(function (image) {
      image.style.opacity = 0.5;
    });
    selectedImage.style.opacity = 1;
    // call SudokuGame function to update the board by the selected image
    sudokuGame.selectImage(selectedImage.src);
  }
};
