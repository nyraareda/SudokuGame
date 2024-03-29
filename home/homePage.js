window.onload = function () {
  class UserRegistration {
    constructor() {
      this.userInput = document.querySelector("input");
      this.logInButton = document.querySelector("button");

      // Retrieve data from local storage or initialize an empty array
      this.usersData = JSON.parse(localStorage.getItem('usersData')) || [];

      this.logInButton.addEventListener("click", this.onClick.bind(this));
    }

    onClick(event) {
      event.preventDefault();

      if (this.userInput.value.trim() === "") {
        this.errorAlert();
        return;
      }

      let cleanedUserName = this.cleanedUserNameInput();
      this.validatedName(cleanedUserName);
    }
//   Cleans up user input by removing leading and trailing whitespaces
//  replacing multiple spaces with a single space
    cleanedUserNameInput() {
      return this.userInput.value.trim().replace(/\s+/g, " ");
    }

    validatedName(userInput) {
      userInput = userInput.toLowerCase().split(" ");

      if (userInput.length < 2) {
        this.errorAlertToContainFnameLname();
      } else {
        for (let i = 0; i < userInput.length; i++) {
          userInput[i] =
            userInput[i].charAt(0).toUpperCase() +
            userInput[i].substring(1).toLowerCase();
        }
        userInput = userInput.join(" ");

        // Check if the user already exists
        if (this.isUserNameMatch(userInput)) {
       window.location.href=`../../game/gamePage.html?name=${userInput}`; 
        } else {
          // User is new, show the registration alert
          this.successAlertOfRegistration(userInput);
        }
      }
    }

    isUserNameMatch(userInput) {
      // Check if the user already exists
      return this.usersData.some(user => user.yourName && user.yourName.toLowerCase() === userInput.toLowerCase());
    }

    errorAlert() {
      Swal.fire({
        icon: "error",
        title: "You should enter your user Name...",
        text: "Couldn't start your game without registration!",
        confirmButtonColor: "#581139",
      });
    }

    errorAlertToContainFnameLname() {
      Swal.fire({
        icon: "error",
        title: "Your user name should contain your first name and last name at least...",
        text: "Couldn't start your game without writing it well!",
        confirmButtonColor: "#581139",
      });
    }

    successAlertOfRegistration(userInput) {
      Swal.fire({
        title: "Do you want to save your user Name to save your score",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`,
        confirmButtonColor: "#581139",
      }).then((result) => {
        if (result.isConfirmed) {
          // Check if the user already exists
          const existingUser = this.usersData.find(user => user.yourName && user.yourName.toLowerCase() === userInput.toLowerCase());

          if (existingUser) {
            // User already exists, update the score
            existingUser.score = existingUser.score || 0; 
          } else {
            // User is new, initialize the score
            this.usersData.push({ yourName: userInput, score: 0 });
          }

          // Save user data to local storage
          localStorage.setItem('usersData', JSON.stringify(this.usersData));

          Swal.fire({
            title: "Saved!",
            text: "",
            icon: "success",
            confirmButtonColor: "#581139",
          }).then(() => {
            
            window.location.href=`../../game/gamePage.html?name=${userInput}`;
          });
        } else if (result.isDenied) {
          window.location.href=`../../let's_start/sudoku.html?name=${userInput}`;
        }
      });
    }

  }

  let user1 = new UserRegistration();
};
