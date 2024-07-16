document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const spinner = document.querySelector(".spinner");
    const message = document.querySelector(".message");
    const submitButton = document.querySelector("button[type='submit']");

    spinner.style.display = "block";
    submitButton.disabled = true;
    message.style.display = "none";

    fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        spinner.style.display = "none";
        submitButton.disabled = false;
        console.log(data)
        if (data.booleanAuth) {
          message.textContent = "Login bem-sucedido!";
            message.className = "message success";
            message.style.display = "block";
            localStorage.setItem("email", email);
            setTimeout(() => {
                window.location.href = "/src/telas/home/index.html?";
            }, 1000);
        } else {
          message.textContent = "Credenciais inválidas. Por favor, tente novamente.";
          message.className = "message error";
          message.style.display = "block";
        }
      })
      .catch((error) => {
        spinner.style.display = "none";
        submitButton.disabled = false;
        message.textContent = "Erro ao fazer login: " + error.message;
        message.className = "message error";
        message.style.display = "block";
        console.error("Erro ao fazer login:", error);
      });
  });
