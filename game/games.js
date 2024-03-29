window.onload = function () {
  let namePlayer = document.querySelector("h1");
  const GetName = (users, name) => {
    return users.find((el) => el.yourName === name);
  };
  let nameLocation = new URLSearchParams(location.search);
  let username = nameLocation.get("name");
  namePlayer.innerText = `Welcome ${
    GetName(JSON.parse(localStorage.getItem("usersData")), username).yourName
  } your score is ${
    GetName(JSON.parse(localStorage.getItem("usersData")), username).score
  }
    `;
  let startBtn = document.querySelector("button");
  console.log(username);
  startBtn.addEventListener("click", function () {
    let timerInterval;
    Swal.fire({
      title: "Game will start!",
      html: "I will close in <b></b> milliseconds.",
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
          timer.textContent = `${Swal.getTimerLeft()}`;
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        window.location.href = `../../let's_start/sudoku.html?name=${username}`;
      }
    });
  });
};
