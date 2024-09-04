document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const spinner = document.querySelector(".spinner");
    const message = document.querySelector(".message");
    const submitButton = document.querySelector("button[type='submit']");
    const snackbar = document.getElementById("snackbar");

    spinner.style.display = "block";
    submitButton.disabled = true;
    submitButton.classList.add('loading'); // Adiciona classe de carregamento ao botão
    message.style.display = "none";

    fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        spinner.style.display = "none";
        submitButton.disabled = false;
        submitButton.classList.remove('loading'); // Remove classe de carregamento
        if (data.booleanAuth) {
          showSnackbar("Login bem-sucedido!", "success");
          localStorage.setItem("email", email);
          setTimeout(() => {
            window.location.href = "/src/telas/home/index.html?";
          }, 1000);
        } else {
          showSnackbar("Credenciais inválidas. Por favor, tente novamente.", "error");
        }
      })
      .catch((error) => {
        spinner.style.display = "none";
        submitButton.disabled = false;
        submitButton.classList.remove('loading'); // Remove classe de carregamento
        showSnackbar("Erro ao fazer login: " + error.message, "error");
        console.error("Erro ao fazer login:", error);
      });

    function showSnackbar(message, type) {
      snackbar.textContent = message;
      snackbar.style.backgroundColor = type === "success" ? "green" : "red";
      snackbar.className = "snackbar show";
      setTimeout(() => {
        snackbar.className = snackbar.className.replace("show", "");
      }, 3000);
    }
  });

  document.getElementById('toggle-password').addEventListener('click', function () {
    const passwordInput = document.getElementById('login-password');
    const icon = this;
    
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    } else {
      passwordInput.type = 'password';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
  });
