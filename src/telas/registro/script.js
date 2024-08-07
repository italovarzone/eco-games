document
  .getElementById("register-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const password2 = document.getElementById("register-password2").value;
    const spinner = document.querySelector(".spinner");
    const message = document.querySelector(".message");
    const submitButton = document.querySelector("button[type='submit']");

    spinner.style.display = "block";
    submitButton.disabled = true;
    message.style.display = "none";

    if (password !== password2) {
      spinner.style.display = "none";
      submitButton.disabled = false;
      message.textContent = "As senhas não coincidem.";
      message.className = "message error";
      message.style.display = "block";
      return;
  }

    fetch("http://localhost:3000/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, password2 }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        spinner.style.display = "none";
        submitButton.disabled = false;
        if (data.res == "Suceccs") {
          message.textContent = "Registro bem-sucedido! Por favor, faça login.";
          message.className = "message success";
          message.style.display = "block";
          setTimeout(() => {
              window.location.href = "/src/telas/login/index.html?";
          }, 1000);
        } else if (data.register && data.register.message) {
          message.textContent = data.register.message;
          message.className = "message error";
          message.style.display = "block";
        } else {
          message.textContent = "Erro no registro. Por favor, tente novamente.";
          message.className = "message error";
          message.style.display = "block";
        }
      })
      .catch((error) => {
        spinner.style.display = "none";
        submitButton.disabled = false;
        message.textContent = "Erro ao fazer registro: " + error.message;
        message.className = "message error";
        message.style.display = "block";
        console.error("Erro ao fazer registro:", error);
      });
  });
